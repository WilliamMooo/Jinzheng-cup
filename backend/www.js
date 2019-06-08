const express = require('express')
const http = require('http')
const https = require('https')
const fs = require('fs')
const app = require('./app')

const option = {
  key: fs.readFileSync( './certificate/2_jzb.deeract.com.key'),
  cert: fs.readFileSync( './certificate/1_jzb.deeract.com_bundle.crt')
}

let httpServer = http.createServer(app).listen(8000, function () {
  console.log("http is listening in http://localhost:%d", httpServer.address().port)
})

let httpsServer = https.createServer(option, app).listen(3344, function(){
  console.log("https is listening in https://localhost:%d", httpsServer.address().port)
})