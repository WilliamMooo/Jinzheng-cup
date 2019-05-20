var brr = [];
var crr = [];
var arr = [];
var deal = [];
const ctx = wx.createCanvasContext('myCanvas')

function searchedge(data, line) {

  let width = cfg.canvasWrapperWidth
  let height = cfg.canvasWrapperHeight
  // dir 0 => 上 1=> 右 2=> 下  3=> 左 
  let dir = 0
  let movex = [-1, 0, 1, 0]
  let movey = [0, -1, 0, 1]
  console.log(line[0])

  let current = 0
  while (true) {
    let point = line[current]
    let find = false
    for (let i = 0; i < 4; i++) {
      var newx = point.x + movex[(i + dir) % 4]
      var newy = point.y + movey[(i + dir) % 4]
      var newcount = newy * width + newx
      if (newx >= 0 && newx < width && newy >= 0 && newy < height && crr[newcount * 4]) {
        crr[newcount * 4] = false
        if (judgeEdage(data, newx, newy)) {
          dir = (dir + i + 3) % 4
          line.push({ x: newx, y: newy })
          break;
        }
      }
    }
    current++;
    if (current >= line.length) {
      console.log(line[current - 1])
      break;
    }
  }
  return line
}

function drawOutline(path, direction) {
  console.log(direction)
  let tmpPath = direction ? path : path.reverse()
  ctx.moveTo(tmpPath[0].x, tmpPath[0].y)
  for (let i = 1, length = tmpPath.length; i < length; i++)
    ctx.lineTo(tmpPath[i].x, tmpPath[i].y)
  // ctx.lineTo(tmpPath[0].x, tmpPath[0].y)
  return;
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

function judgeEdage(data, x, y) {
  let dirx = [-1, 0, 1, -1, 1, -1, 0, 1]
  let diry = [-1, -1, -1, 0, 0, 1, 1, 1]
  let preIndex = y * cfg.canvasWidth + x
  if (data[preIndex * 4] === 0 && data[preIndex * 4 + 1] === 0 && data[preIndex * 4 + 2] === 0)
    return false
  for (let i = 0; i < 8; i++) {
    let nextX = x + dirx[i];
    let nextY = y + diry[i];
    let index = nextY * cfg.canvasWidth + nextX
    if (nextX === 0 || nextY === 0 || nextX === cfg.canvasWidth - 1 || nextY === cfg.canvasHeight - 1)
      return true;
    if (data[index * 4] === 0 && data[index * 4 + 1] === 0 && data[index * 4 + 2] === 0)
      return true
  }
  return false
}

function paintphoto(data, x, y) {
  let width = cfg.canvasWidth
  let height = cfg.canvasHeight
  setbrr(data)
  setcrr(data)
  let dx = [1, 0, -1, 0]
  let dy = [0, -1, 0, 1]
  let allPath = []
  let xrr = [x]
  let yrr = [y]
  let count = y * width + x
  brr[count * 4] = false
  crr[count * 4] = false
  let head = 0, tail = 1;
  while (head < tail) {
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
          allPath.push(searchedge(data, [{ x: newx, y: newy }]))
        }
      }
    }
    head++
  }
  console.log(allPath)
  let maxPathLength = -1, maxPathPosi = -1
  for (let index = 0, length = allPath.length; index < length; index++)
    if (maxPathLength < allPath[index].length) {
      maxPathPosi = index;
      maxPathLength = allPath[index].length
    }

  ctx.save()
  ctx.beginPath()
  for (let index = 0, length = allPath.length; index < length; index++) {
    if (index === maxPathPosi)
      drawOutline(allPath[index], false)
    else
      drawOutline(allPath[index], true)
  }
  ctx.closePath()
  // ctx.setStrokeStyle('blue')
  // ctx.stroke()
  ctx.clip()
  // ctx.setFillStyle('blue')
  // ctx.fill()
  ctx.drawImage('../../image/pop.jpg', 0, 0)
  ctx.restore()
  ctx.draw(true)
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
      if (tail <= 120) {
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
    let { windowWidth } = wx.getSystemInfoSync()
    wx.getImageInfo({
      src: that.data.src,
      success(res) {
        console.log(res)
        cfg.photo.path = res.path;
        var originalHeight = cfg.photo.originalHeight = res.height;
        var originalWidth = cfg.photo.originalWidth = res.width;
        let rate = originalHeight / originalWidth
        cfg.canvasWidth = windowWidth
        cfg.canvasHeight = parseInt(windowWidth * rate)
        cfg.canvasWrapperWidth = cfg.canvasWidth
        cfg.canvasWrapperHeight = cfg.canvasHeight
        console.log(cfg)
        that.setData({
          canvasWidth: cfg.canvasWidth,
          canvasHeight: cfg.canvasHeight
        });
        that.drawImagescene()
      }
    })
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
      width: cfg.canvasWidth,
      height: cfg.canvasHeight,
      success(res) {
        const data = convertToGrayscale(res.data)
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
  },

  handlepixel: function () {
    wx.canvasGetImageData({
      canvasId: 'myCanvas',
      x: 0,
      y: 0,
      width: cfg.canvasWidth,
      height: cfg.canvasHeight,
      success(res) {
        const data = handlecolor(res.data)
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
  },

  furtherprocess: function () {
    wx.canvasGetImageData({
      canvasId: 'myCanvas',
      x: 0,
      y: 0,
      width: cfg.canvasWidth,
      height: cfg.canvasHeight,
      success: (res) =>  {
        const data = cleanthephoto(res.data)
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
        this.processpic()
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
  },

  addphoto: function (event) {
    let pointx = event.detail.x
    let pointy = event.detail.y
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
  },

  next: function () {
    const _this = this
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success(res) {
        const finalSrc = res.tempFilePath
        wx.navigateTo({
          url: '../canvas/index?photoPos=' + finalSrc,
        })
      }
    })
  },

  onReady: function (e) {
    const _this = this
    wx.showLoading({
      title: '图片处理中……',
      mask: true,
      success() {
        setTimeout(function () {
          _this.furtherprocess()
        }, 1000)
      }
    })
    setTimeout(function () {
      wx.hideLoading()
      _this.next()
    }, 2500)
  },

})