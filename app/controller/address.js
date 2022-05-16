'use strict';

const Controller = require('../core/base_controller');
class AddressController extends Controller {
  // 查询用户地址
  async getAddress() {
    const {
      ctx,
    } = this;
    const query = ctx.query;
    if (query.u_id) {
      const address = await ctx.service.address.getAddress(query.u_id);
      if (address) {
        ctx.body = {
          code: 200,
          data: address,
        };
      } else {
        ctx.body = ctx.logger.error();
      }
    }
    if (query.address_id) {
      const address = await ctx.service.address.getAddressId(query.address_id);
      if (address) {
        ctx.body = {
          code: 200,
          data: address[0],
        };
      } else {
        ctx.body = ctx.logger.error();
      }
    }

  }
  // 添加收货地址
  async addAddress() {
    const {
      ctx,
    } = this;
    const data = ctx.request.body;
    const address = await ctx.service.address.addAddress(data);

    if (address) {
      ctx.body = {
        code: 200,
        data: '添加成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
  // 更新收货地址
  async updataAddress() {
    const {
      ctx,
    } = this;
    const data = ctx.request.body;
    const address = await ctx.service.address.updataAddress(data);
    if (address) {
      ctx.body = {
        code: 200,
        data: '修改成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
  // 删除收货地址
  async deleteAddress() {
    const {
      ctx,
    } = this;
    const query = ctx.query;
    const address = await ctx.service.address.deleteAddress(query.address_id);
    if (address) {
      ctx.body = {
        code: 200,
        data: '删除成功',
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
}

module.exports = AddressController;
