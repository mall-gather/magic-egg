'use strict';

const Controller = require('../core/base_controller');
class PayController extends Controller {
  /* ************************ 支付宝相关 ************************ */
  async ali() {
    const { ctx } = this;
    const date = (new Date()).getTime();
    const query = ctx.query;
    // 此处为模拟数据
    console.log(query);
    const data = {
      subject: query.order_id,
      // order_id: query.order_id,
      out_trade_no: date.toString(),
      total_amount: '0.1',
    };
    const url = await ctx.service.pay.ali(data);
    ctx.redirect(url);
  }

  // 这里是用户扫码之后的回调页面显示，扫码成功后会跳转到(重定向到)商户: /pay/alipay/return 这里
  // 页面上会有一些携带参数，包括cartset,out_trade_no, method, total_amount, sign 等，但不能通过这些信息来更新我们自己数据库的订单，不安全
  // 我们需要用支付宝给我们服务器推送过来的数据，来做更新处理
  async aliReturn() {
    const { ctx } = this;
    ctx.body = '支付成功';
    ctx.redirect('http://localhost:8080/#/order');
    // 接收异步通知 页面什么的自行处理 TODO
  }

  // 支付成功以后更新订单信息 必须正式上线, 或者起码配置一个测试的公网ip或域名, 用于接收付款成功后，支付宝给我们post的数据
  async payMoney() {
    // 接收阿里服务器POST提交的XML数据
    const params = this.ctx.request.body;
    const result = await this.service.pay.aliPayNotify(params);
    if (result.code === 0) {
      if (params.trade_status === 'TRADE_SUCCESS') {

        // 更新订单信息
        console.log(params);
        await this.ctx.service.order.orderPay(params.subject);

        this.ctx.body = {
          code: 200,
        };
      }

    }
  }
}

module.exports = PayController;
