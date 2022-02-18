const connection = require('../app/database')
const { livesSearchSql } = require('../utils/sql')
class LivesService {
  // 获取直播信息列表
  async getLivesInfo(offset, size, anchorName, liveTitle) {
  
  // 相关的sql判断抽离出去
  const res = await livesSearchSql(offset, size, anchorName, liveTitle)
  return res
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
    return result[0]
  }

  //直播商品详情页
  // 获取直播商品详情列表
  async getDetailList(offset, size, liveId) {
    const statement = 
    `
    SELECT *,
    (SELECT liveCount from items_stats WHERE itemId = live_items.itemId) liveCount,
    (SELECT COUNT(*) from live_items WHERE liveId = ?) total
    FROM live_items
    WHERE liveId = ?
    LIMIT ?, ?;
    `
    const result = await connection.execute(statement, [ liveId, liveId, offset, size ]);
    return result[0]
  }

  // 将某件直播商品关进黑屋
  async changeIfShowByItemId( itemId, ifShow) {
    const statement = `UPDATE live_items  SET ifShow = ? WHERE itemId = ?;`
    const result = await connection.execute(statement, [ ifShow, itemId]);
    return result[0];
  }

  // 获取直播商品详情列表(黑屋)
  async getLiveGoodsDarkRoomData() {
    const statement = 
    `
    SELECT *
    from live_items
		WHERE ifShow = 0;
    `
    const result = await connection.execute(statement);
    return result[0]
  }
  // 删除某件直播商品详情的商品
  async removeLiveGoodsData(itemId) {
    const statement = 
    `
    DELETE FROM live_items WHERE itemId = ?;
    `
    const result = await connection.execute(statement, [ itemId ]);
    return result[0]
  }
}

module.exports = new LivesService()