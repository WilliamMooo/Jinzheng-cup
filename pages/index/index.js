//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    src: '../../image/fire.png',
  },

  start: function () {
    var _this = this;
    wx.showActionSheet({
      itemList: ['从素材库中选择', '从相册选择'],
      success(res) {
        _this.setData({
          disable: true,
          tip: "加载中……"
        })
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
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://jzb.deeract.com/api/photograph',
          filePath: tempFilePaths[0],
          name: 'image',
          success(res) {
            let data = JSON.parse(res.data)
            _this.setData({
              src: data.img_dataurl
            })
          }
        })
        wx.navigateTo({
          url: '../canvasTest/index?photoPos=' + _this.data.src,
        })
      }
    })
  }
})
