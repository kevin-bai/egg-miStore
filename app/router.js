'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // 公共路由
  router.get('/admin/login', controller.admin.login.index);
  router.post('/admin/doLogin', controller.admin.login.doLogin);
  router.get('/admin/loginOut', controller.admin.login.loginOut);
  router.get('/admin/verify', controller.admin.base.captcha);
  router.get('/admin/delete', controller.admin.base.delete);
  router.get('/admin/changeStatus', controller.admin.base.changeStatus);
  router.get('/admin/editNum', controller.admin.base.editNum);


  router.get('/admin/manager', controller.admin.manager.index);
  router.get('/admin/manager/add', controller.admin.manager.add);
  router.get('/admin/manager/edit', controller.admin.manager.edit);
  router.post('/admin/manager/doAdd', controller.admin.manager.doAdd);
  router.post('/admin/manager/doEdit', controller.admin.manager.doEdit);

  router.get('/admin/role', controller.admin.role.index);
  router.get('/admin/role/add', controller.admin.role.add);
  router.get('/admin/role/edit', controller.admin.role.edit);
  router.get('/admin/role/auth', controller.admin.role.auth);
  router.post('/admin/role/doAdd', controller.admin.role.doAdd);
  router.post('/admin/role/doAuth', controller.admin.role.doAuth);
  router.post('/admin/role/doEdit', controller.admin.role.doEdit);

  router.get('/admin/access', controller.admin.access.index);
  router.get('/admin/access/add', controller.admin.access.add);
  router.get('/admin/access/edit', controller.admin.access.edit);
  router.post('/admin/access/doAdd', controller.admin.access.doAdd);
  router.post('/admin/access/doEdit', controller.admin.access.doEdit);

  router.get('/admin/file', controller.admin.file.index);
  router.get('/admin/file/add', controller.admin.file.add);
  router.post('/admin/file/doAdd', controller.admin.file.doAdd);
  // router.get('/admin/file/edit', controller.admin.file.edit);

};
