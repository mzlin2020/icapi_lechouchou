const Router = require('koa-router')
const backLoginRouter = new Router({ prefix: "/admin_user/login" })
const { login } = require('../controller/backLogin.controller')
const { verifyLogin } = require('../middleware/verifyBackLogin.middleware')

backLoginRouter.post("/", verifyLogin, login)

module.exports = backLoginRouter