// pages/mycoupon/mycoupon.js
import { http } from '../../common.js'
import { couPondiffTime } from '../../common.js'
import { time } from '../../common.js'
import { statistic } from '../../tunji'
Page({
  data: {
    nav: [{
      id: 1,
      text: '未使用',
      active: true
    }, {
      id: 2,
      text: '已使用',
      active: false
    }, {
      id: 3,
      text: '已过期',
      active: false
    }],
    coupon: []
  },

  onLoad: function (options) {
    // 上报后台数据
    statistic();
    wx.setStorageSync('sence', options.scene) 
  },

  // 导航切换
  changeNav(e) {
    let that = this;
    let idx = e.currentTarget.dataset.idx;
    let nav = this.data.nav;
    nav.forEach(element => {
      element.active = false;
    });
    nav[idx].active = true;
    http({
      type: 'get-user-coupon-list', data: {
        status: idx + 1
      }
    }, function (res) {
      console.log('我的优惠券', res)
      let coupon = res.data.data.user_coupon_list;
      let currentStemp = (new Date()).getTime();
      currentStemp = currentStemp / 1000;
      console.log(currentStemp)
      if (coupon && coupon.length) {
        coupon.forEach((element, idx) => {
          console.log(element)
          element.time = couPondiffTime(currentStemp, element.valid_time);
          element.begin = time(element.create_time, 0).replace(/-/g, ".");
          element.endtime = time(element.valid_time, 0).replace(/-/g, ".");
        })
      }

      that.setData({
        coupon,
        nav
      })
    })
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    http({
      type: 'get-user-coupon-list', data: {
        status: 1
      }
    }, function (res) {
      console.log('我的优惠券', res)
      let coupon = res.data.data.user_coupon_list;
      let currentStemp = (new Date()).getTime();
      currentStemp = currentStemp / 1000;
      console.log(currentStemp)
      coupon.forEach((element, idx) => {
        console.log(element)
        element.time = couPondiffTime(currentStemp, element.valid_time);
        element.begin = time(element.create_time, 0).replace(/-/g, ".");
        element.endtime = time(element.valid_time, 0).replace(/-/g, ".");
      })
      console.log(coupon)
      that.setData({
        coupon
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})