const { handleFanNumRange } = require('../utils/handleFanNumRange')
const {
  getAnchorsInfo,
  getAnchorsInfoByName,
  getAnchorsInfoByAnchorId,
  getTopAnchorsInfo,
  changeIfShowByAnchorId,
  getDarkRoomAnchorsData
} = require("../service/anchors.service");

class AnchorsController {
  // 获取主播信息列表
  async list(ctx, next) {
    // 1.获取参数
    let { offset, size, anchorName, fansNum } = ctx.request.query;
    fansNum = handleFanNumRange(fansNum);
    // 2.发送网络请求获取结果
    const result = await getAnchorsInfo(offset, size, anchorName, fansNum);
    ctx.body = result[0];
  }

  //根据主播名获取主播信息（模糊匹配）
  async listByName(ctx, next) {
    //1.获取名字
    const { anchorName } = ctx.request.query;
    //2.发送网络请求
    const result = await getAnchorsInfoByName(anchorName);
    ctx.body = result[0];
  }

  // 获取主播详情页信息
  async detail(ctx, next) {
    //1.获取主播id
    const anchorId = ctx.params.anchorId;
    //2.发送网络请求
    const result = await getAnchorsInfoByAnchorId(anchorId);
    //3.返回结果
    ctx.body = result[0];
  }

  // 获取热门网红（按粉丝数排名前50）
  async topAnchors(ctx, next) {
    const result = await getTopAnchorsInfo();
    ctx.body = result[0];
  }

  // 改变ifShow的值
  async changeIfShow(ctx, next) {
    // 获取主播id
    const { anchorId, ifShow } = ctx.request.query
    const result = await changeIfShowByAnchorId(anchorId, ifShow)
    ctx.body = result
  }

  // 获取在黑屋中的主播信息
  async getDarkRoomAnchors(ctx, next) {
    const result = await getDarkRoomAnchorsData()
    ctx.body = result
  }
}

module.exports = new AnchorsController();
