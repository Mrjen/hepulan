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
			text: '金币商城',
      navUrl: '../pointMall/pointMall'
    }, {
		    text:'分享海报',
        navUrl:'../sharePoster/sharePoster'
		 }
    // {
		//    text:'金币排行榜',
    //   navUrl:'../integralList/integralList'
		// }
    // {
		//    text:'好友助力',
    //    navUrl:'../sharePage/sharePage'
		// },
    ]

	},
	onLoad: function (options) {
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
		 if (mobile==""||mobile==undefined) {
					 userTag = "未注册用户"
		 }else {
					userTag = "普通用户"
		 }
		 var userInfo = {
		 userImg:avatarUrl,
		 userName:nickName,
		 userTag:userTag
	 };
		 that.setData({
			 userInfo: userInfo
		 })
	},
	onReady: function () {
		// 页面渲染完成
	},
	onShow: function () {
		// 页面显示
		wx.getSetting({
    success(res) {
		        if (!res['scope.userInfo']) {
		            wx.authorize({
		                scope: 'scope.userInfo',
		                success() {
		                    // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问

		                },
										fail:function(){
											wx.openSetting({
												success: (res) => {
													console.log(res);
													/*
													 * res.authSetting = {
													 *   "scope.userInfo": true,
													 *   "scope.userLocation": true
													 * }
													 */
												}
											})
										}
		            })
		        }
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

	onHide: function () {
		// 页面隐藏
	},
	onUnload: function () {
		// 页面关闭
	},
	// 自定义函数

	// 获取注册函数
	getRegister: function () {
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
