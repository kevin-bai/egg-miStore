'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index(){
    let topNav = await this.ctx.model.Nav.find({"position":1})

    let focus = await this.ctx.model.File.find({});

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
    console.log('goods cate',goodsCate)


    await this.ctx.render('/default/index',{
      topNav,
      focus,
      goodsCate
    })
  }
}

module.exports = IndexController;
