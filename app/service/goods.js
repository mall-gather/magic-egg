'use strict';

const {
  Service,
} = require('egg');
const {
  timestamp,
} = require('../utils/time');
const {
  queryDifferentArray,
} = require('../utils/queryDifferentArray');

class GoodsService extends Service {
  // 查询商品列表
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
    const row = Number(pageSize);
    const goods = await app.mysql.query(sql, [ start, row ]);
    return goods;
  }
  // 查询商品总数
  async getGoodsTotal() {
    const {
      app,
    } = this;
    const sql = 'select count(goods_id) as total from goods';
    const total = await app.mysql.query(sql);
    return total[0].total;
  }
  // 查询商品信息
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
  // 删除商品
  async deleteGoods(article_number) {
    const {
      app,
    } = this;
    const deleteData = await app.mysql.delete('goods', {
      article_number,
    });
    const deleteArticleNumber = await app.mysql.delete('specification', {
      article_number,
    });
    return {
      deleteData,
      deleteArticleNumber,
    };
  }
  // 添加商品
  async addGoods(data) {
    const {
      app,
    } = this;

    const goodsData = {
      article_number: data.article_number,
      category_id: data.category_id,
      goods_name: data.goods_name,
      goods_price: data.goods_price,
      infor: data.infor,
      create_time: timestamp(),
      goods_carousel: data.goods_carousel,
      goods_details: data.goods_details,
      goods_avatar: data.goods_avatar,
      status: 1,
    };
    const goods = await app.mysql.insert('goods', goodsData);

    let specificationNum = null;
    const specificationList = data.specification;
    for (let index = 0; index < specificationList.length; index++) {
      const specificationData = {
        article_number: data.article_number,
        specification_name1: specificationList[index].specification_name1,
        specification_value1: specificationList[index].specification_value1,
        specification_name2: specificationList[index].specification_name2,
        specification_value2: specificationList[index].specification_value2,
        goods_pic: specificationList[index].goods_pic,
        inventory: specificationList[index].inventory,
      };
      const specification = await app.mysql.insert('specification', specificationData);
      specificationNum += specification.affectedRows;
    }
    return {
      goods,
      specificationNum,
    };
  }
  // 查询货号
  async getArticleNumber(article_number) {
    const {
      app,
    } = this;

    const articleNumber = await app.mysql.get('goods', {
      article_number,
    });

    return articleNumber;
  }
  // 更新商品信息
  async upDataGoods(data) {
    const {
      app,
    } = this;
    // 商品
    const goodsData = {
      article_number: data.article_number,
      category_id: data.category_id,
      goods_name: data.goods_name,
      goods_price: data.goods_price,
      infor: data.infor,
      goods_carousel: data.goods_carousel,
      goods_details: data.goods_details,
      goods_avatar: data.goods_avatar,
    };
    const goodsOptions = {
      where: {
        goods_id: data.goods_id,
      },
    };
    const goods = await app.mysql.update('goods', goodsData, goodsOptions);
    // 商品规格
    let specificationNum = null;
    const specificationList = data.specification;
    for (let index = 0; index < specificationList.length; index++) {
      const specificationData = {
        specification_name1: specificationList[index].specification_name1,
        specification_value1: specificationList[index].specification_value1,
        specification_name2: specificationList[index].specification_name2 || '',
        specification_value2: specificationList[index].specification_value2 || '',
        goods_pic: specificationList[index].goods_pic,
        inventory: specificationList[index].inventory,
      };
      const specificationOptions = {
        where: {
          specification_id: specificationList[index].specification_id,
        },
      };
      const specification = await app.mysql.update('specification', specificationData, specificationOptions);
      specificationNum += specification.affectedRows;
    }

    if (specificationNum === 0) {
      // 如果更新规格时，不存在规格则执行
      for (let index = 0; index < specificationList.length; index++) {
        const specificationData = {
          article_number: data.article_number,
          specification_name1: specificationList[index].specification_name1,
          specification_value1: specificationList[index].specification_value1,
          specification_name2: specificationList[index].specification_name2,
          specification_value2: specificationList[index].specification_value2,
          goods_pic: specificationList[index].goods_pic,
          inventory: specificationList[index].inventory,
        };
        const specification = await app.mysql.insert('specification', specificationData);
        specificationNum += specification.affectedRows;
      }
    } else if (specificationNum !== specificationList.length) {
      // 在编辑时添加新的规格
      for (let index = specificationNum; index < specificationList.length; index++) {
        const specificationData = {
          article_number: data.article_number,
          specification_name1: specificationList[index].specification_name1,
          specification_value1: specificationList[index].specification_value1,
          specification_name2: specificationList[index].specification_name2,
          specification_value2: specificationList[index].specification_value2,
          goods_pic: specificationList[index].goods_pic,
          inventory: specificationList[index].inventory,
        };
        const specification = await app.mysql.insert('specification', specificationData);
        const specificationDataList = await this.getSpecification(goodsData.article_number);
        specificationList[index].specification_id = specificationDataList[index].specification_id;
        specificationNum += specification.affectedRows;
      }
    }
    // 对比规格是否存在
    const specificationDataList = await this.getSpecification(goodsData.article_number);
    const deleteData = queryDifferentArray(specificationDataList, specificationList);
    for (let index = 0; index < deleteData.length; index++) {
      await app.mysql.delete('specification', {
        specification_id: deleteData[index].specification_id,
      });
    }
    return {
      goods,
      specificationNum,
    };
  }
  // 查询商品规格
  async getSpecification(article_number) {
    const {
      app,
    } = this;

    const sql = 'select * from specification where article_number=?';
    const specification = await app.mysql.query(sql, [ article_number ]);

    return specification;
  }
  // id查询商品规格
  async getSpecificationId(specification_id) {
    const {
      app,
    } = this;

    const sql = 'select * from specification where specification_id=?';
    const specification = await app.mysql.query(sql, [ specification_id ]);

    return specification;
  }
  // 更新商品规格
  async upDataSpecification(data) {
    const {
      app,
    } = this;
    let specificationNum = null;
    const specificationList = data.specification;
    for (let index = 0; index < specificationList.length; index++) {
      const specificationData = {
        specification_name1: specificationList[index].specification_name1,
        specification_value1: specificationList[index].specification_value1,
        specification_name2: specificationList[index].specification_name2 || '',
        specification_value2: specificationList[index].specification_value2 || '',
        goods_pic: specificationList[index].goods_pic,
        inventory: specificationList[index].inventory,
      };
      const specificationOptions = {
        where: {
          specification_id: specificationList[index].specification_id,
        },
      };
      const specification = await app.mysql.update('specification', specificationData, specificationOptions);
      specificationNum += specification.affectedRows;
    }
    return specificationNum === specificationList.length ? specificationNum : null;
  }
}

module.exports = GoodsService;
