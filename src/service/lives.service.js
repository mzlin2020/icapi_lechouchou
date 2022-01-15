const connection = require('../app/database')
class LivesService {
  // 获取直播信息列表
  async getLivesInfo(offset, size) {
    console.log(offset, size);
    const statement = `
    SELECT 
		l.ID ID,anchorName,l.anchorId anchorId,liveId,liveTitle,visitNum,totalNum,liveQuantity,
		totalAmount,l.ifShow ifShow,item_done,
    (SELECT COUNT(*) FROM anchor_lives l LEFT JOIN anchors a ON l.anchorId = a.anchorId) totalCount
    from anchor_lives l LEFT JOIN anchors a ON l.anchorId = a.anchorId
    LIMIT ?,?;
    `
    const result = await connection.execute(statement, [offset, size])
    console.log(result);
    return result
  }

  // 根据网红名获取直播信息
  async getLivesInfoByAnchorName(anchorName) {
    const statement = `
    SELECT l.ID ID,anchorName,l.anchorId anchorId,l.ifShow ifShow,item_done,
           JSON_OBJECT('liveId',liveId,'liveTitle',liveTitle,'totalNum',totalNum,'visitNum',
           visitNum,'liveDay',liveDay,'gmtStart',gmtStart,'totalDuration',totalDuration,
           'fansConversionRate',fansConversionRate,'liveQuantity',liveQuantity,'totalAmount',
           totalAmount,'playBackUrl',playBackUrl,'coverImg',coverImg) liveInfo,
           JSON_OBJECT('saleAbility',saleAbility,'fansNum',fansNum,'agencyName',agencyName,
           'anchorType',anchorType,'telephone',telephone,'picUrl',picUrl) anchorInfo
           from anchor_lives l LEFT JOIN anchors a ON l.anchorId = a.anchorId
    WHERE anchorName LIKE ?;
    `
    anchorName = '%' + anchorName + '%'
    const result = await connection.execute(statement, [anchorName])
    return result
  }

  // 根据直播名获取直播信息
  async getLivesInfoByLiveId(liveId) {
    const statement = `
    SELECT l.ID ID,anchorName,l.anchorId anchorId,l.ifShow ifShow,item_done,
           JSON_OBJECT('liveId',liveId,'liveTitle',liveTitle,'totalNum',totalNum,'visitNum',
           visitNum,'liveDay',liveDay,'gmtStart',gmtStart,'totalDuration',totalDuration,
           'fansConversionRate',fansConversionRate,'liveQuantity',liveQuantity,'totalAmount',
           totalAmount,'playBackUrl',playBackUrl,'coverImg',coverImg) liveInfo,
           JSON_OBJECT('saleAbility',saleAbility,'fansNum',fansNum,'agencyName',agencyName,
           'anchorType',anchorType,'telephone',telephone,'picUrl',picUrl) anchorInfo
           from anchor_lives l LEFT JOIN anchors a ON l.anchorId = a.anchorId
    WHERE liveId = ?;
    `
    const result = await connection.execute(statement, [liveId])
    return result
  }


  // 关进黑屋操作（根据id改变ifShow字段）
  async changeIfShowByLiveId(liveId,ifShow) {
    const statement = `UPDATE anchor_lives  SET ifShow = ? WHERE liveId = ?;`
    const result = await connection.execute(statement, [ifShow, liveId]);
    return result[0];
  }

  // 获取关进黑屋中的主播信息
  async getDarkRoomLivesData() {
    const statement = 
    `
    SELECT 
		l.ID ID,anchorName,l.anchorId anchorId,liveId,liveTitle,visitNum,totalNum,liveQuantity,
		totalAmount,l.ifShow ifShow,item_done
    from anchor_lives l LEFT JOIN anchors a ON l.anchorId = a.anchorId
		WHERE l.ifShow = 0;
    `
    const result = await connection.execute(statement);
    console.log(result);
    return result[0]
  }
}

module.exports = new LivesService()