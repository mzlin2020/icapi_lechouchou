const backUserService = require("../service/backUser.service")
const errorTypes = require('../contants/error-types')
const verfiyUser = async (ctx, next) => {
  // 1.获取用户id和密码
  const { username, password } = ctx.request.body
  // 2.判断用户名和密码不能为空
  if(!username || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit("error", error, ctx) //发送错误
  }
  
  // 3.判断这次注册用户名是没有注册过的
  const result = await backUserService.getUserByName(username)
  if(result.length) {
    const error = new Error(errorTypes.USER_ALREADY_EXISTS)
    return ctx.app.emit("error", error, ctx) //把错误发射出去
  }

  //没有返回值，则说明没有错误，进入下一个中间件
  await next()
}

module.exports = {
  verfiyUser
}