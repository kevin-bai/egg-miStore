'use strict';

const Service = require('egg').Service;
const Alipay = require('alipay-mobile')

class AlipayService extends Service {
  async doPay(data) {

    return new Promise((resolve,reject)=>{

        const service = new Alipay(this.config.alipayOptions)

        service.createPageOrderURL(data, this.config.alipayBasicParams).then(result =>{
            resolve(result)
        })
        
    })


    // const service = new Alipay(this.config.alipayOptions)

    // const result = service.createPageOrderURL(data, this.config.alipayBasicParams)
    // resolve(result)
  }

  //验证异步通知的数据是否正确
  alipayNotify(params){

    const service = new Alipay(this.config.alipayOptions);        
          
    return service.makeNotifyResponse(params);
  }


}

module.exports = AlipayService;
