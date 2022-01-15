const { 
  getLivesInfo, 
  getLivesInfoByAnchorName, 
  getLivesInfoByLiveId,
  changeIfShowByLiveId,
  getDarkRoomLivesData
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
}

module.exports = new LivesController();
