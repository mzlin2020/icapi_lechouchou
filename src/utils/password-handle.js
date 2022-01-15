const crypto = require('crypto')

//封装对数据库密码进行加密处理的函数
const md5Password = (password) => {
  const md5 = crypto.createHash('md5')
  const result = md5.update(password).digest('hex')
  return result
}

module.exports = md5Password