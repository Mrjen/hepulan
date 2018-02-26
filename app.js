//app.js
let common = require('common.js');
var mta = require('utils/mta_analysis.js');
import Api from './api'
import { fromPageData } from './tunji.js'
import {getUser} from './common.js'

App({
    data: {
        loginData: null,
        sign: "",
        mobile: "",
        username: "",
        mid: "",
        sharecode: "",
        authStatic: false,
        loginStatic: false,
        authSuccess: false,
        // apiUrl: "https://api.hepulanerp.com/hpl/index.php?s=/Api/hfzx/index",
        apiUrl: Api.apiUrl,
        apiKey: "be15d4ca913c91494cb4f9cd6ce317c6"
    },
    onLaunch: function () {
        var that = this;
        mta.App.init({
            "appID": "500521555",
            "eventID": "500521564",
        });

        wx.login({
            success: function (res) {
                let code = res.code;
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: that.data.apiUrl,
                        method: "POST",
                        data: {
                            key: that.data.apiKey,
                            type: "auth",
                            data: {
                                code: code
                            }
                        },
                        success: function (res) {
                            console.log('登录数据', res.data.data);
                            if (res.data.status === 2) {
                                console.log("用户常规授权失败");
                                common.getThirdKey(function (res) {
                                    console.log(res);
                                    if (res.data.status === 1) {
                                        let thirdkey = res.data.data.thirdkey;
                                        wx.setStorageSync("thirdkey", thirdkey);
                                        wx.getUserInfo({
                                            success(res) {
                                                var userInfo = res.userInfo;
                                                var encryptedData = res.encryptedData;
                                                var iv = res.iv;
                                                let userData = {
                                                    nickName: userInfo.nickName,
                                                    avatarUrl: userInfo.avatarUrl,
                                                    gender: userInfo.gender,
                                                    province: userInfo.province,
                                                    city: userInfo.city,
                                                    country: userInfo.country
                                                };
                                                wx.setStorageSync("nickName", userInfo.nickName);
                                                wx.setStorageSync("avatarUrl", userInfo.avatarUrl);
                                                wx.setStorageSync("gender", userInfo.gender);
                                                res.userInfo.username = userInfo.nickName;
                                                res.userInfo.id = wx.getStorageSync('user_id');
                                                
                                                wx.request({
                                                    url: that.data.apiUrl,
                                                    method: "POST",
                                                    data: {
                                                        key: that.data.apiKey,
                                                        type: "actionAuth",
                                                        data: {
                                                            info: userData,
                                                            encryptedData,
                                                            iv,
                                                            thirdkey
                                                        }
                                                    },
                                                    success(res) {
                                                        // let _res = JSON.parse(res)
                                                        console.log(res, "2222")
                                                        wx.setStorageSync('sign', res.data.data.sign);
                                                        wx.setStorageSync('unionid', res.data.data.unionid);
                                                        wx.setStorageSync('openid', res.data.data.app_openid);
                                                        wx.setStorageSync('is_fresh', res.data.data.is_fresh);
                                                        if (res.data.data.sign) {
                                                            wx.setStorageSync("sign", res.data.data.sign);
                                                        }
                                                    }
                                                })
                                            },
                                            complete(){
                                                if (wx.getStorageSync('sence')) {
                                                    fromPageData();
                                                }
                                                console.log('授权完成')
                                            }
                                        })
                                    }
                                });
                            } else if (res.data.status === 1) {
                                console.log("用户正常授权", res)
                                wx.setStorageSync('sign', res.data.data.sign);
                                wx.setStorageSync('unionid', res.data.data.unionid);
                                wx.setStorageSync('openid', res.data.data.app_openid);
                                wx.setStorageSync('is_fresh', res.data.data.is_fresh);
                                // 获取用户信息
                                wx.getUserInfo({
                                    success: function (res) {
                                        // console.log(res);
                                        var userData = {};
                                        var encryptedData = res.encryptedData;
                                        var iv = res.iv;
                                        var userInfo = res.userInfo;
                                        wx.setStorageSync('avatarUrl', userInfo.avatarUrl);
                                        wx.setStorageSync('nickName', userInfo.nickName);
                                        wx.setStorageSync("gender", userInfo.gender);
                                        userData = {
                                            nickName: userInfo.nickName,
                                            avatarUrl: userInfo.avatarUrl,
                                            gender: userInfo.gender,
                                            province: userInfo.province,
                                            city: userInfo.city,
                                            country: userInfo.country
                                        };
                                        res.userInfo.username = userInfo.nickName;
                                        res.userInfo.id = wx.getStorageSync('user_id');

                                        wx.request({
                                            url: that.data.apiUrl,
                                            method: 'POST',
                                            data: {
                                                key: that.data.apiKey,
                                                type: "save-user-info",
                                                data: {
                                                    info: userData,
                                                    encryptedData: encryptedData,
                                                    iv: iv,
                                                    sign: wx.getStorageSync("sign")
                                                }
                                            },
                                            success: function (res) {
                                                console.log(res);
                                            }
                                        })
                                        
                                        
                                    },
                                    fail: function () {
                                        console.log("用户拒绝授权");
                                        getUser();
                                    },
                                    complete(){
                                        // fromPageData();
                                        fromPageData();
                                    }
                                })
                            }



                        },
                    })

                } else {
                    console.log('获取用户登录态失败！' + res.errMsg);
                }
            }
        });
    },

    // app onShow
    onShow() {
        console.log('app onShow');
    },

    globalData: {
        userInfo: null,
        sign: ""
    }
})
