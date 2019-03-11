'use strict';

const Service = require('egg').Service;
const svgCaptcha  =require('svg-captcha')

class ToolService extends Service {
  async captcha() {
    let captcha = svgCaptcha.create({ 
        size:6,
        fontSize: 50, 
        width: 100, 
        height:40,
        background:"#cc9966" 
      });
      console.log('captcha', captcha.text)
    this.ctx.session.code = captcha.text;


    return captcha
  }
}

module.exports = ToolService;
