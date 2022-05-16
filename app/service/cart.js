'use strict';

const {
  Service,
} = require('egg');
const {
  timestamp,
} = require('../utils/time');


class CartService extends Service {
  // 添加购物车
  async addCart(data) {
    const {
      app,
    } = this;
    const row = {
      u_id: data.u_id,
      goods_id: data.goods_id,
      goods_avatar: data.goods_avatar,
      category_id: data.category_id,
      number: data.number,
      create_time: timestamp(),
    };

    const getCart = await app.mysql.get('cart', {
      u_id: data.u_id,
      goods_id: data.goods_id,
    });
    console.log(getCart);
    const cart = await app.mysql.insert('cart', row);

    return cart.affectedRows;
  }
}

module.exports = CartService;
