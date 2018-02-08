// pages/skinCase/SkinCase.js
Page({
  data: {
     playData:{
       video1:false,
       video2:false,
       video3:false
     },
     test:"4545645"
  },

  onLoad: function (options) {
  
  },

  // 视频播放函数
  playVideo(play=''){
     let that = this;
     let playData = {
       video1: false,
       video2: false,
       video3: false
     }
     playData[play] = true;
     that.setData({playData})
  },

  //  视频播放完成
  playEnd(){
    let that = this;
    let playData = {
      video1: false,
      video2: false,
      video3: false
    }
    that.setData({
      playData
    })
  },

  // 第一个视频播放
  playVideo1(){
    this.playVideo('video1');
  },

  // 教授视频播放
  playVideo2(){
    this.playVideo('video2');
  },

  // 播放skincase
  playVideo3(){
    this.playVideo('video3');
  },

  onReady: function () {
  
  },

  onShow: function () {
  
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