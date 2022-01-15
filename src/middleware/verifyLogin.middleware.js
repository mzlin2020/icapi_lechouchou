const errorTypes = require('../contants/error-types')
const UserService = require('../service/user.service')
const { PUBLIC_KEY } = require('../app/config')
const jwt = require('jsonwebtoken')
const md5Password = require('../utils/password-handle')
const verifyLogin = async(ctx, next) => {
  // 1.获取用户名和密码
  const { username, password } = ctx.request.body
  // 2.判断用户名和密码是否正确
  if(!username || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error',error,ctx)
}

  // 3.判断用户是否存在
  const result = await UserService.getUserByName(username)
  const user = result[0]
  if(!user) {
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  // 4.判断密码是否和数据库中的是否一致
  if(md5Password(password) !== user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRECT)
    return ctx.app.emit('error', error, ctx)
  }

  //前面的步骤没有出错，则执行下一个中间件
  await next()
}


// 验证用于是否携带token登录过(通用)
const verifyAuth = async(ctx, next) => {
  // 1.获取用户的token
  const authorization = ctx.headers.authorization
  const token = authorization.replace('Bearer ', '')
  //2.没有token
  if(!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION)
    return ctx.app.emit('error', error, ctx)
  }
  //3.有token 进行验证
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
    })
    ctx.user = result
    await next()
  } catch (err) {
    // 发现错误
    const error = new Error(errorTypes.UNAUTHORIZATION)
    ctx.app.emit('error', error, ctx)
  }
}



module.exports = {
  verifyLogin,
  verifyAuth
}