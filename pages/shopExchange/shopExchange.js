// pages/shopExchange/shopExchange.js
var app = getApp();
import { statistic } from '../../tunji'
var common = require('../../common');
Page({
    data: {
        jifen: "",
        hasJiFen: "",
        hasExchange: ""
    },

    onLoad: function(options) {
        // 上报后台数据
        statistic();
        wx.setStorageSync('sence', options.scene) 
    },

    onReady: function() {

    },

    onShow: function() {
        let that = this;
        wx.request({
            url: app.data.apiUrl,
            method: "POST",
            data: {
                sign: wx.getStorageSync("sign"),
                key: app.data.apiKey,
                type: "get-order-list"
            },
            success(res) {
                console.log(res);
                let jifen = res.data.data.score_usable;
                let hasJiFen = res.data.data.score_total;
                let hasExchange = res.data.data.score_exchanged;
                let exchangeList = res.data.data.exchange_list;
                that.setData({
                    jifen,
                    hasJiFen,
                    hasExchange,
                    exchangeList
                });
                console.log(that.data)
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

    },

    onUnload: function() {

    },

    onPullDownRefresh: function() {

    },

    onReachBottom: function() {

    },

    onShareAppMessage: function() {

    }
})