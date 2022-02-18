const Router = require('koa-router')
const { verifyAuth } = require('../middleware/verifyLogin.middleware')
const { 
  list, 
  detail, 
  listByName, 
  topAnchors, 
  changeIfShow,
  getDarkRoomAnchors,
  getCatAbility,
  getHistoryCatAbility,
  matchAnchor,
  searchAnchorsByname
 } = require('../controller/anchors.controller')
const anchorsRouter = new Router({prefix: "/anchors"})


// 获取主播信息列表
anchorsRouter.get('/', verifyAuth, list)

// 前端_热门网红排名接口
anchorsRouter.get('/top', topAnchors)

// 前端_价格与类别匹配网红
anchorsRouter.post('/match', matchAnchor)

// 前端_查询网红（根据网红名称匹配）
anchorsRouter.post('/queryAnchors', searchAnchorsByname)

// 获取关键黑屋的主播信息
anchorsRouter.get('/darkRoom', verifyAuth, getDarkRoomAnchors)

// 获取主播产品类别能力详情（带货能力）
anchorsRouter.get('/catAbility', getCatAbility)

anchorsRouter.get('/catAbility/history', getHistoryCatAbility)

// 根据主播Id查询主播详情（带货能力）
anchorsRouter.get('/detail/:anchorId', detail)  

// 关进黑屋（根据anchorId改变ifShow的值）
anchorsRouter.put('/ifshow', verifyAuth, changeIfShow)



module.exports = anchorsRouter