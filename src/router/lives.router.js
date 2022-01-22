const Router = require("koa-router");
const { 
  list, 
  listByname, 
  listByLiveId, 
  changeIfShow, 
  getDarkRoomLives, 
  detailList, 
  changeDetailIfShow,
  getLiveGoodsDarkRoom,
  removeLiveGoods
 } = require('../controller/lives.controller')
const livesRouter = new Router({ prefix: "/lives" });
const { verifyAuth } = require('../middleware/verifyLogin.middleware')

// 获取主播信息列表
livesRouter.get("/", verifyAuth, list);

// 根据主播名匹配直播
livesRouter.get('/anchorName', verifyAuth, listByname)

// 根据直播名称搜索直播信息（唯一匹配）
livesRouter.get('/liveId', verifyAuth, listByLiveId)

// 关进黑屋（根据liveId改变ifShow的值）
livesRouter.put('/ifshow', verifyAuth, changeIfShow)

// 获取关进黑屋的直播列表
livesRouter.get('/darkRoom', verifyAuth, getDarkRoomLives)


// 直播商品详情相关接口
// 获取直播商品详情列表
livesRouter.get("/liveGoods", verifyAuth, detailList)

// 直播商品详情黑屋列表
livesRouter.get("/liveGoods/darkRoom", verifyAuth, getLiveGoodsDarkRoom) 

// 将某件直播商品关进黑屋
livesRouter.put("/liveGoods/ifShow", verifyAuth, changeDetailIfShow)

// 将某件直播商品删除掉
livesRouter.delete("/liveGoods", verifyAuth, removeLiveGoods)


module.exports = livesRouter;
