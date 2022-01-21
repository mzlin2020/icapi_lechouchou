const Router = require('koa-router')
const backUserRouter = new Router({ prefix: '/admin_user' })
const  { create, getUserInfo, deleteUser, updateUser} = require('../controller/backUser.controller')
const { verfiyUser } = require('../middleware/backUser.middleware')
const { handlePassword } = require('../middleware/handlePassword.middleware')
const { verifyAuth } = require('../middleware/verifyLogin.middleware')

// 注册中间件
backUserRouter.post('/register', verifyAuth, verfiyUser, handlePassword, create)

// 获取后端用户数据
backUserRouter.get('/', verifyAuth, getUserInfo)

// 删除用户
backUserRouter.delete('/', verifyAuth, deleteUser)

// 修改用户信息
backUserRouter.put('/', verifyAuth, updateUser)

module.exports = backUserRouter