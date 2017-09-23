// pages/knowledge/knowledge.js
//获取应用实例
var app = getApp();
Page({
  data: {
    sign: "",
    plot_show: false,
    video_show: false,
    search_world: [{
      world: '全部',
      click_Btn: 'click_btn'
    }, {
      world: '护肤',
      click_Btn: ""
    }, {
      world: '美容',
      click_Btn: ""
    }, {
      world: '眼部',
      click_Btn: ""
    }, {
      world: '祛皱',
      click_Btn: ""
    }, {
      world: '淡斑',
      click_Btn: ""
    }, {
      world: '祛痘',
      click_Btn: ""
    }, {
      world: '护肤',
      click_Btn: ""
    }, {
      world: '美容',
      click_Btn: ""
    }, {
      world: '眼部',
      click_Btn: ""
    }, {
      world: '祛皱',
      click_Btn: ""
    }, {
      world: '淡斑',
      click_Btn: ""
    }],
    w_width: 800,
    main_content: []

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  pageBottom: function() {
    var that = this;
    var oldCentent = that.data.main_content;
    var main_content = that.data.main_content;
    var newContent = oldCentent.concat(main_content);
    that.setData({
      main_content: newContent
    })
    // console.log(main_content);
  },

  // 预览图片
  prewImg: function() {
    var that = this;
    wx.previewImage({
      current: ['../img/home_persion.png', '../img/home_persion.png'], // 当前显示图片的http链接
      urls: ['../img/home_persion.png', '../img/home_persion.png', '../img/home_persion.png', '../img/home_persion.png'] // 需要预览的图片http链接列表
    })

  },
  // 视频播放
  playVideo: function(res) {
    var that = this;
    //视频id索引
    console.log(res);
    var idx = res.target.dataset.idx;
    var main_content = that.data.main_content;
    var videoList = [];
    var wxPlay = [];
    var wxPause = [];
    console.log(main_content);
    for (var i = 0; i < main_content.length; i++) {
      videoList[i] = [];
      videoList[i]['id'] = 'video' + idx;
      videoList[i].video = main_content[i].video;
      wxPause = wx.createVideoContext('video' + [i]);
      // main_content[i].video[0]['postShow'] = "";
      // main_content[idx].video[0]['postShow'] = "psoterhide";
      wxPause.pause();
      wxPlay = wx.createVideoContext(videoList[i].id);
      wxPlay.play();

    }
    that.setData({
      main_content: main_content
    })
  },
  onLoad: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this;
    var search_world = that.data.search_world;
    // 设置搜索关键词内宽度
    var w_width = 80 * search_world.length;
    that.setData({
      w_width: w_width
    })
    // 读取缓存sign
    try {
      var value = wx.getStorageSync('loginData');
      console.log(value);
      if (value) {
        // Do something with return value
        that.setData({
          sign: loginData
        })
      }
    } catch (e) {
      // Do something when catch error
    }
    that.setData({
      sign: value
    })
    // 请求搜索框下面的关键词
    wx.request({
      url: 'https://hepulan.playonwechat.com/site/get-tags?sign=' + that.data.sign,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        //console.log(res.data.data);
        var req_searworld = res.data.data;
        var searchWorld = that.data.search_world;
        for (var i = 0; i < req_searworld.length; i++) {
          searchWorld[i].world = req_searworld[i].ma_desc
        }
        that.setData({
          search_world: searchWorld
        })
      }
    })
    // 获取知识列表
    wx.request({
      url: 'https://hepulan.playonwechat.com/site/get-knowledge-list?sign=' + that.data.sign,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var mainContent = res.data.data;
        var main_content = [];
        for (var i = 0; i < mainContent.length; i++) {
          main_content[i] = {
            contentTip: mainContent[i].title
          };
          main_content[i].titleTime = mainContent[i].publish_time;
          console.log(main_content[i]);
          //
          main_content[i].contentImg = mainContent[i].url;
          main_content[i].video = {
            videoUrl: mainContent[i].url
          };
          main_content[i].video.id = [i];
          var num = mainContent[i].url.lastIndexOf(".");
          if (mainContent[i].url.substring(num) == ".mp4") {
            var mp4 = i;
            main_content[mp4].video.videoUrl = mainContent[i].url;
            main_content[mp4].content_img = "";
            //main_content[mp4].video.postShow = "psoterhide";
            console.log(mainContent[i]); //区分出视频链接
          } else {}
          // main_content[i].video.videoPoster = mainContent[i].cover;

        }
        main_content[1].contentImg = main_content[0].contentImg;
        main_content[0].contentImg = "";
        console.log(main_content);
        that.setData({
          main_content: main_content
        })
        console.log(main_content)
      }
    })
  },
  tapKeyWorld: function(res) {
    var that = this;
    var search_world = that.data.search_world;
    var clickBtn = res.target.dataset.ontap;
    //console.log(clickBtn);
    var len = [];
    for (var i = 0; i < search_world.length; i++) {
      search_world[i].click_Btn = '';
      search_world[clickBtn].click_Btn = 'click_btn';
    };
    console.log(search_world);
    that.setData({
      search_world: search_world
    })
  }
})
