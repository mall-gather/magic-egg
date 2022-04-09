'use strict';

const {
  Service,
} = require('egg');

class GoodsService extends Service {
  async getGoodsList(currentPage, pageSize) {
    const {
      app,
    } = this;

    const sql = `select 
                        g.*,
                        count(o.order_id) sales 
                    from 
                        goods g 
                        left join \`order\` o on g.goods_id=o.goods_id 
                    group by g.goods_id 
                        limit ?,?`;
    const start = (currentPage - 1) * pageSize;
    const end = currentPage * pageSize;
    const goods = await app.mysql.query(sql, [ start, end ]);
    return goods;
  }
  async getGoodsTotal() {
    const {
      app,
    } = this;
    const sql = 'select count(goods_id) as total from goods';
    const total = await app.mysql.query(sql);
    return total[0].total;
  }
}

module.exports = GoodsService;
