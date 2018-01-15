// pages/login/login.js
var app = getApp();
var common = require('../../common');
import { statistic } from '../../tunji'
Page({
    data: {
        inputValue: '',
        second: 60,
        pagePath: "",
        verifyCode: "",
        addImgDis: "none",
        addGoldImg: "",
        date: ["1990-01-01"],
        phoneNumber: "",
        code1: true,
        code2: false,
        register_type: 1
    },

    onLoad: function(options) {
        var that = this;
        // 页面初始化 options为页面跳转所带来的参数

        // 上报后台数据
        statistic();
        wx.setStorageSync('sence', options.scene) 

        wx.showShareMenu({
            withShareTicket: true
        })

        console.log(options);
        var pagePath = options.pagePath;
        var page = options.pages
        that.setData({
            pagePath: pagePath,
            page: page
        })
    },

    // 选择生日
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        })
    },

    bindPhoneInput: function(e) {
        this.setData({
            phoneNumber: e.detail.value
        })
    },

    bindKeyInput: function(e) {
        this.setData({
            verifyCode: e.detail.value
        })
    },

    // 获取手机验证码
    getPhoneCode: function() {
        var that = this;
        var mobile = that.data.phoneNumber;
        //console.log(mobile);
        if (!mobile) {
            wx.showToast({
                title: '请填写正确手机号码',
                image: '../img/tip_icon_warn.png'
            });
        } else {
            wx.request({
                url: app.data.apiUrl,
                method: "POST",
                data: {
                    key: app.data.apiKey,
                    type: "send-code",
                    sign: wx.getStorageSync("sign"),
                    data: {
                        mobile: mobile
                    }
                },
                success: function(res) {
                    console.log(res)
                    var second = that.data.second;
                    if (res.data.status === 1) {
                        wx.showToast({
                            title: '验证码发送成功',
                            icon: 'success',
                            duration: 1000
                        })
                        that.setData({
                            code1: false,
                            code2: true,
                            loginStatic: true
                        });
                        var time = setInterval(function() {
                            if (second > 0) {
                                second = second - 1;
                                that.setData({
                                    second: second
                                });
                            } else {
                                that.setData({
                                    code1: true,
                                    code2: false,
                                    second: 60,
                                })
                                clearInterval(time);
                            }
                        }, 1000);
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'success',
                            duration: 1000
                        })
                    }

                }
            })
        }
    },

    getPhoneNumber: function(e) {
        let that = this;
        let thirdkey = wx.getStorageSync("thirdkey");
        wx.request({
            url: app.data.apiUrl,
            method: "POST",
            data: {
                sign: wx.getStorageSync("sign"),
                key: app.data.apiKey,
                type: "save-user-phone",
                data: {
                    thirdkey: wx.getStorageSync("thirdkey"),
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv
                }
            },
            success(res) {
                 console.log(res)
                let phoneNumber = res.data.data.phoneNumber;
                console.log(phoneNumber)
                if (res.data.status === 1) {
                    that.setData({
                        phoneNumber
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'success',
                        duration: 2000
                    })
                    that.setData({
                        register_type: 2
                    })
                }

            }
        })
    },


    // 注册
    loginIn: function(res) {
        let that = this;
        let mobile = that.data.phoneNumber;
        let date = that.data.date;
        if (!mobile) {
            wx.showToast({
                title: '请填写正确手机号码',
                icon: 'success',
                duration: 1000
            });
            return false;
        } else if (!date) {

        }
        wx.request({
            url: app.data.apiUrl,
            method: "POST",
            data: {
                sign: wx.getStorageSync("sign"),
                key: app.data.apiKey,
                type: "register",
                data: {
                    mobile: mobile,
                    birth: that.data.date[0],
                    code: that.data.verifyCode,
                    register_type: that.data.register_type
                }
            },
            success(res) {
                console.log(res,getCurrentPages());
                if (res.data.status===1) {
                    let pagePath = that.data.pagePath;
                    console.log(pagePath)
                    pagePath = pagePath?pagePath:'../index/index';
                    wx.reLaunch({
                      url: pagePath
                    })
                }
            }
        })

    },

    // 输入手机号
    inputPhone() {
        let that = this;
        that.setData({
            register_type: 2
        });

    },

    onReady: function() {
        // 页面渲染完成
    },

    onShow: function() {
        // 页面显示
        console.log("页面显示");
        var that = this;

    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    }
})