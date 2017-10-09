// pages/shopSubmiteOrder/shopSubmiteOrder.js
var app = getApp();
var failText = {
   title:"很遗憾TAT",
   text1:"您的积分不足",
   text2:"无法完成此次兑换",
   img:"https://qncdn.playonwechat.com/hepulan/nopoints.png",
   btnText:"赚取更多积分"
}

var successText = {
   title:"成功兑换",
   text1:"礼品将会在数个工作日",
   text2:"内送到您的手上",
   img:"https://qncdn.playonwechat.com/hepulan/win.png",
   btnText:"兑换更多礼品"
}

Page({
  data: {
    winText:"",
    winStatus:false
  },

  onLoad: function (options) {
     console.log(options);
     let that = this;
     let addressid = options.addressid;
     if (options.address&&options.name&&options.phone) {
         let info = {
            address:options.address,
            name:options.name,
            phone:options.phone
         }
         that.setData({
             info,
             addressid
         })
     }
  },

  onReady: function () {
  
  },

  onShow: function () {
    let that = this;
     wx.request({
       url:app.data.apiUrl,
       method:"POST",
       data:{
         sign:wx.getStorageSync("sign"),
         key:app.data.apiKey,
         type:"get-confirm-cart-info",
         data:{
           addressid:that.data.addressid?that.data.addressid:0
         }
       },
       success(res){
         console.log(res);
         let cart_list = res.data.data.cart_list;
             for (var i = 0; i < cart_list.length; i++) {
               cart_list[i].img = `${cart_list[i].url_prefix}${cart_list[i].imgurl}`
             }
          that.setData({
             cart_list
          })
       }
     })
  },

  toAddress(){
     wx.redirectTo({
      url: '../myAddress/myAddress?addressinfo=submiteorder'
    })
  },

// 提交订单
  SaveOrder(){
    let that = this;
    let addressid = that.data.addressid;
    let pagePath = "../shopSubmiteOrder/shopSubmiteOrder";
    console.log(that.data)
    wx.request({
      url:app.data.apiUrl,
      method:"POST",
      data:{
        sign:wx.getStorageSync("sign"),
        key:app.data.apiKey,
        type:"save-order",
        data:{
          addressid:addressid
        }
      },
      success(res){
         console.log(res);
         if (res.data.status=="1") {
           that.setData({
              winStatus:true,
              winText:successText,
              sureStatus:true
           })
         }else if(res.data.status<0){
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
         that.setData({
           sureStatus:true
         })
      }
    })
  },

  sureBtn(){
     let that = this;
     let sureBtn = that.data.sureStatus;
     if (sureBtn) {
        wx.navigateTo({
          url: '../pointMall/pointMall'
        })
     }
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {
  
  }
})