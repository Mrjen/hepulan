//index.js
//获取应用实例
let common = require('../../common.js');
let app = getApp();
let calendarSignData;
let date;
let calendarSignDay;
import { statistic } from '../../tunji'
Page({
    data: {
        sign: "",
        helpWin: false,
        goldWin: true,
        dayCheckIn: "",
        scoreImg:"",
        goldImg: [{
          score:2,
          img:"https://qncdn.playonwechat.com/hepulan/check_in2.png"
        },{
          score:4,
          img:"https://qncdn.playonwechat.com/hepulan/check_in4.png"
        },{
          score:6,
          img:"https://qncdn.playonwechat.com/hepulan/check_in6.png"
        },{
          score:8,
          img:"https://qncdn.playonwechat.com/hepulan/check_in8.png"
        },{
          score:10,
          img:"https://qncdn.playonwechat.com/hepulan/check_in10.png"
        }]
    },

    //签到
    formSubmit: function(e) {
        let that = this;
        let _formId = e.detail.formId;
        console.log("formSubmit formId", _formId);
        //console.log("签名"+sign);
        console.log("formId", _formId);

        wx.request({
            url: app.data.apiUrl,
            method: "POST",
            data: {
                sign: wx.getStorageSync("sign"),
                type: "save-app-signin",
                key: app.data.apiKey,
                data: {
                    form_id: _formId
                }
            },
            success: function(res) {
                console.log(res);
                if (res.data.status === 1) {
                    let score = res.data.data.score;
                    let hasDaty = res.data.data.signin_list;  //签到列表
                    let goldImg = that.data.goldImg;
                    let dayCheckIn = res.data.data.is_signin;
                    let scoreImg = "";
                    let dayindex = [];
                    let punch = res.data.data.sign_keep; //连续签到天数
                    let coins = res.data.data.usable_score;
                    let allday = res.data.data.sign_total; //总签到天数
                    let calendarSignData = that.data.calendarSignData;
                    for (let i = 0; i < goldImg.length; i++) {
                       if (score==goldImg[i].score) {
                           scoreImg = goldImg[i].img;
                       }
                    }
                    for (let i = 0; i < hasDaty.length; i++) {
                        dayindex[i] = hasDaty[i].split("-");
                        dayindex[i] = dayindex[i][2];
                        let idx = parseInt(dayindex[i]);
                        calendarSignData[idx] = idx;
                    }

                    that.setData({
                        goldWin: false,
                        coins,
                        punch,
                        allday,
                        scoreImg,
                        dayCheckIn,
                        calendarSignData
                    })

                }else{         
                   wx.showToast({
                      title: res.data.msg,
                      icon: 'success',
                      duration: 2000
                    })
                }
            }
        });
    },

    // 关闭弹窗
    closeGold(){
       this.setData({
          goldWin:true
       })
    },

    onLoad: function (options) {
        //wx.clearStorage();
        let that = this;
        
        // 上报后台数据
        statistic();
        wx.setStorageSync('sence', options.scene) 

        //console.log('sign:'+sign);
        let mydate = new Date();
        let year = mydate.getFullYear();
        let month = mydate.getMonth() + 1;
        date = mydate.getDate();
        //console.log("date" + date)
        let day = mydate.getDay();
        //  console.log(day)
        let nbsp;
        if ((date - day) <= 0) {
            nbsp = day - date + 1;
        } else {
            nbsp = 7 - ((date - day) % 7) + 1;
        }
        let monthDaySize;
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

        let calendarSignData = new Array(monthDaySize);
    
        for (let i = 0; i < calendarSignData.length; i++) {
            calendarSignData[i] = null;
        }
        console.log(calendarSignData);
        that.setData({
            calendarSignData
        })

        // 获取签到列表
        common.getSign(function() {
            wx.request({
                url: app.data.apiUrl,
                method: "POST",
                data: {
                    sign: wx.getStorageSync('sign'),
                    key: app.data.apiKey,
                    type: "get-app-signin-list"
                },
                success: function(res) {
                    console.log(res);
                    let dayindex = [];
                    let hasDaty = res.data.data.sign_list;
                    let dayCheckIn = res.data.data.is_signin;
                    console.log(hasDaty);
                    for (let i = 0; i < hasDaty.length; i++) {
                        dayindex[i] = hasDaty[i].split("-");
                        dayindex[i] = dayindex[i][2];
                        let idx = parseInt(dayindex[i]);
                        calendarSignData[idx] = idx;
                    }
                    console.log(calendarSignData);
                    console.log(calendarSignDay);
                    that.setData({
                        year,
                        month,
                        nbsp,
                        monthDaySize,
                        date,
                        dayCheckIn,
                        calendarSignData,
                        calendarSignDay
                    })
                }
            })
        })
    },

    onShow: function() {
        let that = this;
        common.getSign(function() {
            let sign = wx.getStorageSync("sign");
            let avatarUrl = wx.getStorageSync("avatarUrl") || [];
            let nickName = wx.getStorageSync("nickName") || [];
            // 获取金币
            wx.request({
                url: app.data.apiUrl,
                method: "POST",
                data: {
                    sign: wx.getStorageSync('sign'),
                    key: app.data.apiKey,
                    type: "get-app-signin-list"
                },
                success: function(res) {
                    console.log(res);
                    let punch = res.data.data.sign_keep; //连续签到天数
                    let coins = res.data.data.usable_score;
                    let allday = res.data.data.sign_total; //总签到天数
                    console.log("连续签到天数", punch);
                    console.log("总签到天数", allday);
                    that.setData({
                        "punch": punch,
                        "coins": coins,
                        "avatar": avatarUrl,
                        "nickname": nickName,
                        "allday": allday
                    })
                }
            })
        });
    },

    // 返回首页
    backHome: function() {
        common.backHome();
    },

    // 分享海报
    toShare: function() {
        common.toShare();
    },

    // 弹窗金币数说明
    helpCoins: function() {
        let that = this;
    }

})