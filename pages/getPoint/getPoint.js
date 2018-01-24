// pages/getPoint/getPoint.js
import { statistic, fromPageData } from '../../tunji'
Page({
  data: {
    imgUrls: [
      'https://qncdn.playonwechat.com/hepulan/getpoint1.png',
      'https://qncdn.playonwechat.com/hepulan/getpoint2.png',
      'https://qncdn.playonwechat.com/hepulan/getpoint3.png',
      'https://qncdn.playonwechat.com/hepulan/getpoint4.png',
      'https://qncdn.playonwechat.com/hepulan/getpoint5.png',
      'https://qncdn.playonwechat.com/hepulan/getpoint6.png',
      'https://qncdn.playonwechat.com/hepulan/getpoint7.png',
    ]
  
  },

  onLoad: function (options) {
   
    // 上报后台数据
    statistic();
    wx.setStorageSync('sence', options.scene) 

    // 渠道统计  一定要放在wx.setStorageSync('sence', options.scene) 之后
    fromPageData()

    let e = Math.random();
    let that = this;
    console.log(e);
    let imgUrls = that.data.imgUrls;
    console.log(imgUrls)
    for (var i = 0; i < imgUrls.length; i++) {
      imgUrls[i] = `${imgUrls[i]}?${e}`
    }
    that.setData({
      imgUrls
    })
  },

  onReady: function () {
  
  },

  onShow: function () {
  
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {
  
  }
})