'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;

  // 后台
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
  router.get('/api/querylogisticscompany', jwt, controller.order.queryLogisticsCompany);
  router.get('/api/getreturnreason', jwt, controller.order.getReturnReason);
  router.get('/api/getorderstatistics', jwt, controller.adminhome.getOrderStatistics);


  router.post('/api/admin/login', controller.admin.login);
  router.post('/api/addgoods', jwt, controller.goods.addGoods);
  router.post('/api/addcategory', jwt, controller.category.addCategory);
  router.post('/api/addreason', jwt, controller.order.addReason);
  router.post('/file/upload', jwt, controller.upload.uploadImg);

  router.put('/api/updatagoods', jwt, controller.goods.upDataGoods);
  router.put('/api/updataspecification', jwt, controller.goods.upDataSpecification);
  router.put('/api/updatacategory', jwt, controller.category.upDataCategory);
  router.put('/api/updataconsigneeinfo', jwt, controller.order.updataConsigneeInfo);
  router.put('/api/updatacostinfo', jwt, controller.order.updataCostInfo);
  router.put('/api/updataorderremark', jwt, controller.order.updataOrderRemark);
  router.put('/api/updatacloseorder', jwt, controller.order.updataCloseOrder);
  router.put('/api/updataordershipped', jwt, controller.order.updataOrderShipped);
  router.put('/api/updatareason', jwt, controller.order.updataReason);

  router.delete('/api/deletegoods', jwt, controller.goods.deleteGoods);
  router.delete('/api/deletecategory', jwt, controller.category.deleteCategory);
  router.delete('/api/deleteorder', jwt, controller.order.deleteOrder);
  router.delete('/api/deletereason', jwt, controller.order.deleteReason);

  // 前台
  router.get('/api/forward/querygoods', controller.goods.getGoodsList);
  router.get('/api/forward/getgoods', controller.goods.getGoods);
  router.get('/api/forward/getspecification', controller.goods.getSpecification);
  router.get('/api/forward/getaddress', jwt, controller.address.getAddress);
  // 查询购物车
  router.get('/api/forward/getcart', jwt, controller.cart.getCart);
  // 查询订单列表
  router.get('/api/forward/getuserorderlist', jwt, controller.order.getUserOrderList);

  router.post('/api/forward/login', controller.users.login);
  router.post('/api/forward/register', controller.users.register);
  router.post('/api/forward/addaddress', jwt, controller.address.addAddress);
  // 添加购物车
  router.post('/api/forward/addcart', jwt, controller.cart.addCart);

  // 修改收货地址
  router.put('/api/forward/updataaddress', jwt, controller.address.updataAddress);
  // 修改购物车商品数量
  router.put('/api/forward/updatacartnum', jwt, controller.cart.updataCartNum);

  // 删除收货地址
  router.delete('/api/forward/deleteaddress', jwt, controller.address.deleteAddress);
  // 删除购物车商品
  router.delete('/api/forward/deletecart', jwt, controller.cart.deleteCart);

};
