// pages/lib/index.js
Page({
  data: {
    imagecollection:['../../image/background2.png','../../image/blackbutton.png','../../image/fire.png'],
    imagesetsize:3,
    a:0,
    test:''
  },

  leftview:function(){
    var b = this.data.a - 1
    if(b<0)
    {
      b = this.data.imagesetsize - 1
    }
    this.setData({a:b})
    console.log(this.data.a)
  },

  rightview:function(){
    var b= this.data.a + 1
    if(b>(this.data.imagesetsize-1))
    {
      b = 0
    }
    this.setData({ a: b })
    console.log(this.data.a)
  },

  OnTouchGo:function(){
    wx.navigateTo({
      url: '/pages/canvasTest/index',
    })
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    let _this = this;
    wx.request({
      url: 'https://jzb.deeract.com/gallery',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'GET',
      success(data) {
        _this.setData({
          test: data
        })
        console.log(data)
      }
    })
  },
})