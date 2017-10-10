// pages/mine/mine.js
var common = require('../../common.js');
var app = getApp()

Page({
    data: {
        // isRegister由后端传输，应该是个布尔值
        isRegister: true,
        // 用户信息预保留，根据后端数据进行后续
        userInfo: [{
            'userImg': '',
            'userName': '',
            'userTag': ''
        }],
        opationList: [{
                text: '积分商城',
                navUrl: '../pointMall/pointMall'
            }, {
                text: '分享海报',
                navUrl: '../sharePoster/sharePoster'
            },
            {
               text:'积分记录',
              navUrl:'../goldList/goldList'
            },
            {
               text:'打卡记录',
              navUrl:'../diaryMarkList/diaryMarkList'
            }
            // {
            //    text:'好友助力',
            //    navUrl:'../sharePage/sharePage'
            // },
        ]

    },
    onLoad: function(options) {
        wx.showShareMenu({
            withShareTicket: true
        })
        var that = this;
        // 页面初始化 options为页面跳转所带来的参数
        var signData = wx.getStorageSync("loginData");
        var avatarUrl = wx.getStorageSync("avatarUrl");
        var nickName = wx.getStorageSync("nickName");
        var mobile = wx.getStorageSync("mobile");
        var userTag = ""
        // if (mobile == "" || mobile == undefined) {
        //     userTag = "未注册用户"
        // } else {
        //     userTag = "普通用户"
        // }
        var userInfo = {
            userImg: avatarUrl,
            userName: nickName,
            userTag: userTag
        };
        that.setData({
            userInfo: userInfo
        })
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
        let that = this;
        wx.getSetting({
            success(res) {
            	console.log(res)
            	if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                    	success(res){
                    		// let userInfo = res.userInfo;
                    		let userInfo = {
                    			userName:res.userInfo.nickName,
                    			userImg:res.userInfo.avatarUrl
                    		}
                    		that.setData({
                    			userInfo
                    		})
                    	}
                    })
            	}else{
            		wx.showModal({
					  title: '提示',
					  content: '系统检测到您没有授权给禾葡兰小程序，是否去授权？',
					  success: function(res) {
					    if (res.confirm) {
					       wx.openSetting({
							  success: (res) => {
							  }
							})
					    } else if (res.cancel) {
					      console.log('用户点击取消')
					    }
					  }
					})
            	}
            }
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

    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },
    // 自定义函数

    // 获取注册函数
    getRegister: function() {
        var self = this
        var userInfo = this.data.userInfo
        if (this.data.isRegister == false) {
            this.setData({
                "userInfo[0].userTag": "非注册用户"
            })
        } else {
            this.setData({
                "userInfo[0].userTag": "普通用户"
            })
        }
    }
})