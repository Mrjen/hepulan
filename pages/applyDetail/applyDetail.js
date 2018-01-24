// pages/applyDetail/applyDetail.js
var WxParse = require('../../utils/wxParse.js');
var common = require('../../common.js');
var {http} = require('../../common');
import { statistic, fromPageData} from '../../tunji'
var app = getApp();
Page({
  data: {
    wxcode: "",
    teacherId: "",
    copyTeach: false,
    teach_static: false,
    templateData: [{
      teacher_id: "",
      title_tip: '请咨询您的专属护肤老师'
    }]
  },

// 生命周期函数--监听页面加载
  onLoad: function(options) {
    console.log(options);

    // 渠道统计
    fromPageData()
     
    // 后台数据统计上报
    statistic();
    wx.setStorageSync('sence', options.scene)   

    var smpid = options.smpid;
    var sign = app.data.sign;
    console.log(smpid);
    var that = this;
    wx.request({
      url: 'https://hepulan.playonwechat.com/site/get-sample-detail?sign=' + sign,
      method: 'GET',
      data: {
        smpId: smpid
      },
      success: function(res) {
        console.log(2222,res);
        var article = res.data.data.detail;
        that.setData({
          article: article
        })
        WxParse.wxParse('article', 'html', that.data.article, that, 5);
      }
    })
  },

  applyBtn: function() {
    var that = this;
    that.setData({
      copyTeach: true
    });
  },

  sureBtn: function() {
    var that = this;
    that.setData({
      copyTeach: false
    });
  },

  cencelBbtn: function() {
    var that = this;
    that.setData({
      copyTeach: false
    });
  },

// 生命周期函数--监听页面初次渲染完成
  onReady: function() {

  },

// 生命周期函数--监听页面显示
  onShow: function() {
    var that = this;
    var teacherId = wx.getStorageSync("teacherId");
    console.log("teacherId", teacherId);
    that.data.teacherId = teacherId;
    var templateData = [];
    templateData[0] = {};
    templateData[0].teacher_id = teacherId;
    templateData[0].title_tip = "请咨询您的专属护肤老师";
    console.log(that.data.templateData)
    if (teacherId == "") {
      that.setData({
        teach_static: true,
        templateData: templateData
      })
    } else {
      that.setData({
        teach_static: false,
        templateData: templateData
      })
    }
  },

  // 返回首页
  backHome: function() {
    common.backHome();
  },

  // 分享海报
  toShare: function() {
    common.toShare();
  },

// 生命周期函数--监听页面隐藏
  onHide: function() {

  },

// 生命周期函数--监听页面卸载
  onUnload: function() {

  },

// 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {

  },

// 页面上拉触底事件的处理函数
  onReachBottom: function() {

  },

// 用户点击右上角分享
  onShareAppMessage: function() {

  }
})
