// pages/shopSubmiteOrder/shopSubmiteOrder.js
var app = getApp();
import { statistic } from '../../tunji'
import { http, couPondiffTime,time } from '../../common.js';
var failText = {
    title: "很遗憾TAT",
    text1: "您的积分不足",
    text2: "无法完成此次兑换",
    img: "https://qncdn.playonwechat.com/hepulan/nopoints.png",
    btnText: "赚取更多积分"
}

var successText = {
    title: "成功兑换",
    text1: "礼品将会在数个工作日",
    text2: "内送到您的手上",
    img: "https://qncdn.playonwechat.com/hepulan/win.png",
    btnText: "兑换更多礼品"
}

Page({
    data: {
        winText: "",
        SaveOrder:true, //防止重复提交
        winStatus: false,
        openAnimation:{},
        couponIsOpen:false, //选择红包抵扣是否显示
        couponH:0,
        dikou:0,//抵扣的积分
        couponArr:[],  //选择使用的优惠券
        couponCard: [{
            money: 15,
            jifen: 1500,
            linedate: 2,
            date: '2017.02.23~2017.03.12',
            active: true
        }, {
            money: 15,
            jifen: 1500,
            linedate: 2,
            date: '2017.02.23~2017.03.12',
            active: true
        }, {
            money: 15,
            jifen: 1500,
            linedate: 2,
            date: '2017.02.23~2017.03.12',
            active: true
        }, {
            money: 15,
            jifen: 1500,
            linedate: 2,
            date: '2017.02.23~2017.03.12',
            active: true
        }]
    },

    onLoad: function(options) {
        console.log(options);

        // 上报后台数据
        statistic();
        wx.setStorageSync('sence', options.scene) 

        let that = this;
        let addressid = options.addressid;
        if (options.address && options.name && options.phone) {
            let info = {
                address: options.address,
                name: options.name,
                phone: options.phone,
                detail:options.detail
            }
            that.setData({
                info,
                addressid
            })
        }
    },

    onReady: function() {

    },

    onShow: function() {
        let that = this;
        wx.request({
            url: app.data.apiUrl,
            method: "POST",
            data: {
                sign: wx.getStorageSync("sign"),
                key: app.data.apiKey,
                type: "get-confirm-cart-info",
                data: {
                    addressid: that.data.addressid ? that.data.addressid : 0
                }
            },
            success(res) {
                console.log(res);
                let cart_list = res.data.data.cart_list;
                let cart_select_sum = res.data.data.cart_select_sum;
                let form_token = res.data.data.form_token;
                for (var i = 0; i < cart_list.length; i++) {
                    cart_list[i].img = `${cart_list[i].url_prefix}${cart_list[i].imgurl}`
                }
                that.setData({
                    cart_list,
                    cart_select_sum,
                    form_token
                })
            }
        })
    },
    
    // 打开红包抵扣
    openCouponBar(){
        console.log('打开')
       let that = this;
       
        http({ type:'get-user-coupon-list',data:{
            status: 1
        }},function(res){
            console.log('可使用优惠券',res)
            let coupon = res.data.data.user_coupon_list;
            let currentStemp = (new Date()).getTime();
            currentStemp = currentStemp / 1000;
            if (coupon && coupon.length) {
                coupon.forEach((element, idx) => {
                    console.log(element)
                    element.time = couPondiffTime(currentStemp, element.valid_time);
                    element.begin = time(element.create_time, 0).replace(/-/g, ".");
                    element.endtime = time(element.valid_time, 0).replace(/-/g, ".");
                    element.active = false;
                })
            }
            var openAnimation = wx.createAnimation({
                transformOrigin: "50% 50%",
                duration: 1000,
                timingFunction: "ease",
                delay: 0
            })
            openAnimation.translateY(-380).step();
            that.setData({
                openAnimation: openAnimation.export(),
                couponH:500,
                couponIsOpen:true,
                coupon: coupon
            })
            
        })

        
        
    },

    //  关闭红包抵扣
    closeCouponBar(){
        console.log('关闭')
        let that = this;
        var openAnimation = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 1000,
            timingFunction: "ease",
            delay: 0
        })
        openAnimation.translateY(0).step();
        that.setData({
            openAnimation: openAnimation.export(),
            couponH: 0,
            couponIsOpen: false
        })
    },

    // 选择这个优惠券
    selsctRadio(e){
        let that = this;
        let idx = e.currentTarget.dataset.idx;
        let score = e.currentTarget.dataset.jifen;
        let couponArr = [];
        let coupon = that.data.coupon;
        let dikou = new Number();
        coupon[idx].active = !coupon[idx].active;
        for (let i = 0; i < coupon.length; i++) {
            if (coupon[i].active){
                dikou += parseInt(coupon[i].score)
                couponArr.push(coupon[i].id)
            }
        }
        console.log(couponArr)
        that.setData({
            coupon, dikou, couponArr
        })
    },

    // 选择地址
    toAddress() {
        console.log("11111",getCurrentPages())
        wx.redirectTo({
            url: '../myAddress/myAddress?addressinfo=submiteorder'
        })
    },

    // 提交订单
    SaveOrder() {
        let that = this;
        let SaveOrder = that.data.SaveOrder;
        if (!that.data.SaveOrder){
            wx.showToast({
                title: '订单处理中',
                icon: 'success',
                duration: 1000
            })
            return false;
        }
        
        that.setData({ SaveOrder: false })

        let addressid = that.data.addressid;
        let pagePath = "../shopSubmiteOrder/shopSubmiteOrder";
        let form_token = that.data.form_token;
        if (!form_token){
            wx.showToast({
                title: '没有选择地址',
                icon: 'success',
                duration: 1000
            })
            return false;
        }

        console.log(that.data)
        wx.request({
            url: app.data.apiUrl,
            method: "POST",
            data: {
                sign: wx.getStorageSync("sign"),
                key: app.data.apiKey,
                type: "save-order",
                data: {
                    addressid: addressid,
                    coupon_ids: that.data.couponArr,
                    form_token: that.data.form_token
                }
            },
            success(res) {
                console.log(res);
                if (res.data.status == "1") {
                    that.setData({
                        winStatus: true,
                        winText: successText,
                        sureStatus: true,
                        SaveOrder:true
                    })
                } else if (res.data.status=='0'){
                    wx.showModal({
                        title: '提示',
                        content: res.data.msg,
                        success: function (res) {

                        }
                    })
                    that.setData({ SaveOrder: true})
                }else if (res.data.status < 0) {
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
                }
                that.setData({
                    sureStatus: true
                })
            }
        })
    },

    sureBtn() {
        let that = this;
        let sureBtn = that.data.sureStatus;
        if (sureBtn) {
            wx.navigateTo({
                url: '../pointMall/pointMall'
            })
        }
    },

    toHome(){
        wx.reLaunch({
          url: '../index/index'
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