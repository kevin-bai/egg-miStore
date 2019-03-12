'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
    /**
     * 跳转成功页面，3秒后重定向
     * @param {string} redirectUrl 成功之后重定向url
     * @param {string} msg 成功页面提示信息
     */
    async success(redirectUrl, msg) {
        await this.ctx.render('/admin/public/success', {
            redirectUrl: redirectUrl,
            message: msg || 'operation success'
        });
    }

    /**
     * 跳转失败页面，3秒后重定向
     * @param {string} redirectUrl 失败之后重定向url
     * @param {string} msg 失败页面提示信息
     */
    async error(redirectUrl, msg) {
        await this.ctx.render('/admin/public/error', {
            redirectUrl: redirectUrl,
            message: msg || 'operation failed'
        });
    }

    async captcha() {
        let captcha = await this.ctx.service.tool.captcha();
        this.ctx.response.type = 'image/svg+xml';
        this.ctx.body = captcha.data
    }

    async delete(){
        let model = this.ctx.request.query.model // role
        let _id = this.ctx.request.query._id

        // this.ctx.model.model   ×
        await this.ctx.model[model].deleteOne({  // 注意写法
            _id
        })

        // 返回上一页面
        this.ctx.redirect(this.ctx.locals.prevPage)
    }

}

module.exports = BaseController;
