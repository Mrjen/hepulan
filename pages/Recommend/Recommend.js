// pages/Recommend/Recommend.js
var common = require('../../common.js');
var mta = require('../../utils/mta_analysis.js');
import { statistic } from '../../tunji'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        teacherId: "",
        WXcode: "",
        copyTeach: false,
        teach_static: false,
        templateData: [{
            teacher_id: "",
            title_tip: '请咨询您的专属护肤老师'
        }],
        imgUrls: ['https://qncdn.playonwechat.com/hepulan/home_baner01.png',
            'https://qncdn.playonwechat.com/hepulan/home_baner02.png',
            'https://qncdn.playonwechat.com/hepulan/home_baner03.png',
            'https://qncdn.playonwechat.com/hepulan/home_baner04.png'
        ]
    },


    applyBtn: function () {
        var that = this;
        that.setData({
            copyTeach: true
        });
    },

    sureBtn: function () {
        var that = this;
        var copyText = wx.getStorageSync("teacherId");
        that.setData({
            copyTeach: false
        });
    },

    cencelBbtn: function () {
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
    onLoad: function (options) {
        //console.log(options);
        
        // 上报后台数据
        statistic();
        wx.setStorageSync('sence', options.scene) 

        // 创建视频
        this.videoContext = wx.createVideoContext('myVideo');
        // 初始化腾讯统计
        mta.Page.init();

        var that = this;
        var WXcode = options.WXcode;
        var teacherId = options.teacherId;
        var templateData = [];
        templateData[0] = {};
        templateData[0].teacher_id = teacherId;
        templateData[0].title_tip = "请咨询您的专属护肤老师";
        console.log(that.data.templateData)
        if (teacherId == "") {
            that.setData({
                teach_static: true,
                templateData: templateData
            })
        } else {
            that.setData({
                teach_static: false,
                templateData: templateData
            })
        }

        that.setData({
            WXcode: WXcode,
            teacherId: teacherId
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    // 返回首页
    backHome: function () {
        common.backHome();
    },

    // 分享海报
    toShare: function () {
        common.toShare();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        wx.showShareMenu({
            withShareTicket: true
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    }
})