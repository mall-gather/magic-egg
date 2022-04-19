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
  async getGoods(goods_id) {
    const {
      app,
    } = this;
    const goodsSql = 'select * from goods where goods_id=?';
    const specificationSql = 'select * from specification where article_number=?';
    const goods = await app.mysql.query(goodsSql, [ goods_id ]);
    const specification = await app.mysql.query(specificationSql, [ goods[0].article_number ]);

    goods.map(item => {
      item.specification = specification;
      return item;
    });
    return goods[0];
  }
}

module.exports = GoodsService;
