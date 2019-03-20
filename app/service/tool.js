'use strict';

const Service = require('egg').Service;
const svgCaptcha  =require('svg-captcha')
const md5 = require('md5')

class ToolService extends Service {
  async captcha() {
    let captcha = svgCaptcha.create({ 
        size:4,
        fontSize: 50, 
        width: 100, 
        height:40,
        background:"#cc9966" 
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
  async md5(str){
    return md5(str)
  }
}

module.exports = ToolService;
