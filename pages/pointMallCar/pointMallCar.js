// pages/pointMallCar/pointMallCar.js
var app = getApp();
Page({
    data: {
        list: [],
        allSelect: true,
        mode: ""
    },

    onLoad: function(options) {

    },

    onReady: function() {

    },

    onShow: function() {
        let that = this;
        let sign = wx.getStorageSync("sign");
        let AllMoney = new Number();

        wx.request({
            url: app.data.apiUrl,
            method: "POST",
            data: {
                sign: sign,
                key: app.data.apiKey,
                type: "get-cart-list"
            },
            success(res) {
                let list = res.data.data;
                console.log(list)
                for (var i = 0; i < list.length; i++) {
                    list[i].goods_num = Number(list[i].goods_num);
                    list[i].is_select = Number(list[i].is_select);
                    list[i].score = Number(list[i].score);
                }
                console.log(list);
                AllMoney = that.countGoods(list);
                that.setData({
                    list,
                    AllMoney
                })
            }
        })
    },

    // 勾选商品
    selectGoods(ev) {
        console.log(ev)
        let that = this;
        let _index = ev.currentTarget.dataset.index;
        let gid = ev.currentTarget.dataset.gid;
        let list = that.data.list;
        let AllMoney = new Number();
        list[_index].is_select = (list[_index].is_select == '1' ? '0' : '1');
        console.log(list[_index].is_select);
        wx.request({
            url: app.data.apiUrl,
            method: "POST",
            data: {
                sign: wx.getStorageSync("sign"),
                key: app.data.apiKey,
                type: "save-cart-select",
                data: {
                    gid: gid,
                    is_select: list[_index].is_select,
                    mode: "0"
                }
            },
            success(res) {
                console.log(res);
                AllMoney = that.countGoods(list);
                console.log(AllMoney)
                that.setData({
                    list,
                    AllMoney
                })
            }
        })

    },

    // 加商品
    addGoods(ev) {
        let that = this;
        let list = that.data.list;
        let _index = ev.currentTarget.dataset.index;
        let gid = ev.currentTarget.dataset.gid;
        let AllMoney = new Number();
        list[_index].goods_num += 1;
        wx.request({
            url: app.data.apiUrl,
            method: "POST",
            data: {
                sign: wx.getStorageSync("sign"),
                key: app.data.apiKey,
                type: "save-cart-num",
                data: {
                    gid: gid,
                    goods_num: list[_index].goods_num
                }
            },
            success(res) {
                console.log(res);
                AllMoney = that.countGoods(list);
                console.log(list);
                that.setData({
                    list,
                    AllMoney
                })
            }
        })
    },

    // 减商品
    cutGoods(ev) {
        console.log(ev)
        let that = this;
        let list = that.data.list;
        let _index = ev.currentTarget.dataset.index;
        let gid = ev.currentTarget.dataset.gid;
        let AllMoney = new Number();
        list[_index].goods_num -= 1;
        if (list[_index].goods_num == 0) {
            wx.showModal({
                title: '提示',
                content: '是否删除商品',
                success: function(res) {
                    if (res.confirm) {
                        console.log(list)
                        wx.request({
                            url: app.data.apiUrl,
                            method: "POST",
                            data: {
                                sign: wx.getStorageSync("sign"),
                                key: app.data.apiKey,
                                type: "remove-cart-info",
                                data: {
                                    gid: gid
                                },
                                success(res) {
                                    list.splice(_index, 1)
                                    console.log(list)

                                    AllMoney = that.countGoods(list);
                                    that.setData({
                                        list,
                                        AllMoney
                                    })
                                }
                            }
                        })
                    } else if (res.cancel) {
                        list[_index].goods_num = 1;
                        AllMoney = that.countGoods(list);
                        that.setData({
                            list,
                            AllMoney
                        })
                    }
                }
            })
        } else {
            console.log("else")
            console.log(list)
            wx.request({
                url: app.data.apiUrl,
                method: "POST",
                data: {
                    sign: wx.getStorageSync("sign"),
                    key: app.data.apiKey,
                    type: "save-cart-num",
                    data: {
                        gid: gid,
                        goods_num: list[_index].goods_num
                    }
                },
                success(res) {
                    console.log(res)
                    if (res.data.status === 1) {
                        AllMoney = that.countGoods(list);
                        that.countGoods(list);
                        that.setData({
                            list,
                            AllMoney
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

        }
    },

    // 计算商品数量所需积分
    countGoods(arr) {
        let AllMoney = new Number();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].is_select > 0) {
                AllMoney += Number(arr[i].goods_num) * Number(arr[i].score);
            }
        }
        return AllMoney;
    },

    // 全选或取消全选
    allSelect() {
        let that = this;
        let allSelect = that.data.allSelect;
        let list = that.data.list;
        let AllMoney = new Number();
        if (allSelect) {
            for (var i = 0; i < list.length; i++) {
                list[i].is_select = 0;
            }
            // AllMoney = that.countGoods(list);
            // console.log(allSelect)
            wx.request({
                url: app.data.apiUrl,
                method: "POST",
                data: {
                    sign: wx.getStorageSync("sign"),
                    key: app.data.apiKey,
                    type: "save-cart-select",
                    data: {
                        is_select: "0",
                        mode: "all"
                    }
                },
                success(res) {
                    console.log(res);
                    if (res.data.status == "1") {
                        AllMoney = that.countGoods(list);
                        console.log(AllMoney)
                        that.setData({
                            list,
                            AllMoney
                        })
                    }
                }

            })

        } else {
            console.log(allSelect)
            wx.request({
                url: app.data.apiUrl,
                method: "POST",
                data: {
                    sign: wx.getStorageSync("sign"),
                    key: app.data.apiKey,
                    type: "save-cart-select",
                    data: {
                        is_select: "1",
                        mode: "all"
                    }
                },
                success(res) {
                    console.log(res);
                    if (res.data.status == "1") {
                        AllMoney = that.countGoods(list);
                        console.log(AllMoney)
                        that.setData({
                            list,
                            AllMoney
                        })
                    }

                }
            })

            for (var i = 0; i < list.length; i++) {
                list[i].is_select = 1;
            }
            AllMoney = that.countGoods(list);


        }
        that.setData({
            list,
            AllMoney,
            allSelect: !that.data.allSelect
        })
    },

    // 结算
    Tosetttle() {
        let that = this;
        let pagePath = "../pointMallCar/pointMallCar"
        wx.request({
            url: app.data.apiUrl,
            method: "POST",
            data: {
                sign: wx.getStorageSync("sign"),
                key: app.data.apiKey,
                type: "action-confirm-cart"
            },
            success(res) {
                console.log(res)
                if (res.data.status === 1) {
                    wx.navigateTo({
                        url: '../shopSubmiteOrder/shopSubmiteOrder'
                    })
                } else if (res.data.status < 0) {
                    wx.showModal({
                        title: '提示',
                        content: '您还没有注册，是否去注册',
                        success: function(res) {
                            if (res.confirm) {
                                wx.navigateTo({
                                    url: '../login/login?pagePath='+pagePath
                                })
                            } else if (res.cancel) {
                                
                            }
                        }
                    })
                }
            }
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