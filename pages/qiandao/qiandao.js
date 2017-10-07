//index.js
//获取应用实例
var common = require('../../common.js');
var app = getApp();
var calendarSignData;
var date;
var calendarSignDay;
Page({
  data: {
    sign: "",
    helpWin: false,
    goldWin: true,
    adyAllday:0,
    userInfo:[{
      avatarUrl: "",
      nickName: ""
    }],
    goldImg:[{
      id:10,
      static:"none",
      imgsrc:'../img/gold10.gif',
    },{
      id:15,
      static:"none",
      imgsrc:'https://hepulan.playonwechat.com//static/gold15.gif',
    },{
      id:20,
      static:"none",
      imgsrc:'https://hepulan.playonwechat.com//static/gold20.gif',
    },{
      id:25,
      static:"none",
      imgsrc:'https://hepulan.playonwechat.com//static/gold25.gif',
    },{
      id:30,
      static:"none",
      imgsrc:'https://hepulan.playonwechat.com//static/gold30.gif',
    },{
      id:35,
      static:"none",
      imgsrc:'https://hepulan.playonwechat.com//static/gold35.gif',
    },{
      id:40,
      static:"none",
      imgsrc:'https://hepulan.playonwechat.com//static/gold40.gif',
    }]
  },
  //签到
  formSubmit: function(e) {
    var that = this;
    var _formId = e.detail.formId;
    common.getSign(function(){
      console.log("formSubmit formId",_formId);
      var sign = app.data.sign;
      console.log("formId", _formId);
      console.log(calendarSignData);
      var calendarSignData = that.data.calendarSignData;
      calendarSignData[date] = date;
      var calendarSignDay = that.data.calendarSignDay;
      console.log(calendarSignData);
      calendarSignDay = calendarSignDay + 1;
      wx.request({
        url: app.data.apiUrl,
        method: "POST",
        data: {
          type:"save-punch",
          sign:sign,
          key:app.data.apiKey,
          data:{
            formId: _formId
          }
        },
        success: function(res) {
          console.log(res);
          wx.setStorageSync("calendarSignData", calendarSignData);
          wx.setStorageSync("calendarSignDay", calendarSignDay);
          var dayCoins = that.data.coins; //截止到签到签的所有金币
          var checkCoins = res.data.data; //签到获取金币数量
          var dayPunch = that.data.punch; //截止当天签到前连续签到总天数
          var adyAllday = that.data.adyAllday;
          var coins = dayCoins + checkCoins;
          var goldImg = that.data.goldImg;
          for (var i = 0; i < goldImg.length; i++) {
            if (checkCoins==goldImg[i].id) {
              goldImg[i].static = "block";
              that.setData({
                 goldImg:goldImg
              })
              var ind = i;
              setTimeout( function(){
                var goldImg = that.data.goldImg;
                goldImg[ind].static = "none";
                that.setData({
                   goldImg:goldImg
                })
              },1700);
            }
          }
          dayPunch = dayPunch + 1;
          adyAllday = parseInt(adyAllday) + 1;
          that.setData({
            calendarSignData: calendarSignData,
            calendarSignDay: calendarSignDay,
            checkCoins: checkCoins,
            goldWin: false,
            coins: coins,
            punch: dayPunch,
            adyAllday: adyAllday
          })
          setTimeout(function() {
            that.setData({
              goldWin: true
            })
          }, 1500)
        }
      });
    });
  },

  toDiary(){
     wx.navigateTo({
      url: '../DiaryMark/DiaryMark'
    })
  },

  onLoad: function() {
    //wx.clearStorage();
    var that = this;
    common.getSign(function(){
      var sign = app.data.sign;
      var mydate = new Date();
      var year = mydate.getFullYear();
      var month = mydate.getMonth() + 1;
      date = mydate.getDate();
      //console.log("date" + date)
      var day = mydate.getDay();
    //  console.log(day)
      var nbsp;
      if ((date - day) <= 0) {
        nbsp = day - date + 1;
      } else {
        nbsp = 7 - ((date - day) % 7) + 1;
      }
      var monthDaySize;
      if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
        monthDaySize = 31;
      } else if (month == 4 || month == 6 || month == 9 || month == 11) {
        monthDaySize = 30;
      } else if (month == 2) {
        // 计算是否是闰年,如果是二月份则是29天
        if ((year - 2000) % 4 == 0) {
          monthDaySize = 29;
        } else {
          monthDaySize = 28;
        }
      };
      // 判断是否签到过
      if (wx.getStorageSync("calendarSignData") == null || wx.getStorageSync("calendarSignData") == '') {
        wx.setStorageSync("calendarSignData", new Array(monthDaySize));
      };
      if (wx.getStorageSync("calendarSignDay") == null || wx.getStorageSync("calendarSignDay") == '') {
        wx.setStorageSync("calendarSignDay", 0);
      }
      var calendarSignData = wx.getStorageSync("calendarSignData");
      // 获取签到列表
      wx.request({
        url: app.data.apiUrl,
        method: "POST",
        data:{
          key:app.data.apiKey,
          sign:sign,
          type:"get-punchs"
        },
        success: function(res) {
          console.log(res)
          console.log(calendarSignData);
          console.log(calendarSignDay);
          var dayindex = [];
          var hasDaty = res.data.data;
          var dat = wx.getStorageSync("calendarSignData");
          console.log(dat)
          console.log(hasDaty);
          for (var i = 0; i < hasDaty.length; i++) {
            dayindex[i] = hasDaty[i].split("-");
            dayindex[i] = dayindex[i][2];
            var idx = parseInt(dayindex[i]);
            calendarSignData[idx] = idx;
          }
          that.setData({
            sign: sign,
            year: year,
            month: month,
            nbsp: nbsp,
            monthDaySize: monthDaySize,
            date: date,
            calendarSignData: calendarSignData,
            calendarSignDay: calendarSignDay
          })
        }
      })
    })

  },

  onShow: function() {
    var that = this;
    common.getSign(function(){
      var sign = app.data.sign;
      var avatarUrl = wx.getStorageSync("avatarUrl");
      var nickName = wx.getStorageSync("nickName");
      if(avatarUrl&&nickName){
        var userInfo = {
	        avatarUrl: avatarUrl,
	        nickName: nickName
	      };
        that.setData({
	        userInfo: [userInfo]
	      });
        console.log("that.data",that.data);
      }



    

      // 获取金币
      // wx.request({
      //   url: 'https://hepulan.playonwechat.com/site/get-coins?sign=' + sign + '&v=1.1',
      //   method: "GET",
      //   success: function(res) {
      //     console.log(res);
      //     var top = res.data.data.topIndex;
      //     var punch = res.data.data.continuePunch; //连续签到天数
      //     var coins = res.data.data.coins;
      //     var adyAllday = res.data.data.totalPunch; //总签到天数
      //     that.setData({
      //       "top": top,
      //       "punch": punch,
      //       "coins": coins,
      //       "avatar": avatarUrl,
      //       "nickname": nickName,
      //       "adyAllday": adyAllday
      //     })
      //     //console.log(that.data);
      //   }
      // })
    })
  },
  
  // 用户主动授权
  toAuth: function() {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        console.log(res);
        var userInfo = res.userInfo;
        console.log(userInfo);
        var nickName = userInfo.nickName;
        var avatarUrl = userInfo.avatarUrl;
        var gender = userInfo.gender; //性别 0：未知、1：男、2：女
        var province = userInfo.province;
        var city = userInfo.city;
        var country = userInfo.country;
        var userData = {
          nickName: nickName,
          avatarUrl: avatarUrl,
          gender: gender,
          province: province,
          city: city,
          country: country
        };
        wx.request({
          url:api.data.apiUrl,
          method:'POST',
          data:{
            info:userData
          },
          success:function(res){
            console.log("用户信息保存成功",res);
            wx.setStorageSync('avatarUrl', avatarUrl);
            wx.setStorageSync('nickName', nickName);
            that.setData({
              userInfo:[userInfo]
            });
            console.log(that.data);
            app.globalData.userInfo = userInfo;
            console.log(app.globalData);
          }
        })
      },
      fail:function(){
         console.log("获取授权失败");
         wx.showModal({
            title: '提示',
            content: '系统检测您没打开禾葡兰的用户信息权限，是否去设置打开？',
            success: function(res) {
              if (res.confirm) {
                wx.openSetting({
                      success: (res) => {
                        console.log(res);
                        if (res.authSetting['scope.userInfo']) {
                            console.log("用户授权成功");
                            wx.getUserInfo({
                              success: function(res) {
                               console.log("用户信息",res);
                                var userInfo = res.userInfo;
                                var nickName = userInfo.nickName;
                                var avatarUrl = userInfo.avatarUrl;
                                var gender = userInfo.gender; //性别 0：未知、1：男、2：女
                                var province = userInfo.province;
                                var city = userInfo.city;
                                var country = userInfo.country;
                               var userData = {
                                 nickName: nickName,
                                 avatarUrl: avatarUrl,
                                 gender: gender,
                                 province: province,
                                 city: city,
                                 country: country
                               };
                               wx.request({
                                 url:'https://hepulan.playonwechat.com/site/save-user-info?sign='+app.data.sign,
                                 method:'POST',
                                 data:{
                                   info:userData
                                 },
                                 success:function(res){
                                    console.log("用户信息保存成功",res);
                                   wx.setStorageSync('avatarUrl', avatarUrl);
                                   wx.setStorageSync('nickName', nickName);
                                   that.setData({
                                      userInfo:[userInfo]
                                   });
                                   app.globalData.userInfo = userInfo;
                                 }
                               })
                              }
                            })
                        }
                      }
                    })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
      }
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

  // 弹窗
  helpCoins: function() {
    var that = this;
    that.setData({
      helpWin: true
    })
  },

  close_help: function() {
    var that = this;
    that.setData({
      helpWin: false
    })
  }

})
