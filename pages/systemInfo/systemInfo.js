// pages/systemInfo/systemInfo.js
import {http} from '../../common'
Page({
  data: {
    rules:[],
    page:2,
    loadMore:true
  },

  onLoad: function (options) {
  
  },

  onReady: function () {
  
  },

  onShow: function () {
    let that = this;
      http({
         type:'get-message-list',
         data:{
           page:1
         }
      },function(res){
        let rules = res.data.data.message_list;
            rules.map(el=>{
              switch (el.msg_type) {
                  case 1:
                      el.tag = "公告";
                      el.color ="#e9cf9a";
                    break;
                  case 2:
                     el.tag = "通知";
                     el.color ="#33cdff"
                  break;
                  case 3:
                      el.tag = "消息";
                      el.color = "#66df35";
                    break;
                  default:
                      el.tag = '系统';
                    break;
                }
            })
        that.setData({
          rules: rules
        })
      })
  },

  // 点击查看详情
  toInfoDetail(e){
    let Edata = e.currentTarget.dataset;
    if (Edata.url){
        wx.navigateTo({
          url: `../systemInfoWeb/systemInfoWeb?webUrl=${Edata.url}`
        })
      }else{
        wx.navigateTo({
          url: `../systemInfoDetail/systemInfoDetail?id=${Edata.id}`
        })
      }
      
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
    let that = this,
        loadMore = that.data.loadMore,
        page = that.data.page;
    if(loadMore){
      http({
        type: 'get-message-list',
        data: {
          page: page
        }
      }, function (res) {
        console.log(res)
        let rules = res.data.data.message_list;
        let oldRules = that.data.rules;
        if (rules.length>0){
            rules.map(el => {
              switch (el.msg_type) {
                case 1:
                  el.tag = "公告";
                  el.color = "#e9cf9a";
                  break;
                case 2:
                  el.tag = "通知";
                  el.color = "#33cdff"
                  break;
                case 3:
                  el.tag = "消息";
                  el.color = "#66df35";
                  break;
                default:
                  el.tag = '系统';
                  break;
              }
          })
          rules = [...oldRules, ...rules];
          page++;
        }else{
          rules = oldRules;
          wx.showToast({
            title:'没有更多数据'
          })
        }
        that.setData({
          rules: rules,
          page:page
        })
      })
    }
  },

  onShareAppMessage: function () {
  
  }
})