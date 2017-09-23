// pages/pointMall/pointMall.js
var common = require('../../common.js')
Page({
  data: {
    pointCount:"",
    shopList:[],
    start:0
  },

  onLoad: function (options){

  },

// 兑换
exchangeBtn(ev){
  var _id = ev.currentTarget.dataset.id;
  console.log(_id);
  var jifen = ev.currentTarget.dataset.jifen;
  wx.showModal({
  title: '提示',
  content: '兑换此商品需要花费'+jifen+"积分,确定兑换吗？",
  success: function(res) {
    if (res.confirm) {
      console.log('用户点击确定')
    } else if (res.cancel) {
      console.log('用户点击取消')
    }
  }
})
},

  onReady: function () {

  },

  onShow: function () {
    var that = this;
    var avatarUrl = wx.getStorageSync("avatarUrl");
    var nickName = wx.getStorageSync("nickName");
    that.setData({
      avatarUrl:avatarUrl,
      nickName:nickName
    });
    common.getVipId(18372668568,function(){
        var vip_id = wx.getStorageSync("vip_id");
        console.log(vip_id);
        wx.request({
          url:'https://api.hepulanerp.com/hpl/index.php?s=/Api/hfzx/index',
          method:"POST",
          header: {
              'content-type': 'application/json'
          },
          data:{
            key:"be15d4ca913c91494cb4f9cd6ce317c6",
            type:"getUsableExchangeList",
            data:{
              start:0,
              length:10,
              vip_id:vip_id
            }
          },
          success(res){
            var shopList = res.data.data.exchange_list;
            var pointCount = res.data.data.usable_score;
            that.setData({
              shopList:shopList,
              vip_id:vip_id,
              pointCount:pointCount
            });
          },
          fail(res){
            console.log(res);
          }
        })
    });
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function (ev) {
    var that = this;
    var _start = that.data.start +10;
    var vip_id = that.data.vip_id;
    wx.request({
      url:'https://api.hepulanerp.com/hpl/index.php?s=/Api/hfzx/index',
      method:"POST",
      header: {
          'content-type': 'application/json'
      },
      data:{
        key:"be15d4ca913c91494cb4f9cd6ce317c6",
        type:"getUsableExchangeList",
        data:{
          start:_start,
          length:10,
          vip_id:vip_id
        }
      },
      success(res){
        console.log(res);
        var shopList = res.data.data.exchange_list;
        var oldList = that.data.shopList;
        if (shopList.length>0) {
          _start += 10;
          shopList = oldList.concat(shopList);
          console.log(shopList);
        }else {
          shopList = oldList;
          wx.showToast({
            title: '没有更多数据',
            icon: 'success',
            duration: 1000
          })
        }
        that.setData({
          shopList:shopList,
          start:_start
        })
      },
      fail(res){
        console.log(res);
      }
    })
  },

  onShareAppMessage: function () {

  }
})
