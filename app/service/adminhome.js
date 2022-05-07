'use strict';

const {
  Service,
} = require('egg');
const {
  getTime,
  convertTime,
} = require('../utils/time');

class AdminHomeService extends Service {
  // 订单统计
  async getOrderStatistics() {
    const {
      app,
    } = this;

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

    // 前7天的订单总数
    const todayorderTotal = [];
    const todaySalesTotal = [];
    const todayorderFinish = [];
    const orderDayTotal = await app.mysql.select('order');

    for (let i = 0; i < orderDayTotal.length; i++) {
      const orderGoods = await app.mysql.query(orderGoodsSql, [ orderDayTotal[i].order_id ]);
      orderDayTotal[i].orderGoods = orderGoods;
    }

    for (let index = 6; index >= 0; index--) {
      let num = 0;
      let money = 0;
      let finish = 0;
      orderDayTotal.map(item => {
        if (convertTime('yyyy-MM-dd', item.create_time) === getTime(-index)) {
          num += 1;
          money += item.order_amount_tatal;
          if (item.order_status === 4) {
            finish += 1;
          }
        }
        return item;
      });
      todayorderTotal.push(num);
      todaySalesTotal.push(money);
      todayorderFinish.push(finish);
    }
    return {
      todayorderTotal,
      todaySalesTotal,
      todayorderFinish,
    };
  }
}

module.exports = AdminHomeService;
