'use strict';
let BaseController = require('./base.js');
class FocusController extends BaseController {

  async index() {

    //获取轮播图的数据

    let result = await this.ctx.model.Focus.find({});

    await this.ctx.render('admin/focus/index', {

      list: result
    });
  }

  async add() {
    await this.ctx.render('admin/focus/add');
  }




  async doAdd() {
    let uploadResult = await this.service.tool.getUploadFile(this.ctx, true)
    let formFields = Object.assign(uploadResult.files, uploadResult.field)

    // [{"focus_img":"/public/admin/upload/20180914/1536895826566.png"}，{"aaaa":"/public/admin/upload/20180914/1536895826566.png"}]

    //{"focus_img":"/public/admin/upload/20180914/1536895826566.png",'aaa':'/wefewt/ewtrewt'}

    //{"focus_img":"/public/admin/upload/20180914/1536895826566.png"，"title":"aaaaaaaa","link":"11111111111","sort":"11","status":"1"}


    let focus = new this.ctx.model.Focus(formFields);

    let result = await focus.save();

    await this.success('/admin/focus', '增加轮播图成功');

  }
  async edit() {

    let id = this.ctx.request.query.id;

    let result = await this.ctx.model.Focus.find({
      "_id": id
    });

    console.log(result);

    await this.ctx.render('admin/focus/edit', {

      list: result[0]
    });

  }

  async doEdit() {

    let uploadResult = await this.service.tool.getUploadFile(this.ctx, true)
    let formFields = Object.assign(uploadResult.files, uploadResult.field)

    //修改操作

    let id = uploadResult.field.id;

    let result = await this.ctx.model.Focus.updateOne({
      "_id": id
    }, formFields);

    await this.success('/admin/focus', '修改轮播图成功');


  }






}

module.exports = FocusController;
