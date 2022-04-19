'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  router.post('/api/admin/login', controller.admin.login);
  router.get('/api/admin/index', jwt, controller.admin.index);
  router.get('/api/querygoods', jwt, controller.goods.getGoodsList);
  router.get('/api/getgoods', jwt, controller.goods.getGoods);
  router.post('/file/upload', jwt, controller.upload.uploadImg);
  router.get('/api/category', jwt, controller.category.getCategoryColumnList);
};
