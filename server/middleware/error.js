const logger = require("../utils/logger");
const error = ((err, req, res, next) => {
    logger.warn('JWT Error:', err.name, '-', err.message)
    if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            code: 401,
            message: '你无权访问'
        })
    }
      logger.warn(err.message)
    res.status(500).json({ code: 500, message: '服务器内部错误' })
   
})

module.exports = error