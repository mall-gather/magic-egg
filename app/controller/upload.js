'use strict';
const Controller = require('../core/base_controller');
class UploadController extends Controller {
  async uploadImg() {
    const {
      ctx,
    } = this;

    const data = await ctx.service.upload.uploadImg();

    if (data) {
      ctx.body = {
        code: 200,
        data,
      };
    } else {
      ctx.body = ctx.logger.error();
    }
  }
}

module.exports = UploadController;

