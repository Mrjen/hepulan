// pages/goldList/goldList.js
var common = require('../../common.js');
var app = getApp();
import { statistic } from '../../tunji'
Page({
    data: {
        start: 0
    },

    onLoad: function(options) {
        // 上报后台数据
        statistic();
        wx.setStorageSync('sence', options.scene) 
    },

    onReady: function() {

    },

    onShow: function() {
        var that = this;
        let start = that.data.start;
        let http = {
            type: "get-score-log-list",
            data: {
                start: 0,
                length: 10
            }
        }
        common.http(http, function(res) {
            console.log(res)
            let score_list = res.data.data.score_list;
            start += 10;
            that.setData({
                score_list,
                start,
                score_today: res.data.data.score_today,
                score_total: res.data.data.score_total
            })
        })
    },

    checkTo: function(ev) {
        //    console.log(ev);
        var that = this;
        var navData = that.data.navData;
        var idx = ev.currentTarget.dataset.idx;
        var pageData = navData[idx].products;
        console.log(pageData);
        for (var i = 0; i < pageData.length; i++) {
            var imgurl = pageData[i].img.split(",");
            console.log(imgurl);
            pageData[i].img = imgurl;
            console.log(pageData);
        }
        wx.navigateTo({
            url: '../goldstore/goldstore?pageData=' + JSON.stringify(pageData),
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
        var that = this;
        let start = that.data.start;
        let http = {
            type: "get-score-log-list",
            data: {
                start: start,
                length: 10
            }
        }
        common.http(http, function(res) {
            console.log(res)
            let score_list = res.data.data.score_list;
            let oldData = that.data.score_list;
            if (score_list.length > 0) {
                start += 10;
                score_list = oldData.concat(score_list);
            } else {
                score_list = oldData;
                wx.showToast({
                    title: '没有更多数据',
                    icon: 'success',
                    duration: 2000
                })
            }
            that.setData({
                score_list,
                score_today: res.data.data.score_today,
                score_total: res.data.data.score_total
            })

        })
    },

    onShareAppMessage: function() {

    }
})