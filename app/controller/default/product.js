'use strict';

const Controller = require('egg').Controller;

class ProductController extends Controller {
  async list() {
    let cid = this.ctx.request.query.cid
    let currentCate = await this.ctx.model.GoodsCate.findOne({
      '_id': cid
    }, '_id pid title')
    let pid = currentCate.pid
    let cateTitle = currentCate.title

    console.log('curCate', currentCate)
    let goodsList;
    if (pid.toString() != '0') {
      goodsList = await this.ctx.model.Goods.find({
        'cate_id': pid
      }, '_id title price sub_title goods_img')
    } else {
      let subCate = await this.ctx.model.GoodsCate.find({
        'pid': this.app.mongoose.Types.ObjectId(cid)
      }, '_id')
      //console.log(subCate)

      let subCateIds = [];
      subCate.forEach(item => {
        subCateIds.push({
          'cate_id': this.app.mongoose.Types.ObjectId(item._id)
        })
      })

      goodsList = await this.ctx.model.Goods.find({
        $or: subCateIds
      }, '_id title price sub_title goods_img')

    }

    console.log('goodsList', goodsList)


    await this.ctx.render('default/product_list.html', {
      goodsList,
      cateTitle
    });
  }


  async info() {
    let _id = this.ctx.request.query.id

    let productInfo = await this.ctx.model.Goods.findOne({
      _id
    })
    let cate_id = productInfo.cate_id

    let goodsImageResult = await this.ctx.model.GoodsImage.find({
      'goods_id': _id
    })
    // let colorIds = []
    // goodsImageResult.forEach(item => {
    //   if (item.color_id) {
    //     colorIds.push({
    //       '_id': item.color_id
    //     })
    //   }
    // })

    let goods_color = productInfo.goods_color
    let colorIds = await this.ctx.service.goods.strToIds(goods_color)
    let goodsColor = await this.ctx.model.GoodsColor.find({
      $or: colorIds
    })

    let relationGoods = await this.ctx.model.Goods.find({
      'cate_id': cate_id
    })

    let goodsAttr = await this.ctx.model.GoodsAttr.find({
      'goods_id': _id
    })

    //关联赠品
    let goodsGiftIds = await this.ctx.service.goods.strToIds(productInfo.goods_gift);
    let goodsGift = await this.ctx.model.Goods.find({
      $or: goodsGiftIds
    })

    //关联配件
    let goodsFittingIds = await this.ctx.service.goods.strToIds(productInfo.goods_fitting);
    let goodsFitting = await this.ctx.model.Goods.find({
      $or: goodsFittingIds
    })

    //console.log('goodsAttr', goodsAttr)

    await this.ctx.render('default/product_info.html', {
      productInfo,
      goodsImageResult,
      relationGoods,
      goodsColor,
      goodsAttr,
      goodsFitting,
      goodsGift
    });

  }
}

module.exports = ProductController;
