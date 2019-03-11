'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
    async success(redirectUrl, msg) {
        await this.ctx.render('admin/public/success', {
            redirectUrl: redirectUrl,
            message: msg || 'operation success'
        });
    }

    async error(redirectUrl, msg) {
        await this.ctx.render('admin/public/error', {
            redirectUrl: redirectUrl,
            message: msg || 'operation failed'
        });
    }

    async captcha() {
        let captcha = await this.ctx.service.tool.captcha();
        this.ctx.response.type = 'image/svg+xml';
        this.ctx.body = captcha.data
    }
}

module.exports = BaseController;
