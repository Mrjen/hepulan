// pages/ShopLogistics/ShopLogistics.js
var app = getApp();
let common = require('../../common.js');
import { statistic } from '../../tunji'
Page({
  data: {
     editAddress:"../myAddress/myAddress?addressinfo=editAddress"
  },

  onLoad: function (options) {
    console.log(options)

    // 上报后台数据
    statistic();
    wx.setStorageSync('sence', options.scene) 

      let that = this;
      let order_num = options.order_num;
      let addressid = options.addressid;
      let orderEditaddress = options.orderEditaddress;
      let info = {
         contact:options.name,
         mobile:options.phone,
         address:options.address,
         detail:options.detail
      }
      that.setData({
         order_num,
         addressid,
         orderEditaddress,
         info
      })
  },

  onReady: function () {
  
  },

  // 修改地址
  toMyaddress(){
      console.log("11111",getCurrentPages())
      let that = this;
      let order_num = that.data.order_num;
      console.log(that.data)
      console.log(order_num)
      wx.reLaunch({
        url: `../myAddress/myAddress?addressinfo=editAddress&order_num=${that.data.order_num}`
      })
  },

  onShow: function () {
    let that = this;
    wx.request({
      url:app.data.apiUrl,
      method:"POST",
      data:{
        sign:wx.getStorageSync("sign"),
        key:app.data.apiKey,
        type:"get-order-detail",
        data:{
           order_num:that.data.order_num
        }
      },
      success(res){
        console.log(res)
        let opration_usable = res.data.data.opration_usable;
        let editAddress = that.data.editAddress;
        let info = res.data.data.address;
        let orderEditaddress = that.data.orderEditaddress;
        let exchange_infos = res.data.data.exchange_infos;
        for (var i = 0; i < exchange_infos.length; i++) {
          exchange_infos[i].img = `${exchange_infos[i].url_prefix}${exchange_infos[i].imgurl}`
        }
        if (opration_usable=='0') {
              editAddress = "";
        }
        if (orderEditaddress) {
           info = that.data.info;
        }
        that.setData({
          info,
          exchange_infos,
          express_com:res.data.data.express_com,
          express_num:res.data.data.express_num,
          express_list:res.data.data.express_list,
          cart_select_sum:res.data.data.cart_select_sum,
          opration_usable,
          editAddress
        })
      }
    })
  },

  // 取消订单
  deleteOrder(ev){
     let that = this;
     let order_num = ev.currentTarget.dataset.order;
     let http = {
        type:"delete-order",
        data:{
          order_num
        }
     };
     common.http(http,function(res){
        if (res.data.status===1) {
           wx.showToast({
            title: '订单取消成功',
            icon: 'success',
            duration: 2000
          })
           that.setData({
              opration_usable:0,
              editAddress:""
           })
        }else{
           wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
        }
     })
  },

  // 修改地址
  EditOrder(){
    let that = this;
    let order_num = that.data.order_num;
    let addressid = that.data.addressid;
    let orderEditaddress = that.data.orderEditaddress;
    let http = {
       type:"save-order-address",
       data:{
         order_num,
         addressid:that.data.addressid
       }
    }

    if (orderEditaddress) {
        common.http(http,function(res){
           console.log(res);
           if (res.data.status===1) {
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 2000
               })
           }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 2000
              })
           }
        })
    }else{
        wx.showToast({
          title: "请先修改地址",
          icon: 'success',
          duration: 2000
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