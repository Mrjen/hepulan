//index.js
var app = getApp();
var common = require('../../common.js');
var mta = require('../../utils/mta_analysis.js');
import { http } from '../../common.js'
import { statistic, fromPageData, userEvent } from '../../tunji'
Page({
    data: {
        redpack: false,  //红包
        playVideo:false,  //video封面是否显示
        skinCare:false,
        banner: ['http://p1jrmxejh.bkt.clouddn.com/hepulanhufu/index-banner.png',
                 'https://qncdn.playonwechat.com/hepulanhufu/index-banner1.png'],
        imgUrls: ['https://qncdn.playonwechat.com/hepulan/home_baner01.png',
            'https://qncdn.playonwechat.com/hepulan/home_baner02.png',
            'https://qncdn.playonwechat.com/hepulan/home_baner03.png',
            'https://qncdn.playonwechat.com/hepulan/home_baner04.png'
        ]
    },

    // 统计
    tongJi(ev) {
        let codeid = wx.getStorageSync("codeid");
        codeid = codeid.split("_");
        codeid = codeid.toLocaleString();
        codeid = codeid.toLowerCase();
        mta.Event.stat("contact_click", { codeid: 'true' })
    },

    // 播放视频
    playVideo(){
       this.setData({
           playVideo:true,
           skinCare:false
       })
    },

    // 视频播放完了
    playEnd(){
        this.setData({
            playVideo: false,
            skinCare: false
        })
    },

    skinCare(){
       this.setData({
           skinCare:true,
           playVideo: false
       })
    },

    // 点击打开红包
    getFromId(e) {
        let that = this;
        console.log(e.detail.formId);
        if (e.detail.formId) {
            http({
                type: 'add-user-active-coupon', data: {
                    formid: e.detail.formId
                }
            }, function (res) {
                console.log('生成红包成功', res)
                wx.setStorageSync('unique_code', res.data.data.unique_code);
                mta.Event.stat("redpack_index", {})
                wx.navigateTo({
                    url: `../redPack/redPack?formid=${e.detail.formId}`
                })
                that.setData({
                    redpack: false
                })
            })
        }
    },

    // 关闭红包
    closeRedPack() {
        this.setData({
            redpack: false
        })
    },

    applyBtn: function () {
        var that = this;
        that.setData({
            copyTeach: true
        });
    },

    sureBtn: function () {
        var that = this;
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

    onLoad: function (options) {
        console.log("onload页面参数", options)

        // 后台数据统计上报
        statistic();
        wx.setStorageSync('sence', options.scene)       

        // 渠道统计  一定要放在wx.setStorageSync('sence', options.scene) 之后
        fromPageData()

        // 初始化腾讯统计
        mta.Page.init();

        if (options.codeId) {
            console.log('options.codeId', options.codeId)
            let codeid = `codeid_${options.codeId}`;
            // let load_code = codeid.split("_");
            console.log("onload", codeid)
            wx.setStorageSync("codeid", codeid)
            mta.Event.stat(codeid, {});

            if (options.codeId == 'goto') {
                wx.switchTab({
                    url: '../circle/circle'
                })
            }
        }
        var that = this;
        wx.showShareMenu({
            withShareTicket: true,
        });
        setTimeout(() => {
            that.setData({
                redpack: true
            })
        }, 1000);
    },

    onReady: function () {
        // 页面渲染完成
    },

    onShow() {
        let that = this;
        common.getSign(function (sign) {

        });
    },

    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
    onShareAppMessage(){

    }

});