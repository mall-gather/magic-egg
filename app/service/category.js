'use strict';

const {
  Service,
} = require('egg');

class CategoryService extends Service {
  async getCategoryColumnList() {
    const {
      app,
    } = this;

    const categoryColumn = await app.mysql.select('category');
    return categoryColumn;
  }

}

module.exports = CategoryService;
