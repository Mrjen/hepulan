// pages/systemInfo/systemInfo.js
import {http} from '../../common'
Page({
  data: {
    rules:[],
    page:2,
    loadMore:true, //防止重复加载
    editIndex:0,
    delBtnWidth:100
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
    console.log('111111111111', )
    if (Edata.url){
        wx.navigateTo({
          url: `../systemInfoWeb/systemInfoWeb?webUrl=${Edata.url}`
        })
      wx.setStorageSync('webUrl', `../systemInfoWeb/systemInfoWeb?webUrl=${Edata.url}`)
      }else{
        wx.navigateTo({
          url: `../systemInfoDetail/systemInfoDetail?id=${Edata.id}`
        })
      }
      
  },

  // 删除系统消息
  delItem(e){
     let that = this,
         Edata = e.currentTarget.dataset,
         rules = that.data.rules;
      http({
        type:'delete-message',
        data:{
          message_id:Edata.id
        }
      },function(res){
        console.log('删除公告',res)
        rules.splice(Edata.index,1);
        that.setData({
          rules
        })  
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
  
  },

  //手指刚放到屏幕触发
  touchS(e) {
    console.log("touchS" + e);
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM(e) {
    console.log("touchM:" + e);
    var that = this
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      console.log(index)
      var rules = that.data.rules;
      //将拼接好的样式设置到当前item中
      rules[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        rules: rules
      });
    }
  },
  touchE(e) {
    console.log("touchE" + e);
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var rules = that.data.rules;
      rules[index].txtStyle = txtStyle;
      //更新列表的状态
      that.setData({
        rules: rules
      });
    }
  }
})