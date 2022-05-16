'use strict';

const {
  Service,
} = require('egg');
const {
  v4: uuidv4,
} = require('uuid');

class UsersService extends Service {
  // 登录
  async getUser(data) {
    const {
      app,
    } = this;
    const sql = `select u_id,u_name,u_phone,u_gender,u_age,u_avatar,status
                      from users
                      where u_phone=? and u_password=?`;
    const user = await app.mysql.query(sql, [ data.telephone, data.password ]);
    return user[0];
  }
  // 注册账号
  async register(data) {
    const {
      app,
    } = this;
    const userInfo = {
      u_id: uuidv4(),
      u_name: data.username,
      u_phone: data.telephone,
      u_password: data.password,
      u_avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg',
    };
    const getUser = await app.mysql.get('users', {
      u_phone: userInfo.u_phone,
    });
    if (getUser) {
      return 0;
    }
    const user = await app.mysql.insert('users', userInfo);
    return user.affectedRows;


  }
}

module.exports = UsersService;
