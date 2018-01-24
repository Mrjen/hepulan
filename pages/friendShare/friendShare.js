// pages/friendShare/friendShare.js
var app = getApp();
var common = require('../../common.js');
import { statistic, fromPageData } from '../../tunji'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userName:"",
    avatarUrl:"",
    danList:[],
    hashelp:false,
    danMu:[{
      persionName:"人物1",
      userImg:"../img/knowledge_icon_persion.png"
    },{
      persionName:"人物2",
      userImg:"../img/knowledge_icon_persion.png"
    },{
      persionName:"人物3",
      userImg:"../img/knowledge_icon_persion.png"
    },{
      persionName:"人物4",
      userImg:"../img/knowledge_icon_persion.png"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("打印friendshare页面参数");
    
    // 上报后台数据
    statistic();
    wx.setStorageSync('sence', options.scene) 

    // 渠道统计  一定要放在wx.setStorageSync('sence', options.scene) 之后
    fromPageData()

    console.log(options);
    console.log(options.sharecode,"分享人的sign");
    // let sharecode = "0be371dd1b62c87947fba665346b492a";
    let sharecode = options.sharecode;
    that.setData({
      pageSharecode:sharecode
    })
  },


  navTo:function(){
    var that = this;
    var avatarUrl = that.data.avatarUrl;
    var nickName = that.data.nickName;
     wx.switchTab({
      url: '../index/index'
    })
  },


  helpHe(){
    let that = this;
    let pageSharecode = that.data.pageSharecode;
    common.getSign(function(res){
       let http = {
          type:"save-zuli",
          data:{
            beizuli_sign:pageSharecode
          }
       }
       common.http(http,function(res){
           console.log(res);
           if(res.data.status==1){
            var danMu = res.data.beizuli_zuli_list;
            let score = that.data.score + 5;
                wx.showToast({
                  title: res.data.msg,
                  icon: 'success',
                  duration: 2000
                })
              that.setData({
                 helped:1,
                 danMu,
                 score
              })
           }
       })
    })
  },


     // 页面显示
   onShow(){
    let that = this;
    let pageSharecode = that.data.pageSharecode;
    common.getSign(function(res){
       let sign = res;
       console.log(sign,"sign")
       let http = {
          type:"get-zuli-list",
          data:{
             beizuli_sign:pageSharecode
          },
          sign:sign,
       }
       common.http(http,function(res){
           console.log(res,'0000');
           var danMu = res.data.beizuli_zuli_list;
           let avatarUrl = res.data.beizuli_headimgurl;
           let nickName = res.data.beizuli_nickname;
           let score = res.data.beizuli_usable_score;
           let get_score = res.data.beizuli_zuli_total_score;
           let today_helps = res.data.beizuli_zuli_today_count;
           let helped = res.data.is_zuli_today_log;
           
           for (var i = 0; i < danMu.length; i++) {
              danMu[i].topMargin = 10
           }
           // console.log(danMu,"danMu");
           var danList = [];
           var m = 0;
           var topM = that.data.topMargin;
           var j = 1;
           let time = setInterval(function(){
             if (m<danMu.length) {
               danMu[m].topMargin = danMu[m].topMargin*7*j;
               danList.push(danMu[m]);
               // console.log(danList);
               if (j>4) {
                 j=1;
               }
               m++;
               j++;
             }else{
               clearInterval(time);
             }
             console.log(danList)
             that.setData({
               danList,
               avatarUrl,
               nickName
             })
           },800)

           that.setData({
              score,
              get_score,
              today_helps,
              helped
           })
       })
    })

    // common.getSign(function(res){
    //    let sign = res.data.data.sign;
    //    let http = {
    //       type:"help-frends",
    //       sign:sign,
    //       data:{
    //         plus_score_sign:pageSharecode
    //       }
    //    }
    //    common.http(http,function(res){
    //        console.log(res)
    //    })
    // })
  },



  // helpHe:function(){
  //   var that = this;
  //   var pageSharecode = that.data.pageSharecode;
  //    console.log(this.data.userName);
  //    wx.login({
  //    success: function(res) {
  //      if (res.code) {
  //        //发起网络请求
  //        wx.request({
  //          url: "https://hepulan.playonwechat.com/site/auth?code="+res.code,
  //          data: {
  //            code: res.code
  //          },
  //          success:function(ress){
  //            var _sign = ress.data.data.sign;
  //            wx.getUserInfo({
  //               success: function(resx) {
  //                 console.log("打印用户信息--助力人的信息吧");
  //                 console.log(resx);
  //                 var userInfo = resx.userInfo;
  //                 var _nickName = userInfo.nickName;
  //                 var _avatarUrl = userInfo.avatarUrl;
  //                 var gender = userInfo.gender;
  //                 wx.request({
  //                   url: "https://hepulan.playonwechat.com/site/save-boost?sign="+_sign,
  //                   method:"POST",
  //                   data:{
  //                     // sharecode:"8c9016d2cdb7bae04c511a7c58d8dac2"
  //                     sharecode:pageSharecode
  //                   },
  //                   success:function(ressucceed){
  //                     //console.log(ressucceed);
  //                       var preCoins = ressucceed.data.data;
  //                       var coins =  that.data.coins+(+3);
  //                       var tadybootsts = that.data.tadybootsts+(+1);
  //                       var danList = that.data.danList;
  //                       console.log("danList push之前",danList);
  //                       danList.push({
  //                            avatarurl:_avatarUrl,
  //                            nickname:_nickName,
  //                            topMargin:10,
  //                         })
  //                       console.log("danList push之后",danList);
  //                       that.setData({
  //                         hashelp:true,
  //                         coins:coins,
  //                         danList:danList,
  //                         _nickName:_nickName,
  //                         _avatarUrl:_avatarUrl,
  //                         tadybootsts:tadybootsts
  //                       })
  //                     console.log("保存助力");
  //                   }
  //                 })
  //               }
  //             })
  //          }
  //        })
  //      } else {
  //        console.log('获取用户登录态失败！' + res.errMsg)
  //      }
  //    }
  //  });
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function () {
  //    var that = this;
  //    var username = app.data.username;
  //    var pageSharecode = that.data.pageSharecode;
  //    var sign = app.data.sign;
  //    console.log("打印助力人的sign",sign);
  //    console.log("被助力人的pageSharecode",pageSharecode);
  //    wx.request({
  //      url: "https://hepulan.playonwechat.com/site/get-boosts?sign="+sign,
  //      method:"GET",
  //      header: {
  //        'content-type': 'application/json'
  //      },
  //      data:{
  //       //  sharecode:"8c9016d2cdb7bae04c511a7c58d8dac2"
  //        sharecode:pageSharecode
  //      },
  //      success:function(res){
  //        console.log("onShow");
  //        console.log(res);
  //        var avatarUrl = res.data.data.avatarurl;
  //        var nickName = res.data.data.nickname;
  //        var coins = res.data.data.coins;
  //        var boosted = res.data.data.boosted;
  //        var tadybootsts = res.data.data.todayBoosts;
  //        var boostCoins = res.data.data.boostCoins;
  //        console.log(avatarUrl,nickName,tadybootsts,boostCoins);
  //        var danMu = res.data.data.list;
  //        for (var i = 0; i < danMu.length; i++) {
  //          danMu[i].topMargin = 10
  //        }
  //        console.log(danMu);
  //        if (boosted==0) {
  //          that.setData({
  //            hashelp:false
  //          })
  //        }else if (boosted==1) {
  //          that.setData({
  //            hashelp:true
  //          })
  //        }
  //       //  var danMu = [{
  //       //    persionName:"人物1人物1人物",
  //       //    userImg:"../img/knowledge_icon_persion.png",
  //       //    topMargin:10
  //       //  }];
  //        var danList = [];
  //        var m = 0;
  //        var topM = that.data.topMargin;
  //        var j = 1;
  //        var time = setInterval(function(){
  //              if (m<danMu.length) {
  //                  danMu[m].topMargin = danMu[m].topMargin*7*j;
  //                danList.push(danMu[m]);
  //                console.log(danList);
  //                if (j>4) {
  //                  j=1;
  //                  console.log("j==1");
  //                }
  //                m++;
  //                j++;
  //              }else{
  //                 clearInterval(time);
  //              }
  //             console.log(danList);
  //           that.setData({
  //                 danList:danList,
  //                 avatarUrl:avatarUrl,
  //                 userName:nickName,
  //                 coins:coins,
  //                 sign:sign,
  //                 tadybootsts:tadybootsts,
  //                 boostCoins:boostCoins
  //             })
  //        },800);
  //      }
  //    });
  //    that.setData({
  //     userName:username
  //   });
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
