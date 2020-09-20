module.exports = app =>{
    const user = require("../controllers/user.controller")
    let router = require("express").Router()
    router.get('/login',user.login)
    app.use('/api/user/',router)
};