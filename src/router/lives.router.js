const Router = require("koa-router");
const { list, listByname, listByLiveId, changeIfShow, getDarkRoomLives } = require('../controller/lives.controller')
const livesRouter = new Router({ prefix: "/lives" });

// 获取主播信息列表
livesRouter.get("/", list);

// 根据主播名匹配直播
livesRouter.get('/anchorName', listByname)

// 根据直播名称搜索直播信息（唯一匹配）
livesRouter.get('/liveId', listByLiveId)

// 关进黑屋（根据liveId改变ifShow的值）
livesRouter.put('/ifshow', changeIfShow)

// 获取关进黑屋的直播列表
livesRouter.get('/darkRoom', getDarkRoomLives)



module.exports = livesRouter;
