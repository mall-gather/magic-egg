'use strict';

const Controller = require('../core/base_controller');
class AdminHomeController extends Controller {
  // 订单统计
  async getOrderStatistics() {
    const {
      ctx,
    } = this;

    const orderDayData = await ctx.service.adminhome.getOrderStatistics();
    ctx.body = {
      code: 200,
      data: orderDayData,
    };
  }
}

module.exports = AdminHomeController;
