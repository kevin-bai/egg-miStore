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

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1:27017/eggxiaomi',
      options: {
        useNewUrlParser: true,
      },
    }
  };

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