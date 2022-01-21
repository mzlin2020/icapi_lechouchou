const connections = require('../app/database')
class GoodsSerive {
  // 获取商品信息列表
  async getGoodsListInfo(offset, size) {
    const statement = `
    SELECT *,(SELECT COUNT(*) FROM items_stats) totalCount
    FROM items_stats
    LIMIT ?,?;
    `
    const result = await connections.execute(statement, [ offset, size])
    return result[0]
  }


  // 关进黑屋操作（根据ItemId改变ifShow字段）
  async changeIfShowByItemId(itemId,ifShow) {
    const statement = `UPDATE items_stats  SET ifShow = ? WHERE itemId = ?;`
    const result = await connections.execute(statement, [ifShow, itemId]);
    return result[0];
  }

  // 获取关进黑屋中的商品信息
  async getDarkRoomGoodsData() {
    const statement = 
    `
    SELECT * FROM items_stats WHERE ifShow = 0;
    `
    const result = await connections.execute(statement);
    return result[0]
  }

  // 删除某件商品信息
  async removeGood(itemId) {
    const statement = `
    DELETE FROM items_stats WHERE itemId = ?;
    `
    const result = await connections.execute(statement, [itemId])
    return result[0]
  }
}

module.exports = new GoodsSerive()