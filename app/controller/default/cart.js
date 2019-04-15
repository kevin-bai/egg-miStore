'use strict';

const Controller = require('egg').Controller;

class CartController extends Controller {
    async addCart() {
        let goods_id = this.ctx.request.query.goods_id;
        let color_id = this.ctx.request.query.color_id;
        let goodsResult = await this.ctx.model.Goods.findOne({
            '_id': goods_id
        })
        let colorResult = await this.ctx.model.GoodsColor.findOne({
            '_id': color_id
        })
        if (!goodsResult) {
            this.ctx.status = 404;
            this.ctx.body = '错误404'
        } else {
            // 赠品
            var goodsGiftIds=this.ctx.service.goods.strToArray(goodsResult.goods_gift);
            var goodsGift=await this.ctx.model.Goods.find({
                $or:goodsGiftIds
            });
            let currentData={
                _id:goods_id,
                title:goodsResult.title,
                price:goodsResult.shop_price,
                goods_version:goodsResult.goods_version,
                num:1,
                color:colorResult.color_name,
                goods_img:goodsResult.goods_img,
                goods_gift:goodsGift,  /*赠品*/
                checked:true           /*默认选中*/
              }
            let cartList=this.service.cookies.get('cartList');
            if (cartList && cartList.length > 0) {

                if (this.service.cart.cartHasData(cartList, currentData)) {
                    cartList.forEach(item => {
                        if (item._id === currentData._id) {
                            item.num++
                        }
                    });
                    this.service.cookies.set('cartList',cartList)
                } else {
                    cartList.push(currentData);
                    this.service.cookies.set('cartList',cartList)
                }

                
            } else {
                let tempArr = []
                tempArr.push(currentData)
                this.service.cookies.set('cartList',tempArr)
            }



            await this.ctx.redirect(`/addCartSuccess?goods_id=${goods_id}&color_id=${color_id}`)
        }


        
    }

    async addCartSuccess() {
        let goods_id = this.ctx.request.query.goods_id;
        let color_id = this.ctx.request.query.color_id;

        let goodsResult = await this.ctx.model.Goods.findOne({
            '_id': goods_id
        })
        let colorResult = await this.ctx.model.GoodsColor.findOne({
            '_id': color_id
        })

        if (!goodsResult) {
            this.ctx.status = 404;
            this.ctx.body = '错误404'
        } else {
            let title = `${goodsResult.title}${goodsResult.goods_version ? `--${goodsResult.goods_version}`:''}${colorResult.color_name ? `--${colorResult.color_name}`:''}`
            await this.ctx.render('default/add_cart_success.html', {
                title,
                goods_id
            });
        }


    }

    async cartList() {

    }


    async incCart() {

    }

    async decCart() {

    }


    async changeOneCart() {

    }

    async changeAllCart() {

    }

    async removeCart() {

    }
}

module.exports = CartController;
