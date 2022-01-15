const app = require('./app/index')
//全局配置
const config = require('./app/config') 
//测试连接数据库是否成功
require('./app/database')


app.listen(config.APP_PORT, () => {
  console.log(`服务器在${config.APP_PORT}端口启动成功~`);
})
