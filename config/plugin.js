'use strict';

/** @type Egg.EggPlugin */
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }
//   ejs : {
//     enable: true,
//     package: 'egg-view-ejs',
//   }
// };
exports.ejs = {
  enable: true,
  package: 'egg-view-ejs'
};

// exports.mysql = {
//   enable: true,
//   package: 'egg-mysql',
// };

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose'
};