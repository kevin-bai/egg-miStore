'use strict';

const Service = require('egg').Service;

class CartService extends Service {
  /**
   * 判断cartlist 里有没有 当前商品数据
   * @param {Array} cartList 
   * @param {Object} currentData 
   */
  async cartHasData(cartList, currentData) {
    if(cartList.length> 0){
      let flag = false;
      cartList.forEach(item => {
        if(item._id === currentData._id){
          flag = true
        }
      });
      return flag
    }else{
      return false
    }
  }
}

module.exports = CartService;
