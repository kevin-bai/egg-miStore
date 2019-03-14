'use strict';

const BaseController = require('./base');

class ManagerController extends BaseController {
    async index() {
        const {
            ctx
        } = this

        let list = [{
            username:'张三',
            mobile:123,
            email:'2@2.com',
            role:[{
                title:'总监'
            }],
            _id:'3213213wqewq'
        }]

        // let list = await this.ctx.model.Admin.find()
        // ctx.body = 'admin list'
        await ctx.render('admin/manager/index',{
            list
        })
    }

    async add() {
        let roleResult  = [{
            title:'主管'
        }]

        await this.ctx.render('admin/manager/add',{
            roleResult
        })
    }
    
    async doAdd(){
        console.log(this.ctx.request.body)
        let newAdmin = new this.ctx.model.Admin(this.ctx.request.body)
        newAdmin.password = await this.service.tool.md5(newAdmin.password)

        let result = await this.ctx.model.Admin.find({'username':newAdmin.username})
        if(result.length > 0){
            this.error('/admin/manager/add','已经存在该用户')
        }else{
            newAdmin.save();
            await this.ctx.redirect('/admin/manager')
            console.log('添加管理员成功')
        }

    }

    async edit() {
        await this.ctx.render('admin/manager/edit')
    }
}

module.exports = ManagerController;