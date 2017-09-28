// pages/shopExchange/shopExchange.js
var app = getApp();

Page({
  data: {
    jifen:"",
    hasJiFen:"",
    hasExchange:""
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
         sign:wx.getStorageSync("sign"),
         key:app.data.apiKey,
         type:"get-order-list"
       },
       success(res){
         console.log(res);
         let jifen = res.data.data.score_usable;
         let hasJiFen = res.data.data.score_total;
         let hasExchange = res.data.data.score_exchanged;
         let exchangeList = res.data.data.exchange_list;
         that.setData({
            jifen,
            hasJiFen,
            hasExchange,
            exchangeList
         });
         console.log(that.data)
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