'use strict';
const Controller = require('../core/base_controller');
class goodsController extends Controller {
  async getGoodsList() {
    const { ctx } = this;

    const goods = await ctx.service.goods.getGoodsList();

    ctx.body = {
      code: 200,
      data: goods,
    };
  }
}

module.exports = goodsController;
