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
            let goodsGiftIds = await this.ctx.service.goods.strToIds(goodsResult.goods_gift);
            //console.log('goodsGiftIds',goodsGiftIds)
            let goodsGift = await this.ctx.model.Goods.find({
                $or: goodsGiftIds
            });
            let currentData = {
                _id: goods_id,
                title: goodsResult.title,
                price: goodsResult.shop_price,
                goods_version: goodsResult.goods_version,
                num: 1,
                color: colorResult.color_name,
                goods_img: goodsResult.goods_img,
                goods_gift: goodsGift,
                /*赠品*/
                checked: true /*默认选中*/
            }
            let cartList = this.service.cookies.get('cartList');
            if (cartList && cartList.length > 0) {

                if (await this.service.cart.cartHasData(cartList, currentData)) {
                    cartList.forEach(item => {
                        if (item._id === currentData._id) {
                            item.num++
                        }
                    });
                    this.service.cookies.set('cartList', cartList)
                } else {
                    cartList.push(currentData);
                    this.service.cookies.set('cartList', cartList)
                }

                console.log('cartList', cartList)
            } else {
                let tempArr = []
                tempArr.push(currentData)
                this.service.cookies.set('cartList', tempArr)
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
        let cartList = await this.service.cookies.get('cartList');
        let allPrice = 0;
        if (cartList && cartList.length > 0) {
            cartList.forEach(item => {
                allPrice += item.price
            })
        }
        console.log('cartList', cartList)

        await this.ctx.render('default/cart.html', {
            allPrice,
            cartList
        })


    }

    //增加购物车数量
    async incCart() {

        let goods_id = this.ctx.request.query.goods_id;
        let color = this.ctx.request.query.color;

        let goodsResult = await this.ctx.model.Goods.find({
            "_id": goods_id
        });
        if (goodsResult.length == 0) {
            this.ctx.body = {
                "success": false,
                msg: '修改数量失败'
            }
        } else {

            let cartList = this.service.cookies.get('cartList');
            let currentNum = 0; //当前数量
            let allPrice = 0; //总价格
            for (let i = 0; i < cartList.length; i++) {
                if (cartList[i]._id == goods_id && cartList[i].color == color) {
                    cartList[i].num += 1;
                    currentNum = cartList[i].num;

                }
                if (cartList[i].checked) {
                    allPrice += cartList[i].price * cartList[i].num;
                }
            }
            this.service.cookies.set('cartList', cartList);


            this.ctx.body = {
                "success": true,
                num: currentNum,
                allPrice: allPrice
            }
        }

    }

    //减少购物车数量  
    async decCart() {

        let goods_id = this.ctx.request.query.goods_id;

        let color = this.ctx.request.query.color;

        let goodsResult = await this.ctx.model.Goods.find({
            "_id": goods_id
        });
        if (goodsResult.length == 0) {
            this.ctx.body = {
                "success": false,
                msg: '修改数量失败'
            }
        } else {

            let cartList = this.service.cookies.get('cartList');
            let currentNum = 0; //当前数量
            let allPrice = 0; //总价格
            for (let i = 0; i < cartList.length; i++) {
                if (cartList[i]._id == goods_id && cartList[i].color == color) {
                    if (cartList[i].num > 1) {
                        cartList[i].num -= 1;
                    }
                    currentNum = cartList[i].num;

                }

                if (cartList[i].checked) {
                    allPrice += cartList[i].price * cartList[i].num;
                }
            }
            this.service.cookies.set('cartList', cartList);
            this.ctx.body = {
                "success": true,
                num: currentNum,
                allPrice: allPrice
            }
        }
    }



    //改变购物车商品的状态  
    async changeOneCart() {

        let goods_id = this.ctx.request.query.goods_id;
        let color = this.ctx.request.query.color;

        let goodsResult = await this.ctx.model.Goods.find({
            "_id": goods_id
        });

        if (!goodsResult || goodsResult.length == 0) {
            this.ctx.body = {
                "success": false,
                msg: '改变状态失败'
            }
        } else {
            let cartList = this.service.cookies.get('cartList');
            let allPrice = 0; //总价格
            for (let i = 0; i < cartList.length; i++) {
                if (cartList[i]._id == goods_id && cartList[i].color == color) {
                    cartList[i].checked = !cartList[i].checked;
                }
                //计算总价
                if (cartList[i].checked) {
                    allPrice += cartList[i].price * cartList[i].num;
                }
            }

            this.service.cookies.set('cartList', cartList);
            this.ctx.body = {
                "success": true,
                allPrice: allPrice
            }
        }


    }


    //改变所有购物车商品的状态  
    async changeAllCart() {
        let type = this.ctx.request.query.type;
        let cartList = this.service.cookies.get('cartList');
        let allPrice = 0; //总价格
        for (let i = 0; i < cartList.length; i++) {

            if (type == 1) {
                cartList[i].checked = true;
            } else {
                cartList[i].checked = false;
            }
            //计算总价
            if (cartList[i].checked) {
                allPrice += cartList[i].price * cartList[i].num;
            }
        }

        this.service.cookies.set('cartList', cartList);
        this.ctx.body = {
            "success": true,
            allPrice: allPrice
        }

    }


    async removeCart() {

        let goods_id = this.ctx.request.query.goods_id;
        let color = this.ctx.request.query.color;

        let goodsResult = await this.ctx.model.Goods.find({
            "_id": goods_id
        });

        if (!goodsResult || goodsResult.length == 0) {

            this.ctx.redirect('/cart');

        } else {
            let cartList = this.service.cookies.get('cartList');

            for (let i = 0; i < cartList.length; i++) {
                if (cartList[i]._id == goods_id && cartList[i].color == color) {

                    cartList.splice(i, 1);

                }
            }
            this.service.cookies.set('cartList', cartList);
            this.ctx.redirect('/cart');
        }


    }

}

module.exports = CartController;
