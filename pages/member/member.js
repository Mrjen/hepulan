// pages/login/login.js
var common = require('../../common.js');
var mta = require('../../utils/mta_analysis.js');
import { statistic, fromPageData } from '../../tunji'
Page({
    data: {
        teacherId: "",
        WXcode: "",
        copyTeach: false,
        teach_static: false,
        templateData: [{
            teacher_id: "",
            title_tip: ''
        }]
    },

    closeWin: function() {
        var that = this;
        that.setData({
            applyWin: false
        });
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
        codeid =  codeid.toLowerCase();
        mta.Event.stat("contact_click", {codeid:'true'})
    },

    onLoad: function(options) {
        // 上报后台数据
        statistic();
        wx.setStorageSync('sence', options.scene) 

        // 渠道统计  一定要放在wx.setStorageSync('sence', options.scene) 之后
        fromPageData()

        wx.showShareMenu({
            withShareTicket: true
        })
        var that = this;
        var wxcode = options.wxcode;
        var teacherId = options.teacherId;
        console.log(teacherId);
        var templateData = [];
        templateData[0] = {};
        templateData[0].teacher_id = teacherId;
        templateData[0].title_tip = "请咨询您的专属护肤老师";
        console.log(that.data.templateData)
        if (teacherId == "") {
            that.setData({
                teach_static: true
            })
        } else {
            that.setData({
                teach_static: false
            })
        }
        that.setData({
            wxcode: wxcode,
            teacherId: teacherId,
            templateData: templateData
        })
        console.log(that.data)
    },

    loginBtn: function() {

    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
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
    }
})