const app = getApp()
var ctx= null
// pages/canvas/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    allDrawWorksPath: [],
    logo: ["../photos/leftarrow.svg", "../photos/finish.svg"],
    src: '',
    disable: false,
    showColorPicker: false,
    numOfColor: 12,
    itemcolor: ["#000", "#0ff", "#ff0", "#666", "#a45", "#569", "#500530", "#afa", "#bba", "#765", "#f45", "#a49"],
    currentColor: "#fff",
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

  //事件处理函数
  currentcolor: function (e) { //当前颜色

    var color = this.data.itemcolor;
    var index = e.currentTarget.dataset.index;
    this.data.currentColor = color[index]
  },
  drawrevoke: function () { //每一步保存上一步图片
    var _this = this
    wx.canvasToTempFilePath({
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

    })
    
  },
  redraw: function () { //撤回上一步
    var self = this;
    var allDrawWorksPath = self.data.allDrawWorksPath;
    if (allDrawWorksPath == null || allDrawWorksPath.length == 0 || allDrawWorksPath == undefined) {
      return;
    }

    var privWorksPath = allDrawWorksPath.pop();
    self.setData({
      allDrawWorksPath: allDrawWorksPath,
    })
    const ctx = wx.createCanvasContext('myCanvas', this) //创建carvas实例对象，方便后续使用。
    ctx.drawImage(privWorksPath, 0, 0);
    ctx.draw()
    if (allDrawWorksPath.length == 0) {

    }

  },
  next: function () { //跳转下一页
    var _this = this;
    _this.setData({
      disable: true,
      tip: "加载中……"
    })
    wx.navigateTo({
      url: '../result/index?photoPos=' + _this.data.src,
    })
  },

  getColor: function (currx, curry) { //获取当前像素点颜色
    var r
    var g
    var b
    wx.canvasGetImageData({ //获取当前像素的数据
      canvasId: 'myCanvas',
      x: currx,
      y: curry,
      width: 1,
      height: 1,
      success(res) {
        r = res.data[0]
        g = res.data[1]
        b = res.data[2]
        let hex = ((r << 16) | (g << 8) | b).toString(16)
        //console.log('#' + hex)
        return ('#' + hex)
      }
    })

  },
  setColor: function (x, y, color) {//与floodFill调用有关的填充画布颜色
    var self = this;
    var allDrawWorksPath = self.data.allDrawWorksPath;
    var privWorksPath = allDrawWorksPath[allDrawWorksPath.length - 1];
    ctx.drawImage(privWorksPath, 0, 0); //每一次先载入上一次保存的图片
    ctx.setFillStyle(color)
    ctx.fillRect(x, y, 10, 10)
    ctx.draw()
  },

  fillColor: function (e) { //与界面绑定的填充颜色
    var arr = e.changedTouches[0] //获取当前像素的坐标
    var currx = arr.x
    var curry = arr.y
    var color = this.data.currentColor
    var oldColor = this.getColor(currx, curry)
    //this.floodFillScanline(currx,curry,color,oldColor)
    this.setColor(currx, curry, color)
    
  },



  onChangeColor(e) { //调色板函数
    const index = e.target.dataset.id
    this.setData({
      currentColor: e.detail.colorData.pickerData.hex,
      colorData: e.detail.colorData
    })
  },
  toggleColorPicker(e) { //调色板函数
    this.setData({
      showColorPicker: !this.data.showColorPicker
    })
  },
  closeColorPicker() { //调色板函数
    this.setData({
      showColorPicker: false,

    })
  },

  floodFillScanline: function (x, y, newColor, oldColor) {
    var h=200
    var w=100
    var _this=this
      if (oldColor == newColor) return;
      if (_this.getColor(x,y) != oldColor) return;

      var y1;

      //draw current scanline from start position to the top
      y1 = y;
    while (y1 < h && _this.getColor(x, y1) == oldColor) {
      _this.setColor(x, y1,newColor);
        y1++;
      }

      //draw current scanline from start position to the bottom
      y1 = y - 1;
    while (y1 >= 0 && _this.getColor(x, y1) == oldColor) {
      _this.setColor(x, y1, newColor);
        y1--;
      }

      //test for new scanlines to the left
      y1 = y;
    while (y1 < h && _this.getColor(x, y1)== newColor) {
      if (x > 0 && _this.getColor(x-1, y1) == oldColor) {
          floodFillScanline(x - 1, y1, newColor, oldColor);
        }
        y1++;
      }
      y1 = y - 1;
    while (y1 >= 0 && _this.getColor(x, y1) == newColor) {
      if (x > 0 && _this.getColor(x-1, y1) == oldColor) {
          floodFillScanline(x - 1, y1, newColor, oldColor);
        }
        y1--;
      }

      //test for new scanlines to the right 
      y1 = y;
    while (y1 < h && _this.getColor(x, y1) == newColor) {
      if (x < w - 1 && _this.getColor(x+1, y1) == oldColor) {
          floodFillScanline(x + 1, y1, newColor, oldColor);
        }
        y1++;
      }
      y1 = y - 1;
    while (y1 >= 0 && _this.getColor(x, y1)== newColor) {
      if (x < w - 1 && _this.getColor(x+1, y1) == oldColor) {
          floodFillScanline(x + 1, y1, newColor, oldColor);
        }
        y1--;
      }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 ctx = wx.createCanvasContext('myCanvas', this) //创建carvas实例对象，方便后续使用。
    let _this = this;
    _this.setData({
      src: options.photoPos
    })

    wx.getSystemInfo({
      success(res) {
        _this.setData({
          rpxRatio: res.screenWidth / 750
        })
      }
    })
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

  }
})