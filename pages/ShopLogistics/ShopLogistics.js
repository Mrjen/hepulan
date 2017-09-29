// pages/ShopLogistics/ShopLogistics.js
var app = getApp();

Page({
  data: {
  
  },

  onLoad: function (options) {
      let that = this;
      let order_num = options.order_num;
      console.log(order_num)
      that.setData({
         order_num
      })
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
        type:"get-order-detail",
        data:{
           order_num:that.data.order_num
        }
      },
      success(res){
        console.log(res)
        
        let info = res.data.data.address;
        let exchange_infos = res.data.data.exchange_infos;
        for (var i = 0; i < exchange_infos.length; i++) {
          exchange_infos[i].img = `${exchange_infos[i].url_prefix}${exchange_infos[i].imgurl}`
        }
        that.setData({
          info,
          exchange_infos,
          express_com:res.data.data.express_com,
          express_num:res.data.data.express_num,
          express_list:res.data.data.express_list,
          cart_select_sum:res.data.data.cart_select_sum
        })
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