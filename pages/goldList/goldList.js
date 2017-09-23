// pages/goldList/goldList.js
var common = require('../../common.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      navData:[{
         url:"../goldstore/goldstore",
         src:"https://hepulan.playonwechat.com/static/goldstore_img1.png",

      },{
         url:"../goldstore/goldstore",
         src:"https://hepulan.playonwechat.com/static/goldstore_img2.png",

      },{
         url:"../goldstore/goldstore",
         src:"https://hepulan.playonwechat.com/static/goldstore_img3.png",
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url:'https://hepulan.playonwechat.com/site/get-cat-products?sign='+app.data.sign,
      data:{
        page:1
      },
      header: {
         'content-type': 'application/json'
       },
      success:function(res){
        console.log(res);
        that.setData({
           navData:res.data.data
        });
         console.log(that.data.navData);
      }
    })

  },

  checkTo:function(ev){
  //    console.log(ev);
      var that = this;
      var navData =  that.data.navData;
      var idx = ev.currentTarget.dataset.idx;
      var pageData = navData[idx].products;
      console.log(pageData);
      for (var i = 0; i < pageData.length; i++) {
        var imgurl = pageData[i].img.split(",");
        console.log(imgurl);
        pageData[i].img = imgurl;
        console.log(pageData);
      }
      wx.navigateTo({
        url:'../goldstore/goldstore?pageData='+JSON.stringify(pageData),
      })
  },

  // 返回首页
    backHome:function(){
       common.backHome();
    },

  // 分享海报
    toShare:function(){
      common.toShare();
    },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
