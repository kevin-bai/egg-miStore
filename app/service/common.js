'use strict';

const Service = require('egg').Service;

class CommonService extends Service {
  async delete() {
    let model = this.ctx.request.query.model;
    let _id = this.ctx.request.query.id;


    await this.ctx.model[model].deleteOne({
        _id
    })

    this.ctx.redirect(this.ctx.locals.prevPage)
  }
}

module.exports = CommonService;
