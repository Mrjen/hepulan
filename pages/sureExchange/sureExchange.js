// pages/sureExchange/sureExchange.js
Page({
  data: {
    address:true,

  },

  onLoad: function (options) {

  },

  onReady: function () {

  },

  onShow: function () {

  },

// 选择地址
selectAddress(){
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
        that.setData({
          address:false,
          addressInfo:res
        });
      }
    })
  },

  // 提交地址
  submitAddress(){
    var that = this;
    var addressInfo = that.data.addressInfo;

    var main_url = "../pointMall/pointMall";
    var vice_url = "../mine/mine";
    var page_text = "您的订单已提交，请耐心等待，我们会为您尽快处理"

    wx.redirectTo({
      url: '../IconPage/IconPage?status=1'+"&main_url="+main_url+"&page_text="+page_text+"&vice_url="+vice_url
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
