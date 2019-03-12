'use strict';

const BaseController = require('./base');

class RoleController extends BaseController {
    async index() {
        await this.ctx.render('/admin/role/index')
    }

    async add() {
        // this.ctx.body = 'add role'
        await this.ctx.render('/admin/role/add')
    }
    async doAdd() {
        // this.ctx.body = 'add role'
        console.log(this.ctx.request.body)

        //todo 存入数据库

        await this.success('/admin/role','添加角色成功')
    }

    async edit() {
        await this.ctx.render('/admin/role/edit')
    }

    async doEdit() {
        // this.ctx.body = 'add role'
        console.log(this.ctx.request.body)

        //todo 存入数据库

        await this.success('/admin/role','添加角色成功')
    }
}

module.exports = RoleController;