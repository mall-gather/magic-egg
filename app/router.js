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
  router.get('/api/getarticlenumber', jwt, controller.goods.getArticleNumber);
  router.get('/api/getspecification', jwt, controller.goods.getSpecification);

  router.post('/api/admin/login', controller.admin.login);
  router.post('/api/addgoods', jwt, controller.goods.addGoods);
  router.post('/api/addcategory', jwt, controller.goods.addCategory);
  router.post('/file/upload', jwt, controller.upload.uploadImg);

  router.put('/api/updatagoods', jwt, controller.goods.upDataGoods);
  router.put('/api/updataspecification', jwt, controller.goods.upDataSpecification);

  router.delete('/api/deletegoods', jwt, controller.goods.deleteGoods);
};
