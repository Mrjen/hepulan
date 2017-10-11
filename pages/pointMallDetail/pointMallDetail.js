// pages/pointMallDetail/pointMallDetail.js
var app = getApp();
Page({
    data: {
        detailNav: [{
            text: "产品详情",
            active: true
        }, {
            text: "产品规格",
            active: false
        }],
        productNum: 1
    },

    onLoad: function(options) {
        console.log(options);
        let kid = options.id;
        // let kid = 10;
        this.setData({
            kid
        })
    },

    // 减商品
    cutproduct() {
        let that = this;
        let productNum = that.data.productNum;
        productNum -= 1;
        if (productNum == 0) {
            productNum = 1;
        }
        that.setData({
            productNum
        })
    },

    // 加商品
    addProduct() {
        let that = this;
        let productNum = that.data.productNum;
        productNum += 1;
        that.setData({
            productNum
        })
    },

    // 切换导航
    changeNav(ev) {
        let that = this;
        let index = ev.currentTarget.dataset.index;
        let detailNav = that.data.detailNav;
        for (var i = 0; i < detailNav.length; i++) {
            detailNav[i].active = false;
        }
        detailNav[index].active = true;
        that.setData({
            detailNav
        })
    },

    // 加入购物车
    SaveCart() {
        let that = this;
        let type_id = that.data.type_id;
        let num = that.data.productNum;
        let productInfo = that.data.productInfo;
        if (type_id) {
            wx.request({
                url: app.data.apiUrl,
                method: "post",
                data: {
                    sign: wx.getStorageSync("sign"),
                    key: app.data.apiKey,
                    type: "save-cart",
                    data: {
                        gid: type_id,
                        goods_num: num
                    }
                },
                success(res) {
                    console.log(res);
                    if (res.data.status) {
                        wx.showToast({
                            title: '加入购物车成功',
                            icon: 'success',
                            duration: 1000
                        })
                        
                       productInfo.cart_count = res.data.data.cart_count;
                       that.setData({
                         productInfo
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


    // 收藏或者取消收藏
    changeCollect(ev) {
        let that = this;
        let kid = that.data.kid;
        let productInfo = that.data.productInfo;
        wx.request({
            url: app.data.apiUrl,
            method: "POST",
            data: {
                sign: wx.getStorageSync("sign"),
                key: app.data.apiKey,
                type: "save-collect-status",
                data: {
                    kid: kid
                }
            },
            success(res) {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'success',
                    duration: 2000
                })
                console.log(res.data.data.state)
                if (res.data.data.state === 1) {
                    productInfo.is_collect = 1;
                } else {
                    productInfo.is_collect = 0;
                }
                that.setData({
                    productInfo
                })
            }
        })

    },

    onReady: function() {

    },

    // 立即兑换
    exchangeBtn() {
        let that = this;
        let type_id = that.data.type_id;
        let num = that.data.productNum;
        if (type_id) {
            wx.request({
                url: app.data.apiUrl,
                method: "POST",
                data: {
                    sign: wx.getStorageSync("sign"),
                    key: app.data.apiKey,
                    type: "save-cart",
                    data:{
                        gid: type_id,
                        goods_num: num
                    }
                },
                success(res) {
                    console.log(res.data.status)
                    if (res.data.status) {
                        wx.navigateTo({
                            url: '../pointMallCar/pointMallCar'
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

    // 选择款式
    changeType(ev) {
        console.log(ev)
        let that = this;
        let index = ev.currentTarget.dataset.index;
        let productInfo = that.data.productInfo;
        let type_id = productInfo.details[index].detail_id;
        let image = productInfo.details[index].url_prefix + productInfo.details[index].imgurl;
        // console.log("type_id",type_id,image)
        for (var i = 0; i < productInfo.details.length; i++) {
            productInfo.details[i].active = 0;
        }
        productInfo.details[index].active = 1;
        productInfo.color = productInfo.details[index].color;
        productInfo.original_imgurl = image;
        productInfo.amount = productInfo.details[index].amount;
        that.setData({
            productInfo,
            type_id
        })
    },

    onShow: function() {
        console.log(111)
        let that = this;
        let kid = that.data.kid;
        wx.request({
            url: app.data.apiUrl,
            method: "POST",
            data: {
                sign: wx.getStorageSync("sign"),
                key: app.data.apiKey,
                type: "get-kinfo-by-kid",
                data: {
                    kid: kid
                }
            },
            success(res) {
                console.log(res)
                let productInfo = res.data.data;
                for (var i = 0; i < productInfo.details.length; i++) {
                    productInfo.details[i].active = Number(productInfo.details[i].active)
                }
                for (var i = 0; i < productInfo.images.length; i++) {
                    productInfo.images[i].imgArr = `${productInfo.images[i].url_prefix}${productInfo.images[i].url}`
                }
                that.setData({
                    productInfo
                })
            },
            fail(res) {
                console.log(res)
            }
        })
    },

    //去购物车
    toShopCart() {
        wx.navigateTo({
            url: '../pointMallCar/pointMallCar'
        })
    },

    onHide: function() {

    },

    onUnload: function() {

    },

    onPullDownRefresh: function() {

    },

    onReachBottom: function() {

    },

    onShareAppMessage: function() {

    }
})