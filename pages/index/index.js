//index.js
var app = getApp();
var common = require('../../common.js');
var mta = require('../../utils/mta_analysis.js');
import { http, wxRequest } from '../../common.js'
import { statistic, fromPageData, userEvent } from '../../tunji'
import api from '../../api'
Page({
    data: {
        redpack: false,  //红包
        playVideo:false,  //video封面是否显示
        skinCare:false,
        teachList:[], //老师数据
        random_number:12568,
        banner: ['http://p1jrmxejh.bkt.clouddn.com/hepulanhufu/index-banner.png',
                 'https://qncdn.playonwechat.com/hepulanhufu/index-banner1.png'],
        imgUrls: ['https://qncdn.playonwechat.com/hepulan/home_baner01.png',
            'https://qncdn.playonwechat.com/hepulan/home_baner02.png',
            'https://qncdn.playonwechat.com/hepulan/home_baner03.png',
            'https://qncdn.playonwechat.com/hepulan/home_baner04.png'
        ],
        canIUse: wx.canIUse('display-multiple-items')
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

    // 查看老师详情
    toTeachDetail(e) {
        wx.navigateTo({
            url: `../teacherDetail/teacherDetail?tid=${e.currentTarget.dataset.tid}`
        })
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
        let that = this;

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
        
        wx.showShareMenu({
            withShareTicket: true,
        });
        
        // 显示红包
        setTimeout(() => {
            that.setData({
                redpack: true
            })
        }, 1000);

        // 获取老师数据
        wxRequest({
            url: api.teachList
        }, function (res) {
            if (res.data.status) {
                let teachList = res.data.data;
                that.setData({
                    teachList
                })
            } else {
                console.log('请求老师列表数据出错')
            }
        })
    },

    onReady: function () {
        // 页面渲染完成
    },

    onShow() {
        let that = this;
        wxRequest({
            url: api.indexRand
        },function(res) {
             console.log(res)
            that.setData({
                random_number: res.data.random_number
            })
        })

        if (!wx.canIUse('swiper.display-multiple-items')) {
            console.log('不支持')
            wx.redirectTo({
                url: '../update/update'
            })
        }
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