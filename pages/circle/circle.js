// pages/circle/circle.js
var app = getApp();
var common = require('../../common.js');
import { statistic, fromPageData } from '../../tunji'
import {http} from '../../common'
Page({
    data: {
        sign: "",
        userInfo: "",
        nickName: "", //用户名
        writeContent: "", //评论内容
        showWrite: false, //评论窗口
        writeIndex: null, //评论索引
        zanStatus: false, //点赞状态
        spaceDyn: "",     //禾圈内容列表
        writeComment: "",
        empty: "1",
        plid: "",
        mid: "",
        isWritting: true,
        writeCircle: true,
        start: 0,
        share_type: 0,
        navIndex:1, //主导航index
        circleNav:[{
            id:1,
            text:'禾粉圈',
            active:true
        },{
            id: 2,
            text: '禾苗圈',
            active: false
        },{
            id: 3,
            text: '禾兰圈',
            active: false
        }],
        navList: [{
            id: 1,
            img: "https://qncdn.playonwechat.com/hepulan/circle_skincare_experience.png",
            text: "护肤心得",
            active: true
        }, {
            id: 2,
            img: "https://qncdn.playonwechat.com/hepulan/circle_new_product.png",
            text: "新品测评",
            active: false
        }, {
            id: 3,
            img: "https://qncdn.playonwechat.com/hepulan/circle_empty_bollte.png",
            text: "空瓶记",
            active: false
        }, {
            id: 4,
            img: "https://qncdn.playonwechat.com/hepulan/circle_time_active.png",
            text: "限时活动",
            active: false
        }]
    },

    // 图片预览
    prewImg: function(ev) {
        let Edata = ev.currentTarget.dataset;
        wx.previewImage({
            current: Edata.url, // 当前显示图片的http链接
            urls: Edata.imglist // 需要预览的图片http链接列表
        })
    },

    dissWrite: function(res) {
        // 书写评论
        console.log(res);
        var that = this;
        var writeIndex = res.currentTarget.dataset.idwrite;
        // console.log(writeIndex);
        that.setData({
            showWrite: true,
            isWritting: false,
            writeCircle: false,
            writeIndex: writeIndex
        })
    },

    bindTextAreaBlur: function(e) {
        var that = this;
        var comment = e.detail.value;
        that.setData({
            writeComment: comment
        })
    },

    writeSure: function(res) {
        //  console.log(res);
        var that = this;
        var _writeText = that.data.writeComment;
        var _writeIndex = that.data.writeIndex;
        var pid = that.data.spaceDyn[_writeIndex].pid;
        var spaceDyn = that.data.spaceDyn;
        var sign = wx.getStorageSync('sign');
        var kun = [];
        if (!_writeText) {
            wx.showToast({
                title: '请填写评论内容',
                icon: 'success',
                duration: 2000
            });
            return false;
        }
        that.setData({
            isWritting: true,
            writeCircle: true
        })
        wx.getUserInfo({
            success: function(res) {
                kun.push(res);
                console.log(http)
                http({
                    type:'save-plaza-post-comment',
                    data:{
                        pid: pid,
                        comment: _writeText
                    }
                },function(res){
                    console.log(res);
                    var nickNamee = kun[0].userInfo.nickName;
                    var personData = [];
                    personData.push({
                        username: nickNamee,
                        comment: _writeText
                    });
                    spaceDyn[_writeIndex].comments = spaceDyn[_writeIndex].comments.concat(personData);
                    //console.log(personData);
                    that.setData({
                        showWrite: false,
                        spaceDyn: spaceDyn
                    })
                })
            }
        });
    },

    // 播放禾苗圈视频
    videoPlay(){
       console.log('播放视频')
    },

    writeCencel: function() {
        var that = this;
        that.setData({
            showWrite: false,
            isWritting: true,
            writeCircle: true
        })
    },

    // 点赞
    dianZan: function(ev) {
        console.log(ev);
        var that = this;
        var zanStatus = that.data.zanStatus;
        var Edata = ev.currentTarget.dataset;
        var zan = that.data.spaceDyn[Edata.zan].is_praise;
        var spaceDyn = that.data.spaceDyn;
        var nick_name = that.data.nickName;
        var sign = wx.getStorageSync('sign');
        zan = zan > 0 ? true : false;
        var nickName = that.data.nickName;
        http({
            type:'save-plaza-post-like',
            data:{
                pid: Edata.pid
            }
        },function(res){
            let praise_list = res.data.data;
            spaceDyn[Edata.zan].praise = praise_list.praise_list;
            spaceDyn[Edata.zan].praise_num = praise_list.praise_num;
            spaceDyn[Edata.zan].is_praise = praise_list.haslike;
            that.setData({
                spaceDyn: spaceDyn,
                pid: Edata.pid
            })
        })
    },

    // 判断用户是否授权否则不能写动态
    writeCircle: function() {
        var that = this;
        var sign = wx.getStorageSync('sign');
        //console.log(sign);
        if (sign == "") {
            wx.showToast({
                title: '未授权用户禁止发言',
                icon: 'success',
                duration: 2000
            })
        } else {
            wx.navigateTo({
                url: '../writeDyn/writeDyn'
            });
            //console.log(_writeText);
        }
    },

    onReady: function() {
        // 页面渲染完成
    },


    onLoad(options) {
        const that = this;
        // 上报后台数据
        statistic();
        wx.setStorageSync('sence', options.scene) 
        
        // 渠道统计  一定要放在wx.setStorageSync('sence', options.scene) 之后
        fromPageData()

        let nickName = wx.getStorageSync("nickName"),
            avatar = wx.getStorageSync('avatarUrl'),
            start = that.data.start;
        wx.showLoading({
            title: '加载中',
        })
        that.setData({
            nickName: nickName,
            avatar: avatar
        })
        common.getSign(function() {
            let sign = wx.getStorageSync('sign');
            that.setData({
                sign: sign
            })

            http({
                type:'get-social-list',
                data:{
                    start: 0,
                    length: 5
                }
            },function(res){
                console.log('禾圈数据', res.data.data.social_list);
                start += 5;
                let spaceDyn = res.data.data.social_list;
                spaceDyn = that.Handel(spaceDyn)
                that.setData({
                    spaceDyn,
                    start
                });
                setTimeout(function () {
                    wx.hideLoading()
                }, 800)
            })
        })
    },

    // 下拉刷新
    onPullDownRefresh: function() {
        let that = this;
        let start = 0;

        http({
            type:'get-social-list',
            data: {
                start: 0,
                length: 5
            }
        },function(res){
            console.log(res);
            start += 5;
            let spaceDyn = res.data.data.social_list;
            spaceDyn = that.Handel(spaceDyn)
            that.setData({
                spaceDyn: spaceDyn,
                start
            });
            wx.stopPullDownRefresh();
            wx.showToast({
                title: '页面刷新成功',
                icon: 'success',
                duration: 2000
            })
        })
    },

    // 处理函数
    Handel(spaceDyn){
        for (let i = 0; i < spaceDyn.length; i++) {
            spaceDyn[i].imgslist = [];
            if (spaceDyn[i].urls) {
                for (let j = 0; j < spaceDyn[i].urls.length; j++) {
                    spaceDyn[i].imgslist.push(spaceDyn[i].urls[j].url);
                }
            }
        }
        return spaceDyn;
    },

    // 输入的搜索关键词
    searchCentent(e) {
        this.setData({
            searchCentent: e.detail.value
        })
    },

    // 搜索
    searchCircle(e) {
        let that = this;
        let searchCentent = that.data.searchCentent;
        let start = 0;
        console.log(searchCentent);
        http({
            type:'get-social-list',
            data: {
                start: 0,
                length: 5,
                search: searchCentent,
                share_type: that.data.share_type
            }
        },function(res){
            console.log(res);
            start += 5;
            let spaceDyn = res.data.data.social_list;
            spaceDyn = that.Handel(spaceDyn)
            that.setData({
                spaceDyn: spaceDyn,
                start
            });
        })
    },

    // 切换一级导航
    changeCircleNav(e){
       let that = this;
       let Edata = e.currentTarget.dataset,
           circleNav = that.data.circleNav;
        circleNav.forEach(element => {
            element.active = false;
        });
        circleNav[Edata.idx].active = true;
        that.setData({
            circleNav: circleNav,
            navIndex: Edata.idx
        })
    },

    // 切换导航
    changeNav(ev) {
        let that = this;
        let index = ev.currentTarget.dataset.index;
        let _index = index + 1;
        let navList = that.data.navList;
        for (var i = 0; i < navList.length; i++) {
            navList[i].active = false;
        }
        navList[index].active = true;
        that.setData({
            navList
        })

        http({
            type:'get-social-list',
            data: {
                share_type: _index,
                start: 0,
                length: 5
            }
        },function(res){
            console.log(res);
            let spaceDyn = res.data.data.social_list;
            spaceDyn = that.Handel(spaceDyn)
            that.setData({
                spaceDyn: spaceDyn,
                start: 0,
                share_type: _index
            });
        })
    },

    // 页面上拉触底事件的处理函数
    onReachBottom: function(ev) {
        var that = this;
        var start = that.data.start;
        var oldspaceDyn = that.data.spaceDyn;
        wx.showLoading({
            title: '数据加载中',
        })

        http({
            type:'get-social-list',
            data:{
                start: that.data.start,
                length: 5,
                share_type: that.data.share_type,
                search: that.data.searchCentent ? that.data.searchCentent : ''
            }
        },function(res){
            console.log(res);
            setTimeout(function () {
                wx.hideLoading()
            }, 300);
            var spaceDyn = res.data.data.social_list;
            if (spaceDyn.length === 0) {
                wx.showLoading({
                    title: '没有更多数据',
                });
                setTimeout(function () {
                    wx.hideLoading()
                }, 1000);
                return false;
            } else {
                spaceDyn = that.Handel(spaceDyn)
                start += 5;
                spaceDyn = oldspaceDyn.concat(spaceDyn);
            }
            console.log(start)

            that.setData({
                start: start,
                spaceDyn: spaceDyn
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
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },
    onShareAppMessage(){
        
    }
})