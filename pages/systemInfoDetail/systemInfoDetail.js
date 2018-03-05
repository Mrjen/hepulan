// pages/systemInfoDetail/systemInfoDetail.js
import {http} from '../../common';
var WxParse = require('../../utils/wxParse.js');
Page({
  data: {
    messageInfo:'',
    msg: "<p>《禾葡兰护肤中心》小程序2018年2月24日领取红包功能，部分用户通过非正常手段获取积分利益，导致数据出现异常，严重影响了其他用户的体验，目前已经查实，并修复了该bug。</p><p><br/></p><p>为了表示我们的歉意，给予昨日所有使用红包的用户150积分的补偿。请用户注意查收，补偿到达账户需要一定的时间，请大家耐心等待。</p><p><br/></p><p>最后再次就此事向用户表示最诚恳的歉意，我们会尽最大努力进行改进，继续给大家带来更好的体验。</p><p><br/></p><p style='text-align: right;'>《禾葡兰护肤中心》小程序运营及研发团队</p><p><br/></p><p style='text - align: right;'>2018年2月25日</p><p><br/></p>"
  },

  onLoad: function (options) {
    let that = this;
      http({
        type:'get-message-info',
        data:{
          message_id:options.id
        }
      },function(res){
        console.log(res)
        that.setData({
          messageInfo:res.data.data.message_info
        })
        WxParse.wxParse("content", "html", res.data.data.message_info.msg, that, 0);
      })

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