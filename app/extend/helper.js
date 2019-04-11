const sd = require('silly-datetime')
const path = require('path')
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
  }
}