var app = getApp();
// pages/sureExchange/sureExchange.js
Page({
    data: {
        address: []
    },

    onLoad: function(options) {
        console.log(options)
        let that = this;
        if (options.addressinfo) {
            that.setData({
                addressinfo: options.addressinfo
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
                type: "get-address-list"
            },
            success(res) {
                console.log(res);
                let address = res.data.data;
                that.setData({
                    address
                })
            }
        })
    },

    selectAddress(ev) {
        let that = this;
        let index = ev.currentTarget.dataset.index;
        let info = that.data.address[index];
        if (that.data.addressinfo == "submiteorder") {
            wx.navigateTo({
                url:`../shopSubmiteOrder/shopSubmiteOrder?address=${info.address}&name=${info.contact}&phone=${info.mobile}&addressid=${info.addressid}`
            })
        }
    },

    // 提交地址
    submitAddress() {
        var that = this;
        var addressInfo = that.data.addressInfo;

        var main_url = "../pointMall/pointMall";
        var vice_url = "../mine/mine";
        var page_text = "您的订单已提交，请耐心等待，我们会为您尽快处理"

        wx.redirectTo({
            url: '../IconPage/IconPage?status=1' + "&main_url=" + main_url + "&page_text=" + page_text + "&vice_url=" + vice_url
        })
    },

    // 添加地址
    ToAddaddress(){
       let that = this;
       let addressinfo = that.data.addressinfo;

       if (addressinfo) {
          wx.navigateTo({
          url: `../EditAddress/EditAddress?addressinfo=${addressinfo}`
        })
       }
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