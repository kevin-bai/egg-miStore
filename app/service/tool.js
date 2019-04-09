'use strict';
const svgCaptcha = require('svg-captcha')
const md5 = require('md5')
const path = require('path')
const mkdirp = require('mz-modules').mkdirp
const sd = require('silly-datetime')
const Jimp = require("jimp"); //生成缩略图的模块
const fs = require('fs');
const pump = require('mz-modules/pump');

const Service = require('egg').Service;

class ToolService extends Service {
  async captcha() {
    let captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      background: "#cc9966"
    });
    this.ctx.session.code = captcha.text;
    // console.log('captcha code',this.ctx.session.code)
    return captcha
  }

  /**
   * 
   * @param {string} str 
   * @returns {string}
   */
  async md5(str) {
    return md5(str)
  }

  /**
   * 获取时间戳
   */
  async getTime() {

    var d = new Date();

    return d.getTime();

  }


  /**
   * 获取upload file 的 保存路径
   * @param {string} filename 
   */
  async getUploadFilePath(filename) {
    let date = sd.format(new Date(), 'YYYMMDD')
    let uploadDir = path.join(this.config.uploadDir, date)
    let timestamp = await this.getTime();
    await mkdirp(uploadDir)

    let uploadPath = path.join(uploadDir, timestamp + path.extname(filename))
    console.log('uploadPath', uploadPath)
    let savePath = uploadPath.slice(3).replace(/\\/g, '/')
    console.log('savePath', savePath)
    return {
      uploadPath,
      savePath
    }
  }

  //生成缩略图的公共方法
  async jimpImg(target) {
    //上传图片成功以后生成缩略图
    Jimp.read(target, (err, lenna) => {
      if (err) throw err;
      lenna.resize(200, 200) // resize
        .quality(90) // set JPEG quality                  
        .write(target + '_200x200' + path.extname(target)); // save


      lenna.resize(400, 400) // resize
        .quality(90) // set JPEG quality                  
        .write(target + '_400x400' + path.extname(target)); // save
    });
  }

  /**
   * 
   * @param {Object} ctx let parts = this.ctx.multipart({autoFields: true});
   * @param {Boolean} isJump  是否生成缩略图
   * @returns result.files ：文件path。 剩下的是其他表单字段
   */
  async getUploadFile(ctx, isJump) {
    let parts = ctx.multipart({
      autoFields: true
    });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      let fieldname = stream.fieldname; //file表单的名字

      //上传图片的目录
      let dir = await this.service.tool.getUploadFilePath(stream.filename);
      let target = dir.uploadPath;
      let writeStream = fs.createWriteStream(target);

      await pump(stream, writeStream);

      files = Object.assign(files, {
        [fieldname]: dir.savePath
      })

      if (isJump) {
        this.service.tool.jimpImg(target);
      }
    }

    let result = {}
    result.files = files
    result.field = parts.field

    return result
  }


}

module.exports = ToolService;
