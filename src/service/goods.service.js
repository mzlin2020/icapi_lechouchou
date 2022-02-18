const connections = require('../app/database')
const { goodsSearchSql } = require('../utils/sql')
class GoodsSerive {
  // 获取商品信息列表(待优化)
  async getGoodsListInfo(offset, size, title, catName, min, max) {
    // 逻辑判断太冗余，抽离出去
    const res = await goodsSearchSql(offset, size, title, catName, min, max)
    return res
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

  // 获取所有产品的类别信息
  async getCategoriesData() {
    const statement = `
    SELECT catName 'category'
    FROM live_items 
    GROUP BY catName;
    `
    const result = await connections.execute(statement)
    return result[0]
  }
}

module.exports = new GoodsSerive()