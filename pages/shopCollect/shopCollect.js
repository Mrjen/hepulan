// pages/shopCollect/shopCollect.js
var common = require('../../common.js');
var app = getApp();
import { statistic, fromPageData } from '../../tunji'
Page({
  data: {
     
  },

  onLoad: function (options) {
    // 上报后台数据
    statistic();
    wx.setStorageSync('sence', options.scene)

    // 渠道统计  一定要放在wx.setStorageSync('sence', options.scene) 之后
    fromPageData()
  },

  onReady: function () {
  
  },

  onShow: function () {
    let that = this;
        wx.request({
          url:app.data.apiUrl,
          method:"POST",
          data:{
            sign: wx.getStorageSync("sign"),
            key:app.data.apiKey,
            type:"get-collect-list"
          },
          success(res){
             console.log(res)
            var shopList = res.data.data.collect_list;
            var pointCount = res.data.data.goods_list;
            that.setData({
              shopList,
              pointCount
            });
          },
          fail(res){
            console.log(res);
          }
        })
  },

  // 加入收藏夹
  exchangeBtn(ev){
    let that = this;
    let kid = ev.currentTarget.dataset.id;
    let _index = ev.currentTarget.dataset.index;
    let shopList = that.data.shopList;
    let pointCount = that.data.pointCount;
    console.log(kid)
    wx.request({
       url:app.data.apiUrl,
       method:"POST",
       data:{
         sign:wx.getStorageSync("sign"),
         key:app.data.apiKey,
         type:"save-collect-status",
         data:{
          kid:kid
         }
       },
       success(res){
         console.log(res);
         wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
          })
         if (res.data.data.state===1) {
            let _item = that.data.pointCount[_index];
                pointCount.splice(_index,1);
                shopList.unshift(_item);
                that.setData({
                   shopList,
                   pointCount
                })
         }else if(res.data.data.state===0){
             let _item = that.data.shopList[_index];
               shopList.splice(_index,1);
               pointCount.push(_item);
             that.setData({
                 shopList,
                 pointCount
              })
         }
       }
    })
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