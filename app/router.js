'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  router.post('/api/admin/login', controller.admin.login);
  router.get('/api/admin/index', jwt, controller.admin.index);
  router.get('/api/querygoods', jwt, controller.goods.getGoodsList);
  router.post('/file/upload', jwt, controller.upload.uploadImg);
};
