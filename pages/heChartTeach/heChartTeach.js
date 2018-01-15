// pages/heChartTeach/heChartTeach.js
var common = require('../../common.js');
var app = getApp();
import { statistic } from '../../tunji'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    teacherImg: "https://hepulan.playonwechat.com/static/heChart/he_chart_video_poster1.jpg",
    videoTitle: "夏季美白做的好，男神追着跑",
    teacher: "Jina老师",
    introduct: "国际圣迪斯哥美容博士、年度金牌导师、年度最受欢迎老师",
    roomName: "",
    teachTime: "2017-06-07 20:00:00",
    hasSign: 2734,
    moreIcon: false,
    persionImg: ['https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
      'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
      'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png'
    ],
    courseIntroduct: "日常生活美白技巧、如何在夏天“晒”不怕~",
    topicId: "",
    countDown_tatic:false,
    Countdown:[{
      day:"",
      hr:"",
      min:"",
      sec:""
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(options);
    var that = this;

    // 上报后台数据
    statistic();
    wx.setStorageSync('sence', options.scene) 

    that.setData({
      topicId: options.topicId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.request({
      url: 'https://hepulan.playonwechat.com/site/get-zb-topic-intro?sign=' + app.data.sign,
      method: "GET",
      data: {
        topicId: that.data.topicId
      },
      success: function(res) {
        console.log(res);
        var moreIcon = false;
        var persionImg = res.data.data.users;
        var len = persionImg.length;
        var begin_time = res.data.data.topic.begin_time;
        if (len > 8) {
          that.setData({
            moreIcon: true
          })
        } else {
          that.setData({
            moreIcon: false
          })
        };
        var nowTime = (new Date()).getTime();
        console.log(nowTime);
        var ge_nowTime = common.time(nowTime / 1000, 1);
        var be_gainTime = common.time(begin_time, 1);
        var Countdown = begin_time * 1000 - nowTime; //倒计时

        if (Countdown>0) {
          function dateformat(micro_second) {
            // 秒数
            var second = Math.floor(micro_second / 1000);
            // 小时位
            var day = Math.floor(second/86400);

            if (day < 10) {
                day = '0' + day;
            }

            var hr = Math.floor((second-day*86400) / 3600);
            // 分钟位
            if (hr < 10) {
                hr = '0' + hr;
            }

            var min = Math.floor((second - hr * 3600-day*86400) / 60);
            if (min<10) {
               min = '0' + min;
            }
            // 秒位
            var sec = (second - hr * 3600 - min * 60-day*86400); // equal to => var sec = second % 60;
            // 毫秒位，保留2位
            if (sec<10) {
               sec = '0' + sec;
            }
            var micro_sec = Math.floor((micro_second % 1000) / 10);

            return day + ":" + hr + ":" + min + ":" + sec;
          }

          setInterval(function() {
            Countdown -= 1000;
            var time = dateformat(Countdown);
            var splitArr = time.split(":");
            console.log(splitArr);
            var  _Countdown = [{
               day:splitArr[0],
               hr:splitArr[1],
               min:splitArr[2],
               sec:splitArr[3],
            }];
            console.log(_Countdown);
            that.setData({
              countDown_tatic:true,
              Countdown:_Countdown
            })
          },1000)

        }else {
          countDown_tatic:false
        }

        begin_time = common.time(begin_time, 1);
        console.log(begin_time);
        that.setData({
          teacherImg: res.data.data.topic.topic_icon,
          videoTitle: res.data.data.topic.topic_name,
          teacher: res.data.data.topic.guest_name,
          introduct: res.data.data.topic.guest_info,
          roomName: res.data.data.topic.room_name,
          persionImg: res.data.data.users,
          hasSign: res.data.data.topic.look_numbers,
          courseIntroduct: res.data.data.topic.topic_desc,
          teachTime: begin_time
        })
      },
    })
  },

  // 返回首页
  backHome: function() {
    common.backHome();
  },

  // 分享海报
  toShare: function() {
    common.toShare();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
});

var total_micro_second = 2 * 1000; /* 毫秒级倒计时 */
