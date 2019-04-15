const sd = require('silly-datetime')
const path = require('path')
const showdown = require('showdown')

/*
https://www.npmjs.com/package/showdown

1、安装

cnpm  install showdown --save

2、引入

var showdown  = require('showdown');


3、使用


   var converter = new showdown.Converter();
   var  text      = '# hello, markdown!';
   var  html      = converter.makeHtml(text);

*/

module.exports = {

  /**
   * 格式化时间戳，
   * @param {string} timestamp 13位时间戳 ,
   * @returns YYYY-MM-DD HH:mm:ss
   */
  formatTime(timestamp) {
    //todo 如果timestamp是10位的，需要  ×1000 。javascript生成的都是13位的
    return sd.format(timestamp)
  },

  formatImg(dir, width, height) {
    height = height || width;
    return dir + '_' + width + 'x' + height + path.extname(dir);
  },

  formatAttr(str){
    let converter = new showdown.Converter();
    return converter.makeHtml(str)
  }
}