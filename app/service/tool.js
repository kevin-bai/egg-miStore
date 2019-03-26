'use strict';
const svgCaptcha = require('svg-captcha')
const md5 = require('md5')
const path = require('path')
const mkdirp = require('mz-modules').mkdirp
const sd = require('silly-datetime')
const Jimp = require("jimp"); //生成缩略图的模块

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
  async getUploadFile(filename) {
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




}

module.exports = ToolService;
