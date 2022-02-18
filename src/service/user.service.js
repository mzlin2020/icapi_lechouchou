const connection = require("../app/database");
const { customAlphabet } = require("nanoid");

class UserService {
  //注册用户
  async create(user) {
    const { username, password, name } = user;

    // 随机8位0-9字母(因为数据库字段限定了int，不能使用其他字符)
    const createUid = customAlphabet("1234567890", 6);
    let uid = createUid();
    // sql语句
    const statement = `INSERT INTO user(uid, username, password, name) VALUES(?,?,?,?);`;

    //执行sql语句
    const result = await connection.execute(statement, [uid, username, password, name]);

    // 返回结果
    return result;
  }

  //获取用户username，用于判断账号是否已存在
  async getUserByName(username) {
    const statement = `SELECT * FROM user WHERE username = ?`;
    const result = await connection.execute(statement, [username]);
    return result[0];
  }

  // 查询前端用户数据
  async getUserInfo() {
    const statement = `SELECT ID,uid,username,name,permissions,regTime FROM user;`;
    const result = await connection.execute(statement);
    return result[0];
  }

  // 查询关注的主播(用于判断该主播是否关注过)
  async getSubscribeData(uid, anchorId) {
    uid = Number(uid);
    anchorId = String(anchorId);
    const statement = `SELECT * FROM subscribe 
    WHERE uid = ? AND anchorId = ? `;
    const result = await connection.execute(statement, [uid, anchorId]);
    return result[0];
  }

  // 执行关注主播的操作
  async followOneAnchorAction(uid, anchorId) {
    uid = Number(uid);
    anchorId = String(anchorId);
    const statement = `
    INSERT INTO subscribe(uid, anchorId) 
    VALUES(?, ?);
    `;
    const result = await connection.execute(statement, [uid, anchorId]);
    return result[0];
  }

  // 获取关注的主播列表
  async getSubscribeList(offset, size, uid) {
    offset = String(offset);
    size = String(size);
    uid = Number(uid);
    const statement = `
    SELECT anchors.anchorId anchorId, subscribe.uid, anchorName celebrity_name, fansNum fans_num, isFollow subscribe,
    (SELECT COUNT(*) FROM subscribe  LEFT JOIN anchors ON subscribe.anchorId = anchors.anchorId WHERE subscribe.uid = ?) total
    FROM subscribe 
    LEFT JOIN anchors
    ON subscribe.anchorId = anchors.anchorId
    WHERE subscribe.uid = ?
    LIMIT ?, ?;
    `;
    const result = await connection.execute(statement, [uid, uid, offset, size]);
    return result[0];
  }

  // 取消关注某位主播
  async updateSubscribe(uid, anchorId) {
    uid = Number(uid);
    anchorId = String(anchorId);
    const statement = `
    DELETE FROM subscribe WHERE anchorId = ? AND uid = ?;
    `;
    const result = await connection.execute(statement, [anchorId, uid]);
    return result[0];
  }
}

module.exports = new UserService();
