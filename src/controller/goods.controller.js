const { getGoodsListInfo, removeGood, changeIfShowByItemId, getDarkRoomGoodsData } = require('../service/goods.service')
class GoodsController {
  // 获取商品信息列表
  async list(ctx, next) {
    const { offset, size } = ctx.request.query
    const result = await getGoodsListInfo(offset, size)
    ctx.body = result
  }

  // 关进黑屋操作
  async changeIfShow(ctx, next) {
    // 获取直播id
    const { itemId, ifShow } = ctx.request.query
    const result = await changeIfShowByItemId(itemId, ifShow)
    ctx.body = result
  }

  // 获取黑屋中商品信息
  async getDarkRoomGoods(ctx, next) {
    const result = await getDarkRoomGoodsData()
    ctx.body = result
  }

  // 删除某件商品（根据商品编号）
  async remove(ctx, next) {
    const itemId = ctx.params.itemId
    const result = await removeGood(itemId)
    ctx.body = result
  }
}

module.exports = new GoodsController()