// pages/pointMall/pointMall.js
var common = require('../../common.js');
var app = getApp();
Page({
    data: {
        dataText: [],
        pointCount: "",
        shopList: [],
        start: 0,
        selectWin: false, //选择类型弹层
        selectWinData: []
    },

    onLoad: function(options) {

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
            title: '加载中'
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
                console.log(res)
                let shopNowList = res.data.data.goods_list_now;
                let shopSoonList = res.data.data.goods_list_soon;
                let shopBeforeList = res.data.data.goods_list_before;
                let pointCount = res.data.data.usable_score;
                let dataText = res.data.data.exchanged_list;
                that.setData({
                    shopNowList,
                    shopBeforeList,
                    shopSoonList,
                    pointCount,
                    dataText
                });

                setTimeout(function(){
                  wx.hideLoading()
                },1000)
            },
            fail(res) {
                console.log(res);
            }
        })
    },

    toShopExchange(){
       wx.navigateTo({
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
                        that.setData({
                            selectWin: false
                        })
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'success',
                            duration: 1000
                        })
                    }
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

    // 点击图片预览
    prewImg(ev){
       let url = ev.currentTarget.dataset.url;
       wx.previewImage({
          current: url, 
          urls: [url] 
        })
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