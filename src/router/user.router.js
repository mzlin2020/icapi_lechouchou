const Router = require('koa-router')
const  { create, getUserInfo } = require('../controller/user.controller')
const userRouter = new Router({ prefix: '/user' })
const { verfiyUser } = require('../middleware/user.middleware')
const { handlePassword } = require('../middleware/handlePassword.middleware')
const { verifyAuth } = require('../middleware/verifyLogin.middleware')

// 注册中间件
userRouter.post('/register', verifyAuth, verfiyUser, handlePassword, create)

// 获取前端用户信息（全部获取）
userRouter.get('/', verifyAuth, getUserInfo)

module.exports = userRouter
