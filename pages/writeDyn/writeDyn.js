// pages/writeDyn/writeDyn.js
var common = require('../../common.js');
var app = getApp();
import { statistic, fromPageData } from '../../tunji'
Page({
  data: {
    sign: "",
    upImg: ['../img/circle_icon_upfileimg.png'],
    writeContent: "",
    imgres: "",
    Dabled: false,
    joinText: false
  },

  onLoad: function (options) {
    var that = this;

    // 上报后台数据
    statistic();
    wx.setStorageSync('scene', options.scene)

    // 渠道统计  一定要放在wx.setStorageSync('scene', options.scene) 之后
    fromPageData()

    that.setData({
      sign: app.data.sign
    });
    console.log(that.data.sign);
  },


  // 图片上传
  upFile: function (res) {
    var that = this;
    let sign = wx.getStorageSync('sign');
    console.log("选择图片")
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        let imgArr = [];
        console.log("图片手机路径" + tempFilePaths);
        console.log(tempFilePaths);
        let count = tempFilePaths.length
        for (let i = 0; i < tempFilePaths.length; i++) {
          console.log(tempFilePaths[i])
          wx.uploadFile({
            url: app.data.apiUrl,
            method: "POST",
            filePath: tempFilePaths[i],
            formData: {
              key: app.data.apiKey,
              sign: sign,
              type: "upload",
              upload_style: "social"
            },
            name: 'file',
            success: function (res) {
              console.log(res)
              let imgres = JSON.parse(res.data);
              console.log(imgres)
              imgArr.push(imgres.data[0]);
              // var tempFilePaths = res.tempFilePaths;
              console.log(imgArr);
              that.setData({
                imgres: imgArr,
                upImg: tempFilePaths
              })
            }
          })
        }
      }
    })
  },

  // 活动规则
  toRules() {
    wx.navigateTo({
      url: '../circleRules/circleRules'
    })
  },

  // 参加赢积分活动
  getJiFen(ev) {
    var that = this;
    console.log(ev)
    that.setData({
      joinText: !that.data.joinText
    })

  },


  bindTextAreaBlur: function (e) {
    var that = this;
    console.log(e.detail.value);
    that.setData({
      writeContent: e.detail.value
    })
    //console.log(that.data.writeContent);
  },

  sendBtn: function (e) {
    var that = this;
    var content = that.data.writeContent;
    var upImg = that.data.upImg;
    var imgres = that.data.imgres;
    var sign = wx.getStorageSync("sign");
    var joinText = that.data.joinText;
    joinText = joinText ? '1' : '0';
    // 禁用提交按钮防止用户重复提交
    if (false) {
      wx.showToast({
        title: '请填写动态内容',
        icon: 'success',
        duration: 2000
      })
    } else {
      var keywords = ["屏蔽词", "违规词", "过滤", "敏感词"];
      for (var i = 0; i < keywords.length; i++) {
        var reg = new RegExp(keywords[i], "g");
        if (content.indexOf(keywords[i]) != -1) {
          var result = content.replace(reg, "**");
          content = result;
        }
        //console.log(content);
      }

      wx.request({
        url: app.data.apiUrl,
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        data: {
          type: "save-plaza-post",
          key: app.data.apiKey,
          sign: sign,
          data: {
            title: content,
            imgs: imgres,
            is_share: joinText
          }
        },
        success: function (res) {
          console.log(res);
          wx.showToast({
            title: '动态发布成功',
            icon: 'success',
            duration: 1000
          });
          // 数据提交成功跳转至动态
          wx.switchTab({
            url: '../circle/circle'
          })
          // 放开提交按钮
          setTimeout(function () {
            that.setData({
              disabled: true
            })
          }, 1000)
        }
      });
    }
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

  },

  // 返回首页
  backHome: function () {
    common.backHome();
  },

  // 分享海报
  toShare: function () {
    common.toShare();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
})
