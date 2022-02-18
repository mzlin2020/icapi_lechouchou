const userService = require("../service/user.service")
const errorTypes = require('../contants/error-types')
const verfiyUser = async (ctx, next) => {
  // 1.获取username和密码等信息
  const { username, password } = ctx.request.body
  // 2.判断用户名和密码不能为空
  if(!username || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit("error", error, ctx) //发送错误
  }
   
  // 3.判断这次注册用户名是没有注册过的
  const result = await userService.getUserByName(username)
  if(result.length) {
    const error = new Error(errorTypes.USER_ALREADY_EXISTS)
    return ctx.app.emit("error", error, ctx) //把错误发射出去
  }


  //没有返回值，则说明没有错误，进入下一个中间件
  await next()
}

// 验证前端是否已经关注过该主播
const verifySubscribe = async(ctx, next) => {
  const { uid, anchorId } = ctx.request.body
  // 判断本次前端用户关注的主播是否已经关注过
  const result = await userService.getSubscribeData(uid, anchorId)
  //如果有值，说明已经关注过不能重复关注
  if(result.length) {
    const error = new Error(errorTypes.ANCHOR_HAS_BEEN_SUBSCRIBED)
    return ctx.app.emit("error", error, ctx)
  }

  await next()
}

module.exports = {
  verfiyUser,
  verifySubscribe
}