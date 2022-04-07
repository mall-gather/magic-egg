'use strict';

const {
  Service,
} = require('egg');

class GoodsService extends Service {
  async getGoodsList() {
    const {
      app,
    } = this;
    const goods = await app.mysql.select('goods');
    return goods;
  }
}

module.exports = GoodsService;
