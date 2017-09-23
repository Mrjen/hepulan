//index.js
//获取应用实例
var app = getApp();
var common = require('../../common.js');
var calendarSignData;
var date;
var calendarSignDay;
Page({
  data: {
    sign: "",
  },

  calendarSign: function(e) {
    var that = this;
    console.log(e);
    var formId = that.data.formId;
    var calendarSignData = wx.getStorageSync("calendarSignData");
    var calendarSignDay = wx.getStorageSync("calendarSignDay");
    calendarSignData[date] = date;
    calendarSignDay = calendarSignDay + 1;
    wx.request({
      url: 'https://hepulan.playonwechat.com/site/save-punch?sign=' + that.data.sign + '&v=1.1',
      method: "GET",
      data: {
        formId: formId
      },
      success: function(res) {
        console.log(res);
        var coins = res.data.data;
        that.setData({
          calendarSignData: calendarSignData,
          calendarSignDay: calendarSignDay
        })
      }
    });
  },

  formSubmit: function(e) {
    var that = this;
    that.setData({
      formId: e.detail.formId
    })
  },

  getCoins: function() {
    var that = this;
    var loginData = wx.getStorageSync("loginData") || [];
    var avatarUrl = wx.getStorageSync("avatarUrl") || [];
    var nickName = wx.getStorageSync("nickName") || [];
    // 获取金币
    wx.request({
      url: 'https://hepulan.playonwechat.com/site/get-coins?sign=' + that.data.sign + '&v=1.1',
      method: "GET",
      success: function(res) {
        var top = res.data.data.topIndex;
        var punch = res.data.data.continuePunch;
        var coins = res.data.data.coins;
        that.setData({
          "top": top,
          "punch": punch,
          "coins": coins,
          "avatar": avatarUrl,
          "nickname": nickName
        })
      }
    })
  },
  onLoad: function() {
    console.log(app.data);
    var loginData = wx.getStorageSync("loginData") || [];
    var calendarData = wx.getStorageSync("calendarSignData");
    var calendarDay = wx.getStorageSync("calendarSignDay");
    var that = this;
    that.setData({
      sign: app.data.sign
    })
    var mydate = new Date();
    var year = mydate.getFullYear();
    var month = mydate.getMonth() + 1;
    var date = mydate.getDate();
    var day = mydate.getDay();
    var localDate = [];
    var nbsp = 7 - ((date - day) % 7);
    if (nbsp == 7) nbsp = 0;
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

    calendarSignData = wx.getStorageSync("calendarSignData")
    calendarSignDay = wx.getStorageSync("calendarSignDay")
    // 获取近30天签到列表
    wx.request({
      url: 'https://hepulan.playonwechat.com/site/get-punchs?sign=' + that.data.sign + '&v=1.1',
      method: "GET",
      success: function(res) {
        // pass
        console.log(res);
        var signData = [];
        for (var i = 0; i < res.data.data.length; i++) {
          signData[i] = res.data.data[i].act_date.substring(8, 10);
        };
        console.log(signData); //签到天数数组
        console.log("今天日期:", date);
        console.log("本月签到数据:", signData); //整个月签到数据
        console.log(calendarDay); //当天签到数据
        that.setData({
          year: year,
          month: month,
          nbsp: nbsp,
          monthDaySize: monthDaySize,
          date: date,
          calendarSignData: signData, //整个月签到数据
          calendarSignDay: calendarDay //连续签到天数
        })
        console.log(that.data);
      }
    });
  },
  onShow: function() {
    var that = this;
    console.log(that.data);
    that.setData({
      sign: app.data.sign
    })
    this.getCoins();
  },
  // 返回首页
  backHome: function() {
    common.backHome();
  },

  // 分享海报
  toShare: function() {
    common.toShare();
  },
});
