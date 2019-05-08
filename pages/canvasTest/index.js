var cfg = {
  photo: {}
};


Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    tip: '',
    disable: false,
    canvasWidth: 0,
    canvasHeight: 0
  },

  //事件处理函数
  next: function() {
    let _this = this;
    _this.setData({
      disable: true,
      tip: "加载中……"
    })
    wx.navigateTo({
      url: '../canvas/index?photoPos=' + _this.data.src,
    })
  },

  processpic: function() {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    _this.setData({
      src: options.photoPos
    })
    console.log(_this.data.src)
    _this.setCanvasSize()
  },

  setCanvasSize: function() {
    var that = this;
    wx.createSelectorQuery().select('#scene-editor').boundingClientRect(function(canvasWrapper) {
      console.log(canvasWrapper);
      console.log(canvasWrapper.height);
      console.log(canvasWrapper.width);
      cfg.canvasWrapper = canvasWrapper;

      wx.getImageInfo({
        src: that.data.src,
        success(res) {
          console.log(res)
          cfg.photo.path = res.path;
          var originalHeight = cfg.photo.originalHeight = res.height;
          var originalWidth = cfg.photo.originalWidth = res.width;
          if (originalHeight / originalWidth > canvasWrapper.height / canvasWrapper.width) {
            cfg.canvasHeight = canvasWrapper.height;
            cfg.canvasWidth = originalWidth * cfg.canvasHeight / originalHeight;
            console.log(cfg.canvasHeight)
            console.log(cfg.canvasWidth)
          } else {
            cfg.canvasWidth = canvasWrapper.width;
            cfg.canvasHeight = originalHeight * cfg.canvasWidth / originalWidth;
            console.log(originalHeight)
            console.log(originalWidth)
            console.log(cfg.canvasHeight)
            console.log(cfg.canvasWidth)
          }
          that.setData({
            canvasWidth: cfg.canvasWidth,
            canvasHeight: cfg.canvasHeight
          });
          that.drawImagescene()
        }
      })
    }).exec();
  },

  drawImagescene: function() {
    const ctx = wx.createCanvasContext('myCanvas');
    ctx.drawImage(this.data.src, 0, 0, cfg.canvasWidth, cfg.canvasHeight);
    ctx.draw();
  },

  processpic: function() {
    let src = cv.imread(this.data.src);
    let dst = cv.Mat.zeros(src.cols, src.rows, cv.CV_8UC3);
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(src, src, 61, 200, cv.THRESH_TOZERO_INV);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    for (let i = 0; i < contours.size(); ++i) {
      let color = new cv.Scalar(255, 255, 255);
      cv.drawContours(dst, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
    }
    cv.imshow('canvasOutput', dst);
    src.delete();
    dst.delete();
    contours.delete();
    hierarchy.delete();
  }

})