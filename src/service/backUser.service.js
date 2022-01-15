const connection = require("../app/database")
const { customAlphabet } = require('nanoid')
const md5Password = require('../utils/password-handle')
class backUserService {
  //1.注册用户
  async create(user) {
    const { username, password, name } = user

    // uid（等于账号的后6位）
    const createUid = customAlphabet('1234567890', 6)
    let uid = createUid()

    // sql语句
    const statement = `INSERT INTO admin_user(uid,username, password, name) VALUES(?,?,?,?)`

    //执行sql语句
    const result = await connection.execute(statement, [uid,username, password, name])

    // 返回结果
    return result
  }

  //2.获取用户userId，用于判断账号是否已存在
  async getUserByName(username) {
    const statement = `SELECT * FROM admin_user WHERE username = ?`
    const result = await connection.execute(statement, [ username ])
    return result[0]
  }

  //3.获取后端用户数据
  async getUserInfo() {
    const statement = `SELECT ID,uid,username,name,password,permissions,regTime FROM admin_user;`
    const result = await connection.execute(statement)
    return result[0]
  }

  // 4.删除后端用户
  async removeUser(username) {
    const statememt = `DELETE FROM admin_user WHERE username = ? ; `
    const result = await connection.execute(statememt, [username])
    return result[0]
  }

  // 5.修改用户信息
  async updateUser(username, name, password, permissions, isPasswordChange) {
    if(isPasswordChange) { //如果密码改变了，重新进行加密，否则不处理
      password = md5Password(password)
    }
    const statememt = `UPDATE admin_user SET name =?, permissions =?, password=? WHERE username=?; `

    const result = await connection.execute(statememt, [name, permissions, password, username])
    return result[0]
  }
}

module.exports = new backUserService()