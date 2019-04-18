'use strict';

const Controller = require('egg').Controller;

class AlipayController extends Controller {
    async pay() {
        let data = {
            subject: '辣条',
            out_trade_no: '1232423',
            total_amount: '0.1'
        }

        let url = await this.service.alipay.doPay(data)
        await this.ctx.redirect(url)


    }

    async alipayReturn() {
        this.ctx.body = '支付成功';
    }

    /**
     * 接受alipay异步post请求回调
     * 更新订单相关状态
     */
    async alipayNotify() {
        let params = this.ctx.request.body
        console.log('alipay notify', params)
        let result = await this.service.alipay.alipayNotify(params)
        console.log('alipay notify verify', result)

        if (result.code == 0) {
            if(params.trade_status=='TRADE_SUCCESS'){
                //更新订单相关状态..
            }
        }


    }

}

module.exports = AlipayController;
