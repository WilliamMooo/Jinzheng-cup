var brr = [];
var arr = [];
var deal = [];
const ctx = wx.createCanvasContext('myCanvas')

function indata(data, element) {
  for (let i = 0; i < data.length; i++) {
    if (data[i] == element) {
      return true
    }
  }
  return false
}

function alldone(data) {
  for (let i = 0; i < data.length; i++) {
    if (data[i] == true) {
      return true
    }
  }
  return false
}

function handlecolor(data) {
  for (let i = 0; i < data.length; i += 4) {
    if (isnotblack(data[i], data[i + 1], data[i + 2])) {
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

function fillcolor(data, x, y) {
  let width = cfg.canvasWrapperWidth
  let height = cfg.canvasWrapperHeight
  let picwidth = cfg.canvasWidth
  let picheight = cfg.canvasHeight
  setbrr(data)
  let dx = [0, 0, -1, 1]
  let dy = [1, -1, 0, 0]
  let count = y * width + x
  let head = 0
  let tail = 1
  let xrr = []
  let yrr = []
  xrr[1] = x
  yrr[1] = y
  brr[count * 4] = false
  data[count * 4] = 255
  data[count * 4 + 1] = 0
  data[count * 4 + 2] = 0
  do {
    head++
    for (let i = 0; i < dx.length; i++) {
      var newx = xrr[head] + dx[i]
      var newy = yrr[head] + dy[i]
      var newcount = newy * width + newx
      if (newx >= 0 && newx < picwidth && newy >= 0 && newy < picheight && brr[newcount * 4]) {
        brr[newcount * 4] = false
        if (data[newcount * 4] == 255 && data[newcount * 4 + 1] == 255 && data[newcount * 4 + 2] == 255) {
          tail++
          xrr[tail] = newx
          yrr[tail] = newy
          data[newcount * 4] = 255
          data[newcount * 4 + 1] = 0
          data[newcount * 4 + 2] = 0
        }
        if (data[newcount * 4] == 0 && data[newcount * 4 + 1] == 0 && data[newcount * 4 + 2] == 0) {
          data[newcount * 4] = 0
          data[newcount * 4 + 1] = 255
          data[newcount * 4 + 2] = 0
        }
        if (newx == 0 || newx == width || newy == 0 || newy == height) {
          data[newcount * 4] = 0
          data[newcount * 4 + 1] = 255
          data[newcount * 4 + 2] = 0
        }
      }
    }
  }
  while (head < tail)
  return data
};

function paintphoto(data, x, y) {
  let width = cfg.canvasWrapperWidth
  let height = cfg.canvasWrapperHeight
  let picwidth = cfg.canvasWidth
  let picheight = cfg.canvasHeight
  setbrr(data)
  let dx = [0, 0, -1, 1]
  let dy = [1, -1, 0, 0]
  let count = y * width + x
  let head = 0
  let tail = 1
  let zrr = []
  let n = 0
  let xrr = []
  let yrr = []
  xrr[1] = x
  yrr[1] = y
  brr[count * 4] = false
  do {
    head++
    for (let i = 0; i < dx.length; i++) {
      var newx = xrr[head] + dx[i]
      var newy = yrr[head] + dy[i]
      var newcount = newy * width + newx
      if (newx >= 0 && newx < width && newy >= 0 && newy < height && brr[newcount * 4]) {
        brr[newcount * 4] = false
        if (data[newcount * 4] == 255 && data[newcount * 4 + 1] == 255 && data[newcount * 4 + 2] == 255) {
          tail++
          xrr[tail] = newx
          yrr[tail] = newy
        }
        if (data[newcount * 4] == 0 && data[newcount * 4 + 1] == 0 && data[newcount * 4 + 2] == 0) {
          zrr[n] = { x: newx, y: newy }
          n++
        }
        if (newx == 0 || newx == width - 1 || newy == 0 || newy == height - 1) {
          zrr[n] = { x: newx, y: newy }
          n++
        }
      }
    }
  }
  while (head < tail)
  let left = []
  let right = []
  let signal = []
  for (let i = 0; i < zrr.length; i++) {
    signal[i] = true
  }
  for (let i = 0; i < zrr.length; i++) {
    for (let j = i; j < zrr.length; j++) {
      if (zrr[i].y > zrr[j].y) {
        let miny = zrr[j].y;
        let excx = zrr[j].x;
        zrr[j].y = zrr[i].y;
        zrr[j].x = zrr[i].x;
        zrr[i].y = miny;
        zrr[i].x = excx;
      }
    }
  }
  for (let i = 0; i < zrr.length; i++) {
    if (signal[i] == true) {
      signal[i] = false
      let max_x = zrr[i].x
      let min_x = zrr[i].x
      let max = zrr[i]
      let min = zrr[i]
      for (let j = i + 1; j < zrr.length; j++) {
        if (zrr[i].y == zrr[j].y) {
          signal[j] = false
          if (min_x > zrr[j].x) {
            min = zrr[j]
            min_x = zrr[j].x
          }
          if (max_x < zrr[j].x) {
            max = zrr[j]
            max_x = zrr[j].x
          }
        }
      }
      left.push(min)
      right.push(max)
    }
  }
  console.log(left)
  console.log(right)
  ctx.moveTo(left[0].x, left[0].y)
  for (let i = 1; i < left.length; i++) {
    ctx.lineTo(left[i].x, left[i].y)
  }
  ctx.moveTo(right[0].x, right[0].y)
  for (let i = 1; i < right.length; i++) {
    ctx.lineTo(right[i].x, right[i].y)
  }
  ctx.moveTo(left[0].x, left[0].y)
  ctx.lineTo(right[0].x, right[0].y)
  ctx.stroke()
  ctx.moveTo(left[left.length - 1].x, left[left.length - 1].y)
  ctx.lineTo(right[right.length - 1].x, right[right.length - 1].y)
  ctx.stroke()
  ctx.draw(true)    // 整体边框勾勒完成

  // 勾勒内部区域
  let dirx = [-1, 0, 1, -1, 1, -1, 0, 1]
  let diry = [-1, -1, -1, 0, 0, 1, 1, 1]
  let restrr = []
  let inrerstrr = false
  for (let i = 0; i < zrr.length; i++) {
    if (!indata(left, zrr[i]) && !indata(right, zrr[i])) {
      restrr.push(zrr[i])      // 需要勾勒区域的像素数组
    }
  }
  let contour = []
  let current = 0
  let continuesignal = true
  let allnotdone = true
  contour.push(restrr[0])
  let currentcount = restrr[0].y * width + restrr[0].x
  let mrr = []
  for (let i = 0; i < restrr.length; i++) {
    let count = restrr[0].y * width + restrr[0].x
    mrr[count] = true
    console.log('A')
  }

  while (allnotdone) {
    while (continuesignal) {
      continuesignal = false
      for (let i = 0; i < dirx.length; i++) {
        let newx = contour[current].x + dirx[i]
        let newy = contour[current].y + diry[i]
        if (newx >= 0 && newx < picwidth && newy >= 0 && newy < picheight) {
          let count = newy * width + newx
          for (let p = 0; p < restrr.length; p++) {
            if (restrr[p].x == newx && restrr[p].y == newy) {
              inrerstrr = true
            }
          }
          console.log(inrerstrr)
          console.log(mrr[count])
        }

        if (inrerstrr && mrr[count]) {
          console.log('A')
          mrr[count] = false
          contour.push(element)
          continuesignal = true
          current++
          break
        }
      }
    }
    ctx.moveTo(contour[0].x, contour[0].y)
    for (let i = 1; i < contour.length; i++) {
      ctx.lineTo(contour[i].x, contour[i].y)
    }
    ctx.lineTo(contour[0].x, contour[0].y)
    ctx.stroke()
    ctx.draw(true)
    for (let i = 0; i < contour.length; i++) {
      contour[i] = 0
    }
    allnotdone = alldone(mrr)
  }


  ctx.save()
  ctx.beginPath()
  ctx.moveTo(left[0].x, left[0].y)
  for (let i = 1; i < left.length; i++) {
    ctx.lineTo(left[i].x, left[i].y)
  }
  ctx.moveTo(right[0].x, right[0].y)
  for (let i = 1; i < right.length; i++) {
    ctx.lineTo(right[i].x, right[i].y)
  }
  ctx.moveTo(left[0].x, left[0].y)
  ctx.lineTo(right[0].x, right[0].y)
  ctx.stroke()
  ctx.moveTo(left[left.length - 1].x, left[left.length - 1].y)
  ctx.lineTo(right[right.length - 1].x, right[right.length - 1].y)
  ctx.stroke()
  ctx.clip()
  ctx.drawImage('../../image/pop.jpg', 10, 10)
  ctx.restore()
  ctx.draw(true)
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

function isnotblack(a, b, c) {
  if (a == 0 && b == 0 && c == 0) {
    return false
  } else {
    return true
  }
};

function isnotwhite(a, b, c) {
  if (a == 255 && b == 255 && c == 255) {
    return false
  } else {
    return true
  }
};

function cleanthephoto(data) {
  setbrr(data)
  for (let i = 0; i < data.length; i += 4) {
    if (isnotblack(data[i], data[i + 1], data[i + 2]) && brr[i]) {
      let width = cfg.canvasWrapperWidth
      let incre = [-4, 4, width * 4 - 4, width * 4, width * 4 + 4, -width * 4 - 4, -width * 4, -width * 4 + 4]
      let head = 0
      let tail = 1
      arr[1] = i
      brr[i] = false
      do {
        head++
        for (let n = 0; n < incre.length; n++) {
          let x = arr[head] + incre[n]
          if (x >= 0 && x < data.length && brr[x]) {
            if (isnotblack(data[x], data[x + 1], data[x + 2])) {
              tail++
              arr[tail] = x
              brr[x] = false
            }
          }
        }
      }
      while (head < tail)
      console.log(tail)
      if (tail <= 100) {
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

Page({
  data: {
    src: '../../image/pic1.jpg',
    disable: false,
    canvasWidth: 0,
    canvasHeight: 0
  },

  onLoad: function (options) {
    var _this = this;
    _this.setData({
      src: options.photoPos
    })
    console.log(_this.data.src)
    _this.setCanvasSize()
  },

  setCanvasSize: function () {
    var that = this;
    wx.createSelectorQuery().select('#scene-editor').boundingClientRect(function (canvasWrapper) {
      cfg.canvasWrapper = canvasWrapper;
      cfg.canvasWrapperWidth = canvasWrapper.width
      cfg.canvasWrapperHeight = canvasWrapper.height
      wx.getImageInfo({
        src: that.data.src,
        success(res) {
          console.log(res)
          cfg.photo.path = res.path;
          var originalHeight = cfg.photo.originalHeight = res.height;
          var originalWidth = cfg.photo.originalWidth = res.width;
          if (originalHeight / originalWidth > canvasWrapper.height / canvasWrapper.width) {
            cfg.canvasHeight = parseInt(canvasWrapper.height);
            cfg.canvasWidth = parseInt(originalWidth * cfg.canvasHeight / originalHeight);
          } else {
            cfg.canvasWidth = parseInt(canvasWrapper.width);
            cfg.canvasHeight = parseInt(originalHeight * cfg.canvasWidth / originalWidth);
          }
          that.setData({
            canvasWidth: cfg.canvasWidth,
            canvasHeight: cfg.canvasHeight
          });
          console.log(cfg)
          that.drawImagescene()
        }
      })
    }).exec();
  },

  drawImagescene: function () {
    ctx.drawImage(this.data.src, 0, 0, cfg.canvasWidth, cfg.canvasHeight);
    ctx.draw();
  },

  processpic: function () {
    wx.canvasGetImageData({
      canvasId: 'myCanvas',
      x: 0,
      y: 0,
      width: cfg.canvasWrapperWidth,
      height: cfg.canvasWrapperHeight,
      success(res) {
        const data = convertToGrayscale(res.data)
        wx.canvasPutImageData({
          canvasId: 'myCanvas',
          data,
          x: 0,
          y: 0,
          width: cfg.canvasWrapperWidth,
          height: cfg.canvasWrapperHeight,
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

  handlepixel: function () {
    wx.canvasGetImageData({
      canvasId: 'myCanvas',
      x: 0,
      y: 0,
      width: cfg.canvasWrapperWidth,
      height: cfg.canvasWrapperHeight,
      success(res) {
        const data = handlecolor(res.data)
        wx.canvasPutImageData({
          canvasId: 'myCanvas',
          data,
          x: 0,
          y: 0,
          width: cfg.canvasWrapperWidth,
          height: cfg.canvasWrapperHeight,
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

  furtherprocess: function () {
    wx.canvasGetImageData({
      canvasId: 'myCanvas',
      x: 0,
      y: 0,
      width: cfg.canvasWrapperWidth,
      height: cfg.canvasWrapperHeight,
      success(res) {
        const data = cleanthephoto(res.data)
        wx.canvasPutImageData({
          canvasId: 'myCanvas',
          data,
          x: 0,
          y: 0,
          width: cfg.canvasWrapperWidth,
          height: cfg.canvasWrapperHeight,
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

  paintcanvas: function (event) {
    let pointx = event.detail.x
    let pointy = event.detail.y
    wx.canvasGetImageData({
      canvasId: 'myCanvas',
      x: 0,
      y: 0,
      width: cfg.canvasWrapperWidth,
      height: cfg.canvasWrapperHeight,
      success(res) {
        const data = fillcolor(res.data, pointx, pointy)
        wx.canvasPutImageData({
          canvasId: 'myCanvas',
          data,
          x: 0,
          y: 0,
          width: cfg.canvasWrapperWidth,
          height: cfg.canvasWrapperHeight,
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

  addphoto: function (event) {
    let pointx = event.detail.x
    let pointy = event.detail.y
    wx.canvasGetImageData({
      canvasId: 'myCanvas',
      x: 0,
      y: 0,
      width: cfg.canvasWrapperWidth,
      height: cfg.canvasWrapperHeight,
      success(res) {
        paintphoto(res.data, pointx, pointy)
      },
      fail: (err) => {
        console.error(err)
      }
    })
  },

  next: function () {
    const _this = this
    wx.navigateTo({
      url: '../canvas/index?photoPos=' + _this.data.src,
    })
  },

  onReady: function (e) {
    const _this = this
    wx.showLoading({
      title: '图片处理中……',
      mask: true,
      success() {
        // setTimeout(function () {
        //   _this.furtherprocess()
        //   _this.processpic()
        // }, 100)
      }
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },
})