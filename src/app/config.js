const docenv = require('dotenv')
const path = require('path')
const fs = require('fs')

// 获取公钥私钥的信息并导出
const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname,'keys/private.key'))
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname,'keys/public.key'))

docenv.config()
//将全局变量放进process.env中

module.exports = { APP_PORT } = process.env

// 顺序-不能放上方，会被覆盖
module.exports.PRIVATE_KEY = PRIVATE_KEY;
module.exports.PUBLIC_KEY = PUBLIC_KEY;
