'use strict';

// 当前时间戳
function timestamp() {
  const time = new Date();
  return time.getTime();
}

module.exports = { timestamp };
