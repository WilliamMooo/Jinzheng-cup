// pages/lib/index.js
import transferSrc from '../../utils/base64src.js'

Page({
  data: {
    imagecollection:['../../image/background2.png','../../image/blackbutton.png','../../image/fire.png'],
    imagesetsize:2,
    a:0,
    src:'',
    first: true
  },

  leftview:function(){
    var b = this.data.a - 1
    if(b<0)
    {
      b = this.data.imagesetsize - 1
    }
    this.setData({a:b})
  },

  rightview:function(){
    var b= this.data.a + 1
    if(b>(this.data.imagesetsize-1))
    {
      b = 0
    }
    this.setData({ a: b })
  },

  next:function() {
    const _this = this;
    const photoPath = _this.data.imagecollection[this.data.a]
    wx.request({
      url: 'https://jzb.deeract.com/api/photograph',
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: {
        'name': 'image',
        'image_url': photoPath
      },
      success(res) {
        transferSrc(res.data.img_dataurl).then( data =>  {
          _this.setData({ src: data })
        })
      }
    })
    if(!_this.data.first) _this.loadImg()
  },

  loadImg: function() {
    const _this = this
    _this.data.first = false
    wx.navigateTo({
      url: '../preprocessing/index?photoPos=' + _this.data.src,
    })
  },

  

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    let _this = this;
    wx.request({
      url: 'https://jzb.deeract.com/api/gallery',
      header: { 'content-type': 'application/json' },
      method: 'GET',
      success(res) {
        _this.setData({
          imagecollection: res.data,
          imagesetsize: res.data.length,
        })
      }
    })
  },
})