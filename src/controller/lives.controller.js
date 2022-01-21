const { 
  getLivesInfo, 
  getLivesInfoByAnchorName, 
  getLivesInfoByLiveId,
  changeIfShowByLiveId,
  getDarkRoomLivesData,
  getDetailList,
  changeIfShowByItemId,
  getLiveGoodsDarkRoomData,
  removeLiveGoodsData
} = require("../service/lives.service");

class LivesController {
  // 获取直播信息列表
  async list(ctx, next) {
    const { offset, size } = ctx.request.query;
    const result = await getLivesInfo(offset, size);
    ctx.body = result[0];
  }

  async listByname(ctx, next) {
    const { anchorName } = ctx.request.query;
    const result = await getLivesInfoByAnchorName(anchorName);
    ctx.body = result[0];
  }

  async listByLiveId(ctx, next) {
    const { liveId } = ctx.request.query;
    const result = await getLivesInfoByLiveId(liveId);
    ctx.body = result[0];
  }

  // 改变ifShow的值
  async changeIfShow(ctx, next) {
    // 获取直播id
    const { liveId, ifShow } = ctx.request.query
    const result = await changeIfShowByLiveId(liveId, ifShow)
    ctx.body = result
  }

  // 获取黑屋中直播信息
  async getDarkRoomLives(ctx, next) {
    const result = await getDarkRoomLivesData()
    ctx.body = result
  }



  // 直播商品详情
  // 直播详情商品列表
  async detailList(ctx, next) {
    const { offset, size, itemId } = ctx.request.query
    const result = await getDetailList(offset, size, itemId)
    ctx.body = result
  }


  // 将直播商品详情中的某件商品关进黑屋
  async changeDetailIfShow(ctx, next) {
    const { itemId, ifShow } = ctx.request.query
    const result = await changeIfShowByItemId(itemId, ifShow)
    ctx.body = result
  }

  // 获取直播商品详情黑屋列表
  async getLiveGoodsDarkRoom(ctx, next) {
    const result = await getLiveGoodsDarkRoomData()
    ctx.body = result
  }

  // 删除某件直播商品
  async removeLiveGoods(ctx, next) {
    const { itemId } = ctx.request.query
    const result = await removeLiveGoodsData(itemId)
    ctx.body = result
  }
}

module.exports = new LivesController();
