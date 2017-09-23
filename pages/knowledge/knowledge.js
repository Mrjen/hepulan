var common = require('../../common.js');
var main_content = [];
var app = getApp();
Page({
    data: {
        searchWord: "",
        checkBottom: true,
        start: 0
    },
    onLoad: function() {
        wx.showShareMenu({
            withShareTicket: true
        })
        var that = this;


    },

    onShow() {
        let that = this;
        common.getSign(function() {
            var sign = wx.getStorageSync('sign');
            console.log(sign)
            // 获取搜索关键词
            wx.request({
                url: app.data.apiUrl,
                header: {
                    'content-type': 'application/json'
                },
                method: "POST",
                data: {
                    type: "get-tags",
                    key: app.data.apiKey,
                    sign: sign
                },
                success: function(res) {
                    // console.log(res);
                    var firstTag = {
                        id: "-1",
                        ma_desc: "全部",
                        active: true
                    };
                    var search_word = res.data.data;
                    for (var i = 0; i < search_word.length; i++) {
                        search_word[i].active = false
                    }
                    search_word.unshift(firstTag);
                    var width = 130 * search_word.length;
                    console.log(search_word)
                    that.setData({
                        search_word: search_word,
                        w_width: width
                    })
                }
            });
            // 获取整个知识列表
            wx.request({
                url: app.data.apiUrl,
                header: {
                    'content-type': 'application/json'
                },
                method: "POST",
                data: {
                    key: app.data.apiKey,
                    type: "get-knowledge-list",
                    sign: sign
                },
                success: function(res) {
                    console.log("知识列表", res)
                    // 获取用户名称及发表时间
                    var start = that.data.start;
                    start += res.data.data.length;
                    that.setData({
                        "main_content": res.data.data,
                        start: start
                    });
                }
            });
        })
    },

    // 点赞文章
    likeBtn: function(ev) {
        var that = this;
        var idx = ev.currentTarget.dataset.inx;
        // app.getUserInfo(function () {
        wx.request({
            url: "https://hepulan.playonwechat.com/site/knowledge-thumb?sign=" + app.data.sign,
            data: {
                id: idx
            },
            success: function(res) {
                var main_content = that.data.main_content;
                for (var i = 0; i < main_content.length; i++) {
                    if (main_content[i].id == idx) {
                        main_content[i].is_thumb = 1;
                        main_content[i].thumb_num = parseInt(main_content[i].thumb_num) + 1;
                    }
                }
                that.setData({
                    main_content: main_content
                })
            }
        })
        // })
    },

    hasLike: function() {
        wx.showToast({
            title: '你已经点过赞了',
            icon: 'success',
            duration: 1000
        })
    },

    video_control: function(e) {
        var index = e.currentTarget.dataset.ontap;
        var info = this.data.main_content;
        for (var i = 0; i < info.length; i++) {
            info[i].noplay = "false";
            if (info[i].id == index && info[i].noplay == "false") {
                info[i].noplay = "true";
                info[i].visit_num = parseInt(info[i].visit_num) + 1;
            }
        };
        wx.request({
            url: "https://hepulan.playonwechat.com/site/add-knowledge-visit?sign=" + app.data.sign,
            data: {
                id: index
            },
            success: function(res) {
                // 保存浏览量
                console.log("浏览量", res);
            }
        })
        this.setData({
            "main_content": info
        })
    },


    // 搜索关键词
    inputValue(e) {
        this.setData({
            searchValue: e.detail.value
        })
    },

    // 搜索按钮
    searchBtn: function(e) {
        var that = this;
        var searchValue = that.data.searchValue;
        var sign = wx.getStorageSync("sign");
        wx.request({
            url: app.data.apiUrl,
            data: {
                key: app.data.apiKey,
                sign: sign,
                type: "get-knowledge-list",
                data: {
                    keyword: searchValue
                }
            },
            header: {
                'content-type': 'application/json'
            },
            method: "POST",
            success: function(res) {
                // 此处清空全局的数据
                var main_content = [];
                // 获取用户名称及发表时间
                var contentTip = res.data.data;
                console.log(res)
                that.setData({
                    "main_content": contentTip
                })
            }
        })
    },

    // 点击
    tapKeyWorld: function(e) {
        console.log(e)
        var that = this;
        var tapKeyWorld = e.currentTarget.dataset.id;
        var inx = e.target.dataset.inx;
        var sign = wx.getStorageSync("sign");
        var main_content = [];
        var search_word = that.data.search_word;
        for (var i = 0; i < search_word.length; i++) {
            search_word[i].active = false;
            search_word[inx].active = true;
        }
        this.setData({
            search_word: search_word,
            tapKeyWorld: tapKeyWorld,
            start: 0
        });
        if (tapKeyWorld < 0) {
            wx.request({
                url: app.data.apiUrl,
                data: {
                    key: app.data.apiKey,
                    sign: sign,
                    type: "get-knowledge-list"
                },
                header: {
                    'content-type': 'application/json'
                },
                method: "POST",
                success: function(res) {
                    console.log(res)
                    main_content = res.data.data;
                    that.setData({
                        "main_content": main_content
                    })
                }
            })
        } else {
            wx.request({
                url: app.data.apiUrl,
                data: {
                    key: app.data.apiKey,
                    sign: sign,
                    type: "get-knowledge-list",
                    data: {
                        tag: tapKeyWorld
                    }
                },
                header: {
                    'content-type': 'application/json'
                },
                method: "POST",
                success: function(res) {
                    console.log(res)
                    main_content = res.data.data;
                    that.setData({
                        "main_content": main_content
                    })
                }
            })
        }
    },



    onReachBottom: function() {
        var that = this;
        var oldCentent = that.data.main_content;
        var main_content = [];
        var start = that.data.start;
        var sign = wx.getStorageSync("sign");
        var tapKeyWorld = that.data.tapKeyWorld;
        var searchValue = that.data.searchValue;
        if ((!tapKeyWorld || tapKeyWorld < 0)&&!searchValue) {
            wx.request({
                url: app.data.apiUrl,
                method: "POST",
                data: {
                    key: app.data.apiKey,
                    type: "get-knowledge-list",
                    sign: sign,
                    data: {
                        start: start,
                        length: 10
                    }
                },
                success(res) {
                    if (res.data.data.length > 0) {
                        main_content = res.data.data;
                        start += 10;
                        main_content = oldCentent.concat(main_content);
                    } else {
                        main_content = oldCentent;
                        wx.showToast({
                          title: '没有更多数据',
                          icon: 'success',
                          duration: 1000
                        })
                    };
                    that.setData({
                        main_content: main_content,
                        start: start
                    })
                }
            })
        } else if ( tapKeyWorld > 0&&!searchValue) {
            wx.request({
                url: app.data.apiUrl,
                method: "POST",
                data: {
                    key: app.data.apiKey,
                    type: "get-knowledge-list",
                    sign: sign,
                    tag: tapKeyWorld,
                    data: {
                        start: start,
                        length: 10
                    }
                },
                success(res) {
                    if (res.data.data.length > 0) {
                        main_content = res.data.data;
                        start += 10;
                        main_content = oldCentent.concat(main_content);
                    } else {
                        main_content = oldCentent;
                        wx.showToast({
                          title: '没有更多数据',
                          icon: 'success',
                          duration: 1000
                        })
                    };
                    that.setData({
                        main_content: main_content,
                        start: start
                    })
                }
            })
        }else if (searchValue) {
            wx.request({
                url: app.data.apiUrl,
                data: {
                    key: app.data.apiKey,
                    sign: sign,
                    type: "get-knowledge-list",
                    data: {
                        keyword: searchValue,
                        start:start,
                        length:10
                    }
                },
                header: {
                    'content-type': 'application/json'
                },
                method: "POST",
                success: function(res) {
                    // 获取用户名称及发表时间
                    var contentTip = res.data.data;
                    if (contentTip>0) {
                        main_content = oldCentent.concat(contentTip);
                        start+=length;
                    }else{
                       main_content = contentTip;
                       wx.showToast({
                          title: '没有更多数据',
                          icon: 'success',
                          duration: 1000
                        })
                    }
                    that.setData({
                        "main_content": main_content,
                        start: start
                    })
                }
            })

        }

    },

    toArticle: function(e) {
        var that = this;
        var idx = e.currentTarget.dataset.idx;
        var singleTitle = ""
        for (var i = 0; i < that.data.main_content.length; i++) {
            if (that.data.main_content[i].id == idx) {
                singleTitle = that.data.main_content[i].title
            }
        }
        wx.request({
            url: "https://hepulan.playonwechat.com/site/get-knowledge-detail?sign=" + app.data.sign,
            data: {
                id: idx
            },
            success: function(res) {
                //console.log(idx)
                wx.navigateTo({
                    url: "../single/single?id=" + idx,
                })
            }
        })

        wx.request({
            url: "https://hepulan.playonwechat.com/site/add-knowledge-visit?sign=" + app.data.sign,
            data: {
                id: idx
            },
            success: function(res) {
                // 保存浏览量
                console.log("浏览量", res);
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
});