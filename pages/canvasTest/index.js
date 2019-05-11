var brr = [];
var arr = [];
var deal = []

function handlecolor(data){
  for (let i = 0; i < data.length; i += 4) {
    if (isnotblack(data[i], data[i+1], data[i+2])) {
      data[i] = 255
      data[i + 1] = 255
      data[i + 2] = 255
    } else {
      data[i] = 0
      data[i + 1] = 0
      data[i + 2] = 0
    }
  }
  console.log('A')
  return data
};

function setbrr(data) {
  for (let i = 0; i < data.length; i += 4) {
    brr[i] = true
  }
};

function convertToGrayscale(data) {
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] == 0 && data[i + 1] == 0 && data[i + 2] == 0) {
      data[i] = 255
      data[i + 1] = 255
      data[i + 2] = 255
    } else {
      data[i] = 0
      data[i + 1] = 0
      data[i + 2] = 0
    }
  }
    return data
};

function isnotblack(a,b,c){
  if(a ==0 && b==0 && c==0){
    return false
  }
  else{
    return true
  }
};

  function cleanthephoto(data) {
    setbrr(data)
    for (let i = 0; i < data.length; i += 4) {
      if ( isnotblack(data[i],data[i + 1],data[i + 2]) && brr[i]) {
        let width = 414
        let incre = [-4, 4, width * 4 - 4, width * 4, width * 4 + 4, - width * 4 - 4, -width * 4, -width * 4 + 4]
        let head = 0
        let tail = 1
        arr[1] = i
        brr[i] = false
        do {
          head++
          for (let n = 0; n < incre.length; n++) {
            let x = arr[head] + incre[n]
            if (x >= 0 && x < data.length && brr[x]) {
                  if (isnotblack(data[x], data[x + 1], data[x + 2])){
                    tail++
                    arr[tail] = x
                    brr[x] = false
                  }
            }
          }
        }
        while (head < tail)
        if (tail <=300) {
          for (let m = 1; m <= tail; m++) {
            let x = arr[m]
            data[x] = 0
            data[x + 1] = 0
            data[x + 2] = 0
          }
        }
      }
    }
    return data
  };

  var cfg = {
    photo: {}
  };

  Page ({
    data: {
      src: '../image/processed.png',
      disable: false,
      canvasWidth: 0,
      canvasHeight: 0
    },

    onLoad: function(options) {
      var _this = this;
      console.log(_this.data.src)
      _this.setCanvasSize()
      _this.setData({ src: options.photoPos })
    },

    setCanvasSize: function() {
      var that = this;
      wx.createSelectorQuery().select('#scene-editor').boundingClientRect(function(canvasWrapper) {
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
            } else {
              cfg.canvasWidth = canvasWrapper.width;
              cfg.canvasHeight = originalHeight * cfg.canvasWidth / originalWidth;
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
      let one = parseInt(cfg.canvasHeight)
      console.log(one)
      let two = parseInt(cfg.canvasWidth)
      console.log(two)
      wx.canvasGetImageData({
        canvasId: 'myCanvas',
        x: 0,
        y: 0,
        width: two,
        height: one,
        success(res) {
          const data = convertToGrayscale(res.data)
          wx.canvasPutImageData({
            canvasId: 'myCanvas',
            data,
            x: 0,
            y: 0,
            width: two,
            height: one,
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
    },

    handlepixel: function(){
      let one = parseInt(cfg.canvasHeight)
      console.log(one)
      let two = parseInt(cfg.canvasWidth)
      console.log(two)
      wx.canvasGetImageData({
        canvasId: 'myCanvas',
        x: 0,
        y: 0,
        width: two,
        height: one,
        success(res) {
          const data = handlecolor(res.data)
          wx.canvasPutImageData({
            canvasId: 'myCanvas',
            data,
            x: 0,
            y: 0,
            width: two,
            height: one,
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
    },

    furtherprocess: function() {
      let one = parseInt(cfg.canvasHeight)
      console.log(one)
      let two = parseInt(cfg.canvasWidth)
      console.log(two)
      wx.canvasGetImageData({
        canvasId: 'myCanvas',
        x: 0,
        y: 0,
        width: two,
        height: one,
        success(res) {
          const data = cleanthephoto(res.data)
          wx.canvasPutImageData({
            canvasId: 'myCanvas',
            data,
            x: 0,
            y: 0,
            width: two,
            height: one,
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
    }
  })