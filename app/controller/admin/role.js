'use strict';

const BaseController = require('./base');

class RoleController extends BaseController {
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
