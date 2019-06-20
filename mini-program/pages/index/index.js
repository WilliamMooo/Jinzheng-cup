//index.js
//获取应用实例
const app = getApp()
let originImage
import transferSrc from '../../utils/base64src.js'

Page({
  data:{
    src: null,
    first: true,
    tip: '开始制作吧！',
    disable: false
  },

  start: function () {
    const _this = this;
    wx.showActionSheet({
      itemList: ['从素材库中选择', '从相册选择'],
      success(res) {
        if (res.tapIndex) {
          _this.getPhoto();
        } else {
          wx.navigateTo({
            url: '../lib/index',
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  
  getPhoto: function () {
    const _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        _this.setData({
          disable: true,
          tip: "加载中……"
        })
        const tempFilePaths = res.tempFilePaths
        originImage = tempFilePaths[0]
        wx.uploadFile({
          url: 'https://jzb.deeract.com/api/photograph',
          filePath: tempFilePaths[0],
          name: 'image',
          success(res) {
            transferSrc(JSON.parse(res.data).img_dataurl).then(data => {
              _this.setData({ src: data })
            })
            if (!_this.data.first) _this.loadImg()
          }
        })
      }
    })
  },
  
  loadImg: function () {
    const _this = this
    _this.setData({
      disable: false,
      tip: "开始制作吧！",
      first: false
    })
    wx.navigateTo({
      url: '../preprocessing/index?photoPos=' + _this.data.src + '&originImage=' + originImage,
    })
  },
})
