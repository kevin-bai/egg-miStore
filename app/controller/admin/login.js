'use strict';

const BaseController = require('./base')

class LoginController extends BaseController {

    async index() {
        await this.ctx.render('admin/login')
    }

    //login post方法
    async doLogin() {

        console.log(this.ctx.request.body);
        let code = this.ctx.request.body.code
        let username = this.ctx.request.body.username;
        let password = await this.service.tool.md5(this.ctx.request.body.password);

        if (code.toUpperCase() === this.ctx.session.code.toUpperCase()) {

            try {
                let result =await this.ctx.model.Admin.find({
                    username: username,
                    password: password
                })
                console.log('result',result)

                if(result.length>0){

                    this.ctx.session.userinfo = result[0]
                    // await this.success('/admin/manager','登录成功')
                    await this.ctx.redirect('/admin')
                }else{
                    await this.error('/admin/login','用户名密码错误')
                }
            } catch (error) {
                console.log(error)
            }


            //await this.success('/admin/manager', '登录成功')
        } else {
            // this.ctx.redirect('admin/error','验证码错误')
            await this.error('/admin/login', '验证码错误')
        }
    }

    async loginOut() {
        this.ctx.session.userinfo = null;
        this.ctx.redirect('/admin/login')
    }

}

module.exports = LoginController;