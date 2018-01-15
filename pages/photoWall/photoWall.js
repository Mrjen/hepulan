const app = getApp();
var mta = require('../../utils/mta_analysis.js');
import { statistic } from '../../tunji'
Page({
  data: {
    poster:'http://ovhvevt35.bkt.clouddn.com/photo/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20180105171204.png',
    canshu:null
  },
  onLoad: function (options) {
    // 初始化腾讯统计
    mta.Page.init();
    
    // 上报后台数据
    statistic();
    wx.setStorageSync('sence', options.scene) 

    let poster = options.poster;  
    let canshu = options.photowall;
    this.setData({
      poster: poster,
      canshu: canshu
    })
  },

  // 统计点击次数
  potowall(){
    mta.Event.stat("photowall", {})
    this.setData({
      canshu:null
    })
  },

  onShow: function () {
    if (!this.data.canshu){
      wx.switchTab({
        url: '../index/index'
      })
    }
  }

})