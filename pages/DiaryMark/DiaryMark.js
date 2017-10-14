// pages/DiaryMark/DiaryMark.js
var app = getApp();
let common = require('../../common.js');
Page({
  data: {
    uploadimg: [
     // 'https://qncdn.playonwechat.com/hupulan/DiaryMarkdaka-input-bg.jpg',
     //  'https://qncdn.playonwechat.com/hupulan/DiaryMarkdaka-input-bg.jpg'
    ],
    imgres:[],
    imgcount: 9,
    cardStatus: "草率打卡",
    statusIcon: "https://qncdn.playonwechat.com/hupulan/DiaryMarkicon-2points.png",
    isRadio: true,
    jiFen: 1,
    dakaSuccess: false,
    imglength:0
  },

  // 输入内容
  bindTextAreaBlur(ev) {
    var that = this;
    var uploadimg = that.data.imgres;
    console.log(uploadimg)
    if (!ev.detail.value && uploadimg.length < 1) {
      that.setData({
        cardStatus: "草率完成",
        content: ev.detail.value,
        jiFen: 1
      })
    } else if (ev.detail.value && uploadimg.length < 1) {
      that.setData({
        cardStatus: "较认真完成",
        content: ev.detail.value,
        jiFen: 2
      })
    }else if(!ev.detail.value&&uploadimg.length > 0){
      that.setData({
        cardStatus: "较认真完成",
        content: ev.detail.value,
        jiFen: 2
      })
    }else if(ev.detail.value&&uploadimg.length > 0){
      that.setData({
        cardStatus: "认真完成",
        content: ev.detail.value,
        jiFen: 8
      })
    }
  },

    // 活动规则
  toRules(){
      wx.navigateTo({
        url: '../circleRules/circleRules'
      })
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
              upload_style:"signin"
            },
            success(res) {
              console.log(res);
              let imgres = JSON.parse(res.data);
              console.log(imgres)
                  // imgres.data[0].thumb = `${imgres.data.url_prefix}${imgres.data[0].thumb}`;
                  imgres.data[0].img = `${imgres.data.url_prefix}${imgres.data[0].url}`;
              imgArr.push(imgres.data[0]);
              let imglength = imgArr.length;
              that.setData({
                imgres:imgArr,
                imglength:imglength,
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
    let that = this;
    let _index = ev.currentTarget.dataset.index;
    let imgres = that.data.imgres;
    wx.showModal({
      title: '提示',
      content: '确定删除这张图片吗？',
      success: function(res) {
        if (res.confirm) {
           imgres.splice(_index,1);
           that.setData({
               imgres
            })
        } else if (res.cancel) {
            
        }
      }
    }) 
    
  },

  // 提交打卡
  formSubmit(e) {
    var form_id = e.detail.formId;
    var that = this;
    var content = that.data.content;
    wx.request({
      url:app.data.apiUrl,
      method:"POST",
      data:{
        sign:wx.getStorageSync("sign"),
        key:app.data.apiKey,
        type:"save-punch",
        data:{
          imgs:that.data.imgres?that.data.imgres:"",
          content:content?content:"",
          is_share:that.data.isRadio?1:0,
          form_id:form_id
        }
      },
      success(res){
        console.log(res);
        if (res.data.status===1) {
          that.setData({
            dakaSuccess: true,
            score:res.data.score
          })
        }else{
           wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 1000
            })
        }
      }
    })
    
  },

  // 打卡弹窗提示
  sureDiary() {
    var that = this;
    that.setData({
      dakaSuccess: false
    })
     wx.switchTab({
      url: '../index/index'
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
