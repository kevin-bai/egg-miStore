'use strict';

const Controller = require('egg').Controller;

class AccessController extends Controller {
    async index() {
        const {
            ctx
        } = this
        ctx.body = 'access list'
    }

    async add() {
        this.ctx.body = 'add access'
    }

    async edit() {
        this.ctx.body = 'edit access'
    }
}

module.exports = AccessController;
