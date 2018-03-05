var common = require('../../common.js');
import { statistic, fromPageData } from '../../tunji'
Page({
  data: {
    "goldnote": [{
      "goldnote_month": "5",
      "goldnote_day": "6",
      "goldnote_minute": "1:24",
      "goldnote_report": "+5",
      "goldnote_from": "签到"
    }, {
      "goldnote_month": "4",
      "goldnote_day": "6",
      "goldnote_minute": "1:24",
      "goldnote_report": "+5",
      "goldnote_from": "签到"
    }, {
      "goldnote_month": "3",
      "goldnote_day": "25",
      "goldnote_minute": "12:34",
      "goldnote_report": "+18",
      "goldnote_from": "积分"
    }]
  },
  onLoad: function(options) {
    // Do some initialize when page load.
    // 上报后台数据
    statistic();
    wx.setStorageSync('scene', options.scene) 

    // 渠道统计  一定要放在wx.setStorageSync('scene', options.scene) 之后
    fromPageData()

    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onReady: function() {
    // Do something when page ready.
  },
  onShow: function() {
    // Do something when page show.
  },
  // 返回首页
  backHome: function() {
    common.backHome();
  },

  // 分享海报
  toShare: function() {
    common.toShare();
  },
  onHide: function() {
    // Do something when page hide.
  },
  onUnload: function() {
    // Do something when page close.
  },
  onPullDownRefresh: function() {
    // Do something when pull down.
  },
  onReachBottom: function() {
    // Do something when page reach bottom.
  },
  onShareAppMessage: function() {
    // return custom share data when user share.
  }
})
