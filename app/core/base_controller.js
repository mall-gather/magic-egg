'use strict';

const Controller = require('egg').Controller;
class BaseController extends Controller {

  success({ success, code, data }) {
    this.ctx.body = {
      success: success || true,
      code: code || 200,
      data,
    };
  }
  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }
  /**
 * 获取前端传入的数据
 */
  async fetchData() {
    const ctx = this.ctx;
    const methods = ctx.request.method;
    let params;
    switch (methods.toLocaleUpperCase()) {
      case 'GET':
        params = ctx.query;
        break;
      case 'POST':
      case 'PUT':
      case 'DELETE':
        params = ctx.request.body;
        break;
      default:
        break;
    }
    return params;
  }
}
module.exports = BaseController;
