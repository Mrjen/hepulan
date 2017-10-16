//index.js
var app = getApp();
var common = require('../../common.js');
var mta = require('../../utils/mta_analysis.js');
Page({
    data: {
        content: false,
        mobile: "",
        teacherId: "",
        wxcode: "",
        copyTeach: false,
        teach_static: false,
        templateData: [{
            teacher_id: "",
            title_tip: '请咨询您的专属护肤老师'
        }],
        navList: [{
                text: "肌肤测试",
                navUrl: ""
            }, //{
            //  text:"申请试用",
            //  navUrl:""
            //},
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
        mta.Event.stat("contact_click", {codeid:'true'})
    },

    formSubmit(ev) {
        //  console.log('form发生了submit事件，携带数据为：', ev.detail.formId)
        common.getSign(function() {
            var sign = wx.getStorageSync("sign");
            wx.request({
                url: 'https://hepulan.playonwechat.com/site/save-form-id?sign=' + sign,
                data: {
                    form_id: ev.detail.formId
                },
                success(res) {
                    console.log(res);
                }
            })
        })
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

    onLoad: function(options) {
         console.log("onload页面参数",options)
        // 初始化腾讯统计
        mta.Page.init();
        // options.codeId = "Tdhgdi";
        let codeid = `codeid_${options.codeId}`;
        let load_code = codeid.split("_");
        console.log("onload",codeid)
        
        if (codeid) {
            wx.setStorageSync("codeid",codeid)
            mta.Event.stat(codeid,{});
        }
        
        if (options.codeId=='goto') {
            wx.switchTab({
              url: '../circle/circle'
            })
        }

        //页面初始化 options为页面跳转所带来的参数
        var that = this;
        
        common.getUser();

        wx.showShareMenu({
            withShareTicket: true,
        });

    },

    onReady: function() {
        // 页面渲染完成
    },

    onShow() {
        let that = this;
        // 回调获取sign
        that.setData({
           onShow: "执行获取onshow"
        })
        common.getSign(function(sign) {

        });
    },
    // 皮肤测试
    skinTest: function() {
        wx.navigateTo({
            url: '../skinTest/skinTest'
        })
    },

    // 老师推荐
    teacheRed: function() {
        var that = this;
        var mobile = app.data.mobile;
        var pagePath = "../Recommend/Recommend";
        wx.navigateTo({
            url: `../Recommend/Recommend`
        })
    },

    joinVip: function(page) {
        var that = this;
        var mobile = app.data.mobile;
        var pagePath = "../member/member";
        var pages = page.currentTarget.dataset.page;
        wx.navigateTo({
            url: `../member/member`
        })
    },

    Check: function() {
        var that = this;
        var mobile = app.data.mobile;
        var pagePath = "../qiandao/qiandao"
        //console.log(mobile);

        wx.navigateTo({
            url: `../qiandao/qiandao`
        })
    },

    CheckIn(){
        wx.navigateTo({
            url: `../checkIn/checkIn`
        })
    },

    Apply: function(page) {
        //console.log(page);
        var that = this;
        var mobile = app.data.mobile;
        var pagePath = "../apply/apply"
        var pages = page.currentTarget.dataset.page;

        wx.navigateTo({
            url: `../apply/apply`
        })
    },

    askMine: function(ask) {
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

    toLogin: function(page) {
        var pages = page.target.dataset.page;
        //console.log(pages);
        var pagePath = "../index/index"
        wx.navigateTo({
            url: '../login/login?pagePath=' + pagePath + "&pages=" + pages
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
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },

});