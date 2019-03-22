'use strict';

const path = require('path')
const fs = require('fs')
const pump = require('mz-modules/pump');

const BaseController = require('./base');

class FileController extends BaseController {
    async index() {
        //获取轮播图的数据

        var list = await this.ctx.model.File.find({});
        await this.ctx.render('/admin/file/index', {
            list
        })
    }

    async add() {
        await this.ctx.render('/admin/file/add')
    }

    async doAdd() {
        let parts = this.ctx.multipart({
            autoFields: true
        }) // autoFields 可以获取除了除了文件的其他字段，提取到parts的fields里面；
        let part; // stream流
        let files = {};
        while ((part = await parts()) != null) {
            if (!part.filename) {
                break;
            }

            let fieldname = part.fieldname // file 的input标签，name
            let des = await this.service.tool.getUploadFile(part.filename)
            const writeStream = fs.createWriteStream(des.uploadPath)

            await pump(part, writeStream) // 写入然后销毁当前流，如果出错会有error的处理。如果用传统的pipe，报错的话，浏览器会卡死

            files = Object.assign(files, {
                [fieldname]: des.savePath
            })
        }
        console.log('filename', files)
        // this.ctx.response.body = {
        //     files,
        //     fields: parts.field
        // }

        let file = new this.ctx.model.File(Object.assign(files, parts.field))
        file.save()
        await this.success('/admin/file', '添加轮播图成功')
    }


    async edit(){
        var id=this.ctx.request.query.id;

        var result=await this.ctx.model.File.find({"_id":id});
    
        console.log(result);
    
        await this.ctx.render('admin/file/edit',{
    
          list:result[0]
        });
    }


    async doEdit(){
        let parts = this.ctx.multipart({
            autoFields: true
        }) // autoFields 可以获取除了除了文件的其他字段，提取到parts的fields里面；
        let part; // stream流
        let files = {};
        while ((part = await parts()) != null) {
            if (!part.filename) {
                break;
            }

            let fieldname = part.fieldname // file 的input标签，name
            let des = await this.service.tool.getUploadFile(part.filename)
            const writeStream = fs.createWriteStream(des.uploadPath)

            await pump(part, writeStream) // 写入然后销毁当前流，如果出错会有error的处理。如果用传统的pipe，报错的话，浏览器会卡死

            files = Object.assign(files, {
                [fieldname]: des.savePath
            })
        }

        var id=parts.field.id;

        var updateResult=Object.assign(files,parts.field);
        
        let result =await this.ctx.model.File.updateOne({"_id":id},updateResult);
  
        await this.success('/admin/file','修改轮播图成功');
    }
}

module.exports = FileController;