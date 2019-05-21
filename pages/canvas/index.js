const app = getApp()
var ctx = null
var arrx = [];//动作横坐标
var arry = [];//动作纵坐标
var arrz = [];//总做状态，标识按下到抬起的一个组合
// emun type is color or picutre, default is color 
let drawType = 'color'
let chooseImageSrc = ''

var finalSrc = '';//此页面最终的结果

var brr = [];
var arr = [];
var crr = [];

function fillcolor(data, x, y, r, g, b, Or, Og, Ob) {
  var OR = Or
  var OG = Og
  var OB = Ob
  var R = parseInt(r, 16)
  var G = parseInt(g, 16)
  var B = parseInt(b, 16)
  //console.log(R,G,B)
  //console.log(x,y)
  let width = cfg.canvasWidth
  let height = cfg.canvasHeight
  //console.log(height,width)
  setbrr(data)
  let dx = [0, 0, -1, 1]
  let dy = [1, -1, 0, 0]
  let count = parseInt(y) * width + parseInt(x)
  let head = 0
  let tail = 1
  let xrr = []
  let yrr = []
  xrr[1] = parseInt(x)
  yrr[1] = parseInt(y)
  brr[count * 4] = false

  do {
    head++
    for (let i = 0; i < dx.length; i++) {
      var newx = xrr[head] + dx[i]
      var newy = yrr[head] + dy[i]
      var newcount = newy * width + newx
      // console.log(newx,newy,newcount)


      if (newx > 0 && newx < width && newy > 0 && newy < height && brr[newcount * 4]) {
        brr[newcount * 4] = false
        // console.log(data[newcount * 4])
        if (data[newcount * 4] == OR && data[newcount * 4 + 1] == OG && data[newcount * 4 + 2] == OB) {
          tail++
          xrr[tail] = newx
          yrr[tail] = newy
          //console.log("yes2") //
          data[newcount * 4] = R
          data[newcount * 4 + 1] = G
          data[newcount * 4 + 2] = B
        }
      }
    }
  }
  while (head < tail)
  return data
};

function setbrr(data) {

  for (let i = 0; i < data.length; i += 4) {
    brr[i] = true
  }
};
function setcrr(data) {
  for (let i = 0; i < data.length; i += 4) {
    crr[i] = true
  }
};

function handlePicture(event) {
  var pointx =  parseInt( event.changedTouches[0].x )
  var pointy = parseInt( event.changedTouches[0].y )
  wx.canvasGetImageData({
    canvasId: 'myCanvas',
    x: 0,
    y: 0,
    width: cfg.canvasWidth,
    height: cfg.canvasHeight,
    success(res) {
      paintphoto(res.data, pointx, pointy)
    },
    fail: (err) => {
      console.error(err)
    }
  })
};
function paintcanvas(event) {
  let pointx = event.detail.x
  let pointy = event.detail.y
  wx.canvasGetImageData({
    canvasId: 'myCanvas',
    x: 0,
    y: 0,
    width: cfg.canvasWidth,
    height: cfg.canvasHeight,
    success(res) {
      const data = fillcolor(res.data, pointx, pointy)
      wx.canvasPutImageData({
        canvasId: 'myCanvas',
        data,
        x: 0,
        y: 0,
        width: cfg.canvasWidth,
        height: cfg.canvasHeight,
        success: (res) => {
          console.log(res)
        },
        fail: (err) => {
          console.error(err)
        }
      })
    },
    fail: (err) => {
      console.error(err)
    }
  })
};

var cfg = {
  photo: {}
};

function judgeEdage(data, x, y){
  let dirx = [-1, 0, 1, -1, 1, -1, 0, 1]
  let diry = [-1, -1, -1, 0, 0, 1, 1, 1]
  let preIndex = y * cfg.canvasWidth + x
  if(data[preIndex * 4] === 0 && data[preIndex * 4 + 1] === 0 && data[preIndex * 4 + 2] === 0) 
    return false
  for(let i = 0; i < 8; i ++){
    let nextX = x + dirx[i];
    let nextY = y + diry[i];
    let index = nextY * cfg.canvasWidth + nextX
    if(nextX === 0 || nextY === 0 || nextX === cfg.canvasWidth -1 || nextY === cfg.canvasHeight - 1)
     return true;
    if(data[index * 4] === 0 && data[index * 4 + 1] === 0 && data[index * 4 + 2] === 0)
    return true
  }
  return false
}

