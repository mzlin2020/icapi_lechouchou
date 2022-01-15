const backUserService = require("../service/backUser.service");
class backUserControler {
  // 1.创建用户
  async create(ctx, next) {
    // 获取用户请求传递的参数
    const user = ctx.request.body;
    //查询数据
    const result = await backUserService.create(user);

    // 返回数据
    ctx.body = result;
  }

  // 2.获取后端用户数据
  async getUserInfo(ctx, next) {
    // 获取、返回
    const result = await backUserService.getUserInfo();
    ctx.body = result;
  }

  // 3.删除用户
  async deleteUser(ctx, next) {
    const { username } = ctx.request.query
    const result = await backUserService.removeUser(username)
    if(result.affectedRows === 1) ctx.body = '删除成功'
  }

  // 4.修改用户信息
  async updateUser(ctx, next) {
    const { username, name, password, permissions, isPasswordChange } = ctx.request.query
    const result = await backUserService.updateUser(username, name, password, permissions, isPasswordChange)
    if(result.affectedRows) {
      ctx.body = "修改成功！"
    } else {
      ctx.body = "修改失败！"
    }

    
  }
}

// 导出实例
module.exports = new backUserControler();
