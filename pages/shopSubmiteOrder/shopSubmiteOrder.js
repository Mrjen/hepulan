// pages/shopSubmiteOrder/shopSubmiteOrder.js
Page({
  data: {
  
  },

  onLoad: function (options) {
     console.log(options);
     let that = this;
     if (options.address&&options.name&&options.phone) {
         let info = {
            address:options.address,
            name:options.name,
            phone:options.phone
         }
         that.setData({
             info
         })
     }
  },

  onReady: function () {
  
  },

  onShow: function () {
  
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