// pages/myOrder/myOrder.js
import { statistic, fromPageData } from '../../tunji'
import { http, wxRequest } from '../../common'
import api from '../../api'

Page({
  data: {
    page:2,
    orderData:[],
    loadMore:true
  },

  onLoad: function (options) {
  
  },

  onReady: function () {
  
  },

  onShow: function () {
    let that = this;
     http({
       type:'get-user-order-list-hfzx',
       data:{
         page:1
       }
     },function(res){
       console.log(res)
       that.setData({
         orderData: res.data.data.user_order_list
       })
     })
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
     let that = this,
         page = that.data.page,
         orderData = that.data.orderData;
      if(that.data.loadMore){
         that.setData({
             loadMore:false
         })
         http({
           type:'get-user-order-list-hfzx',
           data:{
             page:that.data.page
           }
         },function(res) {
           console.log('加载更多数据', res.data.data.user_order_list)
           if (res.data.data.user_order_list.length>0){
             console.log(111)
             orderData = [...orderData,...res.data.data.user_order_list]
             page++;
           }else{
              orderData = orderData;
           }

           that.setData({
             orderData,
             page,
             loadMore: true
           })
         })
      }
  },

  onShareAppMessage: function () {
  
  }
})