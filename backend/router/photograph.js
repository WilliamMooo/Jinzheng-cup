const express = require('express')
const router = express.Router() 
const multer = require('multer')
const uploadFileHandle = multer()
const cv = require('opencv4nodejs')
const errorWrapper = require('./errorWrapper')

router.post('/', uploadFileHandle.single('image'), async function(req, res){
  let imageBuffer;
  if(req.file && req.file.hasOwnProperty('buffer'))
	imageBuffer = req.file.buffer;
  let img_url = req.body.image_url;
  let img 
  if(imageBuffer)  
    img = cv.imdecode(imageBuffer)
  else if(img_url && img_url.length > 0){
    let filePath = img_url.replace(/^.*:\/\/.*?\//,'')
    img = cv.imread(filePath)
  }
  else
    next(errorWrapper('请求格式错误', 401)) 
  img = img.canny(68, 200, 3, false);
  let outputImageBase64 = 'data:image/png;base64,' + cv.imencode('.png', img).toString('base64');
  res.json({img_dataurl: outputImageBase64})
  res.end() 
})

module.exports = router;
