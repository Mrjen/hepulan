// pages/teacherDetail/teacherDetail.js
import { http, wxRequest } from '../../common'
import { statistic, fromPageData } from '../../tunji'
import api from '../../api'

Page({
  data: {
     teachData:[]
  },

  onLoad: function (options) {
      console.log("onload页面参数", options)
      let st_id = options.tid; 
      let that = this;

    // 后台数据统计上报
    statistic();
    wx.setStorageSync('scene', options.scene) 

    // 渠道统计  一定要放在wx.setStorageSync('scene', options.scene) 之后
    fromPageData()
    
    //  请求页面数据
      wxRequest({
         url: api.teachDeatil,
         data:{
            st_id: st_id
         }
      },function(res){
        console.log(res)
        if (res.data.status) {
          that.setData({
            teachData: res.data.data.skin_teacher_resume
          })
        }else{
          console.log('获取老师详情页数据出错',res)
        }
        
      })
  },

  // 播放视频
  playVideo(e){
     let that = this,
         Edata = e.currentTarget.dataset,
         teachData = that.data.teachData,
         resume = teachData.resume;

    resume.forEach(element => {
        element.play = false;
     });
     resume[Edata.idx].play = true;
     teachData.resume = resume;
     that.setData({
       teachData
     })
  },

  // 视频播放结束
  videoPlayEnd(){
    let that = this,
      teachData = that.data.teachData,
      resume = teachData.resume;
      resume.forEach(element => {
        element.play = false;
      });
    teachData.resume = resume;
    that.setData({
      teachData
    })
  },

  onReady: function () {
  
  },


  onShow: function () {
  
  },

  // 预览证书
  prevImg(){
    let that = this;
    wx.previewImage({
      current: that.data.teachData.diploma, 
      urls: [that.data.teachData.diploma] 
    })
  },

  // 预览历程中的图片
  prevContextImg(e){
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: [e.currentTarget.dataset.src]
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})