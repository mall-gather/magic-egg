'use strict';

const Controller = require('../core/base_controller');
class UsersController extends Controller {
  async login() {
    const {
      ctx,
      app,
    } = this;
    const data = ctx.request.body;
    const user = await ctx.service.users.getUser(data);

    if (user) {
      const token = app.jwt.sign({
        account: data.account,
      }, app.config.jwt.secret, {
        expiresIn: '1d',
      });
      ctx.body = {
        code: 200,
        data: user,
        token,
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
  // 注册账号
  async register() {
    const {
      ctx,
    } = this;
    const data = ctx.request.body;
    const user = await ctx.service.users.register(data);
    if (user === 1) {
      ctx.body = {
        code: 200,
        data: '注册成功',
      };
    } else if (user === 0) {
      ctx.body = {
        code: 204,
        data: '注册失败，手机号已存在',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
}

module.exports = UsersController;
