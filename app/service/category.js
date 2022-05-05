'use strict';

const {
  Service,
} = require('egg');
const {
  timestamp,
} = require('../utils/time');

class CategoryService extends Service {
  // 查询分类
  async getCategoryColumnList() {
    const {
      app,
    } = this;

    const categoryColumn = await app.mysql.select('category');
    return categoryColumn;
  }
  // 添加分类
  async addCategory(data) {
    const {
      app,
    } = this;

    const categoryData = {
      category_name: data.category_name,
      level: data.level,
      category_column: data.category_column,
      create_time: timestamp(),
    };

    const category = await app.mysql.insert('category', categoryData);

    return category.affectedRows;
  }
  // 查询商品分类
  async getCategoryList(currentPage, pageSize) {
    const {
      app,
    } = this;
    const sql = `select 
                        c.*,
                        count(g.goods_id) goodsNumber 
                    from 
                        category c 
                        left join goods g on c.category_id=g.category_id 
                    group by c.category_id 
                        limit ?,?`;
    const start = (currentPage - 1) * pageSize;
    const row = Number(pageSize);
    const category = await app.mysql.query(sql, [ start, row ]);
    return category;
  }
  // 查询商品分类总数
  async getCategoryTotal() {
    const {
      app,
    } = this;
    const sql = 'select count(category_id) as total from category';
    const total = await app.mysql.query(sql);
    return total[0].total;
  }

  // 删除分类
  async deleteCategory(category_id) {
    const {
      app,
    } = this;

    const goodsSql = 'select * from goods where category_id=?';
    const goods = await app.mysql.query(goodsSql, [ category_id ]);
    if (goods.length) {
      return '删除失败，该商品分类存在商品';
    }
    const deleteCategory = await app.mysql.delete('category', {
      category_id,
    });
    console.log(deleteCategory.affectedRows);
    return deleteCategory.affectedRows;
  }
  // id查询商品分类
  async getCategory(category_id) {
    const {
      app,
    } = this;

    const category = await app.mysql.get('category', { category_id });
    return category;
  }
  // 修改商品类型
  async upDataCategory(data) {
    const {
      app,
    } = this;

    const categoryData = {
      category_name: data.category_name,
      level: data.level,
      category_column: data.category_column,
    };
    const categoryOptions = {
      where: {
        category_id: data.category_id,
      },
    };
    const category = await app.mysql.update('category', categoryData, categoryOptions);
    return category.affectedRows;
  }
}

module.exports = CategoryService;
