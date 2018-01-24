// pages/sharePage/sharePage.js
var common = require('../../common.js');
var app = getApp();
import { statistic, fromPageData } from '../../tunji'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signcode: app.data.signcode
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    // 上报后台数据
    statistic();
    wx.setStorageSync('sence', options.scene)

    // 渠道统计  一定要放在wx.setStorageSync('sence', options.scene) 之后
    fromPageData()

    if (options.sharecode) {
      console.log("options_data", options);
      console.log("appdata", app.data);
      var pageSharecode = options.sharecode; //页面带来的signcode
      // var pageSharecode = "701b71d9956a14d39cad86b31ac07578"; 
      that.setData({
        pageSharecode: pageSharecode
      })
    }
  },

  onShow(){
     let that = this;
     let avatarUrl = wx.getStorageSync("avatarUrl");
     let nickName = wx.getStorageSync("nickName");
     let http = {
        type:"get-my-usable-score",
     }
     common.http(http,function(res){
       console.log(res);
       let score = res.data.data.usable_score;
       that.setData({
         score,
         avatarUrl,
         nickName
       })
     })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  onShareAppMessage: function() {
    var that = this;
    var sharecode = wx.getStorageSync("sign");
    //console.log("我自己的sharecode", sharecode);
    return {
      title: '赶紧邀请好朋友来助力吧！',
      path: '/pages/friendShare/friendShare?sharecode=' + sharecode,
      success: function(res) {
        // 转发成功
        console.log("转发成功");
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败");
      },
      complete: function() {
        console.log("已转发");
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function() {
  //   var that = this;
  //   var avatarUrl = wx.getStorageSync("avatarUrl");
  //   var nickName = wx.getStorageSync("nickName");
  //   console.log(app.data);
  //   var sign = app.data.sign;
  //   var pageSharecode = that.data.pageSharecode;
  //   //console.log("分享人的pageSharecode",pageSharecode);
  //   if (pageSharecode) {
  //   console.log("onShow");
  //   if (!sign) {
  //     wx.login({
  //       success: function(res) {
  //         if (res.code) {
  //           //发起网络请求
  //           wx.request({
  //             url: "https://hepulan.playonwechat.com/site/auth?code=" + res.code,
  //             data: {
  //               code: res.code
  //             },
  //             success: function(res) {
  //               //console.log(res);
  //               var sharecode = app.data.sharecode;
  //               //console.log("本人sharecode",sharecode);
  //               that.setData({
  //                  sharecode:sharecode
  //               })
  //               wx.getUserInfo({
  //                 success: function(ress) {
  //                   console.log(ress);
  //                   var userInfo = ress.userInfo;
  //                   var nickName = userInfo.nickName;
  //                   var avatarUrl = userInfo.avatarUrl;
  //                   var gender = userInfo.gender;
  //                   var sign = app.data.sign;
  //                 //  console.log("用户信息",userInfo);
  //                   if (sharecode !== pageSharecode) {
  //                     //console.log("不是自己哈哈1，欢迎新人");
  //                     wx.redirectTo({
  //                       url: '../friendShare/friendShare?pageSharecode='+pageSharecode
  //                     });
  //                     wx.request({
  //                       url:'https://hepulan.playonwechat.com/site/get-boosts?sign='+sign + '&v=1.1',
  //                       data:{
  //                         sharecode:pageSharecode
  //                       },
  //                       success:function(resz){
  //                          //console.log("这里应该显示被助力的人物的信息",resz);
  //                          var nickname = resz.data.data.nickname;
  //                          var avatarurl = resz.data.data.avatarurl;
  //                          var coins = resz.data.data.coins;
  //                          var bootsted = resz.data.data.bootsted;
  //                          var taodyBoosts = resz.data.data.taodyBoosts;
  //                       }
  //                     })
  //                   }else {
  //                     //console.log("是用户自己进入分享页面");
  //                     //console.log("本人sharecode",sharecode);
  //                     wx.request({
  //                       url: 'https://hepulan.playonwechat.com/site/get-coins?sign=' + sign + '&v=1.1',
  //                       method: "GET",
  //                       success: function(res) {
  //                         console.log(res);
  //                         var coins = res.data.data.coins;
  //                         that.setData({
  //                           avatarUrl: avatarUrl,
  //                           nickName: nickName,
  //                           coins: coins
  //                         })
  //                       }
  //                     })
  //                   }
  //                 }
  //               })
  //             }
  //           })
  //         } else {
  //           console.log('获取用户登录态失败！' + res.errMsg)
  //         }
  //       }
  //     });
  //   }else{
  //     //console.log("有sign");
  //     var pageSharecode = that.data.pageSharecode;
  //     var sharecode = app.data.sharecode;
  //     //console.log("本人sharecode",sharecode);
  //     if (sharecode !== pageSharecode) {
  //       //console.log("不是自己哈哈2，欢迎新人");
  //       setTimeout(function(){
  //         wx.redirectTo({
  //           url: '../friendShare/friendShare?id=1'
  //         });
  //       },1000);
  //     }

  //   }
  // }else {
  //   // 自己助力别人
  //   console.log("页面加载用户自己的信息");
  //   wx.request({
  //     url: 'https://hepulan.playonwechat.com/site/get-coins?sign=' + sign + '&v=1.1',
  //     method: "GET",
  //     success: function(res) {
  //       console.log(res);
  //       var coins = res.data.data.coins;
  //       that.setData({
  //         avatarUrl: avatarUrl,
  //         nickName: nickName,
  //         coins: coins
  //       })
  //     }
  //   })
  // }
  // },



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
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

})
