'use strict';

const Controller = require('../core/base_controller');
class OrderController extends Controller {
  // 查询订单列表
  async getOrderList() {
    const {
      ctx,
    } = this;
    const query = ctx.query;
    const total = await ctx.service.order.getOrderTotal();
    const orderList = await ctx.service.order.getOrderList(query.currentPage, query.pageSize);
    ctx.body = {
      code: 200,
      total,
      data: orderList,
    };
  }
  // 删除订单
  async deleteOrder() {
    const {
      ctx,
    } = this;
    const query = ctx.query;
    const deleteOrderData = await ctx.service.order.deleteOrder(query.order_id);
    if (deleteOrderData) {
      ctx.body = {
        code: 200,
        data: '删除成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
  // 查看订单
  async getOrder() {
    const {
      ctx,
    } = this;
    const query = ctx.query;
    const order = await ctx.service.order.getOrder(query.order_id);
    ctx.body = {
      code: 200,
      data: order,
    };
  }
  // 订单跟踪
  async getOrderTracking() {
    const {
      ctx,
    } = this;

    const query = ctx.query;
    const orderTracking = await ctx.service.order.getOrderTracking(query.order_id);

    ctx.body = {
      code: 200,
      data: orderTracking,
    };
  }
  // 查询物流公司列表
  async getLogisticsCompany() {
    const {
      ctx,
    } = this;
    const logisticsCompany = await ctx.service.order.getLogisticsCompany();
    ctx.body = {
      code: 200,
      data: logisticsCompany,
    };
  }
  // 修改收货人信息
  async updataConsigneeInfo() {
    const {
      ctx,
    } = this;

    const data = ctx.request.body;
    const consigneeInfo = await ctx.service.order.updataConsigneeInfo(data);
    if (consigneeInfo) {
      ctx.body = {
        code: 200,
        data: '修改成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
  // 修改费用信息
  async updataCostInfo() {
    const {
      ctx,
    } = this;

    const data = ctx.request.body;
    const costInfo = await ctx.service.order.updataCostInfo(data);
    if (costInfo) {
      ctx.body = {
        code: 200,
        data: '修改成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
  // 修改订单备注
  async updataOrderRemark() {
    const {
      ctx,
    } = this;

    const data = ctx.request.body;
    const orderRemark = await ctx.service.order.updataOrderRemark(data);
    if (orderRemark) {
      ctx.body = {
        code: 200,
        data: '修改成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
  // 关闭订单
  async updataCloseOrder() {
    const {
      ctx,
    } = this;
    const query = ctx.query;
    const closeOrder = await ctx.service.order.updataCloseOrder(query.order_id);
    if (closeOrder) {
      ctx.body = {
        code: 200,
        data: '关闭成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
  // 订单发货
  async updataOrderShipped() {
    const {
      ctx,
    } = this;
    const data = ctx.request.body;
    const orderShipped = await ctx.service.order.updataOrderShipped(data);
    if (orderShipped) {
      ctx.body = {
        code: 200,
        data: '发货成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
}

module.exports = OrderController;
