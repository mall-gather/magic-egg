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
      specification_id: data.specification_id,
      goods_avatar: data.goods_avatar,
      number: data.number,
      create_time: timestamp(),
    };

    const getCart = await app.mysql.get('cart', {
      u_id: data.u_id,
      goods_id: data.goods_id,
      specification_id: data.specification_id,
    });
    if (getCart) {
      const cart = await app.mysql.update('cart', {
        number: data.number > 1 ? (getCart.number + data.number) : (getCart.number + 1),
      }, {
        where: {
          u_id: data.u_id,
          goods_id: data.goods_id,
          specification_id: data.specification_id,
        },
      });
      return cart.affectedRows;
    }
    const cart = await app.mysql.insert('cart', row);
    return cart.affectedRows;
  }
  // 查询购物车
  async getCart(u_id) {
    const { app } = this;

    const sql = `select c.cart_id,
                        c.u_id,c.goods_id,
                        c.specification_id,c.number,
                        c.goods_avatar,
                        g.goods_name,
                        s.specification_name1,
                        s.specification_name2,
                        s.specification_value1,
                        s.specification_value2,
                        s.goods_pic 
                      from cart c 
                      left join goods g 
                      on c.goods_id=g.goods_id 
                      left join specification s 
                      on c.specification_id=s.specification_id 
                      where u_id=?`;
    const cart = await app.mysql.query(sql, u_id);

    return cart;
  }

  // 修改购物车商品数量
  async updataCartNum(data) {
    const { app } = this;

    const cart = await app.mysql.update('cart', {
      number: data.num,
    }, {
      where: {
        cart_id: data.cart_id,
      },
    });
    return cart.affectedRows;
  }
  // 删除购物车商品
  async deleteCart(cart_id) {
    const { app } = this;

    const cart = await app.mysql.delete('cart', {
      cart_id,
    });

    return cart.affectedRows;
  }
}

module.exports = CartService;
