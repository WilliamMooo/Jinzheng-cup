const express = require('express')
const app = express()
const gallery = require('./router/gallery')
const photograph = require('./router/photograph')

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/static', express.static('static'))

app.use('/api/gallery', gallery)
app.use('/api/photograph', photograph)
app.use(function(err, req, res, next){
  res.status(err.status).json({status: err.status, errmsg: err.message}).end()
})

module.exports = app;