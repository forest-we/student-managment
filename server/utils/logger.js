const winston = require('winston')
const path = require('path')
const fs = require('fs')

// winston 不会自动创建目录,先确保 logs/ 存在,否则写日志会报错
fs.mkdirSync(path.join(__dirname, '..', 'logs'), { recursive: true })

const logger = winston.createLogger({
    level: 'info',                           // 默认级别
    format: winston.format.combine(
        winston.format.timestamp(),           // 加时间戳
        winston.format.json()                 // JSON 格式，方便以后接日志平台
    ),
    transports: [
        // 所有日志打控制台
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // error 级别写入文件
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        // 所有日志写入文件
        new winston.transports.File({
            filename: 'logs/combined.log'
        })
    ]
})




module.exports = logger