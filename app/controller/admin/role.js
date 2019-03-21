'use strict';

const BaseController = require('./base');

class RoleController extends BaseController {
    async index() {

        let list = await this.ctx.model.Role.find()

        await this.ctx.render('/admin/role/index', {
            list
        })
    }

    async add() {
        // this.ctx.body = 'add role'
        await this.ctx.render('/admin/role/add')
    }
    async doAdd() {
        // this.ctx.body = 'add role'
        console.log(this.ctx.request.body)


        let result = await this.ctx.model.Role.find({
            title: this.ctx.request.body.title
        })
        if (result.length > 0) {
            await this.error('/admin/role', '角色已经存在')
        } else {
            let newRole = new this.ctx.model.Role({
                title: this.ctx.request.body.title,
                description: this.ctx.request.body.description,
            })
            newRole.save();

            await this.success('/admin/role', '添加角色成功')
        }
        //todo 存入数据库
    }

    async edit() {
        let id = this.ctx.query.id
        let result = await this.ctx.model.Role.find({
            '_id': id
        })

        await this.ctx.render('/admin/role/edit', {
            list: result[0]
        })
    }

    async doEdit() {
        console.log(this.ctx.request.body)
        let _id = this.ctx.request.body._id
        let title = this.ctx.request.body.title;
        let description = this.ctx.request.body.description;


        // 如何判断有没有更新成功？ 
        // result 成功： { n: 1, nModified: 1, ok: 1 }  || 更新失败  result { n: 0, nModified: 0, ok: 1 }
        let result = await this.ctx.model.Role.updateOne({
            "_id": _id
        }, {
            title,
            description
        })
        console.log('result', result)
        if (await this.mongoOperResult(result)) {
            await this.success('/admin/role', '编辑角色成功')
        } else {
            await this.errorReturnPrevPage()
        }
    }

    async auth() {
        let role_id = await this.ctx.request.query.id
        let list = await this.service.adminService.getAuthList(role_id)

        //console.log('list', list)

        await this.ctx.render('/admin/access/auth', {
            list,
            role_id
        })
    }

    async doAuth() {
        let content = await this.ctx.request.body;
        let role_id = content.role_id
        let access_ids = content.access_node
        console.log('access', access_ids)
        await this.ctx.model.RoleAccess.deleteMany({
            role_id: role_id
        })

        access_ids.forEach(access_id => {
            let role_access = new this.ctx.model.RoleAccess({
                role_id,
                access_id
            })
            role_access.save()
        });

        await this.success(`/admin/role/auth?id=${role_id}`, `角色授权成功`)
    }
}

module.exports = RoleController;