const Router = require('koa-router')
const  { create, getUserInfo } = require('../controller/user.controller')
const userRouter = new Router({ prefix: '/user' })
const { verfiyUser } = require('../middleware/user.middleware')
const { handlePassword } = require('../middleware/handlePassword.middleware')

// 注册中间件
userRouter.post('/register', verfiyUser, handlePassword, create)

// 获取前端用户信息（全部获取）
userRouter.get('/', getUserInfo)

module.exports = userRouter
