'use strict';

// 当前时间戳
function timestamp() {
  const time = new Date();
  return time.getTime();
}

function getTime(days) {
  const time = new Date();

  // 当前时间戳
  const dayTimestamp = time.getTime();

  // 一天的时间戳
  const oneTimestamp = 60 * 60 * 24 * 1000;

  /**
   * 参数：days (天数)
   * 公式：
   *    当前时间戳 + 一天的时间戳 * 天数(正数为未来的时间，负数为过去的时间)
   *    dayTimestamp + oneTimestamp * day
   */
  const date = new Date(dayTimestamp + oneTimestamp * days);
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return year + '-' + month + '-' + day;
}

// 转换时间戳为 yyyy-MM-dd hh:mm:ss
function convertTime(fmt, timestamp) {
  /**
   * fmt 时间格式
   * timestamp 时间戳
   */
  const time = new Date(timestamp);
  const o = {
    'M+': time.getMonth() + 1,
    'd+': time.getDate(),
    'h+': time.getHours(),
    'm+': time.getMinutes(),
    's+': time.getSeconds(),
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
}

module.exports = { timestamp, getTime, convertTime };
