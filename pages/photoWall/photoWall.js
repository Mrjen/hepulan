const app = getApp();
var mta = require('../../utils/mta_analysis.js');
Page({
  data: {
    poster:'http://ovhvevt35.bkt.clouddn.com/photo/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20180105171204.png'
  },
  onLoad: function (options) {
    // 初始化腾讯统计
    mta.Page.init();

    let poster = options.poster;  
    this.setData({
      poster: poster
    })
  },

  // 统计点击次数
  potowall(){
    mta.Event.stat("photowall", {})
  },

  onShow: function () {
  }

})