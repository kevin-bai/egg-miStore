'use strict';

const BaseController = require('./base')

class LoginController extends BaseController {

    async index() {
        //await this.success('admin/login','login success')
        await this.ctx.render('admin/login')
    }

    //login post方法
    async doLogin() {

        console.log(this.ctx.request.body);
        let code = this.ctx.request.body.verify
        let username = this.ctx.request.body.username;
        let password = await this.service.tool.md5(this.ctx.request.body.password);

        console.log('password',password)

        if (code.toUpperCase() === this.ctx.session.code.toUpperCase()) {


            // 链接mongoose 验证用户名密码




            await this.success('admin/success','登录成功')
        } else {
            // this.ctx.redirect('admin/error','验证码错误')
            await this.error('admin/errir', '验证码错误')
        }

    }

}

module.exports = LoginController;