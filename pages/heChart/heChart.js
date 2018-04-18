// pages/heChart/heChart.js
var common = require('../../common.js');
var app = getApp();
import { statistic, fromPageData, userClickCantact } from '../../tunji'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topNav:[{
      navText:"精选"
    },{
      navText:"最热"
    },{
      navText:"最新"
    }],
    imgUrls: [{
       img:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
       imgtip:"巴黎埃菲尔铁塔巴黎埃菲尔铁塔巴黎埃菲尔铁塔巴黎埃菲尔铁塔"
    },{
       img:'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
       imgtip:"涂鸦涂鸦涂鸦涂鸦涂鸦涂鸦涂鸦涂鸦涂鸦"
    },{
       img:'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
       imgtip:"篮球比赛篮球比赛篮球比赛篮球比赛"
    }],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    labelItem:[{
      id:'1',
      worlds:"全部",
      select:1,
    },{
      id:'2',
      worlds:"护肤",
      select:0
    },{
      id:'3',
      worlds:"美白",
      select:0
    }],
    videoList:[{
      id:0,
      persion_num:2500,
      videoStatic:"即将开始",
      videoType:"免费",
      videoTitle:"夏季美白做的好，男神追着跑",
      videoPoster:'https://hepulan.playonwechat.com/static/heChart/he_chart_video_poster1.jpg'
    },{
      id:1,
      persion_num:2500,
      videoStatic:"正在直播",
      videoType:"免费",
      videoTitle:"鲜为人知的夏季预防皮肤中暑秘诀",
      videoPoster:'https://hepulan.playonwechat.com/static/heChart/he_chart_video_poster2.jpg'
    },{
      id:2,
      persion_num:2500,
      videoStatic:"回放中",
      videoType:"免费",
      videoTitle:"不做尴尬的卸妆'死',先从护肤开始",
      videoPoster:'https://hepulan.playonwechat.com/static/heChart/he_chart_video_poster2.jpg'
    },{
      id:3,
      persion_num:2500,
      videoStatic:"即将开始",
      videoType:"免费",
      videoTitle:"夏季美白做的好，男神追着跑",
      videoPoster:'https://hepulan.playonwechat.com/static/heChart/he_chart_video_poster2.jpg'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 上报后台数据
    statistic();
    wx.setStorageSync('scene', options.scene) 

    // 渠道统计  一定要放在wx.setStorageSync('scene', options.scene) 之后
    fromPageData()

  },

  // 点击咨询客服接口
  clickCantact() {
    userClickCantact();
  },

  // 点击标签加载数据  美容、护肤
  labelItem:function(ev){
     console.log(ev);
     var that = this;
     var  id = ev.target.dataset.id;

     console.log(id)
     var labelItem = that.data.labelItem;
     var idx = ev.target.dataset.idx;
     for (var i = 0; i < labelItem.length; i++) {
       labelItem[i].select = '0';
       labelItem[idx].select = '1';
     }
     wx.showLoading({
        title: '加载中',
      })
     wx.request({
      url: 'https://hepulan.playonwechat.com/site/get-zb-home?sign=' + app.data.sign,
      method:"GET",
      data:{
        tagId:id
      },
      success:function(res){
          console.log(res)
          var videoList = res.data.data.list;
          var video_list = [];
          var nowTime = (new Date()).getTime();  //获取当前时间
          for (var j = 0; j < videoList.length; j++) {
            video_list[j]  = {};
            video_list[j].persion_num = videoList[j].look_numbers;
            video_list[j].videoType = "免费";
            video_list[j].videoTitle = videoList[j].topic_name;
            video_list[j].videoPoster = videoList[j].topic_icon;
            video_list[j].id = videoList[j].topic_id;
            if ((videoList[j].begin_time*1000)<nowTime&&(videoList[j].end_time*1000)>nowTime) {
                  video_list[j].videoStatic = "直播中";
            }if (((videoList[j].begin_time*1000)>nowTime)) {
                 video_list[j].videoStatic = "即将开始";
            }else if ((videoList[j].end_time*1000)<nowTime) {
                 video_list[j].videoStatic = "回放中";
            }
          }
          setTimeout(function(){
            wx.hideLoading()
          },500)
        that.setData({
           videoList:video_list,
           labelItem:labelItem
        })
      }
     })
  },

// 顶部标签  精选、最热、最新
topNav:function(ev){
  console.log(ev);
  var that = this;
  var top_nav = ev.target.dataset.navtext;
  var sort = ev.target.dataset.sort;
  console.log(sort)
  console.log(top_nav)
  wx.showLoading({
     title: '加载中',
   })
  wx.request({
      url: 'https://hepulan.playonwechat.com/site/get-zb-home?sign=' + app.data.sign,
      method:"GET",
      data:{
        sort:sort
      },
      success:function(res){
          console.log(res);
          var videoList = res.data.data.list;
          var video_list = [];
          var nowTime = (new Date()).getTime();  //获取当前时间
          for (var j = 0; j < videoList.length; j++) {
            video_list[j]  = {};
            video_list[j].persion_num = videoList[j].look_numbers;
            video_list[j].videoType = "免费";
            video_list[j].videoTitle = videoList[j].topic_name;
            video_list[j].videoPoster = videoList[j].topic_icon;
            video_list[j].id = videoList[j].topic_id;
            if ((videoList[j].begin_time*1000)<nowTime&&(videoList[j].end_time*1000)>nowTime) {
                  video_list[j].videoStatic = "直播中";
            }if (((videoList[j].begin_time*1000)>nowTime)) {
                 video_list[j].videoStatic = "即将开始";
            }else if ((videoList[j].end_time*1000)<nowTime) {
                 video_list[j].videoStatic = "回放中";
            }
          }
          setTimeout(function(){
            wx.hideLoading()
          },500)
        that.setData({
           videoList:video_list
        })
      }
     })
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
onShow: function () {
  var that = this;
  wx.request({
    url: 'https://hepulan.playonwechat.com/site/get-zb-home?sign=' + app.data.sign,
    method: "GET",
    success:function(res){
      console.log(res);
      var imgList = [];
      var str = 'http://zb.suoluomei.com/attachment/'
      var banner = res.data.data.banner;   //banner
      var videoList = res.data.data.list;
      var label_item = res.data.data.tags;
      var video_list = [];
      var labelItem = [];
      var nowTime = (new Date()).getTime();  //获取当前时间
      for (var i = 0; i < banner.length; i++) {
          imgList[i]  = {};
          imgList[i].img = banner[i].thumb;
          imgList[i].imgtip = banner[i].title;
          if (imgList[i].img.indexOf("http")>-1) {
             continue;
          }else {
            imgList[i].img = str+banner[i].thumb;
          }
      }
      for (var j = 0; j < videoList.length; j++) {
        video_list[j]  = {};
        video_list[j].persion_num = videoList[j].look_numbers;
        video_list[j].videoType = "免费";
        video_list[j].videoTitle = videoList[j].topic_name;
        video_list[j].videoPoster = videoList[j].topic_icon;
        video_list[j].id = videoList[j].topic_id;
        if ((videoList[j].begin_time*1000)<nowTime&&(videoList[j].end_time*1000)>nowTime) {
              video_list[j].videoStatic = "直播中";
        }if (((videoList[j].begin_time*1000)>nowTime)) {
             video_list[j].videoStatic = "即将开始";
        }else if ((videoList[j].end_time*1000)<nowTime) {
             video_list[j].videoStatic = "回放中";
        }
      }
      for (var m = 0; m < label_item.length; m++) {
        labelItem[m] = {};
        labelItem[m].worlds = label_item[m].tag_name;
        labelItem[m].id = label_item[m].tag_id;
        labelItem[m].select = 0;
        labelItem[0].select = 1;
      }
      console.log(labelItem)
      that.setData({
         imgUrls:imgList,
         videoList:video_list,
         labelItem:labelItem
      })
    },
  });

  },
  // 返回首页
    backHome:function(){
       common.backHome();
    },

  // 分享海报
    toShare:function(){
      common.toShare();
    },

// 生命周期函数--监听页面隐藏
  onHide: function () {

  },

// 生命周期函数--监听页面卸载
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
