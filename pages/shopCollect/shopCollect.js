// pages/shopCollect/shopCollect.js
var common = require('../../common.js')
Page({
  data: {
     
  },

  onLoad: function (options) {
  
  },

  onReady: function () {
  
  },

  onShow: function () {
    let that = this;
     common.getVipId(18372668568,function(){
        var vip_id = wx.getStorageSync("vip_id");
        console.log(vip_id);
        wx.request({
          url:'https://api.hepulanerp.com/hpl/index.php?s=/Api/hfzx/index',
          method:"POST",
          header: {
              'content-type': 'application/json'
          },
          data:{
            key:"be15d4ca913c91494cb4f9cd6ce317c6",
            type:"getUsableExchangeList",
            data:{
              start:0,
              length:10,
              vip_id:vip_id
            }
          },
          success(res){
            var shopList = res.data.data.exchange_list;
            var pointCount = res.data.data.usable_score;
            that.setData({
              shopList:shopList,
              vip_id:vip_id,
              pointCount:pointCount
            });
          },
          fail(res){
            console.log(res);
          }
        })
    });
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