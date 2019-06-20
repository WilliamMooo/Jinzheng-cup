const express = require('express')
const router = express.Router()
const mysqlOption = require('../mysql.config')
const mysql = require('mysql')
const connection = mysql.createPool(mysqlOption)
const multer = require('multer')
const uploadFileHandle = multer()
const fs = require('fs')
const errorWrapper = require('./errorWrapper')


function sqlQuery(sql, ...param){
  return new Promise( function(resolve, reject){
    connection.query(sql, ...param, function(error, results){
      if(error) reject(error)
      else resolve(results)
    })
  })
}

let err = new Error()

router.get('/', async function (req, res, next) {
    let results = await sqlQuery('SELECT url FROM gallery')
    let arr = []
    results.forEach(row => {
      arr.push(row.url)
    });
    res.status(200).json(arr).end();
})

router.post('/',uploadFileHandle.single('image'), async function(req, res, next){
  let env = process.env.NODE_ENV.trim();
  let imageBuffer = req.file.buffer;
  let prefix = env === 'development' ? 'http://localhost:8000/static/' : 'https://jzb.deeract.com/static/' 
  if(!imageBuffer)
    next(errorWrapper("无法正确获取图片", 402))
  let filename = Math.random().toString(36).substr(2) + '.png' 
  fs.writeFileSync('./static/' + filename, imageBuffer)
  sqlQuery('INSERT INTO gallery(url) VALUES (?)', prefix + filename)
  res.status(200).end()
})

module.exports = router;