'use strict';

const BaseController = require('./base')

class LoginController extends BaseController {

    async index() {
        //await this.success('admin/login','login success')
        await this.ctx.render('admin/login')
    }

    //login post方法
    async doLogin() {
        //await this.success('admin/login','login success')

        // console.log('query',ctx.reqest.query.username)
            console.log(this.ctx.request.body);

        //await this.ctx.render('admin/login')
    }

}

module.exports = LoginController;
