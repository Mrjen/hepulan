// pages/circle/circle.js
var app = getApp();
var common = require('../../common.js');
console.log(app.data);
Page({
    data: {
        sign: "",
        userInfo: "",
        nickName: "", //用户名
        writeContent: "", //评论内容
        showWrite: false, //评论窗口
        writeIndex: null, //评论索引
        zanStatus: false, //点赞状态
        spaceDyn: "",
        writeComment: "",
        empty: "1",
        plid: "",
        mid: "",
        isWritting: true,
        writeCircle: true,
        start: 0,
        share_type: 1,
        navList: [{
            id: 1,
            img: "https://qncdn.playonwechat.com/hepulan/circle_skincare_experience.png",
            text: "护肤心得"
        }, {
            id: 2,
            img: "https://qncdn.playonwechat.com/hepulan/circle_new_product.png",
            text: "新品测评"
        }, {
            id: 3,
            img: "https://qncdn.playonwechat.com/hepulan/circle_empty_bollte.png",
            text: "空瓶记"
        }, {
            id: 4,
            img: "https://qncdn.playonwechat.com/hepulan/circle_time_active.png",
            text: "限时活动"
        }]
    },

    // 图片预览
    prewImg: function(ev) {
        // console.log(ev);
        let that = this;
        var img = ev.target.dataset.url;
        let imglist = ev.target.dataset.imglist;
        var img = ev.target.dataset.img;
        wx.previewImage({
            current: img, // 当前显示图片的http链接
            urls: imglist // 需要预览的图片http链接列表
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
                wx.request({
                    url: app.data.apiUrl,
                    header: {
                        'content-type': 'application/json'
                    },
                    method: "POST",
                    data: {
                        type: "save-plaza-post-comment",
                        key: app.data.apiKey,
                        sign: sign,
                        data: {
                            pid: pid,
                            comment: _writeText
                        }
                    },
                    success: function(res) {
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
                    }
                });
            }
        });
    },

    writeCencel: function() {
        var that = this;
        that.setData({
            showWrite: false,
            isWritting: true,
            writeCircle: true
        })
    },

    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    // 点赞
    dianZan: function(ev) {
        // console.log(ev);
        var that = this;
        var zanStatus = that.data.zanStatus;
        var writeIndex = ev.currentTarget.dataset.zan;
        var pid = ev.currentTarget.dataset.pid;
        var zan = that.data.spaceDyn[writeIndex].haslike;
        var spaceDyn = that.data.spaceDyn;
        var nick_name = that.data.nickName;
        var sign = wx.getStorageSync('sign');
        zan = zan > 0 ? true : false;
        // console.log(zan)
        var nickName = that.data.nickName;
        if (!zan) {
            wx.request({
                url: app.data.apiUrl,
                header: {
                    'content-type': 'application/json'
                },
                method: "POST",
                data: {
                    type: "save-plaza-post-like",
                    key: app.data.apiKey,
                    sign: "8a3a862e995ece7f15fe1c4f82e6a714",
                    data: {
                        pid: pid
                    }

                },
                success: function(res) {
                    // console.log(res);
                    spaceDyn[writeIndex].liks.unshift({
                        username: nickName,
                        pid: pid
                    });
                    spaceDyn[writeIndex].haslike = "1";
                    that.setData({
                        spaceDyn: spaceDyn,
                        pid: pid
                    })
                }
            });
        } else {

            var likeList = spaceDyn[writeIndex].liks;
            var zanList = [];
            wx.request({
                url: app.data.apiUrl,
                header: {
                    'content-type': 'application/json'
                },
                method: "POST",
                data: {
                    key: app.data.apiKey,
                    type: "remove-plaza-post-like",
                    // sign:sign,
                    sign: "8a3a862e995ece7f15fe1c4f82e6a714",
                    data: {
                        pid: pid
                    }
                },
                success: function(res) {
                    // console.log(res);
                    var likeList = spaceDyn[writeIndex].liks;
                    var zanList = [];
                    for (var i = 0; i < likeList.length; i++) {
                        if (pid == likeList[i].pid) {
                            likeList.splice(i, 1);
                        }
                    }
                    spaceDyn[writeIndex].liks = likeList;
                    likeList = spaceDyn[writeIndex].haslike = 0;
                    that.setData({
                        spaceDyn: spaceDyn
                    })
                }
            });
        }
    },

    // 判断用户是否授权否则不能写动态
    writeCircle: function() {
        var that = this;
        var sign = that.data.sign;
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


    onShow() {
        const that = this;
        let nickName = wx.getStorageSync("nickName"),
            avatar = wx.getStorageSync('avatarUrl');
        let start = that.data.start;
        that.setData({
            nickName: nickName,
            avatar: avatar
        })

        common.getSign(function() {
            let sign = wx.getStorageSync('sign');
            that.setData({
                sign: sign
            })
            wx.request({
                url: app.data.apiUrl,
                method: "POST",
                data: {
                    key: app.data.apiKey,
                    type: "get-plaza-posts",
                    sign: "8a3a862e995ece7f15fe1c4f82e6a714",
                    // sign:sign,
                    data: {
                        start: 0,
                        length: 10
                    }
                },
                success(res) {
                    console.log(res);
                    start += 10;
                    let spaceDyn = res.data.data.social_list;
                    for (let i = 0; i < spaceDyn.length; i++) {
                        spaceDyn[i].imgslist = [];
                        for (let j = 0; j < spaceDyn[i].imgs.length; j++) {
                            spaceDyn[i].imgslist.push(spaceDyn[i].imgs[j].img_url);
                        }
                    }
                    that.setData({
                        spaceDyn: spaceDyn
                    });
                }
            })
        })
    },

    changeNav(ev) {
        let that = this;
        let index = ev.currentTarget.dataset.index;
        let _index = index + 1;

        wx.request({
            url: app.data.apiUrl,
            method: "POST",
            data: {
                sign: wx.getStorageSync("sign"),
                key: app.data.apiKey,
                type: "get-plaza-posts",
                data: {
                  share_type: _index,
                  start:0,
                  length:10
                }
            },
            success(res) {
                console.log(res);
                let spaceDyn = res.data.data.social_list;
                    for (let i = 0; i < spaceDyn.length; i++) {
                        spaceDyn[i].imgslist = [];
                        for (let j = 0; j < spaceDyn[i].imgs.length; j++) {
                            spaceDyn[i].imgslist.push(spaceDyn[i].imgs[j].img_url);
                        }
                    }
                  that.setData({
                      spaceDyn: spaceDyn,
                      start:0,
                      share_type:_index
                  });
            }
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
        wx.request({
            url: app.data.apiUrl,
            header: {
                'content-type': 'application/json'
            },
            method: "POST",
            data: {
                key: app.data.apiKey,
                type: "get-plaza-posts",
                data: {
                    start: that.data.start,
                    length: 10,
                    share_type:that.data.share_type
                }
            },
            success: function(res) {
                console.log(res);

                setTimeout(function() {
                    wx.hideLoading()
                }, 300);
                var spaceDyn = res.data.data.social_list;
                if (spaceDyn.length === 0) {
                    wx.showLoading({
                        title: '没有更多数据',
                    });
                    setTimeout(function() {
                        wx.hideLoading()
                    }, 1000);
                    return false;
                } else {
                    for (let i = 0; i < spaceDyn.length; i++) {
                        spaceDyn[i].imgslist = [];
                        for (let j = 0; j < spaceDyn[i].imgs.length; j++) {
                            spaceDyn[i].imgslist.push(spaceDyn[i].imgs[j].img_url);
                        }
                    }
                    start += 10;
                    spaceDyn = oldspaceDyn.concat(spaceDyn);
                }
                console.log(start)

                that.setData({
                    start: start,
                    spaceDyn: spaceDyn
                })
            }
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
    }
})