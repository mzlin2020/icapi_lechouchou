const { handleFanNumRange } = require('../utils/handleFanNumRange')
const {
  getAnchorsInfo,
  getAnchorsInfoByAnchorId,
  getTopAnchorsInfo,
  changeIfShowByAnchorId,
  getDarkRoomAnchorsData,
  getCatAbilityData,
  getHistoryCatAbilityData,
  getMatchAnchorData,
  searchAnchorsByname
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


  // 获取主播详情页信息(带货能力)
  async detail(ctx, next) {
    //1.获取主播id
    const anchorId = ctx.params.anchorId;
    //2.发送网络请求
    const result = await getAnchorsInfoByAnchorId(anchorId);
    //3.返回结果
    ctx.body = result[0];
  }

  // 获取主播产品类别能力详情（带货能力）
  async getCatAbility(ctx, next) {
    const { anchorId, catName } = ctx.request.query
    // 发送网络请求
    const result = await getCatAbilityData(anchorId, catName)
    // 返回结果
    ctx.body = result
  }

  // 获取主播历史带货类别能力详情（带货能力详情页）
  async getHistoryCatAbility(ctx, next) {
    const { anchorId, catName } = ctx.request.query
    // 发送网络请求
    const result = await getHistoryCatAbilityData(anchorId, catName)
    // 返回结果
    ctx.body = result
  }


  // 获取热门网红（按粉丝数排名前50）
  async topAnchors(ctx, next) {
    const { require_num } = ctx.request.query 
    const result = await getTopAnchorsInfo(require_num);
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

  // 前端_类别与价格匹配网红
  async matchAnchor(ctx, next) {
    const { category, price, offset,size } = ctx.request.body
    const result = await getMatchAnchorData(category, price, offset,size)
    ctx.body = result
  }

  // 前端_查询主播（根据主播名）
  async searchAnchorsByname(ctx, next) {
    const { offset, size ,celebrity_name } = ctx.request.body
    const result = await searchAnchorsByname(offset, size, celebrity_name)
    ctx.body = result
  }
}

module.exports = new AnchorsController();
