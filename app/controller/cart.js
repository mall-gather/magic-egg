'use strict';

const Controller = require('../core/base_controller');
class CartController extends Controller {
  // 添加购物车
  async addCart() {
    const { ctx } = this;
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
}

module.exports = CartController;
