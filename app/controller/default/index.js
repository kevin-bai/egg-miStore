'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() {
    let topNav = await this.ctx.model.Nav.find({
      "position": 1
    })

    let focus = await this.ctx.model.File.find({});

    let goodsCate = await this.ctx.model.GoodsCate.aggregate([{
        $lookup: {
          from: 'goods_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items'
        }
      },
      {
        $match: {
          "pid": '0'
        }
      },{
        $limit:10
      }
    ])
    // console.log('goods cate',goodsCate)

    let middleNav = await this.ctx.model.Nav.find({
      "position": 2
    })
    // console.log('middleNav',middleNav)


    /*
      不可拓展属性的对象    http://bbs.itying.com/topic/5bea72c10e525017c44947cf
    */

    // 转化不可拓展对象  为 可拓展对象
    //middleNav=JSON.parse(JSON.stringify(middleNav));

    var data1 = new Date()


    //串行
    // for (const item of middleNav) {
    //   if (item.relation) {
    //     try {
    //       let temlStr = item.relation.replace(/，/g, ',').split(',')
    //       let temlArr = []
    //       temlStr.forEach(value => {
    //         temlArr.push({
    //           "_id": this.app.mongoose.Types.ObjectId(value)
    //         })
    //       })
    //       //console.log('temlArr', temlArr)
    //       let subGoods = await this.ctx.model.Goods.find({
    //         $or: temlArr
    //       },'title goods_img')
    //       item.subGoods = subGoods
    //       //console.log(item.subGoods)
    //     } catch (error) {
    //       //如果用户输入了错误的ObjectID（商品id）
    //       item.subGoods = []
    //     }
    //   } else {
    //     item.subGoods = []
    //   }
    // }


    //并行
    await Promise.all(middleNav.map(async item => {
      if (item.relation) {
        try {
          let temlStr = item.relation.replace(/，/g, ',').split(',')
          let temlArr = []
          temlStr.forEach(value => {
            temlArr.push({
              "_id": this.app.mongoose.Types.ObjectId(value)
            })
          })
          //console.log('temlArr', temlArr)
          let subGoods = await this.ctx.model.Goods.find({
            $or: temlArr
          }, 'title goods_img')
          item.subGoods = subGoods
          //console.log(item.subGoods)
        } catch (error) {
          //如果用户输入了错误的ObjectID（商品id）
          item.subGoods = []
        }
      } else {
        item.subGoods = []
      }
    }))

    let date2 = new Date()

    console.log('time', date2 - data1)

    console.log('middleNav', middleNav)

    //手机
    let shoujiResult = await this.service.goods.get_category_recommend_goods('5bbf058f9079450a903cb77b', 'best', 8);
    //电视
    let dianshiResult = await this.service.goods.get_category_recommend_goods('5bbf05ac9079450a903cb77c', 'best', 10);


    await this.ctx.render('/default/index', {
      topNav,
      focus,
      goodsCate,
      middleNav,
      shoujiResult
    })

  }
}

module.exports = IndexController;
