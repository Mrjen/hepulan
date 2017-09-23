//index.js
var app = getApp();
var common = require('../../common.js');
var mta= require('../../utils/mta_analysis.js');
Page({
  data: {
    content: false,
    mobile: "",
    sign:"",
    teacherId:"",
    wxcode:"",
    copyTeach: false,
    teach_static:false,
    templateData:[{
      teacher_id:"",
      title_tip:'请咨询您的专属护肤老师'
    }],
    navList:[{
      text:"肌肤测试",
      navUrl:""
    },//{
    //  text:"申请试用",
    //  navUrl:""
    //},
    {
      text:"签到领币",
      navUrl:""
    },{
      text:"加入会员",
      navUrl:""
    }],
    imgUrls:['https://qncdn.playonwechat.com/hepulan/home_baner01.png',
            'https://qncdn.playonwechat.com/hepulan/home_baner02.png',
            'https://qncdn.playonwechat.com/hepulan/home_baner03.png',
            'https://qncdn.playonwechat.com/hepulan/home_baner04.png'
           ]
  },

// 点击页面


// 统计
tongJi(ev){
  console.log(ev,111);
  mta.Event.stat("contact_click",{})
},

formSubmit(ev){
  //  console.log('form发生了submit事件，携带数据为：', ev.detail.formId)
   common.getSign(function(){
     var sign = wx.getStorageSync("sign");
     wx.request({
       url: 'https://hepulan.playonwechat.com/site/save-form-id?sign='+sign,
       data: {
         form_id: ev.detail.formId
       },
       success(res){
           console.log(res);
       }
   })
 })
},

  applyBtn:function(){
    var that = this;
    that.setData({
      copyTeach:true
    });
  },

  sureBtn:function(){
    var that = this;
    that.setData({
      copyTeach:false
    });
  },

  cencelBbtn:function(){
    var that = this;
    that.setData({
      copyTeach:false
    });
  },

  onLoad: function(options) {
    // 初始化腾讯统计
    mta.Page.init();

    //页面初始化 options为页面跳转所带来的参数
    var that= this;
    that.setData({
       sign:app.data.sign
    });
    wx.showShareMenu({
      withShareTicket: true,
    });
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    var that = this;
    var mobile = app.data.mobile;
    var loginStatic = app.data.loginStatic;
    if (mobile==""||mobile==undefined) {
      mobile = app.data.mobile;
    }
    if (!mobile=="") {
      app.data.loginStatic = true;
    }


    //console.log(app.data.loginStatic);//false
    this.setData({
      content: mobile ? true : false
    })

   // if (loginStatic) {
   //   wx.request({
   //     url: 'https://hepulan.playonwechat.com/site/check-member-via-mobile?sign='+app.data.sign,
   //     data: {
   //       mobile: mobile
   //     },
   //     success: function(res) {
   //       console.log(res);
   //       var teacherId = res.data.data.hpl_t_name;
   //       var wxcode = res.data.data.wxcode;
   //       app.data.teacherId = teacherId;
   //       wx.setStorageSync("teacherId",teacherId);
   //       wx.setStorageSync("wxcode", wxcode);
   //       that.setData({
   //          teacherId:teacherId,
   //          wxcode:wxcode
   //       })
   //     }
   //   })
   // }

  },
// 皮肤测试
  skinTest: function() {
    wx.navigateTo({
      url: '../skinTest/skinTest'
    })
  },

  // 老师推荐
  teacheRed: function() {
    var that =this;
    var mobile = app.data.mobile;
    var pagePath = "../Recommend/Recommend"
    console.log(that.data.sign);

     wx.navigateTo({
	    url: `../Recommend/Recommend`
	  })

    // wx.login({
    //   success: function(res) {
    //     if (!mobile) {
    //       wx.navigateTo({
    //         url: '../login/login?pagePath=' + pagePath
    //       })
    //     } else {
    //       wx.request({
    //         url: 'https://hepulan.playonwechat.com/site/check-member-via-mobile?sign='+app.data.sign,
    //         data: {
    //           mobile: mobile
    //         },
    //         success: function(res) {
    //           console.log(res);
    //           var teacherId = res.data.data.hpl_t_name;
    //           console.log("老师ID",teacherId);
    //           var wxcode = res.data.data.wxcode;
    //           if (teacherId=="") {
    //             console.log("您是新用户没有护肤老师，请咨询客服");
    //           }
    //           wx.setStorageSync("teacherId",teacherId);
    //           wx.setStorageSync("wxcode", wxcode);
    //           wx.navigateTo({
    //             url: `../Recommend/Recommend?teacherId=${teacherId}&WXcode=${wxcode}`
    //           })
    //         }
    //       })
    //     }
    //   }
    // });
  },

  joinVip: function(page) {
    var that = this;
    var mobile = app.data.mobile;
    var pagePath = "../member/member"
    var pages = page.currentTarget.dataset.page
    console.log(mobile);
    console.log("111",app.data.sign);

    wx.navigateTo({
	    url: `../member/member`
	  })

    // wx.login({
    //   success: function(res) {
    //     if (mobile==""||mobile==undefined) {
    //       wx.navigateTo({
    //         url: '../login/login?pagePath=' + pagePath + "&pages=" + pages
    //       })
    //     } else {
    //       wx.request({
    //         url: 'https://hepulan.playonwechat.com/site/check-member-via-mobile?sign=' + app.data.sign,
    //         data: {
    //           mobile: mobile
    //         },
    //         success: function(res) {
    //           console.log(res);
    //           var teacherId = res.data.data.hpl_t_name;
    //           var wxcode = res.data.data.wxcode;
    //           wx.setStorageSync("teacherId",teacherId);
    //           wx.setStorageSync("wxcode", wxcode);
    //           wx.navigateTo({
    //             url: `../member/member?teacherId=${teacherId}&WXcode=${wxcode}`
    //           })
    //         }
    //       })
    //     }
    //   }
    // });
  },

  Check: function() {
    var that = this;
    var mobile = app.data.mobile;
    var pagePath = "../qiandao/qiandao"
    //console.log(mobile);

    wx.navigateTo({
	    url: `../qiandao/qiandao`
	  })

    // wx.login({
    //   success: function(res) {
    //     if (mobile == "" || mobile == undefined) {
    //       wx.navigateTo({
    //         url: '../login/login?pagePath=' + pagePath
    //       })
    //     } else {
    //       wx.request({
    //         url: 'https://hepulan.playonwechat.com/site/check-member-via-mobile?sign=' + app.data.sign,
    //         data: {
    //           mobile: mobile
    //         },
    //         success: function(res) {
    //           //console.log(res);
    //           var teacherId = res.data.data.hpl_t_name;
    //           var wxcode = res.data.data.wxcode;
    //           wx.setStorageSync("teacherId",teacherId);
    //           wx.setStorageSync("wxcode", wxcode);
    //           wx.navigateTo({
    //             url: `../qiandao/qiandao?teacherId=${teacherId}&wxcode=${wxcode}`
    //           })
    //         }
    //       })
    //     }
    //   }
    // });
  },

  Apply: function(page) {
    //console.log(page);
    var that = this;
    var mobile = app.data.mobile;
    var pagePath = "../apply/apply"
    var pages = page.currentTarget.dataset.page;

    wx.navigateTo({
	    url: `../apply/apply`
	 })

    console.log(mobile);
    // if (mobile == "" || mobile == undefined) {
    //   wx.navigateTo({
    //     url: '../login/login?pagePath=' + pagePath + "&pages=" + pages
    //   })
    // } else {
    //   wx.request({
    //     url: 'https://hepulan.playonwechat.com/site/check-member-via-mobile?sign=' + app.data.sign,
    //     data: {
    //       mobile: mobile
    //     },
    //     success: function(res) {
    //       console.log(res);
    //       var teacherId = res.data.data.hpl_t_name;
    //       var wxcode = res.data.data.wxcode;
    //       wx.setStorageSync("teacherId",teacherId);
    //       wx.setStorageSync("wxcode", wxcode);
    //       wx.navigateTo({
    //         url: `../apply/apply?teacherId=${teacherId}&wxcode=${wxcode}`
    //       })
    //     }
    //   })
    // }
  },

  askMine: function(ask) {
    //console.log(ask);
    var that = this;
    var mobile = app.data.mobile;
    var pagePath = "../index/index"
    //console.log(mobile);
    if (mobile == "" || mobile == undefined) {
      that.setData({
        content: false
      })
    }
    var teacherId = wx.getStorageSync("teacherId");
    var templateData = [];
    templateData[0]={};
    templateData[0].teacher_id = teacherId;
    console.log(that.data.templateData)
    if (teacherId=="") {
       that.setData({
          teach_static:true
       })
    }else{
      that.setData({
          teach_static:false
       })
    }
  },

  toLogin: function(page) {
    var pages = page.target.dataset.page;
    //console.log(pages);
    var pagePath = "../index/index"
    wx.navigateTo({
      url: '../login/login?pagePath=' + pagePath + "&pages=" + pages
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
  },

});