function paintphoto(data, x, y) {
  console.log(data)
  console.log(x, y)
  let width = cfg.canvasWidth
  let height = cfg.canvasHeight
 setbrr(data)
 setcrr(data)
 let dx = [1, 0, -1, 0]
 let dy = [0, -1, 0, 1]
 let allPath = []
 let xrr = [x]
 let yrr = [y]
 let count = y * width +  x
 brr[count * 4] = false
 crr[count * 4] = false
 let head = 0, tail =1;
 while(head < tail){
   for (let i = 0; i < dx.length; i++) {
     var newx = xrr[head] + dx[i]
     var newy = yrr[head] + dy[i]
     var newcount = newy * width + newx
     if (newx >= 0 && newx < width && newy >= 0 && newy < height && brr[newcount * 4] && (data[newcount * 4] !== 0 || data[newcount * 4 + 1] != 0 || data[newcount * 4 + 2] !== 0) && crr[newcount * 4]) {
       brr[newcount * 4] = false
       xrr.push(newx)
       yrr.push(newy)
       tail++;
       let point = judgeEdage(data, newx, newy)
       if (point && crr[newcount * 4]) {
         crr[newcount * 4] = false
           allPath.push(searchedge(data, [{x: newx, y: newy}]))
         }
       }
     }
     head++
   }
 console.log(allPath)
 let maxPathLength = -1, maxPathPosi = -1
 for(let index = 0, length = allPath.length; index < length; index ++)
   if(maxPathLength < allPath[index].length){
     maxPathPosi = index;
     maxPathLength = allPath[index].length
   }

 ctx.beginPath()
 for(let index = 0, length = allPath.length; index < length; index ++){
   if(index === maxPathPosi)
     drawOutline(allPath[index], false)
   else 
     drawOutline(allPath[index], true)
 }
 ctx.closePath()
//  ctx.setStrokeStyle('blue')
 ctx.stroke()
 ctx.save()
 ctx.clip()
//  // ctx.setFillStyle('blue')
//  ctx.fill()
 ctx.drawImage(chooseImageSrc,0,0, cfg.canvasWidth, cfg.canvasHeight)
 ctx.draw(true)
 ctx.restore()
};

function searchedge(data, line){

  let width = cfg.canvasWrapperWidth
  let height = cfg.canvasWrapperHeight
  // dir 0 => 上 1=> 右 2=> 下  3=> 左 
  let dir = 0
  let movex = [-1, 0, 1, 0]
  let movey = [0, -1, 0, 1]
   console.log(line[0])

  let current = 0
  while(true){
    let point = line[current]
    let find = false
    for(let i = 0; i < 4; i++){
      var newx = point.x + movex[(i + dir) % 4]
      var newy = point.y + movey[(i + dir) % 4]
      var newcount = newy * width + newx
      if (newx >= 0 && newx < width && newy >= 0 && newy < height && crr[newcount * 4]){
        crr[newcount * 4]= false
        if (judgeEdage(data, newx, newy)){
          dir = (dir + i + 3) % 4
          line.push({x: newx, y: newy})
          break;
        }
      }
    }
    current ++;
    if(current >= line.length) {
      console.log(line[current - 1])
      break;
    }
  }
  return line
}
function drawOutline(path, direction){
  console.log(direction)
  let tmpPath = direction ? path : path.reverse()
  ctx.moveTo(tmpPath[0].x, tmpPath[0].y)
  for(let i = 1, length = tmpPath.length; i < length; i ++)
    ctx.lineTo(tmpPath[i].x, tmpPath[i].y)
  // ctx.lineTo(tmpPath[0].x, tmpPath[0].y)
  return ;
}

