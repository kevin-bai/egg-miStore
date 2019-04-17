/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1551707547490_5098';

  // add your middleware config here
  config.middleware = ['adminAuth'];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.adminAuth = {
    match: '/admin'
  }
  
  config.adminAuthWhiteList = [
    '/admin/login',
    '/admin/doLogin',
    '/admin/verify',
    '/admin/manager/add',
    '/admin/manager/doAdd'
]

  config.uploadDir = 'app/public/admin/upload/'

  config.session = {
    key: 'SESSION_ID',
    maxAge: 10864000,
    httpOnly: true,
    encrpty: true,
    renew: true
  }

  config.view = {
    mapping: {
      '.html': 'ejs',
    },
  };

    //配置表单数量
    config.multipart = {
      fields: '50',
      mode: 'stream'
   };

     //redis数据库连接地址
  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: '',
      db: 0
    }
  }


  config.mongoose = {
    client: {
      // url: 'mongodb://127.0.0.1:27017/eggxiaomi',
      url: 'mongodb://111.231.94.71:27017/eggxiaomi',
      options: {
        useNewUrlParser: true,
      },
    }
  };

  config.csrfWhiteList = [
    '/admin/goods/goodsUploadImage',
    '/admin/goods/goodsUploadPhoto',
    '/user/addAddress',
    '/user/editAddress',
     '/alipay/alipayNotify'
  ]
  //ctx.request.url=='/admin/goods/goodsUploadImage' || ctx.request.url=='/admin/goods/goodsUploadPhoto'|| ctx.request.url == '/user/addAddress' ||  ctx.request.url == '/user/editAddress' || ctx.request.url == '/alipay/alipayNotify'

  // config.csrfWhiteList.some(ctx.request.url
  config.security = {
    csrf: {
        // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
        ignore: ctx => {
          if(config.csrfWhiteList.indexOf(ctx.request.url) > 0){
            return true;
          }
          return false;
        }      
      }
    }



  // config.mysql = {
  //   // database configuration
  //   client: {
  //     // host
  //     host: '111.231.94.71',
  //     // port
  //     port: '3306',
  //     // username
  //     user: 'bjw',
  //     // password
  //     password: 'Xiaoshu123',
  //     // database
  //     database: 'online-store',
  //   },
  //   // load into app, default is open
  //   app: true,
  //   // load into agent, default is close
  //   agent: false,
  // };

  return {
    ...config,
    ...userConfig,
  };
};