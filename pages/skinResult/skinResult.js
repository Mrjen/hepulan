// pages/skinResult/skinResult.js
var common = require('../../common.js');
var mta = require('../../utils/mta_analysis.js');
import { statistic } from '../../tunji'
Page({
    data: {
        skinTag: [{
            tag: "D",
            color: "#2ca5ce",
            text: "轻干"
        }, {
            tag: "S",
            color: "#58b17e",
            text: "重敏"
        }, {
            tag: "N",
            color: "#ffba00",
            text: "非色素"
        }, {
            tag: "T",
            color: "#ff79c5",
            text: "紧致"
        }]
    },

    applyBtn: function() {
        var that = this;
        that.setData({
            copyTeach: true
        });
    },

    sureBtn: function() {
        var that = this;
        that.setData({
            copyTeach: false
        });
    },

    cencelBbtn: function() {
        var that = this;
        that.setData({
            copyTeach: false
        });
    },

    // 统计
    tongJi(ev) {
        let codeid = wx.getStorageSync("codeid");
        codeid = codeid.split("_");
        codeid = codeid.toLocaleString();
        codeid = codeid.toLowerCase();
        mta.Event.stat("contact_click", { codeid: 'true' })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 上报后台数据
        statistic();
        wx.setStorageSync('sence', options.scene) 
    },

    onReady: function() {

    },

    onShow: function() {
        let that = this;
        let http = {
            type: "get-skintest-result"
        };
        common.http(http, function(res) {
            console.log(res);
            let skinTag = res.data.data.new_arr;
            let _skinTag = that.data.skinTag;
            for (var i = 0; i < skinTag.length; i++) {
                for (var i = 0; i < _skinTag.length; i++) {
                    skinTag[i].color = _skinTag[i].color
                }
            }
            that.setData({
                skinTag,
                skin_arr: res.data.data.skin_arr
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

    onHide: function() {

    },

    onUnload: function() {

    },

    onPullDownRefresh: function() {

    },

    onReachBottom: function() {

    },

    // onShareAppMessage: function() {

    // },

    onReachBottom: function() {

    },

    onPullDownRefresh: function() {

    }
})