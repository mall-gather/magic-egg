'use strict';
const Controller = require('../core/base_controller');
class CategoryController extends Controller {
  async getCategoryColumnList() {
    const {
      ctx,
    } = this;

    const data = await ctx.service.category.getCategoryColumnList();

    ctx.body = {
      code: 200,
      data,
    };
  }
  // 添加分类
  async addCategory() {
    const {
      ctx,
    } = this;

    const data = ctx.request.body;
    const category = await ctx.service.category.addCategory(data);
    if (category) {
      ctx.body = {
        code: 200,
        data: '添加成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
  // 查询商品分类
  async getCategoryList() {
    const {
      ctx,
    } = this;

    const query = ctx.query;
    const total = await ctx.service.category.getCategoryTotal();
    const category = await ctx.service.category.getCategoryList(query.currentPage, query.pageSize);
    ctx.body = {
      code: 200,
      total,
      data: category,
    };
  }
  // 删除分类
  async deleteCategory() {
    const {
      ctx,
    } = this;

    const query = ctx.query;
    const deleteData = await ctx.service.category.deleteCategory(query.category_id);
    if (deleteData === 1) {
      ctx.body = {
        code: 200,
        data: '删除成功',
      };
    } else {
      if (deleteData === '删除失败，该商品分类存在商品') {
        ctx.body = {
          code: 200,
          data: deleteData,
        };
      } else {
        ctx.body = ctx.logger.error();
      }
    }
  }
  // id查询商品分类
  async getCategory() {
    const {
      ctx,
    } = this;

    const query = ctx.query;
    const category = await ctx.service.category.getCategory(query.category_id);
    ctx.body = {
      code: 200,
      data: category,
    };
  }
  // 修改商品类型
  async upDataCategory() {
    const {
      ctx,
    } = this;

    const data = ctx.request.body;

    const category = await ctx.service.category.upDataCategory(data);
    if (category) {
      ctx.body = {
        code: 200,
        data: '修改成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
}

module.exports = CategoryController;
