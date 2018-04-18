// pages/mine/mine.js
var app = getApp()
import { statistic, fromPageData } from '../../tunji'
import { common, http, getUser } from '../../common'
Page({
    data: {
        userInfo: {},
        msgNum:'',   //系统消息数量
        navData:[{
            icon:'https://qncdn.playonwechat.com/hepulanhufu/mine-punch-icon.png',
            url:'../DiaryMark/DiaryMark',
            text:'护肤打卡'
        },{
            icon:'https://qncdn.playonwechat.com/hepulanhufu/mine-nav-shop.png',
            url: '../pointMall/pointMall',
            text: '积分商城'
        }, {
            icon: 'https://qncdn.playonwechat.com/hepulan/mine-shop-icon.png',
            url: '../mycoupon/mycoupon',
            text: '商城'
        }, {
            icon: 'https://qncdn.playonwechat.com/hepulanhufu/mine-skin-icon.png',
            url: '../skinTest/skinTest',
            text: '肌肤测试'
        },{
            icon:'https://qncdn.playonwechat.com/hepulanhufu/mine-order-icon.png',
            url:'../myOrder/myOrder',
            text: '我的订单'
        }]
    },
    onLoad: function (options) {
        // 上报后台数据
        statistic();
        wx.setStorageSync('scene', options.scene)

        // 渠道统计  一定要放在wx.setStorageSync('scene', options.scene) 之后
        fromPageData()
    },
    onReady: function () {
        // 页面渲染完成
    },

    onShow: function () {
        let that = this;
        getUser();
     
        let userInfo = {
            userImg:wx.getStorageSync('avatarUrl'),
            nickName:wx.getStorageSync('nickName')
        }
        
        // 获取是否有未读消息
        if (wx.getStorageSync('sign')) {
            http({
                type: 'get-message-unread-num'
            }, function (res) {
                console.log('是否有未读消息', res.data.data)
                let msgNum = res.data.data.user_message_unread_num.toString();
                console.log(msgNum)
                wx.setTabBarBadge({
                    index: 4,
                    text: msgNum
                })
            })
        }

        that.setData({
            userInfo
        })
    },

    toCompanyShop(){
      wx.navigateToMiniProgram({
          appId: 'wx6de91c88beaa27fe ',
          path: 'pages/index/index',
          success(res) {
            // 打开成功
            console.log('打开成功')
          },
          fail(res){
            console.log(res)
          }
      })
    },

    // 跳转详情页
    ToDetail(ev) {
        let id = ev.currentTarget.dataset.id;
        wx.navigateTo({
            url: `../pointMallDetail/pointMallDetail?id=${id}`
        })
    },

    // 返回首页
    backHome: function () {
        common.backHome();
    },

    // 分享海报
    toShare: function () {
        common.toShare();
    },

    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },

    onShareAppMessage() {

    }
})