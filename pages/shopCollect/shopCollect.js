// pages/shopCollect/shopCollect.js
var common = require('../../common.js');
var app = getApp();
Page({
  data: {
     
  },

  onLoad: function (options) {
  
  },

  onReady: function () {
  
  },

  onShow: function () {
    let that = this;
        wx.request({
          url:app.data.apiUrl,
          method:"POST",
          data:{
            sign: wx.getStorageSync("sign"),
            key:app.data.apiKey,
            type:"get-collect-list"
          },
          success(res){
             console.log(res)
            var shopList = res.data.data.collect_list;
            var pointCount = res.data.data.goods_list;
            that.setData({
              shopList:shopList,
              pointCount:pointCount
            });
          },
          fail(res){
            console.log(res);
          }
        })
  },

  // 加入收藏夹
  exchangeBtn(ev){
    let that = this;
    let kid = ev.currentTarget.dataset.id;
    console.log(kid)
    wx.request({
       url:app.data.apiUrl,
       method:"POST",
       data:{
         sign:wx.getStorageSync("sign"),
         key:app.data.apiKey,
         type:"save-collect-status",
         data:{
          kid:kid
         }
       },
       success(res){
         console.log(res)
       }
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