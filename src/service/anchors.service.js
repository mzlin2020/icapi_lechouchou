const connection = require("../app/database");

class AnchorsService {
  // 获取主播信息列表
  async getAnchorsInfo(offset, size, anchorName, fansNum) {
    // sql语句
    let statement = `
    SELECT 
    ID,anchorId,startBuildModel,ifShow,done,updateTime,anchorName,saleAbility,fansNum,agencyName,anchorType,liveTag,weight,picUrl,anchorClass,telephone,email,serviceFee,pgLiveQuantity,medianPrice,pgAudienceNum,pgVisitNum,pgLikedNum,hasShop,shopType,
    (SELECT COUNT(*) FROM anchors) totalCount
    FROM anchors
    LIMIT ?,?;
    `;
    if (!offset && !size) {
      // 如果没有传值，则直接返回10条数据
      const result = await connection.execute(statement, ["0", "10"]);
      return result;
    } else if (fansNum && anchorName && offset && size) {
      //都有值，说明要既符合主播名搜索，也符合范围搜索
      statement = `
      SELECT 
      ID,anchorId,startBuildModel,ifShow,done,updateTime,anchorName,saleAbility,fansNum,agencyName,anchorType,liveTag,weight,picUrl,anchorClass,telephone,email,serviceFee,pgLiveQuantity,medianPrice,pgAudienceNum,pgVisitNum,pgLikedNum,hasShop,shopType,
      (SELECT COUNT(*) FROM anchors where anchorName LIKE ? && fansNum BETWEEN ? AND ?) totalCount
      FROM anchors
      where anchorName LIKE ? && fansNum BETWEEN ? AND ?
      LIMIT ?, ?;
      `;
      anchorName = "%" + anchorName + "%";
      const result = await connection.execute(statement, [
        anchorName,
        fansNum[0],
        fansNum[1],
        anchorName,
        fansNum[0],
        fansNum[1],
        offset,
        size,
      ]);
      return result;
    } else if (anchorName && offset && size) {
      //如果都有值，按名字搜索
      statement = `SELECT 
      ID,anchorId,startBuildModel,ifShow,done,updateTime,anchorName,saleAbility,fansNum,agencyName,anchorType,liveTag,weight,picUrl,anchorClass,telephone,email,serviceFee,pgLiveQuantity,medianPrice,pgAudienceNum,pgVisitNum,pgLikedNum,hasShop,shopType,
      (SELECT COUNT(*) FROM anchors) totalCount
      FROM anchors
      where anchorName LIKE ?
      LIMIT ?, ?;`;
      anchorName = "%" + anchorName + "%";
      const result = await connection.execute(statement, [anchorName, offset, size]);
      return result;
    } else if (offset && size && fansNum) {
      // 如果范围有值
      statement = `
      SELECT 
      ID,anchorId,startBuildModel,ifShow,done,updateTime,anchorName,saleAbility,fansNum,agencyName,anchorType,liveTag,weight,picUrl,anchorClass,telephone,email,serviceFee,pgLiveQuantity,medianPrice,pgAudienceNum,pgVisitNum,pgLikedNum,hasShop,shopType,
      (SELECT COUNT(*) FROM anchors where fansNum BETWEEN ? AND ?) totalCount
      FROM anchors
      where fansNum BETWEEN ? AND ?
      LIMIT ?, ?;
      `;
      // 有传值，则根据传值获取数据
      const result = await connection.execute(statement, [
        fansNum[0],
        fansNum[1],
        fansNum[0],
        fansNum[1],
        offset,
        size,
      ]);
      return result;
    } else {
      // 有传值，则根据传值获取数据
      const result = await connection.execute(statement, [offset, size]);
      return result;
    }
  }

  // 根据主播名字获取主播信息
  async getAnchorsInfoByName(anchorName) {
    const statement = `
    SELECT ID,anchorId,startBuildModel,done,updateTime,
    JSON_OBJECT('anchorName',anchorName,'saleAbility',saleAbility,'fansNum',fansNum,'agencyName',agencyName,'anchorType',anchorType,'liveTag',liveTag,'weight',weight,'avatar',picUrl,'anchorClass',anchorClass,'telephone',telephone,'email',email,'serviceFee',serviceFee) anchorInfo,
    JSON_OBJECT('pgLiveQuantity',pgLiveQuantity,'medianPrice',medianPrice,'pgAudienceNum',pgAudienceNum,'pgVisitNum'       ,pgVisitNum,'pgLikedNum',pgLikedNum) liveInfo,
    JSON_OBJECT('hasShop',hasShop,'type',shopType) shopInfo
    from anchors WHERE anchorName  LIKE ?;
    `;
    anchorName = "%" + anchorName + "%"; //模糊匹配
    const result = await connection.execute(statement, [anchorName]);
    return result;
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

  // 获取热门网红
  async getTopAnchorsInfo() {
    const statement = `
    SELECT ID,anchorId,startBuildModel,done,updateTime,
    JSON_OBJECT('anchorName',anchorName,'saleAbility',saleAbility,'fansNum',fansNum,'agencyName',agencyName,'anchorType',anchorType,'liveTag',liveTag,'weight',weight,'avatar',picUrl,'anchorClass',anchorClass,'telephone',telephone,'email',email,'serviceFee',serviceFee) anchorInfo,
    JSON_OBJECT('pgLiveQuantity',pgLiveQuantity,'medianPrice',medianPrice,'pgAudienceNum',pgAudienceNum,'pgVisitNum'       ,pgVisitNum,'pgLikedNum',pgLikedNum) liveInfo,
    JSON_OBJECT('hasShop',hasShop,'type',shopType) shopInfo
    from anchors
    ORDER BY fansNum DESC
    LIMIT 50;
    `;
    const result = await connection.execute(statement);
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
}

module.exports = new AnchorsService();
