'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  router.post('/api/login', controller.admin.login);
  router.get('/api/index', jwt, controller.admin.index);
  router.get('/api/querygoods', jwt, controller.goods.getGoodsList);
};
