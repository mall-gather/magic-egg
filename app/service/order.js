'use strict';

const {
  Service,
} = require('egg');
const {
  timestamp,
} = require('../utils/time');

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
  async getUserOrderList(data) {
    const {
      app,
    } = this;
    return;
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
}

module.exports = OrderService;
