// pages/DiaryMark/DiaryMark.js
var app = getApp();

Page({
  data: {
    uploadimg: ['https://qncdn.playonwechat.com/hupulan/DiaryMarkdaka-input-bg.jpg',
      'https://qncdn.playonwechat.com/hupulan/DiaryMarkdaka-input-bg.jpg'
    ],
    imgcount: 9,
    cardStatus: "草率打卡",
    statusIcon: "https://qncdn.playonwechat.com/hupulan/DiaryMarkicon-2points.png",
    isRadio: true,
    jiFen: 2,
    dakaSuccess: false
  },

  // 输入内容
  bindTextAreaBlur(ev) {
    var that = this;
    var uploadimg = that.data.uploadimg;
    if (ev.detail.value && uploadimg.length < 1) {
      that.setData({
        cardStatus: "较认真完成",
        conttent: ev.detail.value,
        jiFen: 2
      })
    } else if (ev.detail.value && uploadimg.length > 0) {
      that.setData({
        cardStatus: "认真完成",
        conttent: ev.detail.value,
        jiFen: 8
      })
    }
  },

  // 是否参加护肤热选
  jionHot() {
    var that = this;
    that.setData({
      isRadio: !that.data.isRadio
    })
  },

  // 上传图片
  upImgBtn() {
    let that = this;
    let imgcount = that.data.imgcount;
    let content = that.data.content;
    let sign = wx.getStorageSync("sign");
    wx.chooseImage({
      count:imgcount,
      sizeType: [ 'original', 'compressed' ],
      success: function(res) {
        let tempFilePaths = res.tempFilePaths;
        let imgArr = [];
        console.log("图片手机路径"+tempFilePaths);
        console.log(tempFilePaths);
        for (let i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            method:"POST",
            url: app.data.apiUrl,
            filePath: tempFilePaths[i],
            name: 'file',
            header: { "Content-Type": "multipart/form-data" },
            formData: {
              'key':app.data.apiKey,
              'type': "upload",
              sign:sign,
              data:{
                style:"signin"
              }
            },
            success(res) {
              console.log(res);
              let imgres = JSON.parse(res.data);
              console.log(imgres)
              imgArr.push(imgres.data[0]);
              that.setData({
                imgres:imgArr,
                upImg:tempFilePaths
              })
            },
            fail(res) {
              console.log(res);
            }
          })
        }
      }
    })
  },

  // 删除图片
  deleteImg(ev) {
    console.log(ev);
  },

  // 提交打卡
  formSubmit() {
    var that = this;
    var content = that.data.content;
    that.setData({
      dakaSuccess: true
    })
    if (true) {

    }
  },

  // 打卡弹窗提示
  sureDiary() {
    var that = this;
    that.setData({
      dakaSuccess: false
    })
  },

  onLoad: function(options) {

  },

  onReady: function() {

  },

  onShow: function() {

  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {

  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {

  }
})
