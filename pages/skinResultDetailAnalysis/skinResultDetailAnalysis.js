// pages/skinResultDetail/skinResultDetail.js;
var app = getApp();
var common = require('../../common.js');
var mta= require('../../utils/mta_analysis.js');
import { statistic, fromPageData } from '../../tunji'
Page({
  data: {
  
  },

  onLoad: function (options) {
      // 上报后台数据
      statistic();
      wx.setStorageSync('sence', options.scene)

      // 渠道统计  一定要放在wx.setStorageSync('sence', options.scene) 之后
      fromPageData()
  },

  onReady: function () {
  
  },

  onShow: function () {
     let that = this;
        let http = {
            type:"get-skintest-result"
        };
        common.http(http,function(res){
            console.log(res);
            that.setData({
                skin_arr:res.data.data.skin_arr
            })
        })
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