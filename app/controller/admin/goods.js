'use strict';
const fs =require('fs');
const pump = require('mz-modules/pump');

const BaseController = require('./base.js');

class GoodsController extends BaseController {
  async index() {
    await this.ctx.render('admin/goods/index');
  }

  async add() {

    //获取所有的颜色值
    let colorResult = await this.ctx.model.GoodsColor.find({});

    //获取所有的商品类型
    let goodsType = await this.ctx.model.GoodsType.find({});

    let goodsCate = await this.ctx.model.GoodsCate.aggregate([
      {
        $lookup:{
          from:'goods_cate',
          localField:'_id',
          foreignField:'pid',
          as:'items'
        }
      },
      {
        $match:{
          "pid":'0'
        }
      }
    ])
    console.log('goodsCate',goodsCate)


    await this.ctx.render('admin/goods/add', {
      goodsCate,
      colorResult: colorResult,
      goodsType: goodsType
    });

  }

  async doAdd() {

    console.log(this.ctx.request.body);
  }


  //获取商品类型的属性 api接口
  async goodsTypeAttribute() {


    let cate_id = this.ctx.request.query.cate_id;

    //注意 await
    let goodsTypeAttribute = await this.ctx.model.GoodsTypeAttribute.find({
      "cate_id": cate_id
    })

    // console.log(goodsTypeAttribute);

    this.ctx.body = {
      result: goodsTypeAttribute
    }

  }

  //上传商品详情的图片
  async goodsUploadImage() {
    // let parts = this.ctx.multipart({
    //   autoFields: true
    // });

    let files = await this.service.tool.getUploadFile()
    console.log('files',files)


    // let files = {};
    // let stream;
    // while ((stream = await parts()) != null) {
    //   if (!stream.filename) {
    //     break;
    //   }
    //   let fieldname = stream.fieldname; //file表单的名字

    //   //上传图片的目录
    //   let dir = await this.service.tool.getUploadFile(stream.filename);
    //   let target = dir.uploadPath;
    //   let writeStream = fs.createWriteStream(target);

    //   await pump(stream, writeStream);

    //   files = Object.assign(files, {
    //     [fieldname]: dir.savePath
    //   })
    // }

    //图片的地址转化成 {link: 'path/to/image.jpg'} 

    this.ctx.response.body = {
      link: files.file
    };
  }


  //上传相册的图片
  async goodsUploadPhoto() {
    let parts = this.ctx.multipart({
      autoFields: true
    });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      let fieldname = stream.fieldname; //file表单的名字

      //上传图片的目录
      let dir = await this.service.tool.getUploadFile(stream.filename);
      let target = dir.uploadPath;
      let writeStream = fs.createWriteStream(target);

      await pump(stream, writeStream);

      files = Object.assign(files, {
        [fieldname]: dir.savePath
      })

      //生成缩略图
      this.service.tool.jimpImg(target);
      //图片的地址转化成 {link: 'path/to/image.jpg'} 
    }

    this.ctx.body = {
      link: files.file
    };
  }




}

module.exports = GoodsController;