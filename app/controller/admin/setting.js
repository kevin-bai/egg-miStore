'use strict';
const fs = require('fs');

const pump = require('mz-modules/pump');
let BaseController = require('./base.js');

class SettingController extends BaseController {
      async index() {

            //提前给setting表增加一条数据
            let result = await this.ctx.model.Setting.find({});
            console.log('setting',result)

            await this.ctx.render('admin/setting/index', {

                  list: result[0]
            });

      }


      async doEdit() {


            let uploadResult = await this.ctx.service.tool.getUploadFile(this.ctx)
            let formFields = Object.assign(uploadResult.files, uploadResult.field)
            //修改操作                
            // let setting = new this.ctx.model.Setting(formFields)
            // setting.save()
            await this.ctx.model.Setting.updateOne({}, formFields);
            await this.success('/admin/setting', '修改系统设置成功');
      }
}

module.exports = SettingController;
