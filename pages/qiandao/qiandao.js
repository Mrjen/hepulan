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
        adyAllday: 0,
        userInfo: [{
            avatarUrl: "",
            nickName: ""
        }],
        goldImg: [{
            id: 10,
            static: "none",
            imgsrc: '../img/gold10.gif',
        }, {
            id: 15,
            static: "none",
            imgsrc: 'https://hepulan.playonwechat.com//static/gold15.gif',
        }, {
            id: 20,
            static: "none",
            imgsrc: 'https://hepulan.playonwechat.com//static/gold20.gif',
        }, {
            id: 25,
            static: "none",
            imgsrc: 'https://hepulan.playonwechat.com//static/gold25.gif',
        }, {
            id: 30,
            static: "none",
            imgsrc: 'https://hepulan.playonwechat.com//static/gold30.gif',
        }, {
            id: 35,
            static: "none",
            imgsrc: 'https://hepulan.playonwechat.com//static/gold35.gif',
        }, {
            id: 40,
            static: "none",
            imgsrc: 'https://hepulan.playonwechat.com//static/gold40.gif',
        }]
    },

    toDiary() {
        wx.navigateTo({
            url: '../DiaryMark/DiaryMark'
        })
    },

    onLoad: function() {
        //wx.clearStorage();
        var that = this;

    },

    onShow: function(){
        var that = this;
        common.getSign(function(sign) {
            console.log("signsignsignsign",wx.getStorageSync("sign"));
            sign = wx.getStorageSync("sign")
            that.setData({
                sign
            })
            var mydate = new Date();
            var year = mydate.getFullYear();
            var month = mydate.getMonth() + 1;
            date = mydate.getDate();
            console.log("date" + date)
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
            // if (wx.getStorageSync("calendarSignData") == null || wx.getStorageSync("calendarSignData") == '') {
            //     wx.setStorageSync("calendarSignData", new Array(monthDaySize));
            // };
            // if (wx.getStorageSync("calendarSignDay") == null || wx.getStorageSync("calendarSignDay") == '') {
            //     wx.setStorageSync("calendarSignDay", 0);
            // }
            var calendarSignData = new Array(monthDaySize);
                for (var i = 0; i < calendarSignData.length; i++) {
                    calendarSignData[i] = null;
                }

            // 获取签到列表
            wx.request({
                url: app.data.apiUrl,
                method: "POST",
                data: {
                    key: app.data.apiKey,
                    sign: sign,
                    type: "get-punchs"
                },
                success: function(res) {
                    console.log(res)
                    console.log(calendarSignData);
                    console.log(calendarSignDay);
                    var dayindex = [];
                    var hasDaty = res.data.data;
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

    // 返回首页
    backHome: function() {
        common.backHome();
    },

    // 分享海报
    toShare: function() {
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