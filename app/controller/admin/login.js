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


            // todo 链接mongoose 验证用户名密码


            this.ctx.session.userinfo = {
                username:username,
                password:password
            }

            await this.success('/admin/manager','登录成功')
        } else {
            // this.ctx.redirect('admin/error','验证码错误')
            await this.error('/admin/error', '验证码错误')
        }
    }

    async loginOut(){
        this.ctx.session.userinfo = null;
        this.ctx.redirect('/admin/login')
    }

}

module.exports = LoginController;