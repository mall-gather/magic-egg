'use strict';
const {
  Service,
} = require('egg');
const fs = require('fs');
const path = require('path');
const sendToWormhole = require('stream-wormhole');

class UploadService extends Service {
  async uploadImg() {
    const {
      ctx,
    } = this;
    const stream = await ctx.getFileStream();
    const fileName = stream.filename;

    const target = path.join(this.config.baseDir, `app/public/comfiles/${stream.filename}`);
    const result = await new Promise((resolve, reject) => {
      const remoteFileStream = fs.createWriteStream(target);
      stream.pipe(remoteFileStream);
      let errFlag;
      remoteFileStream.on('error', err => {
        errFlag = true;
        sendToWormhole(stream);
        remoteFileStream.destroy();
        reject(err);
      });

      remoteFileStream.on('finish', async () => {
        if (errFlag) return;
        resolve({
          name: fileName,
          url: 'http://localhost:7001/public/comfiles/' + fileName,
        });
      });
    });
    return result;
  }
}

module.exports = UploadService;
