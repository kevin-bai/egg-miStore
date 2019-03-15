'use strict';

const BaseController = require('./base');

class ManagerController extends BaseController {
    async index() {
        const {
            ctx
        } = this

        let list = await this.ctx.model.Admin.aggregate([{
            $lookup: {
                from: "role",
                localField: 'role_id',
                foreignField: '_id',
                as: 'role'
            }
        }])
        console.log('admin 信息', list)



        // let list = await this.ctx.model.Admin.find()
        // ctx.body = 'admin list'
        await ctx.render('admin/manager/index', {
            list
        })
    }

    async add() {
        let roleResult = await this.ctx.model.Role.find()
        await this.ctx.render('admin/manager/add', {
            roleResult
        })
    }

    async doAdd() {
        console.log(this.ctx.request.body)
        let newAdmin = new this.ctx.model.Admin(this.ctx.request.body)
        newAdmin.password = await this.service.tool.md5(newAdmin.password)

        let result = await this.ctx.model.Admin.find({
            'username': newAdmin.username
        })
        if (result.length > 0) {
            this.error('/admin/manager/add', '已经存在该用户')
        } else {
            newAdmin.save();
            await this.success('/admin/manager','添加管理员成功')
            // console.log('添加管理员成功')
        }

    }

    async edit() {
        let _id = this.ctx.query.id
        let adminResult = await this.ctx.model.Admin.find({
            _id
        })
        let roleResult = await this.ctx.model.Role.find()

        // console.log('adminResult',adminResult)
        await this.ctx.render('admin/manager/edit', {
            adminResult: adminResult[0],
            roleResult
        })
    }


    async doEdit() {
        let content = this.ctx.request.body
        console.log('content',content)


        if (content.password) {
            content.password =await this.service.tool.md5(content.password)

            await this.ctx.model.Admin.updateOne({
                '_id': content.id
            }, {
                username: content.username,
                password: content.password,
                mobile: content.mobile,
                email: content.email,
                role_id: content.role_id
            })
        } else {
            await this.ctx.model.Admin.updateOne({
                '_id': content.id
            }, {
                username: content.username,
                mobile: content.mobile,
                email: content.email,
                role_id: content.role_id
            })
        }
        await this.success('/admin/manager','修改管理员成功')

    }
}

module.exports = ManagerController;