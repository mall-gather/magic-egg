'use strict';
const Controller = require('../core/base_controller');
class GoodsController extends Controller {
  async getGoodsList() {
    const {
      ctx,
    } = this;

    const query = ctx.query;

    const total = await ctx.service.goods.getGoodsTotal();

    const goods = await ctx.service.goods.getGoodsList(query.currentPage, query.pageSize);

    ctx.body = {
      code: 200,
      total,
      data: goods,
    };

  }
}

module.exports = GoodsController;
