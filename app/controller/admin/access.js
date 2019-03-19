'use strict';

const BaseController = require('./base');

class AccessController extends BaseController {
    async index() {
        let list = await this.ctx.model.Access.find()
        console.log('access list',list)
        await this.ctx.render('/admin/access/index',{
            list
        })
    }

    async add() {
        let moduleList = await this.ctx.model.Access.find({
            'module_id': "0"
        })
        console.log('moduleList:', moduleList)
        await this.ctx.render('/admin/access/add', {
            moduleList
        })
    }

    async doAdd() {
        let content = this.ctx.request.body;
        console.log('content', content)

        if (content.module_id != 0) {
            content.module_id = this.app.mongoose.Types.ObjectId(content.module_id)
        }

        try {
            let access = new this.ctx.model.Access(content) // 注意:不能写成 ({content})
            access.save();
        } catch (error) {
            console.log(error)
        }
        await this.success('/admin/access/add', '添加权限成功')
    }

    async edit() {
        this.ctx.body = 'edit access'
    }

    async doEdit() {

    }
}

module.exports = AccessController;