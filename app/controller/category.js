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
}

module.exports = CategoryController;
