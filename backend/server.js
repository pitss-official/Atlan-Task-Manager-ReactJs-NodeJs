const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
// require('app/routes/user.routes')(app)
app.use(express.json())
app.use(cors())
require('./app/routes/task.routes')(app)
app.use('/download', express.static('downloads'))
const port = process.env.APP_PORT||3000;
app.listen(port,()=>{
    console.log(`Server started at http://localhost:${port}`)
})