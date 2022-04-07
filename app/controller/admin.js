'use strict';

const Controller = require('../core/base_controller');
class AdminController extends Controller {
  async login() {
    const {
      ctx,
      app,
    } = this;
    const data = ctx.request.body;

    const getAdmin = await ctx.service.admin.getAdmin(data.account, data.password);

    if (getAdmin) {
      const token = app.jwt.sign({
        account: data.account,
      }, app.config.jwt.secret, {
        expiresIn: '1h',
      });
      ctx.body = {
        code: 200,
        token,
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }

  // 这个是之前测试验证写的
  async index() {
    const {
      ctx,
    } = this;
    console.log(ctx.state.user);
    ctx.body = {
      code: 200,
      msg: '验证成功',
    };
  }
}

module.exports = AdminController;
