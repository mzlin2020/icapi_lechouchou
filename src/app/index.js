const Koa = require('Koa')
const bodyParser = require('koa-bodyparser')
const errorHandler = require('./error.handle')
const userRouter = require('../router/user.router') //用户注册
const backUserRouter = require('../router/back_user.router') //后台用户注册
const loginRouter = require('../router/login.router') //登录
const backLoginRouter = require('../router/back_login.router') //后台用户登录
const anchorsRouter = require('../router/anchors.router') //主播信息表
const livesRouter = require('../router/lives.router')  //直播信息列表
const goodsRouter = require('../router/goods.router') // 商品信息列表

const app = new Koa() //创建实例

// 允许跨域(仅允许后端项目跨域)
// app.use(async (ctx, next)=> {
//   ctx.set('Access-Control-Allow-Origin', 'http://120.25.202.60:8888');
//   ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//   ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//   if (ctx.method == 'OPTIONS') {
//     ctx.body = 200; 
//   } else {
//     await next();
//   }
// });



app.use(bodyParser())  //解析JSON
app.use(userRouter.routes()) //使用路由
app.use(userRouter.allowedMethods()) //错误方法提示
app.use(backUserRouter.routes())
app.use(backUserRouter.allowedMethods()) 
app.use(loginRouter.routes())
app.use(loginRouter.allowedMethods())
app.use(backLoginRouter.routes())
app.use(backLoginRouter.allowedMethods())
app.use(anchorsRouter.routes())
app.use(anchorsRouter.allowedMethods())
app.use(livesRouter.routes())
app.use(livesRouter.allowedMethods())
app.use(goodsRouter.routes())
app.use(goodsRouter.allowedMethods())


// 错误监听
app.on('error', errorHandler)
module.exports = app  