const Router = require('koa-router')
const backUserRouter = new Router({ prefix: '/admin_user' })
const  { create, getUserInfo, deleteUser, updateUser} = require('../controller/backUser.controller')
const { verfiyUser } = require('../middleware/backUser.middleware')
const { handlePassword } = require('../middleware/handlePassword.middleware')

// 注册中间件
backUserRouter.post('/register', verfiyUser, handlePassword, create)

// 获取后端用户数据
backUserRouter.get('/', getUserInfo)

// 删除用户
backUserRouter.delete('/', deleteUser)

// 修改用户信息
backUserRouter.put('/', updateUser)

module.exports = backUserRouter