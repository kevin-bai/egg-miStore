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
    match:'/admin'
  }

  config.session = {
    key: 'SESSION_ID',
    maxAge: 864000,
    httpOnly: true,
    encrpty: true,
    renew: true
  }

  config.view = {
    mapping: {
      '.html': 'ejs',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
