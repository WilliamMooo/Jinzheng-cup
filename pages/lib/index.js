// pages/lib/index.js
Page({
  data: {
    imagecollection:['../../image/background2.png','../../image/blackbutton.png','../../image/fire.png'],
    imagesetsize:2,
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
    console.log(this.data.imagecollection[this.data.a])
  },

  rightview:function(){
    var b= this.data.a + 1
    if(b>(this.data.imagesetsize-1))
    {
      b = 0
    }
    this.setData({ a: b })
  },

  OnTouchGo:function(){
    let photoPath = this.data.imagecollection[this.data.a]
    console.log(photoPath)
    wx.request({
      url: 'https://jzb.deeract.com/api/photograph',
      data: { 'img_dataurl': photoPath },
      header: { 'content-type': 'multipart/form-data' },
      success(res) {
        console.log(res.data)
      }
    })
    // wx.navigateTo({
    //   url: '../canvasTest/index?photoPos=' + photoPath,
    // })
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    let _this = this;
    wx.request({
      url: 'https://jzb.deeract.com/api/gallery',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success(res) {
        _this.setData({
          imagecollection: res.data
        })
        console.log(res.data)
      }
    })
  },
})