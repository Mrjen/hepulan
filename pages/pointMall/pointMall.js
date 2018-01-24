// pages/pointMall/pointMall.js
var common = require('../../common.js');
var app = getApp();
import { statistic, fromPageData } from '../../tunji'
Page({
    data: {
        dataText: [],
        pointCount: "",
        shopList: [],
        start: 0,
        selectWin: false, //选择类型弹层
        selectWinData: [],
        opation_nav: [{
            url: "../shopCollect/shopCollect",
            text: "我的收藏",
            icon: "https://qncdn.playonwechat.com/hupulan/shopMall/point_mall_collect.png",
            id: 1
        }, {
            url: "../pointMallCar/pointMallCar",
            text: "购物车",
            icon: "https://qncdn.playonwechat.com/hupulan/shopMall/point_mall_shopcar.png",
            id: 2
        }, {
            url: "../myAddress/myAddress",
            text: "地址管理",
            icon: "https://qncdn.playonwechat.com/hupulan/shopMall/point_mall_adress.png",
            id: 3
        }]
    },

    onLoad: function(options) {
        // 上报后台数据
        statistic();
        wx.setStorageSync('sence', options.scene) 

        // 渠道统计  一定要放在wx.setStorageSync('sence', options.scene) 之后
        fromPageData()
    },

    // 兑换
    exchangeBtn(ev) {
        var list_id = ev.currentTarget.dataset.id;
        console.log(list_id);
        var jifen = ev.currentTarget.dataset.jifen;
        wx.navigateTo({
            url: `../pointMallDetail/pointMallDetail?id=${list_id}`
        })
    },

    // 导航跳转
    navTo(ev) {
        let that = this;
        let index = ev.currentTarget.dataset.index;
        let opation_nav = that.data.opation_nav;
        let is_register = that.data.is_register;
        console.log(is_register)
        let pagePath = "../pointMall/pointMall";
        if (is_register != '1' && opation_nav[index].id == 3) {
            wx.showModal({
                title: '提示',
                content: '您还没有注册，是否去注册',
                success: function(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../login/login?pagePath=' + pagePath
                        })
                    } else if (res.cancel) {

                    }
                }
            })
        } else if (is_register == '0' || is_register == '1') {
            wx.navigateTo({
                url: opation_nav[index].url
            })
        }
    },

    onReady: function() {

    },

    // 选择款式
    changeType(ev) {
        let that = this;
        let index = ev.currentTarget.dataset.index;
        let selectWinData = that.data.selectWinData;
        let type_id = ev.currentTarget.dataset.id;
        let image = selectWinData.details[index].url_prefix + selectWinData.details[index].imgurl;
        // console.log("type_id",type_id,image)
        for (var i = 0; i < selectWinData.details.length; i++) {
            selectWinData.details[i].active = 0;
        }
        selectWinData.details[index].active = 1;
        selectWinData.color = selectWinData.details[index].color;
        selectWinData.imgurl = image;
        selectWinData.amount = selectWinData.details[index].amount;
        that.setData({
            selectWinData,
            type_id
        })
    },

    // 
    onShow: function() {
        var that = this;
        var avatarUrl = wx.getStorageSync("avatarUrl");
        var nickName = wx.getStorageSync("nickName");
        that.setData({
            avatarUrl: avatarUrl,
            nickName: nickName
        });
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: app.data.apiUrl,
            method: "POST",
            data: {
                key: app.data.apiKey,
                sign: wx.getStorageSync("sign"),
                type: "get-goods-list"
            },
            success(res) {
                let shopNowList = res.data.data.goods_list_now;
                let shopSoonList = res.data.data.goods_list_soon;
                let shopBeforeList = res.data.data.goods_list_before;
                let pointCount = res.data.data.usable_score;
                let dataText = res.data.data.exchanged_list;
                let is_register = res.data.data.is_register;
                that.setData({
                    shopNowList,
                    shopBeforeList,
                    shopSoonList,
                    pointCount,
                    dataText,
                    is_register
                });
               setTimeout(function(){
                    wx.hideLoading()
                },800)
            },
            fail(res) {
                console.log(res);
            }
        })
    },

    toShopExchange() {
        wx.reLaunch({
            url: '../shopExchange/shopExchange'
        })
    },

    // 点击加入购物车图标唤起弹层
    selectType(ev) {
        let that = this;
        let product_id = ev.currentTarget.dataset.id;
        console.log("product_id", product_id)
        wx.request({
            url: app.data.apiUrl,
            method: "POST",
            data: {
                sign: wx.getStorageSync("sign"),
                key: app.data.apiKey,
                type: "get-glist-by-kid",
                data: {
                    kid: product_id
                }
            },
            success(res) {
                console.log(res);
                let selectWinData = res.data.data;
                that.setData({
                    selectWinData
                });
                console.log(that.data)
            }
        })
        that.setData({
            selectWin: true
        })
    },

    // 选好款式加入购物车
    AddShopCart(ev) {
        let that = this;
        let type_id = that.data.type_id;
        if (type_id) {
            wx.request({
                url: app.data.apiUrl,
                method: "POST",
                data: {
                    sign: wx.getStorageSync("sign"),
                    key: app.data.apiKey,
                    type: "save-cart",
                    data: {
                        gid: type_id,
                        goods_num: 1
                    }
                },
                success(res) {
                    console.log(res);
                    if (res.data.status) {
                        wx.showToast({
                            title: '添加购物车成功',
                            icon: 'success',
                            duration: 1000
                        })
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'success',
                            duration: 1000
                        })
                    }
                    that.setData({
                        selectWin: false
                    })
                }
            })
        } else {
            wx.showToast({
                title: '请选择颜色',
                icon: 'success',
                duration: 1000
            })
        }
    },

    // 关闭选择类别
    selectWin(ev) {
        let that = this;
        that.setData({
            selectWin: false
        })
    },

    // 点赞商品
    zanProduct(ev) {
        let that = this;
        let id = ev.currentTarget.dataset.id;
        let index = ev.currentTarget.dataset.index;
        let shopSoonList = that.data.shopSoonList;
        let http = {
            type: "save-shop-good-like",
            data: {
                kid: id
            }
        };
        common.http(http, function(res) {
            console.log(res)
            if (res.data.status === 1 && res.data.data.state == 1) {
                shopSoonList[index].is_praise = 1;
                shopSoonList[index].praise_num = res.data.data.praise;
                wx.showToast({
                    title: "点赞成功",
                    icon: 'success',
                    duration: 1000
                })
            } else if (res.data.status === 1 && res.data.data.state == 0) {
                shopSoonList[index].is_praise = 0;
                shopSoonList[index].praise_num = res.data.data.praise;
                wx.showToast({
                    title: "取消点赞成功",
                    icon: 'success',
                    duration: 1000
                })
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'success',
                    duration: 1000
                })
            }
            that.setData({
                shopSoonList
            })
        })
    },



    // 点击图片预览
    prewImg(ev) {
        let url = ev.currentTarget.dataset.url;
        wx.previewImage({
            current: url,
            urls: [url]
        })
    },

    // 跳转详情页
    ToDetail(ev) {
        let id = ev.currentTarget.dataset.id;
        wx.navigateTo({
            url: `../pointMallDetail/pointMallDetail?id=${id}`
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

    },

    onUnload: function() {

    },

    onPullDownRefresh: function() {

    },

    onReachBottom: function(ev) {

    },

    onShareAppMessage: function() {

    }
})