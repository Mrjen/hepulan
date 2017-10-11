// pages/skinResultDetailGuide/skinResultDetailGuide.js
var app = getApp();
var common = require('../../common.js');
var mta= require('../../utils/mta_analysis.js');

Page({
  data: {
  
  },

  onLoad: function (options) {
  
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