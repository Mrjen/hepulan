// pages/moreTeacher/moreTeacher.js
import { http, wxRequest} from '../../common'
import { statistic, fromPageData } from '../../tunji'
import api from '../../api'

Page({
  data: {
    teachList:{}
  },

  onLoad: function (options) {

    // 后台数据统计上报
    statistic();
    wx.setStorageSync('sence', options.scene)

    // 渠道统计  一定要放在wx.setStorageSync('sence', options.scene) 之后
    fromPageData()

    
  },

  // 查看老师详情
  toTeachDetail(e){
    wx.navigateTo({
      url: `../teacherDetail/teacherDetail?tid=${e.currentTarget.dataset.tid}`
    })
  },

  onReady: function () {
  
  },

  onShow: function () {
    let that = this;
      wxRequest({
         url:api.teachList
      },function(res){ 
        if (res.data.status){
          let teachList = res.data.data;
          that.setData({
            teachList
          })
        }else{
           console.log('请求老师列表数据出错')
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