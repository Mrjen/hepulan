// pages/search/search.js
import { http, wxRequest } from '../../common'
import { statistic, fromPageData } from '../../tunji'
import api from '../../api'

Page({
  data: {
     teachList:[]
  },

  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  searchTeach(e) {
    let that = this;
    wxRequest({
      url: api.searchTeach,
      data: {
        keywords: e.detail.value
      }
    }, function (res) {
      console.log(res)
      if (res.data.status) {
        that.setData({
          teachList: res.data.data.skin_teachers
        })
      }

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // let that = this;
    // wxRequest({
    //   url: api.searchTeach,
    //   data: {
    //     keywords:'a'
    //   }
    // }, function (res) {
    //   console.log(res)
    //   that.setData({
    //     teachList: res.data.data.skin_teachers
    //   })
    // })
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