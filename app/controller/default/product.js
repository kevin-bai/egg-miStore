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

    //console.log('goodsList', goodsList)


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

    // 商品颜色
    let goods_color = productInfo.goods_color
    let colorIds = await this.ctx.service.goods.strToIds(goods_color)
    let goodsColor = await this.ctx.model.GoodsColor.find({
      $or: colorIds
    })

    //关联商品
    let relationGoods = await this.ctx.model.Goods.find({
      'cate_id': cate_id
    })

    //商品属性
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


    //根据 颜色以及商品id获取商品图片信息
    async getImagelist(){


      try {
  
        let color_id=this.ctx.request.query.color_id;
        let goods_id=this.ctx.request.query.goods_id;
    
        let goodsImages=await this.ctx.model.GoodsImage.find({"goods_id":goods_id,"color_id":this.app.mongoose.Types.ObjectId(color_id)});
    
        
        if(goodsImages.length==0){
  
           goodsImages=await this.ctx.model.GoodsImage.find({"goods_id":goods_id}).limit(8);
        }
  
        // console.log(goodsImages);
        this.ctx.body={"success":true,"result":goodsImages};
  
        
      } catch (error) {
  
        this.ctx.body={"success":false,"result":[]};
        
      }
     
  

    }
}

module.exports = ProductController;
