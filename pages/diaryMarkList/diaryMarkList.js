// pages/diaryMarkList/diaryMarkList.js
var common = require('../../common.js');
var app = getApp();
import { statistic } from '../../tunji'
Page({
  data: {
     start:0
  },

  onLoad: function (options) {
    // 上报后台数据
    statistic();
    wx.setStorageSync('sence', options.scene) 
  },

  onReady: function () {
  
  },

  onShow: function () {
     let that = this;
     let start = 0;
     let avatarUrl = wx.getStorageSync("avatarUrl");
     that.setData({
       avatarUrl
     });
     let http = {
        type:"get-punchs-all",
        data:{
          start:0,
          legth:10
        }
     }
     common.http(http,function(res){
        console.log(res)
        let signin_list = res.data.data.signin_list;
            for (let i = 0; i < signin_list.length; i++) {
              for (let j = 0; j < signin_list[i].images.length;j++) {
                signin_list[i].images[j].url = `${signin_list[i].images[j].url_prefix}${signin_list[i].images[j].url}`
              } 
            };
        start+=10;
        console.log(signin_list)
        that.setData({
           signin_list,
            start,
           signin_text:res.data.data.signin_text
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
    let that = this;
    let start = that.data.start;
     let http = {
        type:"get-punchs-all",
        data:{
          start:start,
          legth:10
        }
     }
     common.http(http,function(res){
        console.log(res)
        let signin_list = res.data.data.signin_list;
        let oldData = that.data.signin_list;
        if (signin_list.length>0) {
            for (let i = 0; i < signin_list.length; i++) {
              for (let j = 0; j < signin_list[i].images.length;j++) {
                signin_list[i].images[j].url = `${signin_list[i].images[j].url_prefix}${signin_list[i].images[j].url}`
              } 
            }
        start+=10;
        signin_list = oldData.concat(signin_list);
      }else{
         signin_list = oldData;
         wx.showToast({
            title: '没有更多数据',
            icon: 'success',
            duration: 2000
          })
      }
        that.setData({
           signin_list,
           start,
           signin_text:res.data.data.signin_text
        })

     })
  },

  onShareAppMessage: function () {
  
  }
})