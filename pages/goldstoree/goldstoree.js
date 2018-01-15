// pages/login/login.js
var common = require('../../common.js');
var app = getApp();
import { statistic } from '../../tunji'
Page({
  data: {
    swiperTab: [{
      content: "1111",
      imgs:["https://hepulan.playonwechat.com/static/goldstore_img3.png",
      "https://hepulan.playonwechat.com/static/goldstore_img3.png",
      "https://hepulan.playonwechat.com/static/goldstore_img3.png"],
      shop_price: "28",
      shop_gold: "2800"
    }, {
      content: "222222",
      imgs:["https://hepulan.playonwechat.com/static/goldstore_img3.png",
      "https://hepulan.playonwechat.com/static/goldstore_img3.png",
      "https://hepulan.playonwechat.com/static/goldstore_img3.png"],
      shop_price: "28",
      shop_gold: "2700"
    }, {
      content: "222222",
      imgs:["https://hepulan.playonwechat.com/static/goldstore_img3.png",
      "https://hepulan.playonwechat.com/static/goldstore_img3.png",
      "https://hepulan.playonwechat.com/static/goldstore_img3.png"],
      shop_price: "28",
      shop_gold: "2600"
    }],
    autoplay: false,
    interval: 5000,
    duration: 800,
    swiperCurrent: 0,
  },
  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  getHot:function(){
    wx.navigateTo({
      url: '../shareHot/shareHot',
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  imgPre:function(e){
     var that = this;
     var tab = that.data.swiperTab;
     var current_tab = that.data.swiperCurrent;
     if (current_tab>0) {
       current_tab = that.data.swiperCurrent-1;
     }else {
       current_tab = tab.length-1;
     }
     that.setData({
       swiperCurrent:current_tab
     })
  },
  imgNext:function(){
    var that = this;
    var tab = that.data.swiperTab;
    var current_tab = that.data.swiperCurrent+1;
    if (current_tab<tab.length) {
       current_tab = that.data.swiperCurrent+1;
    }else {
       current_tab = 0;
    }
    that.setData({
      swiperCurrent:current_tab
    })
    console.log(current_tab);
  },

  check: function(ev) {
    var that = this;
    var priceCoins = ev.target.dataset.price;
    var hot_price = ev.target.dataset.hot;
    var coins = that.data.coins;
    var hot_points = that.data.hot_points;
    var is_exchange = ev.target.dataset.exchange;
    var prod_id = ev.target.dataset.id;
    if(is_exchange == 0){
      wx.request({
        url: 'https://hepulan.playonwechat.com/site/exchange-goods',
        method: "GET",
        data: {
          sign: app.data.sign,
          prod_id: prod_id
        },
        success:function(res){
          console.log("兑换",res);
          var weixin = res.data.data.weixin;
          if(res.data.status == 0){
            wx.showModal({
              title: '温馨提示',
              content: res.data.msg,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }else{
            wx.showModal({
              title: '温馨提示',
              content: '恭喜您兑换成功，添加客服微信留下您的邮寄地址，我们将以最快的速度为您送达！客服微信号：' + weixin,
              confirmText: "复制微信",
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.setClipboardData({
                    data: weixin,
                    success: function (res) {
                      wx.getClipboardData({
                        success: function (res) {
                          console.log(res.data) 
                          coins = coins - priceCoins;
                          that.setData({
                            coins: coins
                          })
                          wx.showToast({
                            title: '兑换成功',
                            icon: "success",
                            duration: 800
                          })
                        }
                      })
                    }
                  })
                } 
              }
            })
          }
          
        }
      })
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '请选择金币兑换还是热力兑换',
        confirmText: "热力兑换",
        cancelText: "金币兑换",
        success:function(res){
          if (res.confirm) {
            wx.request({
              url: 'https://hepulan.playonwechat.com/site/exchange-goods',
              method: "GET",
              data: {
                sign: app.data.sign,
                prod_id: prod_id,
                type: false
              },
              success: function (res) {
                console.log(res);
                var weixin = res.data.data.weixin;
                if (res.data.status == 0) {
                  wx.showModal({
                    title: '温馨提示',
                    content: res.data.msg,
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                } else {
                  wx.showModal({
                    title: '温馨提示',
                    content: '恭喜您兑换成功，添加客服微信留下您的邮寄地址，我们将以最快的速度为您送达！客服微信号：' + weixin,
                    confirmText: "复制微信",
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        wx.setClipboardData({
                          data: weixin,
                          success: function (res) {
                            wx.getClipboardData({
                              success: function (res) {
                                console.log(res.data)
                                hot_points = hot_points - hot_price;
                                that.setData({
                                  hot_points: hot_points
                                })
                                wx.showToast({
                                  title: '兑换成功',
                                  icon: "success",
                                  duration: 800
                                })
                              }
                            })
                          }
                        })
                      }
                    }
                  })
                }

              }
            })
          } else if(res.cancel) {
            wx.request({
              url: 'https://hepulan.playonwechat.com/site/exchange-goods',
              method: "GET",
              data: {
                sign: app.data.sign,
                prod_id: prod_id
              },
              success: function (res) {
                console.log(res);
                var weixin = res.data.data.weixin;
                if (res.data.status == 0) {
                  wx.showModal({
                    title: '温馨提示',
                    content: res.data.msg,
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                } else {
                  wx.showModal({
                    title: '温馨提示',
                    content: '恭喜您兑换成功，添加客服微信留下您的邮寄地址，我们将以最快的速度为您送达！客服微信号：' + weixin,
                    confirmText: "复制微信",
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        wx.setClipboardData({
                          data: weixin,
                          success: function (res) {
                            wx.getClipboardData({
                              success: function (res) {
                                console.log(res.data)
                                coins = coins - priceCoins;
                                that.setData({
                                  coins: coins
                                })
                                wx.showToast({
                                  title: '兑换成功',
                                  icon: "success",
                                  duration: 800
                                })
                              }
                            })
                          }
                        })
                      }
                    }
                  })
                }

              }
            })
          }
        }
      })
    }

  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;


    // 上报后台数据
    statistic();
    wx.setStorageSync('sence', options.scene) 

    wx.request({
      url:'https://hepulan.playonwechat.com/site/get-cat-products?sign='+app.data.sign,
      data:{
        page:1
      },
      header: {
         'content-type': 'application/json'
       },
      success:function(res){
        console.log("商品",res);
        var navData = res.data.data[0].products;
        console.log(navData);
        that.setData({
           navData:navData
        });
        that.setData({
           swiperTab:navData
        });
         console.log(that.data.navData);
         console.log(that.data.swiperTab);
      }
    })
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    var that = this;
    wx.request({
      url: 'https://hepulan.playonwechat.com/site/get-coins?sign=' + app.data.sign,
      method: "GET",
      success:function(res){
          var coins = res.data.data.coins;
          var hot_points = res.data.data.hot_points;
          that.setData({
            coins:coins,
            hot_points: hot_points
          })
      }
    })
  },
  // 返回首页
    backHome:function(){
       common.backHome();
    },

  // 分享海报
    toShare:function(){
      common.toShare();
    },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭

  }
})
