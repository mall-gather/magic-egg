'use strict';

const {
  Service,
} = require('egg');

class AdminService extends Service {
  async getAdmin(account, password) {
    const {
      app,
    } = this;
    const admin = await app.mysql.get('admin', {
      telephone: account,
      password,
    });
    return admin;
  }
}

module.exports = AdminService;
