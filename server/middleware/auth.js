const {expressjwt} = require('express-jwt')
require('dotenv').config({path:'.env'})

const tokenAuth = expressjwt({
    secret: process.env.JWT_MI,
    algorithms:['HS256'],
    credentialsRequired:true
})
module.exports = tokenAuth