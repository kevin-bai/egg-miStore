'use strict';

const BaseController = require('./base');

class AccessController extends BaseController {
    async index() {
        let list = await this.ctx.model.Access.aggregate([{
                $match: {
                    module_id: '0'
                }
            },
            {
                $lookup: {
                    from: "access",
                    localField: '_id',
                    foreignField: 'module_id',
                    as: 'items'
                }
            }
        ])
        console.log('access list', list)
        await this.ctx.render('/admin/access/index', {
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
        const _id = this.ctx.request.query.id
        let result = await this.ctx.model.Access.find(this.app.mongoose.Types.ObjectId(_id))
        let moduleList = await this.ctx.model.Access.find({
            module_id: '0'
        })
        //console.log('moduleList', moduleList);
        // console.log('result', result);

        await this.ctx.render('/admin/access/edit', {
            list: result[0],
            moduleList
        })
    }

    async doEdit() {
        let content = this.ctx.request.body;
        content.id = this.app.mongoose.Types.ObjectId(content.id)
        console.log(content)
        let result = await this.ctx.model.Access.updateOne({
            "_id": content.id
        }, content)
        if (await this.mongoOperResult(result)) {
            await this.success('/admin/access', '修改权限成功')
        } else {
            await this.errorReturnPrev()
        }
    }
}

module.exports = AccessController;