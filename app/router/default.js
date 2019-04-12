'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {
    router,
    controller
  } = app;

  let initMiddleWare = app.middleware.init({},app)

  router.get('/',initMiddleWare, controller.default.index.index);

  router.get('/plist',initMiddleWare, controller.default.product.list);
  router.get('/pinfo',initMiddleWare, controller.default.product.info);
  router.get('/pinfo',initMiddleWare, controller.default.product.info);
  router.get('/cart',initMiddleWare, controller.default.flow.cart);

  //用户中心
  router.get('/login', controller.default.user.login);
  router.get('/register', controller.default.user.register);
  router.get('/user', controller.default.user.welcome);
  router.get('/user/order', controller.default.user.order);

};
