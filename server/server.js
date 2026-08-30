const express = require('express');
const cors = require('cors')
const path = require('path')
const app     = express();



const logger = require('./utils/logger')
const router = require('./routes/user');
const student = require('./routes/student')
const  error  = require('./middleware/error');
// ==================== 静态文件（不受 JWT 保护） ====================
app.use(express.static(path.join(__dirname, 'public')))


// ==================== 全局中间件 ====================
app.use(express.json());
app.use(cors())
// JWT 只保护 /admin/* 路由，其余全部放行

app.use(router)
app.use(student)
app.use('/uploads',express.static('uploads'))







app.use(error)


app.listen(4300, () =>{
  logger.info('服务器开始运行')
    
})   