const md5Password = require('../utils/password-handle')

// 数据库密码进行加密
const handlePassword = async(ctx, next) => {
  const { password } = ctx.request.body
  ctx.request.body.password = md5Password(password)

  await next()
}

module.exports = {
  handlePassword
}