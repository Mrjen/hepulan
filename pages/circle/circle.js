// pages/circle/circle.js
var app = getApp();
var common = require('../../common.js');
import { statistic, fromPageData } from '../../tunji'
import { http, wxRequest} from '../../common';
import api from '../../api';
Page({
    data: {
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
        share_type: 1, //护肤心得1  新品测评2   空瓶记3    限时活动4
        navIndex:0,  //主导航index
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
        }],
        jiFenImage: ['../img/score1.png', '../img/score2.png', '../img/score3.png', '../img/score4.png', '../img/score5.png'],
        toastIcon:null
    },

    // 图片预览
    prewImg: function(ev) {
        let Edata = ev.currentTarget.dataset;
        let idx = Edata.imglist.indexOf(Edata.idx)
        wx.previewImage({
            current: Edata.imglist[idx],
            urls: Edata.imglist 
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
        let jiFenImage = that.data.jiFenImage;
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

        // 请求是否给用户加积分
        if (!zan) {
            wxRequest({
                url: api.zanAndPrewAddScore,
                data: {
                    openid: wx.getStorageSync('openid'),
                    sign: wx.getStorageSync('sign'),
                    id: Edata.pid
                }
            }, function (res) {
                console.log('点赞是否加积分', res);
                if (res.data.status == '1') {
                    that.setData({
                        toastIcon: jiFenImage[res.data.score - 1]
                    })
                    setTimeout(() => {
                        that.setData({
                            toastIcon: null
                        })
                    }, 1000);
                }

            })
        }
       
    },

    // 判断用户是否授权否则不能写动态
    writeCircle: function() {
        var that = this;
        var sign = wx.getStorageSync('sign');
          wx.navigateTo({
            url: '../DiaryMark/DiaryMark'
          });
    },

    onReady: function() {
        // 页面渲染完成
    },


    onLoad(options) {
        const that = this;

        http({
            type: 'get-social-list',
            data: {
                start: 0,
                length: 5
            }
        }, function (res) {
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
            }, 100)
        })

        // 上报后台数据
        statistic();
        wx.setStorageSync('scene', options.scene) 
        
        // 渠道统计  一定要放在wx.setStorageSync('scene', options.scene) 之后
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

        
    },

    // 切换一级导航
    changeCircleNav(e) {
        let that = this;
        let apiType = '';
        let Edata = e.currentTarget.dataset,
            circleNav = that.data.circleNav;
        circleNav.map(element=>{
            element.active = false;
        })
        circleNav[Edata.idx].active = true;
        that.setData({
            circleNav: circleNav,
            navIndex: Edata.idx
        })
        if (Edata.idx == 0) {
            apiType = 'get-social-list'
        } else if (Edata.idx == 1) {
            apiType = 'get-hemiao-social-list'
        } else if (Edata.idx == 2) {
            apiType = 'get-helan-social-list'
        }

        http({
            type: apiType
        }, function (res) {
            console.log('切换导航数据', res)
            let spaceDyn = res.data.data.social_list;
            spaceDyn = that.Handel(spaceDyn)
            that.setData({
                spaceDyn: spaceDyn,
                start: 5
            })
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
            type: 'get-social-list',
            data: {
                share_type: _index,
                start: 0,
                length: 5
            }
        }, function (res) {
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

    // 页面显示
    onShow(){
        
       
    },

    // 播放视频
    playVideo(e){
       let Edata = e.currentTarget.dataset,
           spaceDyn = this.data.spaceDyn,
           that = this;
        spaceDyn.map(el=>{
            el.play_video = false;
        })
        spaceDyn[Edata.idx].play_video = true;
        that.setData({
            spaceDyn
        })
    },

    // 视频播放完毕
    videoPlayEnd(e){
        let Edata = e.currentTarget.dataset,
            spaceDyn = this.data.spaceDyn,
            that = this;
        spaceDyn.map(el => {
            el.play_video = false;
        })
        that.setData({
            spaceDyn
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
            spaceDyn[i].content = spaceDyn[i].content.replace(/<br>/g,'\n');
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


    // 页面上拉触底事件的处理函数
    onReachBottom: function(ev) {
        var that = this;
        var start = that.data.start;
        let navIndex = that.data.navIndex;
        let share_type = that.data.share_type;
        var oldspaceDyn = that.data.spaceDyn;
        let apiType = '';
        wx.showLoading({
            title: '数据加载中',
        })

        if (navIndex==0){
            // 加载禾粉圈分类数据
            http({
                type: 'get-social-list',
                data: {
                    start: that.data.start,
                    length: 5,
                    share_type: that.data.share_type,
                    search: that.data.searchCentent ? that.data.searchCentent : ''
                }
            }, function (res) {
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
                    }, 100);
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
        } else{
            //加载禾苗圈或者禾兰圈数据
            if (navIndex==1){
                apiType = 'get-hemiao-social-list' //禾苗圈
                console.log('加载禾苗圈数据')
            } else if (navIndex == 2){
                apiType = 'get-helan-social-list'  //禾兰圈
                console.log('加载禾兰圈数据')
            }
            http({
                type: apiType,
                data:{
                    start: that.data.start,
                    length: 5
                }
            },function(res){
                console.log('加载数据',res)
                var spaceDyn = res.data.data.social_list;
                if (spaceDyn.length === 0) {
                    wx.showLoading({
                        title: '没有更多数据',
                    });
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 100);
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
                setTimeout(function () {
                    wx.hideLoading()
                }, 100);
            })
        }

        
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