const Router = require('koa-router')
const { verifyAuth } = require('../middleware/verifyLogin.middleware')
const { 
  list, 
  detail, 
  listByName, 
  topAnchors, 
  changeIfShow,
  getDarkRoomAnchors,
  getCatAbility
 } = require('../controller/anchors.controller')
const anchorsRouter = new Router({prefix: "/anchors"})


// 获取主播信息列表
anchorsRouter.get('/', verifyAuth, list)

// 热门网红排名接口
anchorsRouter.get('/top', verifyAuth, topAnchors)

//根据主播名获取主播信息
anchorsRouter.get('/name', verifyAuth, listByName)

// 获取关键黑屋的主播信息
anchorsRouter.get('/darkRoom', verifyAuth, getDarkRoomAnchors)

// 获取主播产品类别能力详情（带货能力）
anchorsRouter.get('/catAbility', verifyAuth,getCatAbility)

// 根据主播Id查询主播详情（带货能力）
anchorsRouter.get('/detail/:anchorId', verifyAuth,detail)

// 关进黑屋（根据anchorId改变ifShow的值）
anchorsRouter.put('/ifshow', verifyAuth, changeIfShow)



module.exports = anchorsRouter