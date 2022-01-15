const Router = require('koa-router')
const { login, success } = require('../controller/login.controller')
const { verifyLogin, verifyAuth } = require('../middleware/verifyLogin.middleware')

const loginRouter = new Router()

loginRouter.post('/user/login', verifyLogin, login)

// 测试登录
loginRouter.get('/login_test', verifyAuth, success)

module.exports = loginRouter