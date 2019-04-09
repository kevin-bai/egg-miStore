const fs = require('fs');

const pump = require('mz-modules/pump');

let BaseController = require('./base.js');
class ArticleController extends BaseController {
  async index() {
    let page = this.ctx.request.query.page || 1;
    let pageSize = 3;

    //总数量
    let totalNum = await this.ctx.model.Article.find({}).countDocuments();



    /*
              
       let goodsResult=await this.ctx.model.Goods.find({}).skip((page-1)*pageSize).limit(pageSize);
       
    */


    //让文章和分类进行关联

    let result = await this.ctx.model.Article.aggregate([

      {
        $lookup: {
          from: 'article_cate',
          localField: 'cate_id',
          foreignField: '_id',
          as: 'catelist'
        }
      },
      {
        $skip: (page - 1) * pageSize
      },
      {
        $limit: pageSize
      }

    ])

    console.log(result);


    await this.ctx.render('admin/article/index', {
      list: result,
      totalPages: Math.ceil(totalNum / pageSize),
      page: page
    });

  }
  async add() {

    //获取所有的分类
    let cateResult = await this.ctx.model.ArticleCate.aggregate([

      {
        $lookup: {
          from: 'article_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items'
        }
      },
      {
        $match: {
          "pid": '0'
        }
      }

    ])


    await this.ctx.render('admin/article/add', {

      cateList: cateResult
    });

  }

  async doAdd() {

    let uploadResult = await this.service.tool.getUploadFile(this.ctx, true)
    let formFields = Object.assign(uploadResult.files, uploadResult.field)

    let article = new this.ctx.model.Article(formFields);
    await article.save();

    await this.success('/admin/article', '增加文章成功');

  }


  async edit() {

    let id = this.ctx.request.query.id;

    //当前id对应的数据
    let result = await this.ctx.model.Article.find({
      "_id": id
    });

    //获取所有的分类
    let cateResult = await this.ctx.model.ArticleCate.aggregate([

      {
        $lookup: {
          from: 'article_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items'
        }
      },
      {
        $match: {
          "pid": '0'
        }
      }

    ]);

    await this.ctx.render('admin/article/edit', {
      cateList: cateResult,
      list: result[0],
      prevPage: this.ctx.state.prevPage
    });

  }

  async doEdit() {

    let uploadResult = await this.service.tool.getUploadFile(this.ctx)
    //let formFields = Object.assign(uploadResult.files, uploadResult.field)

    let id = uploadResult.field.id;

    let prevPage = uploadResult.field.prevPage;

    let formFields = Object.assign(uploadResult.files, uploadResult.field)

    await this.ctx.model.Article.updateOne({
      "_id": id
    }, formFields);

    await this.success(prevPage, '修改数据成功');



  }


}
module.exports = ArticleController;