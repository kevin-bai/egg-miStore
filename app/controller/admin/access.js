'use strict';

const BaseController = require('./base');

class AccessController extends BaseController {
    async index() {
        const {
            ctx
        } = this
        ctx.body = 'access list'
    }

    async add() {
        this.ctx.render('/admin/access/add')
    }

    async edit() {
        this.ctx.body = 'edit access'
    }
}

module.exports = AccessController;
