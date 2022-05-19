'use strict';

const {
  Service,
} = require('egg');
const {
  timestamp,
  countdown,
} = require('../utils/time');
const {
  v4: uuidv4,
} = require('uuid');

class OrderService extends Service {
  // 查询订单列表
  async getOrderList(currentPage, pageSize) {
    const {
      app,
    } = this;

    const sql = `select 
                      o.*,u.u_name 
                      from \`order\` o 
                      left join users u 
                      on o.u_id=u.u_id 
                      group by o.order_id 
                      limit ?,?`;
    const start = (currentPage - 1) * pageSize;
    const row = Number(pageSize);

    const orderList = await app.mysql.query(sql, [ start, row ]);

    return orderList;
  }
  // 查询用户订单列表
  async getUserOrderList(u_id, order_status) {
    const {
      app,
    } = this;

    // 查询订单
    const orderUidAll = await app.mysql.select('order', {
      where: {
        u_id,
      },
    });
    for (let index = 0; index < orderUidAll.length; index++) {
      if (orderUidAll[index].order_status === 1) {
        if (countdown(orderUidAll[index].end_time) === 0) {
          await app.mysql.update('order', {
            order_status: -1,
          }, {
            where: {
              order_id: orderUidAll[index].order_id,
            },
          });
        }
      }
    }

    if (Number(order_status) !== 0) {
      // 查询订单
      const order = await app.mysql.select('order', {
        where: {
          u_id,
          order_status,
        },
      });
      // 查询订单包含的商品
      for (let index = 0; index < order.length; index++) {
        const ordergoodsData = await app.mysql.select('ordergoods', {
          where: {
            order_id: order[index].order_id,
          },
        });
        for (let i = 0; i < ordergoodsData.length; i++) {
          const specificationData = await app.mysql.get('specification', {
            specification_id: ordergoodsData[i].specification_id,
          });
          ordergoodsData[i].specification = specificationData;
        }
        order[index].ordergoods = ordergoodsData;
      }
      return order;
    }

    // 查询用户全部订单
    const order = await app.mysql.select('order', {
      where: {
        u_id,
      },
      orders: [
        [ 'create_time', 'desc' ],
      ],
    });
    // 查询订单包含的商品
    for (let index = 0; index < order.length; index++) {
      const ordergoodsData = await app.mysql.select('ordergoods', {
        where: {
          order_id: order[index].order_id,
        },
      });
      for (let i = 0; i < ordergoodsData.length; i++) {
        const specificationData = await app.mysql.get('specification', {
          specification_id: ordergoodsData[i].specification_id,
        });
        ordergoodsData[i].specification = specificationData;
      }
      order[index].ordergoods = ordergoodsData;
    }

    return order;
  }
  // 查询用户订单列表
  async getUserOrder(u_id, order_id) {
    const {
      app,
    } = this;

    const order = await app.mysql.get('order', {
      u_id,
      order_id,
    });
    const orderGoods = await app.mysql.select('ordergoods', {
      where: {
        order_id,
      },
    });
    for (let index = 0; index < orderGoods.length; index++) {
      const specification = await app.mysql.get('specification', {
        specification_id: orderGoods[index].specification_id,
      });
      orderGoods[index].specification = specification;
    }
    order.orderGoods = orderGoods;

    return order;
  }
  // 查询订单总数
  async getOrderTotal() {
    const {
      app,
    } = this;
    const sql = 'select count(order_id) as total from \`order\`';
    const total = await app.mysql.query(sql);
    return total[0].total;
  }
  // 删除订单
  async deleteOrder(order_id) {
    const {
      app,
    } = this;
    const deleteOrderData = await app.mysql.delete('order', {
      order_id,
    });
    return deleteOrderData.affectedRows;
  }
  // 查看订单
  async getOrder(order_id) {
    const {
      app,
    } = this;

    const orderSql = `select 
                      o.*,u.u_name,c.coupon_reduce 
                      from \`order\` o 
                      left join users u 
                      on o.u_id=u.u_id 
                      left join coupon c 
											on o.coupon_id=c.coupon_id
                      where o.order_id=?`;
    const order = await app.mysql.query(orderSql, [ order_id ]);
    const orderGoodsSql = `select o.*,
                                s.article_number,
                                s.specification_name1,
                                s.specification_value1,
                                s.specification_name2,
                                s.specification_value2
                                from ordergoods o 
                                left join specification s 
                                on o.specification_id=s.specification_id 
                                where o.order_id=?`;
    const orderGoods = await app.mysql.query(orderGoodsSql, [ order_id ]);

    order[0].orderGoods = orderGoods;

    return order[0];
  }
  // 订单跟踪
  async getOrderTracking(order_id) {
    const {
      app,
    } = this;

    const orderTracking = await app.mysql.select('logisticsinfo', {
      where: {
        order_id,
      },
      columns: [ 'logistics_info', 'logistics_time' ],
    });

    return orderTracking;
  }
  // 查询物流公司列表
  async getLogisticsCompany() {
    const {
      app,
    } = this;
    const logisticsCompany = await app.mysql.select('logisticscompany');
    return logisticsCompany;
  }
  // 查询物流公司
  async queryLogisticsCompany(company_id) {
    const {
      app,
    } = this;
    const logisticsCompany = await app.mysql.get('logisticscompany', {
      company_id,
    });
    return logisticsCompany;
  }
  // 修改收货人信息
  async updataConsigneeInfo(data) {
    const {
      app,
    } = this;

    const row = {
      consignee: data.consignee,
      telephone: data.telephone,
      zipcode: data.zipcode,
      address_region: data.address_region,
      address_detailed: data.address_detailed,
    };
    const options = {
      where: {
        order_id: data.order_id,
      },
    };

    const consigneeInfo = await app.mysql.update('order', row, options);

    return consigneeInfo.affectedRows;
  }
  // 修改费用信息
  async updataCostInfo(data) {
    const {
      app,
    } = this;

    const row = {
      order_freight: data.order_freight || 0,
      order_amount_tatal: data.order_amount_tatal,
    };
    const options = {
      where: {
        order_id: data.order_id,
      },
    };

    const costInfo = await app.mysql.update('order', row, options);

    return costInfo.affectedRows;
  }
  // 修改订单备注
  async updataOrderRemark(data) {
    const {
      app,
    } = this;

    const row = {
      note: data.note,
    };
    const options = {
      where: {
        order_id: data.order_id,
      },
    };

    const orderRemark = await app.mysql.update('order', row, options);

    return orderRemark.affectedRows;
  }
  // 关闭订单
  async updataCloseOrder(order_id) {
    const {
      app,
    } = this;

    const row = {
      order_status: -1,
    };
    const options = {
      where: {
        order_id,
      },
    };
    const closeOrder = await app.mysql.update('order', row, options);

    return closeOrder.affectedRows;
  }
  // 订单发货
  async updataOrderShipped(data) {
    const {
      app,
    } = this;

    const row = {
      company_id: data.company_id,
      company_number: data.company_number,
      order_status: 3,
    };
    const options = {
      where: {
        order_id: data.order_id,
      },
    };
    const orderShipped = await app.mysql.update('order', row, options);

    return orderShipped.affectedRows;
  }
  // 退货原因
  async getReturnReason(currentPage, pageSize) {
    const {
      app,
    } = this;
    const sql = 'select * from reason limit ?,?';
    const start = (currentPage - 1) * pageSize;
    const row = Number(pageSize);

    const returnReason = await app.mysql.query(sql, [ start, row ]);

    return returnReason;
  }
  // 退货原因总数
  async getReturnReasonTotal() {
    const {
      app,
    } = this;
    const sql = 'select count(reason_id) as total from reason';
    const total = await app.mysql.query(sql);
    return total[0].total;
  }
  // 编辑退货原因
  async updataReason(data) {
    const {
      app,
    } = this;

    const row = {
      reason_type: data.reason_type,
      available: data.available,
      add_time: timestamp(),
    };
    const options = {
      where: {
        reason_id: data.reason_id,
      },
    };
    const reason = await app.mysql.update('reason', row, options);
    return reason.affectedRows;
  }
  // 添加退货原因
  async addReason(data) {
    const {
      app,
    } = this;

    const row = {
      reason_type: data.reason_type,
      available: data.available,
      add_time: timestamp(),
    };

    const reason = await app.mysql.insert('reason', row);
    console.log(reason);
    return reason.affectedRows;
  }
  // 删除原因
  async deleteReason(reason_id) {
    const {
      app,
    } = this;

    const reason = await app.mysql.delete('reason', {
      reason_id,
    });
    return reason.affectedRows;
  }
  // 提交订单
  async submitOrders(data) {
    const {
      app,
    } = this;
    const row = {
      order_id: uuidv4(),
      u_id: data.u_id,
      item_count: data.item_count,
      goods_amount_tatol: data.goods_amount_tatol,
      order_amount_tatal: data.order_amount_tatal,
      order_status: data.order_status,
      pay_channel: data.pay_channel,
      coupon_id: data.coupon_id,
      zipcode: data.zipcode,
      consignee: data.consignee,
      telephone: data.telephone,
      address_region: data.address_region,
      address_detailed: data.address_detailed,
      note: data.note,
      order_freight: data.order_freight,
      create_time: timestamp(),
      end_time: timestamp() + (30 * 60 * 1000),
    };
    const order = await app.mysql.insert('order', row);

    let orderGoodsNum = 0;
    for (let index = 0; index < data.orderGoods.length; index++) {
      const row2 = {
        order_id: row.order_id,
        goods_id: data.orderGoods[index].goods_id,
        goods_avatar: data.orderGoods[index].goods_avatar,
        goods_name: data.orderGoods[index].goods_name,
        specification_id: data.orderGoods[index].specification_id,
        goods_pic: data.orderGoods[index].goods_pic,
        goods_num: data.orderGoods[index].goods_num,
        state: data.order_status,
      };
      const orderGoodsData = await app.mysql.insert('ordergoods', row2);
      if (data.orderGoods[index].cart_id) {
        await app.mysql.delete('cart', {
          cart_id: data.orderGoods[index].cart_id,
        });
      }
      orderGoodsNum += orderGoodsData.affectedRows;
    }

    if (order.affectedRows === 1 && orderGoodsNum === data.orderGoods.length) {
      return {
        order_id: row.order_id,
        order_amount_tatal: row.order_amount_tatal,
      };
    }
    return false;


  }
  // 支付订单
  async orderPay(order_id) {
    const { app } = this;

    const orderPay = await app.mysql.update('order', {
      order_status: 2,
    },
    {
      where: {
        order_id,
      },
    });

    return orderPay.affectedRows;
  }
}

module.exports = OrderService;
