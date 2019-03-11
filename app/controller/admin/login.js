'use strict';

const BaseController = require('./base')

class LoginController extends BaseController {
  async doLogin() {
    //await this.success('admin/login','login success')
    await this.ctx.render('admin/login')
  }

}

module.exports = LoginController;
