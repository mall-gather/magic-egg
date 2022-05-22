/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1646394997839_2521';

  // add your middleware config here
  config.middleware = [];

  config.cluster = {
    listen: {
      path: '',
      port: 7001,
      hostname: '127.0.0.1',
    },
  };

  config.jwt = {
    secret: 'yuzu',
  };

  // 安全配置 （https://eggjs.org/zh-cn/core/security.html）
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
      ignore: ctx => {
        if (ctx.request.url === '/pay/ali/notify') {
          return true;
        }
        return false;
      },
    },
    // 允许访问接口的白名单
    domainWhiteList: [ '*' ],
  };

  // 支付相关配置：微信，支付宝
  config.pay = {
    ali: {
      // 我个人的沙箱信息
      options: {
        app_id: '2021000119699048', // 支付宝应用id
        appPrivKeyFile: 'MIIEogIBAAKCAQEAjVWs7guJMSdKlQU+nXaROVJbh+FWtSLCmDKjmYepB5jL6O0C9CAZKilnpgsCD2bcEuxmQksIPcjtiogcUUokiggRGKxJuVkT1Dlo5gFTVKeCA1F72Z+Z8OoeDpHBfGL0jzBvDRiVccvffi4MlB4Zadxf3M3OOhlMrFi/YM+qoeuATzGv4IsDSJqH6LAVcPhY/LS0DO8CvCof60AKQW5tuwe3lRESOW9ixfibCeuBDlQU3ot7NN3Jn8AS5Sfq5Ko8Ol4XlIta2c2sty6QVTJDHZd7LqW8fqYTIPtnm+dWLOU+IMTxF12F7ftGb2uYZ0hzWb1GIzaNAFuHqs+gQlg+lwIDAQABAoIBAGCyuJFZlTDrKA0TPIbxg2TLo1Ixa2ic8rS9GM/HUG+hLAoedwHeIDmHgKHLMEqnXnUYBtLekTHskhFRFMbNSniiEkhmQD6u4nE2Ij4TtBbcUIjCrFD18JYzKANh2BapgZeiVKiKJF1qVmv3R6XjfhG+tFvW930qqBnW0oGDM8R53EGkgxig5C8VfVhAd6m79g4c5QbQcmnsTzQgMcq84Y4nyFSXmOZGjF4cvJZJVslyloooXXAcE1rD/kttaEcTg5s6jwD73xdGz1mNT5/a3CextlpbCmdz6maPCKi6UMilWuPOAB1gAVf+DqDb5RrqNp97kZnnFJQuZyFH7qBAJqECgYEA2uRJ03ndEfg7337fYnQePpzgaKrIJDK5R+5/v6hftB3ksmMiaAdGd2x6IVrvckwCrdiHgBuhguQzQLlpXacYW2lLtc6m7+pfreD2seQkj+kCBmIEcpn/OkGeEtRqCWvKgcXEqtjsNg338+AOPKdU9hYwjTSI8WIGyI2d8ynafScCgYEApUt6LNDlSLq6/3WDwsuve/OqpOsmXZWLzt322Ckmrf7CKiklZDqfy4cd2Mz0BjO22fEqaZ3mXwyr+H1JV1YKiPOoa+GQ5sOGjaixsASqRDrzUS8qNIJLqKeWeXaFJDle0PiM3eMMFmNRuZi1NTUR+VcnhjgxcF5xo71bbFbt+RECgYBYeqzo4bqdt+Sjy8oKJvvOvWTsihQKpcJFND/JPgspaGf4P6A5wq8WOPAJKZPedKEkmoDzJLgdi5a4E/pmU9PBp4dl/xl1oxx30ZaGg7zPuxUJdXdsx5jmeH2oCNqv4jViTYnYsYSRuQXAO5IlrFHog0Gu4kx0nfY1/SCamRFrQwKBgGfXpwWIpsKuLNRYK1KxS6l/RvEcmZmpXY+0emMKVzZwGeMKvmbdPY5LcEDHYXaT/oekrpRzkkqcV11guDaZ4zxudpxvtOyEYX+VPyvpgl4i+sFB9C3QvV9TCYF9J9+9+wclXrn27Z0TAECs4wpuMMCINFhp7QU/D/1h9JF3e0FBAoGAQAIu6WQ7B+rj0nxmqO5Xxciwk5wdc+PfDhkD0ycqznVHewpLDAQZHkw4MX0oUDICuVGSDua0zuQKAGd8f1Ao8YtIppq3VkLjrLnxMA8TPhhp7/H2VGywB0l0hGa3IAzzK4c8cRAu6MMa9JAnXnBcDRbz3yFhe8nZbkw34JYFnc8=', // 应用私钥 字符串即可，文件需要读取同样是字符串
        alipayPubKeyFile: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnP3MmQteTB2xwlNA0pj29CTZJNPr2stD+kzs8ADy52ifZxU65laaR7z65RbqK2hfPk1+/SQ80y40FPQyDeTX9cOXAVYG319G19R/WfzZh1ejDH3+tZt5zwyaur/uVGNLL5esVdGQRk9J/35aVWsnmpPtgbUMUYTgggnQJ0zaNpvl+a6QwV+g5eMBii9UmJZyV9Ejq+WxzXrmP+JBqSwNOybl+metntt5t49EAmofalVo3b0jldx8qzolzD739K5R9M0pVo5wZBBslSVm7peQHpXh8TXTx6rqnb7lp0e1JeVpclceJ7pp4p9hmgLrtFGQguXRQRzRaNm4ZIM1e+7H4wIDAQAB', // 支付宝公钥
      },
      // 注意这里的路由是之前配置好的，后面会有讲到
      /**
       * http://localhost:7001 为公网地址
       * 根据个人环境配置
       *
       */
      basicParams: {
        return_url: 'http://localhost:7001/pay/ali/return', // 支付成功返回地址 此处仅作为举例 匹配路由 后期可配置调试环境、测试环境和线上环境 区分不同域名
        notify_url: 'http://localhost:7001/pay/ali/notify', // 支付成功异步通知地址 此处仅作为举例
      },
    },
    // .... 当然这里还可以有其他支付，如微信等
  };

  config.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'root',
      database: 'magic-egg',
    },
    app: true,
    agent: false,
  };

  // 跨域配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
