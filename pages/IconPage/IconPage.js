// pages/IconPage/IconPage.js
var success = "https://qncdn.playonwechat.com/hupulan/iconpage/inon_page_success.png"
Page({
  data: {
     pageIcon:"",
     page_text:"您的订单已提交，请耐心等待，我们会为您尽快处理",
     pshr:2
  },

  onLoad: function (options) {
    var that = this;
    console.log("options",options);
      var _status = options.status;
      var main_url = options.main_url;
      var vice_url = options.vice_url;
      var page_text = options.page_text;
      if (_status=="1") {
        that.setData({
          pageIcon:success,
          page_text:page_text,
          main_url:main_url,
          vice_url:vice_url
        });
      }else {

      }
  },

// 回主页面
  MainUrl(ev){
    console.log(ev);
    var that = this;
    wx.redirectTo({
     url: that.data.main_url
    })
  },

  //回副页面
  viceUrl(ev){
    var that = this;
    wx.switchTab({
      url: that.data.vice_url
    })
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
