'use strict';

const Controller = require('egg').Controller;

class BuyController extends Controller {
  async checkout() {
    // 获取购物车选中的商品

    let orderList = [];
    let allPrice = 0;
    let cartList = this.service.cookies.get('cartList');


    //签名防止重复提交订单
    var orderSign=await this.service.tool.md5(await this.service.tool.getRandomNum());
    this.ctx.session.orderSign=orderSign;
      

    if (cartList && cartList.length > 0) {

      for (let i = 0; i < cartList.length; i++) {

        if (cartList[i].checked) {
          orderList.push(cartList[i]);

          allPrice += cartList[i].price * cartList[i].num;
        }

      }

      // 获取当前用户的所有收货地址

      const uid = this.ctx.service.cookies.get('userinfo')._id;
      const addressList = await this.ctx.model.Address.find({ uid }).sort({ default_address: -1 });


      await this.ctx.render('default/checkout.html', {
        orderList,
        allPrice,
        addressList,
        orderSign:orderSign
      });

    } else {
      // 恶意操作
      this.ctx.redirect('/cart');
    }
  }


  async confirm(){

  }

  async doOrder(){

  }
}

module.exports = BuyController;
