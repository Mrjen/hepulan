// pages/webContact/WebContact.js
import { statistic, fromPageData } from '../../tunji'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var form_id = wx.getStorageSync('form_id');
    
    // 上报后台数据
    statistic();
    wx.setStorageSync('sence', options.scene)

    // 渠道统计  一定要放在wx.setStorageSync('sence', options.scene) 之后
    fromPageData()

    console.log(form_id);
     this.setData({
      webUrl:`https://hpchat.playonwechat.com/index/index/mobile/?id=${wx.getStorageSync('user_id')}&formid=${options.teacher_id?'0':form_id}&teacher_id=${options.teacher_id || 0 }`
     })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!wx.canIUse('web-view')) {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
          wx.showModal({
              title: '提示',
              content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
      }
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