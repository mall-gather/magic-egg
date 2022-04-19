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
  async getGoods() {
    const {
      ctx,
    } = this;

    const query = ctx.query;
    const goods = await ctx.service.goods.getGoods(query.goods_id);

    ctx.body = {
      code: 200,
      data: goods,
    };
  }
}

module.exports = GoodsController;
