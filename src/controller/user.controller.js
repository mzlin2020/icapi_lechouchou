const UserService = require('../service/user.service')
class userController {
  async create(ctx, next) {
    // 获取用户请求传递的参数
    const user = ctx.request.body 
    //查询数据
    const result = await UserService.create(user)

    // 返回数据
    ctx.body = result
  }

  // 获取用户信息
  async getUserInfo(ctx, next) {
    // 查询数据
    const result = await UserService.getUserInfo()

    // 返回数据
    ctx.body = result 
  }
}


// 导出实例
module.exports = new userController()