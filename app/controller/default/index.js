'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() {

    let focus = await this.service.cache.get('index_focus')
    if (!focus) {
      focus = await this.ctx.model.File.find({});
      await this.service.cache.set('index_focus', focus, 60 * 10)
    }


    let shoujiResult = await this.service.cache.get('index_shoujiResult');
    if (!shoujiResult) {
      //手机
      shoujiResult = await this.service.goods.get_category_recommend_goods('5bbf058f9079450a903cb77b', 'best', 8);
      await this.service.cache.set('index_shoujiResult', shoujiResult, 60 * 10)

    }


    //电视
    // let dianshiResult = await this.service.goods.get_category_recommend_goods('5bbf05ac9079450a903cb77c', 'best', 10);

    await this.ctx.render('/default/index', {
      focus,
      shoujiResult
    })

  }
}

module.exports = IndexController;
