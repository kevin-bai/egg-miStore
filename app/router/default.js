'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {
    router,
    controller
  } = app;

  let initMiddleWare = app.middleware.init({}, app)

  router.get('/', initMiddleWare, controller.default.index.index);

  // 商品信息
  router.get('/plist', initMiddleWare, controller.default.product.list);
  router.get('/pinfo', initMiddleWare, controller.default.product.info);
  router.get('/getImagelist', initMiddleWare, controller.default.product.getImagelist);
  // router.get('/cart', initMiddleWare, controller.default.flow.cart);

  // 用户中心
  router.get('/login', controller.default.user.login);
  router.get('/register', controller.default.user.register);
  router.get('/user', controller.default.user.welcome);
  router.get('/user/order', controller.default.user.order);


  // 购物车
  router.get('/addCart', controller.default.cart.addCart);
  router.get('/cart', initMiddleWare, controller.default.cart.cartList);
  router.get('/addCartSuccess', initMiddleWare, controller.default.cart.addCartSuccess);
  router.get('/incCart', initMiddleWare, controller.default.cart.incCart);
  router.get('/decCart', initMiddleWare, controller.default.cart.decCart);
  router.get('/changeOneCart', initMiddleWare, controller.default.cart.changeOneCart);
  router.get('/changeAllCart', initMiddleWare, controller.default.cart.changeAllCart);
  router.get('/removeCart', initMiddleWare, controller.default.cart.removeCart);


  //用户注册登录
  router.get('/login', initMiddleWare, controller.default.pass.login);
  router.get('/register/registerStep1', initMiddleWare, controller.default.pass.registerStep1);
  router.get('/register/registerStep2', initMiddleWare, controller.default.pass.registerStep2);
  router.get('/register/registerStep3', initMiddleWare, controller.default.pass.registerStep3);
  router.get('/pass/sendCode', initMiddleWare, controller.default.pass.sendCode);
  router.get('/pass/validatePhoneCode', initMiddleWare, controller.default.pass.validatePhoneCode);


  //验证码
  router.get('/verify', initMiddleWare, controller.default.base.verify);


};
