'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  router.get('/api/admin/index', jwt, controller.admin.index);
  router.get('/api/querygoods', jwt, controller.goods.getGoodsList);
  router.get('/api/category', jwt, controller.category.getCategoryColumnList);
  router.get('/api/getcategory', jwt, controller.category.getCategory);
  router.get('/api/querycategory', jwt, controller.category.getCategoryList);
  router.get('/api/getgoods', jwt, controller.goods.getGoods);
  router.get('/api/getarticlenumber', jwt, controller.goods.getArticleNumber);
  router.get('/api/getspecification', jwt, controller.goods.getSpecification);
  router.get('/api/getorderlist', jwt, controller.order.getOrderList);
  router.get('/api/getorder', jwt, controller.order.getOrder);
  router.get('/api/getordertracking', jwt, controller.order.getOrderTracking);
  router.get('/api/getlogisticscompany', jwt, controller.order.getLogisticsCompany);

  router.post('/api/admin/login', controller.admin.login);
  router.post('/api/addgoods', jwt, controller.goods.addGoods);
  router.post('/api/addcategory', jwt, controller.category.addCategory);
  router.post('/file/upload', jwt, controller.upload.uploadImg);

  router.put('/api/updatagoods', jwt, controller.goods.upDataGoods);
  router.put('/api/updataspecification', jwt, controller.goods.upDataSpecification);
  router.put('/api/updatacategory', jwt, controller.category.upDataCategory);
  router.put('/api/updataconsigneeinfo', jwt, controller.order.updataConsigneeInfo);
  router.put('/api/updatacostinfo', jwt, controller.order.updataCostInfo);
  router.put('/api/updataorderremark', jwt, controller.order.updataOrderRemark);
  router.put('/api/updatacloseorder', jwt, controller.order.updataCloseOrder);
  router.put('/api/updataordershipped', jwt, controller.order.updataOrderShipped);

  router.delete('/api/deletegoods', jwt, controller.goods.deleteGoods);
  router.delete('/api/deletecategory', jwt, controller.category.deleteCategory);
  router.delete('/api/deleteorder', jwt, controller.order.deleteOrder);
};
