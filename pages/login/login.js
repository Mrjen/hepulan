// pages/login/login.js
var app = getApp();
var common = require('../../common');
Page({
    data: {
        inputValue: '',
        second: 60,
        selected: false,
        selected1: true,
        pagePath: "",
        verifyCode: "",
        page: "",
        loginStatic: false,
        addImgDis: "none",
        addGoldImg: "",
        goldImg: [{
            imgId: "1",
            imgUrl: "https://hepulan.playonwechat.com//static/gold10.gif"
        }, {
            imgId: "2",
            imgUrl: "https://hepulan.playonwechat.com//static/gold20.gif"
        }, {
            imgId: "3",
            imgUrl: "https://hepulan.playonwechat.com//static/gold40.gif"
        }, {
            imgId: "4",
            imgUrl: "https://hepulan.playonwechat.com//static/gold100.gif"
        }],
        date: "请选择您的生日"
    },

    onLoad: function(options) {
        var that = this;
        // 页面初始化 options为页面跳转所带来的参数
        var app = getApp();
        console.log(app.data);
        that.setData({
            sign: app.data.sign
        })
        wx.showShareMenu({
            withShareTicket: true
        })

        //console.log(options);
        var pagePath = options.pagePath;
        var page = options.pages
        that.setData({
            pagePath: pagePath,
            page: page
        })
    },

    // 选择生日
    bindDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            date: e.detail.value
        })
    },

    bindKeyInput: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },

    // 获取手机验证码
    getphone: function() {
        var that = this;
        var mobile = that.data.inputValue;
        //console.log(mobile);
        if (mobile == "" || mobile == undefined) {
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
                    data: {
                        mobile: mobile,
                        data: "2017-07-09"
                    }
                },
                success: function(res) {
                    console.log(res)
                    var second = that.data.second;
                    that.setData({
                        selected: true,
                        selected1: false,
                        loginStatic: true
                    });
                    app.data.loginStatic = true;
                    var time = setInterval(function() {
                        if (second > 0) {
                            second = second - 1;
                            that.setData({
                                second: second
                            });
                        } else {
                            that.setData({
                                selected: false,
                                selected1: true,
                                second: 60,
                            })
                            clearInterval(time);
                        }
                    }, 1000);
                    //console.log("验证码" + res);
                }
            })
        }
    },

    getPhoneNumber: function(e) {
      let that = this;
      let thirdkey = wx.getStorageSync("thirdkey");
      wx.request({
         url:app.data.apiUrl,
         method:"POST",
         data:{
           sign:wx.getStorageSync("sign"),
           key:app.data.apiKey,
           type:"save-user-phone",
           data:{
             thirdkey:wx.getStorageSync("thirdkey"),
             encryptedData:e.detail.encryptedData,
             iv:e.detail.iv
           }
         },
         success(res){
           // bzI3SHQwRmV2YldIZlo0cEh3SFowbm5OVi1Fc3x8fDNSVDUxbE1penJvNy9qcW56L0FuZkE9PQ==
          console.log(res)
         }
      })
        console.log(e.detail.errMsg);
        console.log(e.detail.iv);
        console.log(e.detail.encryptedData);
    },


    verifyCode: function(code) {
        //console.log(code.detail.value);
        var that = this;
        this.setData({
            verifyCode: code.detail.value
        })
        //console.log(that.data.verifyCode);
    },

    loginIn: function(res) {
        // 登录
        var that = this;
        //console.log(that.data.inputValue);
        var mobile = that.data.inputValue;
        var pagePath = that.data.pagePath;
        var verifyCode = that.data.verifyCode;
        var page = that.data.page;
        var sign = app.data.sign;
        if (!(/^1[34578]\d{9}$/.test(that.data.inputValue))) {
            wx.showToast({
                title: '请填写正确手机号码',
                image: '../img/tip_icon_warn.png'
            });
            return;
        }
        wx.request({
            url: app.data.api.Url,
            method: "POST",
            data: {
                key: app.data.apiKey,
                type: "verify-code",
                data: {
                    mobile: mobile,
                    sign: sign,
                    code: verifyCode
                }
            },
            success: function(res) {
                console.log(res);
                wx.setStorageSync('mobile', mobile);
                var keyCode = res.data.status;
                var msg = res.data.msg;
                var app = getApp();
                if (keyCode == 0) {
                    wx.showToast({
                        title: msg,
                        image: '../img/tip_icon_warn.png'
                    });
                } else {
                    wx.request({
                        url: app.data.apiUrl,
                        data: {
                            key: app.data.apiKey,
                            type: "verify-code",
                            data: {
                                mobile: mobile,
                                sign: sign,
                                code: verifyCode
                            }
                        },
                        success: function(res) {
                            console.log(res);
                            var teacherId = res.data.data.hpl_t_id;
                            var wxcode = res.data.data.wxcode;
                            var addGoldImg = "";
                            var goldimg = that.data.golddImg;
                            console.log(that.data);
                            addGoldImg = that.data.goldImg[3].imgUrl;
                            wx.setStorageSync("teacherId", teacherId);
                            app.data.teacherId = teacherId;
                            app.data.wxcode = wxcode;
                            app.data.loginStatic = true;
                            that.setData({
                                addImgDis: "flex",
                                addGoldImg: addGoldImg
                            });
                            setTimeout(function() {
                                that.setData({
                                    addImgDis: "none"
                                });
                            }, 1000)
                            app.data.mobile = mobile;
                            console.log(app.data);
                            setTimeout(function() {
                                if (page == "ask_me") {
                                    wx.switchTab({
                                        url: pagePath
                                    })
                                } else {
                                    wx.redirectTo({
                                        url: pagePath + "?teacherId=" + teacherId + "&wxcode=" + wxcode
                                    })
                                }
                            }, 1000)
                        }
                    });
                }
            }
        })


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