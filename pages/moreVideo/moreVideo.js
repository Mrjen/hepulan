// pages/moreVideo/moreVideo.js
var app = getApp();
var common = require('../../common.js');
import { statistic, fromPageData } from '../../tunji'
import { http, wxRequest } from '../../common'
import api from '../../api'
Page({
  data: {
    videoData:'',
    navData:[],
    page:2,
    vt_id:'0',
    loadMore:true
  },

  onLoad: function (options) {
  
  },

  onReady: function () {
     
  },

  onShow: function () {
    let that = this;
      wxRequest({
        url:api.moreVideo
      },function(res){
        console.log(res)
        let videoData = res.data.data;
        let oldVideos = videoData.videos;
        that.setData({
          videoData,
          oldVideos
        })
      })

      wxRequest({
        url: api.videoNav
      },function(res){
        console.log('导航数据',res)
        let navData = res.data.data.videoTypes
        navData.map(el=>{
          el.active = false;
        })
        navData[0].active = true;
        that.setData({
          navData: navData
        })
      })

  },

  // 切换导航
  changeNav(e){
     let Edata = e.currentTarget.dataset,
         that = this,
         navData = that.data.navData,
         videoData = that.data.videoData;
          navData.map(el=>{
            el.active = false;
          })
          navData[Edata.idx].active = true;
          wxRequest({
            url: api.moreVideo,
            data:{
              page:1,
              vt_id:Edata.id,
              limit:10
            }
          },function(res){
            console.log('切换导航数据',res)
            videoData.videos = res.data.data.videos;
            let oldVideos = videoData.videos;
            that.setData({
              navData,
              videoData,
              page: 2,
              oldVideos,
              vt_id: Edata.id
            })
          })

  },

  // 播放视频
  playVideo(e){
    console.log(e)
     let that = this,
         Edata = e.currentTarget.dataset,
       oldVideos = that.data.oldVideos;
    oldVideos.map(el=>{
       el.play = false;
    })
    oldVideos[Edata.idx].play = true;
    oldVideos[Edata.idx].play_number++;
    that.setData({
      oldVideos
    })

    wxRequest({
      url: api.videoNum,
      data:{
        vid:Edata.vid
      }
    },function(res){
       console.log('统计视频播放',res)
    })
  },

  // 视频播放完成
  videoPlayEnd(e) {
    let that = this,
      Edata = e.currentTarget.dataset,
      videoData = that.data.videoData;
    videoData.videos.map(el => {
      el.play = false;
    })
    that.setData({
      videoData
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
           videoData = that.data.videoData,
           page = that.data.page,
           oldVideos = that.data.oldVideos;
           console.log('page',page)
           if(that.data.loadMore){
                that.setData({
                  loadMore:false
                })
               wxRequest({
                 url: api.moreVideo,
                 data:{
                   page: page,
                   vt_id: that.data.vt_id,
                   limit: 10
                 }
               },function(res) {
                 if (res.data.data.videos.length>0){
                   oldVideos = [...oldVideos, ...res.data.data.videos];
                   page++;
                 }else{
                   oldVideos = oldVideos
                   wx.showToast({
                     title: '没有更多数据',
                     icon: 'success',
                     duration: 1000
                   })
                 }

                 that.setData({
                   oldVideos,
                   page,
                   loadMore: true
                 })
               })
           }
  },

  onShareAppMessage: function () {
  
  }
})