// pages/login/login.js
var app = getApp();
var common = require('../../common.js');
import { statistic, fromPageData} from '../../tunji'
Page({
  data: {
    smpid:"",
    "join_img_url": "https://hepulan.playonwechat.com/static/join_suit.png",
    "join_qrcode": "../img/join_qrcode.png",
    wxcode: "",
    teacherId: "",
    applyWin: false,
    productList:[{
      url:"https://hepulan.playonwechat.com//static/apply01.png",
      title:"禾葡兰限量版口红",
      Eng:"HerbPlantist",
      btn:"阅读详情>>"
    },{
      url:"https://hepulan.playonwechat.com//static/apply02.png",
      title:"禾葡兰限量版口红",
      Eng:"HerbPlantist",
      btn:"阅读详情>>"
    }]
  },

  applyBtn: function(ev) {
    var that = this;
    console.log(ev);
    var smpid = ev.currentTarget.dataset.smpid;
    console.log(smpid);
    wx.navigateTo({
      url: '../applyDetail/applyDetail?smpid='+smpid
    })
  },
  onLoad: function(options) {

    // 后台数据统计上报
    statistic();
    wx.setStorageSync('sence', options.scene) 

    // 渠道统计  一定要放在wx.setStorageSync('sence', options.scene) 之后
    fromPageData()

    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this;
    var wxcode = options.wxcode;
    var teacherId = options.teacherId;
    console.log(teacherId);
    that.setData({
      wxcode: wxcode,
      teacherId: teacherId
    });
  },

  onReady: function() {
    // 页面渲染完成
  },

  onShow: function() {
    // 页面显示
    var that = this;
    var sign = app.data.sign;
    wx.request({
      url:'https://hepulan.playonwechat.com/site/get-samples?sign='+sign,
      method:'GET',
      success:function(res){
         //console.log(res);
         var productList = res.data.data;
         for (var i = 0; i < productList.length; i++) {
           productList[i].btn = "阅读详情";
         }
         that.setData({
             productList:productList
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
