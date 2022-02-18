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


  // 关注某位主播
  async followOneAnchor(ctx, next) {
    const { uid, anchorId } = ctx.request.body
    const result = await UserService.followOneAnchorAction(uid, anchorId)
    ctx.body = result
  }

  // 关注的主播列表
  async getSubscribeList(ctx, next) {
    const { offset, size, uid } = ctx.request.query
    const result = await UserService.getSubscribeList(offset, size, uid)
    ctx.body = result
  }

  // 取消关注
  async removeSubscribe(ctx, next) {
    const { uid, anchorId } = ctx.request.query
    const result = await UserService.updateSubscribe(uid, anchorId)
    ctx.body = result
  }
}


// 导出实例
module.exports = new userController()