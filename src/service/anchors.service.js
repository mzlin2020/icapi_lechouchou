const connection = require("../app/database");
const { anchorsSearchSql, getMatchAnchorDataSql } = require('../utils/sql')

class AnchorsService {
  // 获取主播信息列表
  async getAnchorsInfo(offset, size, anchorName, fansNum) {
    // 此处逻辑判断过于冗余，抽离出去
    const res = await anchorsSearchSql(offset, size, anchorName, fansNum)
    return res
  }



  //根据主播Id获取主播详情信息（详情页带货能力页）
  async getAnchorsInfoByAnchorId(anchorId) {
    const statement = `
    SELECT ID,anchorId,anchorName,telephone,saleAbility,picUrl,agencyName,fansNum,medianPrice,serviceFee,pgLiveQuantity,
    (SELECT COUNT(*) FROM anchors A LEFT JOIN anchor_lives L ON A.anchorId = L.anchorId WHERE A.anchorId = ?) total
    FROM anchors
    WHERE anchorId = ?;
    `;
    const result = await connection.execute(statement, [anchorId, anchorId]);
    return result;
  }

  // 获取主播产品类别能力详情（带货能力）
  async getCatAbilityData(anchorId, catName) {
    let statement = `
    SELECT * FROM anchor_cat_ability WHERE anchorId = ?;
  `;
    // 如果有catName这个参数
    if (catName) {
      statement = `
      SELECT * FROM anchor_cat_ability WHERE anchorId = ? AND catName = ?;
    `;
      const result = await connection.execute(statement, [anchorId, catName]);
      return result[0];
    } else {
      const result = await connection.execute(statement, [anchorId]);
      return result[0];
    }
  }

    // 获取主播历史带货类别能力详情（带货能力详情页）
    async getHistoryCatAbilityData(anchorId, catName) {
      let statement = `
      SELECT * FROM anchor_history_ability WHERE anchorId = ?;
    `;
      // 如果有catName这个参数
      if (catName) {
        statement = `
        SELECT * FROM anchor_history_ability WHERE anchorId = ? AND catName = ?;
      `;
        const result = await connection.execute(statement, [anchorId, catName]);
        return result[0];
      } else {
        // 如果没有则返回该主播所有的历史纪记录
        const result = await connection.execute(statement, [anchorId]);
        return result[0];
      }
    }


  // 获取热门网红
  async getTopAnchorsInfo(require_num) {
    const statement = `
    SELECT ID,anchorId, anchorName celebrity_name,fansNum fans_num,saleAbility goods_capacity,
		startBuildModel,done, ifShow,updateTime
    from anchors
    ORDER BY fansNum DESC
    LIMIT ?;
    `;
    const result = await connection.execute(statement, [require_num]);
    return result;
  }

  // 关进黑屋操作（根据id改变ifShow字段）
  async changeIfShowByAnchorId(anchorId, ifShow) {
    const statement = `UPDATE anchors SET ifShow = ? WHERE anchorId = ?;`;
    const result = await connection.execute(statement, [ifShow, anchorId]);
    return result[0];
  }

  // 获取关进黑屋中的主播信息
  async getDarkRoomAnchorsData() {
    const statement = `
    SELECT 
    ID,anchorId,startBuildModel,ifShow,done,updateTime,anchorName,saleAbility,
    fansNum,agencyName,anchorType,liveTag,weight,picUrl,anchorClass,
    pgLiveQuantity,medianPrice,pgAudienceNum,pgVisitNum,pgLikedNum,hasShop
    FROM anchors 
    WHERE ifShow = 0;
    `;
    const result = await connection.execute(statement);
    return result[0];
  }

  // 前端_类别与价格匹配网红
  async getMatchAnchorData(category, price, offset, size) {
    const res = await getMatchAnchorDataSql(category, price, offset, size)
    return res
  }

  // 前端_查询主播
  async searchAnchorsByname(offset, size, celebrity_name) {

    const statement = `
    SELECT a.anchorId anchorId, anchorName celebrity_name, fansNum fans_num, saleAbility goods_capacity,
    (SELECT count(*) FROM anchors WHERE anchorName LIKE ?) total,
    isFollow isSubscribe
    FROM anchors a LEFT JOIN subscribe s ON a.anchorId = s.anchorId
    WHERE anchorName LIKE ?
    LIMIT ?, ?;    
    `;
    offset = String(offset)
    size = String(size)
    celebrity_name = '%' + celebrity_name + '%'
    const result = await connection.execute(statement, [celebrity_name,celebrity_name,offset, size]);
    return result[0];
  }
}

module.exports = new AnchorsService();
