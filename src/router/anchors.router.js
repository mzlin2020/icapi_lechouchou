const Router = require('koa-router')
const { 
  list, 
  detail, 
  listByName, 
  topAnchors, 
  changeIfShow,
  getDarkRoomAnchors
 } = require('../controller/anchors.controller')
const anchorsRouter = new Router({prefix: "/anchors"})


// 获取主播信息列表
anchorsRouter.get('/', list)

// 热门网红排名接口
anchorsRouter.get('/top', topAnchors)

//根据主播名获取主播信息
anchorsRouter.get('/name', listByName)

// 获取关键黑屋的主播信息
anchorsRouter.get('/darkRoom', getDarkRoomAnchors)

// 根据主播Id查询主播详情
anchorsRouter.get('/:anchorId', detail)

// 关进黑屋（根据anchorId改变ifShow的值）
anchorsRouter.put('/ifshow', changeIfShow)



module.exports = anchorsRouter