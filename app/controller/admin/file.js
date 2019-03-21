'use strict';

const path = require('path')
const fs = require('fs')
const pump = require('mz-modules/pump');

const Controller = require('egg').Controller;

class FileController extends Controller {
    async index() {
        this.ctx.render('/admin/file/index')
    }

    async add() {
        this.ctx.render('/admin/file/add')
    }

    async doAdd() {
        let parts = this.ctx.multipart({
            autoFields: true
        }) // autoFields 可以获取除了除了文件的其他字段，提取到parts的fields里面；
        let part;
        const files = [];
        while ((part = await parts()) != null) {
            let filename = stream.filename
            let des = 'app/public/admin/upload' + path.basename(part.filename)
            const writeStream = fs.writeStream(des)

            await pump(part, writeStream) // 写入然后销毁当前流，如果出错会有error的处理。如果用传统的pipe，报错的话，浏览器会卡死

            files.push({
                [filename]:des
            })
        }
        this.ctx.response.body = {
            files,
            fields: parts.field
        }

    }
}

module.exports = FileController;
