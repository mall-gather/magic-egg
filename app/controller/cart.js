'use strict';

const Controller = require('../core/base_controller');
class CartController extends Controller {
  // 添加购物车
  async addCart() {
    const {
      ctx,
    } = this;
    const data = ctx.request.body;
    const cart = await ctx.service.cart.addCart(data);

    if (cart) {
      ctx.body = {
        code: 200,
        data: '添加成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
  // 查询购物车
  async getCart() {
    const {
      ctx,
    } = this;
    const query = ctx.query;
    const cart = await ctx.service.cart.getCart(query.u_id);
    if (cart) {
      ctx.body = {
        code: 200,
        data: cart,
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
  // 修改购物车商品数量
  async updataCartNum() {
    const {
      ctx,
    } = this;
    const data = ctx.request.body;
    const cart = await ctx.service.cart.updataCartNum(data);
    if (cart) {
      ctx.body = {
        code: 200,
        data: '修改成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
  // 删除购物车商品
  async deleteCart() {
    const {
      ctx,
    } = this;
    const query = ctx.query;
    const cart = await ctx.service.cart.deleteCart(query.cart_id);
    if (cart) {
      ctx.body = {
        code: 200,
        data: '删除成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
}

module.exports = CartController;
