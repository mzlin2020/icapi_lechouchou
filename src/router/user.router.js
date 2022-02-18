const Router = require('koa-router')
const  { create, getUserInfo, followOneAnchor, getSubscribeList, removeSubscribe } = require('../controller/user.controller')
const userRouter = new Router({ prefix: '/user' })
const { verfiyUser, verifySubscribe } = require('../middleware/user.middleware')
const { handlePassword } = require('../middleware/handlePassword.middleware')
const { verifyAuth } = require('../middleware/verifyLogin.middleware')

// 注册中间件
userRouter.post('/register', verfiyUser, handlePassword, create)

// 获取前端用户信息（全部获取）
userRouter.get('/', verifyAuth, getUserInfo)


// 获取关注的主播列表
userRouter.get('/subscribe', verifyAuth, getSubscribeList)

// 关注某位主播
userRouter.post('/subscribe', verifyAuth,verifySubscribe, followOneAnchor)

// 取消关注
userRouter.put('/subscribe', verifyAuth, removeSubscribe)

module.exports = userRouter