// pages/canvas/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    originPic:"", //直接从选取的原图中来
    showModal: false,
    //pridata: {},
    height: 0,
    width: 0,
    isclear: false,
    ispencil: false,
    allDrawWorksPath: [],
    logo: ["../photos/leftarrow.svg", "../photos/finish.svg"],
    src: "", //从网站获取
    disable: false,
    showColorPicker: false,
    numOfColor: 11,
    itemcolor: ["#e46fdc", "#0ff", "#ff0", "#666", "#a45", "#569", "#500530", "#afa", "#bba", "#765", "#fd6969"],
    currentColor: "#fff",
    oldColorR: "",
    oldColorG: "",
    oldColorB: "",
    DIYcolor: '',
    colorData: {
      //基础色相(色盘右上顶点的颜色)
      hueData: {
        colorStopRed: 255,
        colorStopGreen: 0,
        colorStopBlue: 0,
      },
      //选择点的信息
      pickerData: {
        x: 0,
        y: 480,
        red: 0,
        green: 0,
        blue: 0,
        hex: '#000000'
      },
      //色相控制条位置
      barY: 0
    },
    rpxRatio: 1 //单位rpx实际像素
  },
  
  btn: function () {
    this.setData({
      showModal: true
    })
  },

  // 禁止屏幕滚动
  preventTouchMove: function () {
  },

  // 弹出层里面的弹窗
  ok: function () {
    this.setData({
      showModal: false
    })
  },
  //事件处理函数
  currentcolor: function (e) { //当前颜色
    drawType = 'color'
    this.data.ispencil = false
    this.data.isclear = false
    var color = this.data.itemcolor;
    var index = e.currentTarget.dataset.index;
    this.data.currentColor = color[index]
    //console.log(this.data.currentColor)

  },
  drawrevoke: function (e) { //每一步保存上一步图片
    var _this = this
    if (_this.data.isclear || _this.data.ispencil) {
      _this.startX = e.changedTouches[0].x
      _this.startY = e.changedTouches[0].y

    }

    /* wx.canvasToTempFilePath({
       x: 0,
       y: 0,
       canvasId: 'myCanvas',
       success(res) {
         var imgPath = res.tempFilePath;
         var allDrawWorksPath = _this.data.allDrawWorksPath;
         allDrawWorksPath.push(imgPath);
         _this.setData({
           allDrawWorksPath: allDrawWorksPath
         })
 
       },
       fail: res => {
         console.log('获取画布图片失败', res);
 
       }
 
     })*/

  },
  redraw: function () { //撤回上一步

  },
  next: function () { //跳转下一页
   
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success(res) {
       finalSrc= res.tempFilePath
        wx.navigateTo({
          url: '../result/index?photoPos=' + finalSrc,
        })
      }
    })
  
  
  },

  getColor: function (e) { //获取当前像素点颜色
   
    arrz.push(0);
    arrx.push(e.changedTouches[0].x);
    arry.push(e.changedTouches[0].y);
    
    var _this = this
    var r
    var g
    var b
    var currx = e.changedTouches[0].x
    var curry = e.changedTouches[0].y
    //console.log(currx, curry)
    wx.canvasGetImageData({ //获取当前像素的数据
      canvasId: 'myCanvas',
      x: currx,
      y: curry,
      width: 1,
      height: 1,
      success(res) {
        var data = res.data
        //  console.log(data)
        //console.log(this.data.oldColor)
        wx.canvasPutImageData({
          canvasId: 'myCanvas',
          data,
          x: currx,
          y: curry,
          width: 1,
          height: 1,
          success: (res) => {
            // console.log("fillcolor ok")
          },
          fail: (err) => {
            console.error(err)
          }
        })
        // console.log(res)
        r = res.data[0]
        g = res.data[1]
        b = res.data[2]
        let hex = ((r << 16) | (g << 8) | b).toString(16)
        // console.log('#' + hex)
        _this.setData({
          oldColorR: res.data[0],
          oldColorG: res.data[1],
          oldColorB: res.data[2]
        })

      }
    })

  },
  /*setColor: function (x, y, color) {//与floodFill调用有关的填充画布颜色
    var self = this;
    var allDrawWorksPath = self.data.allDrawWorksPath;
    var privWorksPath = allDrawWorksPath[allDrawWorksPath.length - 1];
    ctx.drawImage(privWorksPath, 0, 0); //每一次先载入上一次保存的图片
    ctx.setFillStyle(color)
    ctx.fillRect(x, y, 10, 10)
    ctx.draw()
  },*/

  /*fillColor: function (e) { //与界面绑定的填充颜色
    var arr = e.changedTouches[0] //获取当前像素的坐标
    var currx = arr.x
    var curry = arr.y
    var color = this.data.currentColor
    var oldColor = this.getColor(currx, curry)
    //this.floodFillScanline(currx,curry,color,oldColor)
    this.setColor(currx, curry, color)

  },*/

  touchMove: function (event) {//画图或橡皮擦
    //console.log()

    if (this.data.ispencil || this.data.isclear) { //判断是否启用的橡皮擦功能  ture表示清除  false表示画画
      arrz.push(1);
      arrx.push(event.changedTouches[0].x);
      arry.push(event.changedTouches[0].y);

    };
    
    for (var i = 0; i < arrx.length; i++) {

      if (arrz[i] == 0) {
        ctx.moveTo(arrx[i], arry[i])
      } else {
        ctx.lineTo(arrx[i], arry[i])
      };



    };

    if (this.data.isclear) {
      ctx.setStrokeStyle('#ffffff');
      ctx.setLineWidth(3);
    }
    else {
      ctx.setStrokeStyle('#000000');
      ctx.setLineWidth(1);
    }

    ctx.setLineCap('round');
    ctx.setLineJoin('round');
    ctx.stroke();
    ctx.draw(true);




  },
  isPencil: function () {
    drawType = 'color'
    var _this = this
    _this.data.ispencil = true
    _this.data.isclear = false
  },

  isClear: function () {
    drawType = 'color'
    var _this = this
    _this.data.isclear = true
    _this.data.ispencil = false
  },

  onChangeColor(e) { //调色板函数
    const index = e.target.dataset.id
    this.setData({
      currentColor: e.detail.colorData.pickerData.hex,
      colorData: e.detail.colorData
    })
  },
  toggleColorPicker(e) { //调色板函数
    drawType = 'color'
    this.setData({
      showColorPicker: !this.data.showColorPicker
    })
    this.data.ispencil = false
    this.data.isclear = false
  },
  closeColorPicker() { //调色板函数
    this.setData({
      showColorPicker: false,

    })
    console.log("重新加载啦")
  },
  handleDraw(event){
    console.log(event)
    if(drawType === 'color')  
      this.handleColor(event)
    else 
      handlePicture(event)
  },
  handleColor: function (event) {
    
  arrx=[]
  arry=[]
  arrz=[]
    console.log()
   // console.log(arrx,arry)
    if (!this.data.ispencil && !this.data.isclear) {
      console.log(this.data.ispencil)
      var _this = this
      var Or = this.data.oldColorR
      var Og = this.data.oldColorG
      var Ob = this.data.oldColorB
      // console.log(this.data.oldColorR,this.data.oldColorG,this.data.oldColorB)
      var currentColor = this.data.currentColor
      if (currentColor.length < 6) {
        var r = currentColor[1] + currentColor[1]
        var g = currentColor[2] + currentColor[2]
        var b = currentColor[3] + currentColor[3]
        //console.log(r,g,b)
      } else {
        var r = currentColor[1] + currentColor[2]
        var g = currentColor[3] + currentColor[4]
        var b = currentColor[5] + currentColor[6]
        //console.log(r,g,b)
      }

      var arr = event.changedTouches[0] //获取当前像素的坐标
      var pointx = arr.x
      var pointy = arr.y

      let one = cfg.canvasWidth
      let two = cfg.canvasHeight
      console.log(one, two)  //
      wx.canvasGetImageData({
        canvasId: 'myCanvas',
        x: 0,
        y: 0,
        width: one,
        height: two,
        success(res) {
          // console.log(res)  //

          // _this.data.pridata=res.data
              
          const data = fillcolor(res.data, pointx, pointy, r, g, b, Or, Og, Ob)
          wx.canvasPutImageData({
            canvasId: 'myCanvas',
            data,
            x: 0,
            y: 0,
            width: one,
            height: two,
            success: (res) => {
              console.log("fillcolor ok")
            },
            fail: (err) => {
              console.error(err)
            }
          })
        },
        fail: (err) => {
          console.error(err)
        }
      })
    }

  },
  drawImagescene: function () {
    const _this = this
    ctx = wx.createCanvasContext('myCanvas', this);
    console.log(cfg.canvasWidth, cfg.canvasHeight)//
    ctx.drawImage(_this.data.src, 0, 0, cfg.canvasWidth, cfg.canvasHeight);
    ctx.draw();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      src: options.photoPos,
      originPic: options.originImage
    })
    let {windowWidth} = wx.getSystemInfoSync()
    wx.getImageInfo({
      src: _this.data.originPic,
      success(res) {
        console.log(res)
        cfg.photo.path = res.path;
        var originalHeight = cfg.photo.originalHeight = res.height;
        var originalWidth = cfg.photo.originalWidth = res.width;
        let rate =  originalHeight / originalWidth
        cfg.canvasWidth = windowWidth
        cfg.canvasHeight = parseInt(windowWidth * rate)
        cfg.canvasWrapperWidth = cfg.canvasWidth
        cfg.canvasWrapperHeight = cfg.canvasHeight
        console.log(cfg)
        _this.setData({
          canvasWidth: cfg.canvasWidth,
          canvasHeight: cfg.canvasHeight
        });
        _this.drawImagescene()
      }
    })
    // _this.drawImagescene()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  choosePic: function(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success(res) {
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        // const tempFilePaths = res.tempFilePaths
        chooseImageSrc = res.tempFilePaths[0]
        console.log(chooseImageSrc)
        drawType = 'picutre '
      }
    })
  }
})