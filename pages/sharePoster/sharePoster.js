// pages/sharePoster/sharePoster.js
var common = require('../../common.js');
import { statistic, fromPageData } from '../../tunji'
Page({

// 页面的初始数据
  data: {

  },

// 生命周期函数--监听页面加载
  onLoad: function (options) {
    // 上报后台数据
    statistic();
    wx.setStorageSync('sence', options.scene)

    // 渠道统计  一定要放在wx.setStorageSync('sence', options.scene) 之后
    fromPageData()
  },

// 预览海报
  prewImg:function(){
       wx.previewImage({
         current: 'https://hepulan.playonwechat.com/static/hepulan_poster.png', // 当前显示图片的http链接
         urls: ['https://hepulan.playonwechat.com/static/hepulan_poster.png'] // 需要预览的图片http链接列表
      })
  },

// 海报下载
  downLoad:function(){
    wx.downloadFile({
      url: 'https://hepulan.playonwechat.com/static/hepulan_poster.png', //仅为示例，并非真实的资源
     success: function(res) {
       //console.log(res);
        wx.saveImageToPhotosAlbum({
          filePath:res.tempFilePath,
          success(res) {
            console.log(res);
            wx.showToast({
              title: '海报下载成功，请去相册查看',
              icon: 'success',
              duration: 800
            })
         }
        })
     }
    })
  },

// 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },

// 生命周期函数--监听页面显示
  onShow: function () {

  },

  // 返回首页
    backHome:function(){
       common.backHome();
    },

  // 分享海报
    toShare:function(){
      common.toShare();
    },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
