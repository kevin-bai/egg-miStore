'use strict';

const Controller = require('egg').Controller;

class ManagerController extends Controller {
    async index() {
        const {
            ctx
        } = this
        // ctx.body = 'admin list'
        await ctx.render('admin/manager/index')
    }

    async add() {
        this.ctx.body = 'add admin'
    }

    async edit() {
        this.ctx.body = 'edit admin'
    }
}

module.exports = ManagerController;