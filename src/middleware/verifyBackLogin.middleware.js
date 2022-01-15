const errorTypes = require('../contants/error-types')
const backUserService = require('../service/backUser.service')
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
  const result = await backUserService.getUserByName(username)
  const user = result[0]
  if(!user) {
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }

  // 4.判断密码是否和数据库中的是否一致
  if(md5Password(password) != user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRECT)
    return ctx.app.emit('error', error, ctx)
  }

  //前面的步骤没有出错，则执行下一个中间件
  await next()
}





module.exports = {
  verifyLogin
}