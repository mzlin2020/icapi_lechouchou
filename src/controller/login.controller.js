const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../app/config");
const { getUserByName } = require("../service/user.service");

class LoginController {
  async login(ctx, next) {
    const { username, password } = ctx.request.body;
    
    // 根据私钥生成token
    const token = jwt.sign({ username, password }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24 * 30, //30天
      algorithm: "RS256",
    });
    // 根据用户账号获取详情信息
    const userInfo = await getUserByName(username);
    const { ID, uid, name, permissions, regTime } = userInfo[0];
    const userId = userInfo[0].username;

    //登录成功后返回结果
    ctx.body = {
      ID,
      uid,
      userId,
      name,
      permissions,
      regTime,
      token,
    };
    next();
  }

  // 登录成功
  success(ctx, next) {
    ctx.body = "登录成功~";
  }
}

module.exports = new LoginController();
