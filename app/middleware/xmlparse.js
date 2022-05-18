'use strict';
/*
egg中配置koa中间件，注意上面配置路由中引用了这个中间件，属于路由中间件而非全局配置的中间件
cnpm install koa-xml-body --save
*/

module.exports = require('koa-xml-body');
