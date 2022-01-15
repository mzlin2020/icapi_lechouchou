const connection = require("../app/database")
const { customAlphabet } = require('nanoid')

class UserService {
  //注册用户
  async create(user) {
    const { username, password, name } = user

    // 随机8位0-9字母(因为数据库字段限定了int，不能使用其他字符)
    const createUid = customAlphabet('1234567890', 6)
    let uid = createUid()
    // sql语句
    const statement = `INSERT INTO user(uid, username, password, name) VALUES(?,?,?,?);`

    //执行sql语句
    const result = await connection.execute(statement, [uid, username, password, name])

    // 返回结果
    return result
  }

  //获取用户username，用于判断账号是否已存在
  async getUserByName(username) {
    const statement = `SELECT * FROM user WHERE username = ?`
    const result = await connection.execute(statement, [ username ])
    return result[0]
  }

  // 查询前端用户数据
  async getUserInfo() {
    const statement = `SELECT ID,uid,username,name,permissions,regTime FROM user;`
    const result = await connection.execute(statement)
    return result[0]
  }
}

module.exports = new UserService()