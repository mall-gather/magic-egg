'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  router.get('/api/admin/index', jwt, controller.admin.index);
  router.get('/api/querygoods', jwt, controller.goods.getGoodsList);
  router.get('/api/category', jwt, controller.category.getCategoryColumnList);
  router.get('/api/getgoods', jwt, controller.goods.getGoods);
  router.get('/api/articlenumber', jwt, controller.goods.getArticleNumber);

  router.post('/api/admin/login', controller.admin.login);
  router.post('/api/addgoods', jwt, controller.goods.addGoods);
  router.post('/file/upload', jwt, controller.upload.uploadImg);

  router.put('/api/updatagoods', jwt, controller.goods.upDataGoods);

  router.delete('/api/deletegoods', jwt, controller.goods.deleteGoods);
};
