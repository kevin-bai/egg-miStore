'use strict';

const Controller = require('egg').Controller;

class RoleController extends Controller {
    async index() {
        const {
            ctx
        } = this
        ctx.body = 'role list'
    }

    async add() {
        this.ctx.body = 'add role'
    }

    async edit() {
        this.ctx.body = 'edit role'
    }
}

module.exports = RoleController;
