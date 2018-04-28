// pages/pointMallCar/pointMallCar.js
var app = getApp();
let common = require('../../common.js');
import { statistic, fromPageData } from '../../tunji'
import {http} from '../../common'
Page({
  data: {
    list: [],
    allSelect: false,
    mode: "one",
    delBtnWidth: 150,
    is_app_auth: null
  },

  onLoad: function(options) {
    // 上报后台数据
    statistic();
    wx.setStorageSync("scene", options.scene);

    // 渠道统计  一定要放在wx.setStorageSync('scene', options.scene) 之后
    fromPageData();
  },

  onReady: function() {},

  onShow: function() {
    let that = this;
    let sign = wx.getStorageSync("sign");
    let AllMoney = new Number();
    http({
        type: "get-cart-list"
      },
      function(res) {
        console.log("111", res);
        let list = res.data.data;
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
        });
      }
    );
    this.setData({
        is_app_auth: wx.getStorageSync('is_app_auth')
    })
  },

  // 授权
  getUserInfo(e) {
    console.log(e.detail.userInfo);
    let that = this;
    let userInfo = e.detail.userInfo;
    if (!userInfo) return;
    userInfo.is_app_auth = 1;
    http({
        type: "save-user-info",
        data: { info: userInfo }
     },
      function(res) {
        if(res.data.status === 1){
            console.log("res1", res.data.data.user_info.is_app_auth);
            that.setData({
               is_app_auth: res.data.data.user_info.is_app_auth
            });
        } 
      }
    );
  },

  // 勾选商品
  selectGoods(ev) {
    let that = this;
    let Edata = ev.currentTarget.dataset;
    let list = that.data.list;
    let AllMoney = new Number();
    list[Edata.index].is_select =
      list[Edata.index].is_select == "1" ? "0" : "1";
    console.log(list[Edata.index].is_select);
    http(
      {
        type: "save-cart-select",
        data: {
          gid: Edata.gid,
          is_select: list[Edata.index].is_select,
          mode: "one"
        }
      },
      function(res) {
        console.log(res);
        AllMoney = that.countGoods(list);
        console.log(AllMoney);
        that.setData({
          list,
          AllMoney
        });
      }
    );
  },

  // 加商品
  addGoods(ev) {
    let that = this;
    let Edata = ev.currentTarget.dataset;
    let list = that.data.list;
    let AllMoney = new Number();
    list[Edata.index].goods_num += 1;
    http(
      {
        type: "save-cart-num",
        data: {
          gid: Edata.gid,
          goods_num: list[Edata.index].goods_num
        }
      },
      function(res) {
        console.log(res);
        AllMoney = that.countGoods(list);
        console.log(list);
        that.setData({
          list,
          AllMoney
        });
      }
    );
  },

  // 减商品
  cutGoods(ev) {
    let that = this;
    let Edata = ev.currentTarget.dataset;
    let list = that.data.list;
    let AllMoney = new Number();
    // console.log(list[_index].goods_num)
    if (list[Edata.index].goods_num > 1) {
      list[Edata.index].goods_num -= 1;
      http(
        {
          type: "save-cart-num",
          data: {
            gid: Edata.gid,
            goods_num: list[Edata.index].goods_num
          }
        },
        function(res) {
          console.log(res);
          if (res.data.status === 1) {
            AllMoney = that.countGoods(list);
            that.countGoods(list);
            that.setData({
              list,
              AllMoney
            });
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "success",
              duration: 1000
            });
          }
        }
      );
    } else if (list[Edata.index].goods_num < 1) {
      list[Edata.index].goods_num = 1;
    }
  },

  // 删除商品
  deleteProduct(ev) {
    let that = this;
    let gid = ev.currentTarget.dataset.gid;
    let _index = ev.currentTarget.dataset.index;
    let list = that.data.list;
    let AllMoney = new Number();
    wx.request({
      url: app.data.apiUrl,
      method: "POST",
      data: {
        sign: wx.getStorageSync("sign"),
        key: app.data.apiKey,
        type: "remove-cart-info",
        data: {
          gid: gid
        }
      },
      success(res) {
        console.log(res.data.status);
        if (res.data.status === 1) {
          list.splice(_index, 1);
          console.log(list);

          AllMoney = that.countGoods(list);
          that.setData({
            list,
            AllMoney
          });
          wx.showToast({
            title: "删除成功",
            icon: "success",
            duration: 1000
          });
        } else {
          wx.showToast({
            title: res.data.mag,
            icon: "success",
            duration: 1000
          });
        }
      }
    });
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
            console.log(AllMoney);
            that.setData({
              list,
              AllMoney
            });
          }
        }
      });
    } else {
      console.log(allSelect);
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
            console.log(AllMoney);
            that.setData({
              list,
              AllMoney
            });
          }
        }
      });

      for (var i = 0; i < list.length; i++) {
        list[i].is_select = 1;
      }
      AllMoney = that.countGoods(list);
    }
    that.setData({
      list,
      AllMoney,
      allSelect: !that.data.allSelect
    });
  },

  // 结算
  Tosetttle() {
    let that = this;
    let pagePath = "../pointMallCar/pointMallCar";
    wx.request({
      url: app.data.apiUrl,
      method: "POST",
      data: {
        sign: wx.getStorageSync("sign"),
        key: app.data.apiKey,
        type: "action-confirm-cart"
      },
      success(res) {
        console.log(res);
        if (res.data.status === 1) {
          wx.reLaunch({
            url: "../shopSubmiteOrder/shopSubmiteOrder"
          });
        } else if (res.data.status < 0) {
          wx.showModal({
            title: "提示",
            content: "您还没有注册，是否去注册",
            success: function(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: "../login/login?pagePath=" + pagePath
                });
              } else if (res.cancel) {
              }
            }
          });
        } else if (res.data.status === 0) {
          wx.showToast({
            title: res.data.msg,
            icon: "success",
            duration: 2000
          });
        }
      }
    });
  },

  // 修改款式
  ChangeType(ev) {
    let that = this;
    let product_id = ev.currentTarget.dataset.id;
    let gid = ev.currentTarget.dataset.gid;
    let changeIndex = ev.currentTarget.dataset.index;
    console.log("product_id", product_id);
    wx.request({
      url: app.data.apiUrl,
      method: "POST",
      data: {
        sign: wx.getStorageSync("sign"),
        key: app.data.apiKey,
        type: "get-glist-by-kid",
        data: {
          kid: product_id
        }
      },
      success(res) {
        console.log(res);
        let selectWinData = res.data.data;
        that.setData({
          selectWinData
        });
        console.log(that.data);
      }
    });

    that.setData({
      selectWin: true,
      gid,
      changeIndex
    });
  },

  // 选择款式
  changeType(ev) {
    let that = this;
    let index = ev.currentTarget.dataset.index;
    let selectWinData = that.data.selectWinData;
    let type_id = ev.currentTarget.dataset.id;
    let image =
      selectWinData.details[index].url_prefix +
      selectWinData.details[index].imgurl;
    // console.log("type_id",type_id,image)
    for (var i = 0; i < selectWinData.details.length; i++) {
      selectWinData.details[i].active = 0;
    }
    selectWinData.details[index].active = 1;
    selectWinData.color = selectWinData.details[index].color;
    selectWinData.imgurl = image;
    selectWinData.amount = selectWinData.details[index].amount;
    that.setData({
      selectWinData,
      type_id
    });
  },

  // 修改保存颜色
  SaveGoodsInfo(ev) {
    let that = this;
    let type_id = that.data.type_id;
    let gid = that.data.gid;
    let list = that.data.list;
    let changeIndex = that.data.changeIndex;
    if (type_id) {
      wx.request({
        url: app.data.apiUrl,
        method: "POST",
        data: {
          sign: wx.getStorageSync("sign"),
          key: app.data.apiKey,
          type: "save-ginfo-by-gid",
          data: {
            gid: type_id,
            from_gid: gid
          }
        },
        success(res) {
          console.log(res);
          if (res.data.status === 1) {
            wx.showToast({
              title: "颜色修改成功",
              icon: "success",
              duration: 1000
            });
            let img = `${res.data.url_prefix}${res.data.data.imgurl}`;
            list[changeIndex].img = img;
            list[changeIndex].color = res.data.data.color;
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "success",
              duration: 1000
            });
          }
          console.log(list);
          that.setData({
            selectWin: false,
            list
          });
        }
      });
    } else {
      wx.showToast({
        title: "请选择颜色",
        icon: "success",
        duration: 1000
      });
    }
  },

  // 关闭选择类别
  selectWin(ev) {
    let that = this;
    that.setData({
      selectWin: false
    });
  },

  touchS: function(e) {
    if (e.touches.length == 1) {
      // console.log(e.touches[0].clientX);
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function(e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {
        //如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {
        //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "rpx";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      console.log(index);
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },
  touchE: function(e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle =
        disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },

  onHide: function() {},

  onUnload: function() {},

  onPullDownRefresh: function() {},

  onReachBottom: function() {},

  onShareAppMessage: function() {}
});