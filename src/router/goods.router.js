const Router = require('koa-router')
const { list, remove, changeIfShow, getDarkRoomGoods, getCategories } = require('../controller/goods.controller')
const { verifyAuth } = require('../middleware/verifyLogin.middleware')
const goodsRouter = new Router({ prefix: "/goods" })

// 获取商品列表
goodsRouter.get("/", verifyAuth, list)

// 关进黑屋（根据itemId改变ifShow的值）
goodsRouter.put('/ifshow', verifyAuth, changeIfShow)

// 查询所有的产品类别
goodsRouter.get('/categories', getCategories)

// 获取关进黑屋的商品列表
goodsRouter.get('/darkRoom', verifyAuth, getDarkRoomGoods)

// 删除某一个商品信息
goodsRouter.delete('/:itemId', verifyAuth, remove)

module.exports = goodsRouter