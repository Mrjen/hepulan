//index.js
var app = getApp();
var common = require('../../common.js');
var mta = require('../../utils/mta_analysis.js');
import { http } from '../../common.js'
import { statistic, fromPageData, userEvent } from '../../tunji'
Page({
    data: {
        content: false,
        mobile: "",
        teacherId: "",
        wxcode: "",
        redpack: false,  //红包
        copyTeach: false,
        teach_static: false,
        closeGetPoint: "block",//获取积分icon的显示状态
        templateData: [{
            teacher_id: "",
            title_tip: '请咨询您的专属护肤老师'
        }],
        navList: [{
            text: "肌肤测试",
            navUrl: ""
        },
        {
            text: "护肤打卡",
            navUrl: ""
        }, {
            text: "加入会员",
            navUrl: ""
        }
        ],
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

    formSubmit(ev) {
        userEvent({ event: 'zixun' })
        //  console.log('form发生了submit事件，携带数据为：', ev.detail.formId)
        common.getSign(function () {
            var sign = wx.getStorageSync("sign");
            wx.setStorageSync('form_id', ev.detail.formId);
            wx.request({
                url: 'https://hepulan.playonwechat.com/site/save-form-id?sign=' + sign,
                data: {
                    form_id: ev.detail.formId,
                    id: wx.getStorageSync('user_id')
                },
                success(res) {
                    console.log(res)                    
                    // wx.navigateTo({
                    //     url:'../webContact/WebContact'
                    // })
                }
            })
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
    // 皮肤测试
    skinTest: function () {
        wx.navigateTo({
            url: '../skinTest/skinTest'
        })
    },

    // 老师推荐
    teacheRed: function () {
        var that = this;
        var mobile = app.data.mobile;
        var pagePath = "../Recommend/Recommend";
        wx.navigateTo({
            url: `../Recommend/Recommend`
        })
    },

    joinVip: function (page) {
        var that = this;
        var mobile = app.data.mobile;
        var pagePath = "../member/member";
        var pages = page.currentTarget.dataset.page;
        wx.navigateTo({
            url: `../member/member`
        })
    },

    Check: function () {
        var that = this;
        var mobile = app.data.mobile;
        var pagePath = "../qiandao/qiandao"
        //console.log(mobile);

        wx.navigateTo({
            url: `../qiandao/qiandao`
        })
    },

    CheckIn() {
        wx.navigateTo({
            url: `../checkIn/checkIn`
        })
    },

    Apply: function (page) {
        //console.log(page);
        var that = this;
        var mobile = app.data.mobile;
        var pagePath = "../apply/apply"
        var pages = page.currentTarget.dataset.page;

        wx.navigateTo({
            url: `../apply/apply`
        })
    },

    askMine: function (ask) {
        //console.log(ask);
        var that = this;
        var mobile = app.data.mobile;
        var pagePath = "../index/index"
        //console.log(mobile);
        if (mobile == "" || mobile == undefined) {
            that.setData({
                content: false
            })
        }
        var teacherId = wx.getStorageSync("teacherId");
        var templateData = [];
        templateData[0] = {};
        templateData[0].teacher_id = teacherId;
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
    },

    toLogin: function (page) {
        var pages = page.target.dataset.page;
        //console.log(pages);
        var pagePath = "../index/index"
        wx.navigateTo({
            url: '../login/login?pagePath=' + pagePath + "&pages=" + pages
        })
    },


    // 关闭获取积分按钮
    closeGetPoint() {
        let that = this;
        that.setData({
            closeGetPoint: "none"
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

});