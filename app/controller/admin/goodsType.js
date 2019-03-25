'use strict';

const BaseController = require('./base');

class GoodsTypeController extends BaseController {
    async index() {
        let list = await this.ctx.model.GoodsType.find({})
        await this.ctx.render('/admin/goodsType/index', {list})
    }

    async add() {
        await this.ctx.render('/admin/goodsType/add')
    }

    async doAdd() {
        let content = await this.ctx.request.body;
        console.log(content)

        let goodsType = new this.ctx.model.GoodsType(content)
        goodsType.save();
        await this.success('/admin/goodsType', '添加商品类型成功')
    }

    async edit() {
        let _id = await this.ctx.request.query.id
        let list = await this.ctx.model.GoodsType.findOne({_id})
        await this.ctx.render('/admin/goodsType/edit',{list})
    }

    async doEdit() {
        let _id = await this.ctx.request.body._id;
        let title = this.ctx.request.body.title;
        let description = this.ctx.request.body.description;


        let result = await this.ctx.model.GoodsType.updateOne({
            _id
        }, {
            title,
            description
        })
        // console.log(result)
        await this.mongoOperResult(result,'/admin/goodsType', '修改商品类型成功')
        //await this.success('/admin/goodsType', '修改商品类型成功')
    }
}

module.exports = GoodsTypeController;
