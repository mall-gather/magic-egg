'use strict';
const Controller = require('../core/base_controller');
class GoodsController extends Controller {
  // 查询商品列表
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
  // 查询商品
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
  // 删除商品
  async deleteGoods() {
    const {
      ctx,
    } = this;

    const query = ctx.query;
    const data = await ctx.service.goods.deleteGoods(query.article_number);
    if (data.deleteData.affectedRows) {
      ctx.body = {
        code: 200,
        data: '删除成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
  // 添加商品
  async addGoods() {
    const {
      ctx,
    } = this;

    const data = ctx.request.body;
    const info = await ctx.service.goods.addGoods(data);
    if (info.goods.affectedRows && info.specificationNum) {
      ctx.body = {
        code: 200,
        data: '添加成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
  // 查询货号是否存在
  async getArticleNumber() {
    const {
      ctx,
    } = this;

    const query = ctx.query;

    const data = await ctx.service.goods.getArticleNumber(query.article_number);
    if (data) {
      ctx.body = {
        code: 200,
        data: '货号存在',
      };
    } else {
      ctx.body = {
        code: 200,
        data: '货号不存在',
      };
    }
  }
  // 更新商品信息
  async upDataGoods() {
    const {
      ctx,
    } = this;

    const data = ctx.request.body;
    const info = await ctx.service.goods.upDataGoods(data);
    if (info.goods.affectedRows && info.specificationNum) {
      ctx.body = {
        code: 200,
        data: '修改成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
  // 查询商品规格
  async getSpecification() {
    const {
      ctx,
    } = this;

    const query = ctx.query;
    // 货号查
    if (query.article_number) {
      const specification = await ctx.service.goods.getSpecification(query.article_number);
      if (specification.length) {
        ctx.body = {
          code: 200,
          data: specification,
        };
      } else {
        ctx.body = ctx.logger.error();
      }
    }
    // id查
    if (query.specification_id) {
      const specification = await ctx.service.goods.getSpecificationId(query.specification_id);
      if (specification.length) {
        ctx.body = {
          code: 200,
          data: specification[0],
        };
      } else {
        ctx.body = ctx.logger.error();
      }
    }

  }
  // 更新商品规格
  async upDataSpecification() {
    const {
      ctx,
    } = this;
    const data = ctx.request.body;
    const specification = await ctx.service.goods.upDataSpecification(data);
    if (specification) {
      ctx.body = {
        code: 200,
        data: '修改成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
}

module.exports = GoodsController;
