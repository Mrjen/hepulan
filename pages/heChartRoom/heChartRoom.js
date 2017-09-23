// pages/heChartRoom/heChartRoom.js
var common = require('../../common.js');
var WxParse = require('../../utils/wxParse.js');
var app = getApp();
Page({
  // 页面的初始数据
  data: {
    imgUrls: [ //PPT
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    current: 0,
    imgLen: 0,
    teacher_img: ['https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
      'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
      'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png'
    ],
    persion_pop: 25656, //人气
    popWidth: [],
    pptShow: true,
    pptHeight: 0,
    oldPlayAudio: "", //上一个播放音频的ID
    barrgeAnimate: "", //弹屏
    mainContent: [],
    //[{
    //   id: '1',
    //   persion_img: 'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
    //   contentType: 'text',
    //   content: "首次课程在5月4日晚19:00开讲，海莲将分享一些夏季预防皮肤中暑的小秘诀给大家哦，敬请期待！有什么建议和疑问可以微信私聊海莲老师哦！",
    //   persionName: "圈圈",
    //   audioLen: '0',
    //   contentTime: '04/28 14:42:24',
    //   playStatic: false
    // }, {
    //   id: '2',
    //   persion_img: 'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
    //   contentType: 'ask',
    //   content: [{
    //     name: "晴天晴天",
    //     quest: "我不知道这是什么问题",
    //     replay: "我就是答案啊我就是答案啊我就是答案啊我就是答案啊我就是答案啊"
    //   }],
    //   audioLen: '0',
    //   persionName: "土壤",
    //   contentTime: '05/04 15:51:52',
    //   playStatic: false,
    // }, {
    //   id: '3',
    //   persion_img: 'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
    //   contentType: 'text',
    //   content: "首次课程在5月4日晚19:00开讲，海莲将分享一些夏季预防皮肤中暑的小秘诀给大家哦，敬请期待！有什么建议和疑问可以微信私聊海莲老师哦！",
    //   audioLen: '0',
    //   persionName: "圈圈",
    //   contentTime: '05/04 15:51:52',
    //   playStatic: false
    // }, {
    //   id: '4',
    //   persion_img: 'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
    //   contentType: 'mp3',
    //   content: "https://hepulan.playonwechat.com/static/heChart/test_music.wav",
    //   audioLen: '8',
    //   persionName: "圈圈",
    //   contentTime: '05/04 15:51:52',
    //   playStatic: false
    // }, {
    //   id: '5',
    //   persion_img: 'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
    //   contentType: 'img',
    //   content: "https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png",
    //   audioLen: '0',
    //   persionName: "圈圈",
    //   contentTime: '05/04 15:51:52',
    //   playStatic: false
    // }, {
    //   id: '6',
    //   persion_img: 'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
    //   contentType: 'img',
    //   content: "https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png",
    //   audioLen: '0',
    //   persionName: "圈圈",
    //   contentTime: '05/04 15:51:52',
    //   playStatic: false
    // }, {
    //   id: '7',
    //   persion_img: 'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
    //   contentType: 'mp3',
    //   content: "http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46",
    //   audioLen: '30',
    //   persionName: "圈圈",
    //   contentTime: '05/04 15:51:52',
    //   playStatic: false
    // }],
    // discuss: [{
    //   dis_pers_img: 'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
    //   dis_pers_name: 'Andrew Li',
    //   dis_pers_time: "06/02 22:50:44",
    //   dis_pers_content: "很不错哦"
    // }, {
    //   dis_pers_img: 'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
    //   dis_pers_name: '小恶魔',
    //   dis_pers_time: "05/25 14:03:05",
    //   dis_pers_content: "禾葡兰"
    // }, {
    //   dis_pers_img: 'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
    //   dis_pers_name: '涂秋月',
    //   dis_pers_time: "05/05 22:42:28",
    //   dis_pers_content: "感谢海莲老师"
    // }, {
    //   dis_pers_img: 'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
    //   dis_pers_name: '小恶魔',
    //   dis_pers_time: "06/02 19:53:11",
    //   dis_pers_content: "老师"
    // }, {
    //   dis_pers_img: 'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
    //   dis_pers_name: '小恶魔',
    //   dis_pers_time: "06/02 19:53:11",
    //   dis_pers_content: "其他时间没有，但是运动完后一段时间脸红就会消失"
    // }, {
    //   dis_pers_img: 'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
    //   dis_pers_name: '小恶魔',
    //   dis_pers_time: "06/02 19:53:11",
    //   dis_pers_content: "老师，晚上什么时间敷面膜比较好?"
    // }, {
    //   dis_pers_img: 'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
    //   dis_pers_name: '小恶魔',
    //   dis_pers_time: "06/02 19:53:11",
    //   dis_pers_content: "这么快就结束了吗？"
    // }, {
    //   dis_pers_img: 'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
    //   dis_pers_name: '小恶魔',
    //   dis_pers_time: "06/02 19:53:11",
    //   dis_pers_content: "海莲老师可以帮我看看是属于什么肤质吗"
    // }, {
    //   dis_pers_img: 'https://hepulan.playonwechat.com/static/heChart/knowledge_icon_persion.png',
    //   dis_pers_name: '小恶魔',
    //   dis_pers_time: "06/02 19:53:11",
    //   dis_pers_content: "好哒，谢谢老师"
    // }],
    emoji: [{
      tip: '[微笑]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/00.gif',
    }, {
      tip: '[憋嘴]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/01.gif',
    }, {
      tip: '[色]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/02.gif',
    }, {
      tip: '[发呆]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/03.gif',
    }, {
      tip: '[得意]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/04.gif',
    }, {
      tip: '[流泪]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/05.gif',
    }, {
      tip: '[害羞]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/06.gif',
    }, {
      tip: '[闭嘴]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/07.gif',
    }, {
      tip: '[睡觉]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/08.gif',
    }, {
      tip: '[大哭]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/09.gif',
    }, {
      tip: '[尴尬]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/10.gif',
    }, {
      tip: '[发怒]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/11.gif',
    }, {
      tip: '[调皮]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/12.gif',
    }, {
      tip: '[龇牙]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/13.gif',
    }, {
      tip: '[惊讶]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/14.gif',
    }, {
      tip: '[难过]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/15.gif',
    }, {
      tip: '[酷]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/16.gif',
    }, {
      tip: '[冷汗]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/17.gif',
    }, {
      tip: '[抓狂]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/18.gif',
    }, {
      tip: '[吐]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/19.gif',
    }, {
      tip: '[偷笑]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/20.gif',
    }, {
      tip: '[可爱]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/21.gif',
    }, {
      tip: '[白眼]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/22.gif',
    }, {
      tip: '[哼]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/23.gif',
    }, {
      tip: '[饥饿]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/24.gif',
    }, {
      tip: '[困]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/25.gif',
    }, {
      tip: '[惊恐]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/26.gif',
    }, {
      tip: '[冷汗]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/27.gif',
    }, {
      tip: '[憨笑]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/28.gif',
    }, {
      tip: '[悠闲]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/29.gif',
    }, {
      tip: '[奋斗]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/30.gif',
    }, {
      tip: '[咒骂]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/31.gif',
    }, {
      tip: '[疑问]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/32.gif',
    }, {
      tip: '[悄悄话]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/33.gif',
    }, {
      tip: '[晕]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/34.gif',
    }, {
      tip: '[抓狂]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/35.gif',
    }, {
      tip: '[衰]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/36.gif',
    }, {
      tip: '[骷髅]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/37.gif',
    }, {
      tip: '[敲打]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/38.gif',
    }, {
      tip: '[再见]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/39.gif',
    }, {
      tip: '[擦汗]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/40.gif',
    }, {
      tip: '[抠鼻]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/41.gif',
    }, {
      tip: '[鼓掌]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/42.gif',
    }, {
      tip: '[溴大了]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/43.gif',
    }, {
      tip: '[坏笑]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/44.gif',
    }, {
      tip: '[左哼哼]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/45.gif',
    }, {
      tip: '[右哼哼]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/46.gif',
    }, {
      tip: '[哈欠]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/47.gif',
    }, {
      tip: '[鄙视]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/48.gif',
    }, {
      tip: '[委屈]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/49.gif',
    }, {
      tip: '[难过]',
      emoji_src: 'https://hepulan.playonwechat.com/static/heChart/emojis/50.gif',
    }],
    writeVlue: "", //讨论输入框输入的内容
    checked: false, //是否选择向嘉宾或主持人提问
    switchEmoji: false, //表情输入面板显示、隐藏
    disscussWrite: true, //讨论输入面单显示、隐藏
    discussStatic: false, //讨论弹窗显示、隐藏
    course_static: "",
    pageTop_request: true,
    position_static: "0", //textarea 外层view样式
    textAreaFocus: false,
    barrageData: [],
    popStatic: true,
    page_static:true
  },
  // ppt索引
  changeCurrent: function(e) {
    var that = this;
    var index = e.detail.current;
    that.setData({
      current: index
    })
  },
  // 关闭弹幕
  colsePop: function() {
    console.log("关闭");
    var that = this;
    var animation = wx.createAnimation({
      transformOrigin: "100% 100%",
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
    animation.width(0).step();

    var barrgeAnimate = wx.createAnimation({
      transformOrigin: "100% 100%",
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
    barrgeAnimate.width(0).height(0).step();
    that.setData({
      popWidth: animation.export(),
      popStatic: false,
      barrgeAnimate: barrgeAnimate.export(),
    })

  },
  // 打开弹幕
  openPop: function() {
    console.log("ok");
    var that = this;
    var animation = wx.createAnimation({
      transformOrigin: "100% 100%",
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
    animation.width(360).step();
    var barrgeAnimate = wx.createAnimation({
      transformOrigin: "100% 0%",
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
    barrgeAnimate.width(200).height(200).step();

    that.setData({
      popWidth: animation.export(),
      popStatic: true,
      barrgeAnimate: barrgeAnimate.export(),
    })
  },

  // 打开显示ppt
  pptShow: function() {
    console.log("打开PPT");
    var that = this;
    var animation = wx.createAnimation({
      transformOrigin: "0% 0%",
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    });
    animation.height(420 + 'rpx').step();
    that.setData({
      pptShow: false,
      pptHeight: animation.export()
    });
  },

  // 关闭显示ppt
  pptHide: function() {
    console.log("关闭PPT");
    var that = this;
    var animation = wx.createAnimation({
      transformOrigin: "0% 0%",
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    });
    animation.height(0 + 'rpx').step();
    that.setData({
      pptShow: true,
      pptHeight: animation.export()
    })
  },

  // 预览聊天图片
  prewImg: function(ev) {
    //console.log(ev);
    wx.previewImage({
      current: ev.target.dataset.src.toString(), // 当前显示图片的http链接
      urls: [ev.target.dataset.src] // 需要预览的图片http链接列表
    })
  },

  // 获取语音ID执行播放事件
  audioControl: function(ev) {
    console.log(ev);
    var that = this;
    var oldPlayAudio = that.data.oldPlayAudio;
    var audio_id = ev.currentTarget.dataset.audio_id; //当前播放语音id
    var audio_src = ev.currentTarget.dataset.audiosrc;
    var id_idx = ev.currentTarget.dataset.id_idx;
    var mainContent = that.data.mainContent;
    var play_static = ev.currentTarget.dataset.play_static;
    var audioLen = "";
    var _audioLen = "";

    wx.onBackgroundAudioPlay(function() {
      console.log("监听背景音乐正在播放");
      for (let j = 0; j < mainContent.length; j++) {
        mainContent[j].playStatic = false;
      }
      for (let i = 0; i < mainContent.length; i++) {
        if (mainContent[i].id == id_idx) {
          mainContent[i].playStatic = !mainContent[i].playStatic;
          //console.log(mainContent[i]);
          audioLen = mainContent[i].audioLen;
          that.setData({
            mainContent: mainContent,
            oldPlayAudio: audio_id //记录上一次播放的语音的id
          })
          break;
        }
      }
    });

// 监听背景音乐暂停
    wx.onBackgroundAudioPause(function(){
      console.log("监听暂停执行");
      play_static = !play_static;
      console.log(id_idx,"id_idx");
      for (var i = 0; i < mainContent.length; i++) {
        if (mainContent[i].id == id_idx) {
          console.log(mainContent[i]);
           mainContent[i].playStatic = false
        }
      }
      that.setData({
        mainContent:mainContent
      })
    })

  that.data.page_static = true;
  wx.onBackgroundAudioStop(function() {
    if (!that.data.page_static) {
      return false;
    }
    console.log("这段音频播放完成");
    for (let i = 0; i < mainContent.length; i++) {
      if (mainContent[i].contentType == "voice"&&mainContent[i].id>id_idx) {
        id_idx = mainContent[i].id;
        _audioLen = mainContent[i].audioLen;
        var idx_audio_src = mainContent[i].content;
        wx.playBackgroundAudio({
          dataUrl: idx_audio_src
        });
        break;
      }else if (i==mainContent.length-1) {
         for (let j = 0; j < mainContent.length; j++) {
           mainContent[j].playStatic = false;
         }
        that.setData({
          mainContent:mainContent
        })
      }
    }
  })


if (play_static) {
  wx.playBackgroundAudio({
    dataUrl: audio_src
  })
}else {
  wx.pauseBackgroundAudio();
}

  },

  // 输入表情
  inputEmoji: function(ev) {
    //console.log(ev);
    var that = this;
    var emoji = ev.target.dataset.alt;
    //console.log(emoji);
    var old_write = that.data.writeVlue;
    old_write = old_write + emoji;
    that.setData({
      writeVlue: old_write
    })
  },

  // 内容输入
  bindTextArea: function(e) {
    var that = this;
    //console.log(e.detail.value);
    that.setData({
      writeVlue: e.detail.value
    })
  },

  // textarea 获取到焦点
  bindTextFouce: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.platform)
        if (res.platform == "ios") {
          //console.log("这是IOS系统");
          that.setData({
            position_static: 250,
            textAreaFocus: true
          })
        } else {
          that.setData({
            position_static: 250,
            textAreaFocus: true
          })
        }
      }
    })
  },

  bindTextBlur: function() {
    var that = this;
    that.setData({
      position_static: 0,
      textAreaFocus: false
    })
  },

  // 切换是否向嘉宾提问
  radioChange: function(e) {
    var that = this;
    var checked = that.data.checked;
    var checked_num = "";
    that.setData({
      checked: !checked,
      checked_num: that.data.checked == true ? '0' : '1'
    })
  },

  // 切换输入表情
  switchEmoji: function() {
    var that = this;
    that.setData({
      switchEmoji: !that.data.switchEmoji
    })
  },

  //切换输入
  switchWrite: function() {
    var that = this;
    that.setData({
      disscussWrite: !that.data.disscussWrite,
      textAreaFocus: false
    })
  },

  // 点击取消消息
  cencelWrite: function() {
    var that = this;
    that.setData({
      disscussWrite: !that.data.disscussWrite,
      textAreaFocus: false
    })
  },

  sureWrite: function() {
    var that = this;
    console.log(that.data.writeVlue);
    var writeVlue = that.data.writeVlue;
    var writeVlue2 = that.data.writeVlue;
    var emoji = that.data.emoji;
    var checked = that.data.checked;
    console.log(that.data.checked);
    WxParse.emojisInit('[]', "https://hepulan.playonwechat.com/static/heChart/emojis/", {
      "微笑": "00.gif",
      "憋嘴": "01.gif",
      "色": "02.gif",
      "发呆": "03.gif",
      "得意": "04.gif",
      "流泪": "05.gif",
      "害羞": "06.gif",
      "闭嘴": "07.gif",
      "睡觉": "08.gif",
      "大哭": "09.gif",
      "尴尬": "10.gif",
      "发怒": "11.gif",
      "调皮": "12.gif",
      "龇牙": "13.gif",
      "惊讶": "14.gif",
      "难过": "15.gif",
      "酷": "16.gif",
      "冷汗": "17.gif",
      "抓狂": "18.gif",
      "吐": "19.gif",
      "偷笑": "20.gif",
      "可爱": "21.gif",
      "白眼": "22.gif",
      "哼": "23.gif",
      "饥饿": "24.gif",
      "困": "25.gif",
      "惊恐": "26.gif",
      "擦汗": "27.gif",
      "憨笑": "28.gif",
      "悠闲": "29.gif",
      "奋斗": "30.gif",
      "咒骂": "31.gif",
      "疑问": "32.gif",
      "悄悄话": "33.gif",
      "晕": "34.gif",
      "抓狂": "35.gif",
      "衰": "36.gif",
      "骷髅": "37.gif",
      "敲打": "38.gif",
      "再见": "39.gif",
      "擦汗": "40.gif",
      "抠鼻": "41.gif",
      "鼓掌": "42.gif",
      "溴大了": "43.gif",
      "坏笑": "44.gif",
      "左哼哼": "45.gif",
      "右哼哼": "46.gif",
      "哈欠": "47.gif",
      "鄙视": "48.gif",
      "委屈": "49.gif",
      "难过": "50.gif",
    });
    for (var i = 0; i < emoji.length; i++) {
      var str = "<img  src=\"" + emoji[i].emoji_src + "\">"
      writeVlue = writeVlue.split(emoji[i].tip).join(str);
    }
    console.log(writeVlue);
    WxParse.wxParse('article', 'html', writeVlue, that, 5);
    console.log(that);
    var now_time = common.time("", 1);
    now_time = now_time.replace(/-/g, "/");
    now_time = now_time.slice(5);
    var discuss = that.data.discuss;
    if (writeVlue) {
      discuss.unshift({
        dis_pers_img: app.data.avatarUrl,
        dis_pers_name: app.data.username,
        dis_pers_time: now_time,
        dis_pers_content: writeVlue,
        article: that.data.article
      });
      wx.request({
        url: 'https://hepulan.playonwechat.com/site/save-zb-topic-discuss?sign=' + app.data.sign,
        method: "POST",
        data: {
          topicId: that.data.topicId,
          content: writeVlue2,
          avatar: app.data.avatarUrl,
          nickname: app.data.username,
          ask_type: that.data.checked_num
        },
        success: function(res) {
          console.log(res);
          that.setData({
            discuss: discuss,
            disscussWrite: !that.data.disscussWrite,
            textAreaFocus: false,
            writeVlue: ""
          })
        }
      })
    } else {
      wx.showToast({
        title: '请填写内容！',
        icon: 'success',
        duration: 2000
      });
    }
  },

  // 打开评论
  openDiscuss: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://hepulan.playonwechat.com/site/get-zb-topic-detail?sign=' + app.data.sign,
      method: "GET",
      data: {
        topicId: that.data.topicId,
      },
      success: function(res) {
        console.log(res);
        var discuss = res.data.data.discuss;
        var _discuss = [];
        var emoji = that.data.emoji;
        for (var j = 0; j < discuss.length; j++) {
          _discuss[j] = {};
          _discuss[j].dis_pers_img = discuss[j].owner_avatar;
          _discuss[j].dis_pers_name = discuss[j].owner_nickname;
          _discuss[j].dis_pers_time = common.time(discuss[j].create_time, 1);
          _discuss[j].dis_pers_time = _discuss[j].dis_pers_time.replace(/-/g, "/");
          var _content = discuss[j].dis_content;
          for (var i = 0; i < emoji.length; i++) {
            var str = "<img src=\"" + emoji[i].emoji_src + "\">";
            _content = _content.split(emoji[i].tip).join(str);
          }
          WxParse.wxParse('article', 'html', _content, that, 5);
          _discuss[j].article = that.data.article;
        }
        that.setData({
          discussStatic: true,
          discuss: _discuss
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
      },
    })
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    //console.log(options);
    var that = this;
    that.setData({
      topicId: options.topicId
    });
    wx.showLoading({
      title: '加载中',
    })

  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function() {

  },

  //生命周期函数--监听页面显示
  onShow: function() {
    console.log("页面显示");
    var that = this;
    var imgUrls = that.data.imgUrls.length;
    //  获取ppt的张数
    //  var mainContent = that.data.mainContent;
    //console.log(mainContent);
    wx.request({
      url: 'https://hepulan.playonwechat.com/site/get-zb-topic-detail?sign=' + app.data.sign,
      method: "GET",
      data: {
        topicId: that.data.topicId,
      },
      success: function(res) {
        console.log(res);
        var main_content = res.data.data.list;
        var discuss = res.data.data.discuss;
        console.log(discuss);
        var emoji = that.data.emoji;
        var bagin_time = res.data.data.topic.begin_time * 1000;
        var end_time = res.data.data.topic.end_time * 1000;
        var nowTime = (new Date()).getTime();
        var new_content = [];
        var _discuss = [];
        var static_text = "";
        if (bagin_time < nowTime) {
          var static_time = common.time(end_time / 1000, 1);
          static_time = static_time.replace(/-/g, "/");
          static_text = "本次直播于" + static_time + "结束"
        } else if (bagin_time > nowTime) {
          var static_time = common.time(bagin_time / 1000, 1);
          static_time = static_time.replace(/-/g, "/");
          static_text = "本次直播于" + static_time + "开始"
        }
        for (var j = 0; j < discuss.length; j++) {
          _discuss[j] = {};
          _discuss[j].dis_pers_img = discuss[j].owner_avatar;
          _discuss[j].dis_pers_name = discuss[j].owner_nickname;
          _discuss[j].dis_pers_time = common.time(discuss[j].create_time, 1);
          _discuss[j].dis_pers_time = _discuss[j].dis_pers_time.replace(/-/g, "/");
          var _content = discuss[j].dis_content;
          for (var i = 0; i < emoji.length; i++) {
            var str = "<img  src=\"" + emoji[i].emoji_src + "\">";
            _content = _content.split(emoji[i].tip).join(str);
            WxParse.wxParse('article', 'html', _content, that, 5);
            _discuss[j].article = that.data.article;
          }
        }
        // 弹屏
        var _barrageData = [];
        for (var i = 0; i < 3; i++) {
          _barrageData[i] = discuss[i];
        }
        // 筛选种类内容
        for (var i = 0; i < main_content.length; i++) {
          new_content[i] = {};
          new_content[i].id = main_content[i].sub_id;
          new_content[i].persion_img = main_content[i].owner_avatar;
          new_content[i].contentType = main_content[i].sub_type;
          new_content[i].contentTime = common.time(main_content[i].create_time, 1)
          if (main_content[i].sub_type == "voice") {
            new_content[i].content = "http://zbcdn.suoluomei.com/" + main_content[i].sub_content_down + "_1"
          } else if (main_content[i].sub_type == "ask") {
            main_content[i].content = JSON.parse(main_content[i].sub_content);
            new_content[i].content = [{
              name: main_content[i].content.N,
              quest: main_content[i].content.Q,
              replay: main_content[i].content.replay,
            }]
          } else if (main_content[i].sub_type == "text" || main_content[i].sub_type == "image") {
            new_content[i].content = main_content[i].sub_content;
          }
          new_content[i].audioLen = main_content[i].sub_content_ext;
          new_content[i].persionName = main_content[i].owner_nickname;
          new_content[i].roleName = main_content[i].role_name;
          new_content[i].playStatic = false;

        }
        that.setData({
          teacher_img: res.data.data.guests,
          persion_pop: res.data.data.topic.look_numbers,
          mainContent: new_content,
          course_static: static_text,
          discuss: _discuss,
          barrageData: _barrageData
        })
        console.log(that.data.discuss);
        setTimeout(function() {
          wx.hideLoading()
        }, 1000)
      }
    })
  },

  // 页面滚动到顶部
  pageTop: function(ev) {
    var that = this;
    console.log(ev);
    var pageTop_request = that.data.pageTop_request;
    console.log(pageTop_request);
    if (!pageTop_request) {
      return false;
    }
    that.setData({
      pageTop_request: false
    })
    wx.showLoading({
        title: '加载中',
      })
    console.log(that.data.mainContent);
    if (!that.data.mainContent[0].id) {
      return false;
    }
    setTimeout(function() {
      wx.request({
        url: 'https://hepulan.playonwechat.com/site/get-zb-topic-subject-list?sign=' + app.data.sign,
        method: 'GET',
        data: {
          topicId: that.data.topicId,
          subId: that.data.mainContent[0].id
        },
        success: function(res) {
          console.log(res);
          var old_content = that.data.mainContent;
          var res_arry = res.data.data;
          var new_arry = [];
          for (var i = 0; i < res_arry.length; i++) {
            new_arry[i] = {};
            new_arry[i].id = res_arry[i].sub_id;
            new_arry[i].persion_img = res_arry[i].owner_avatar;
            new_arry[i].contentType = res_arry[i].sub_type;
            new_arry[i].contentTime = common.time(res_arry[i].create_time, 1);
            if (res_arry[i].sub_type == "voice") {
              new_arry[i].content = "http://zbcdn.suoluomei.com/" + res_arry[i].sub_content_down + "_1"
            } else if (res_arry[i].sub_type == "ask") {
              console.log(res_arry[i]);
              res_arry[i].content = JSON.parse(res_arry[i].sub_content);
              new_arry[i].content = [{
                name: res_arry[i].content.N,
                quest: res_arry[i].content.Q,
                replay: res_arry[i].content.replay,
              }]
              //console.log(new_arry[i].content);
            } else if (res_arry[i].sub_type == "text" || res_arry[i].sub_type == "image") {
              new_arry[i].content = res_arry[i].sub_content;
            }
            new_arry[i].audioLen = res_arry[i].sub_content_ext;
            new_arry[i].persionName = res_arry[i].owner_nickname;
            new_arry[i].roleName = res_arry[i].role_name;
            new_arry[i].playStatic = false;
          }
          if (new_arry.length == "0") {
            console.log("没有更多数据");
            wx.showToast({
              title: '没有更多数据了',
              icon: 'success',
              duration: 2000
            })
          }
          console.log(new_arry);
          console.log("滚动到", that.data.mainContent[0].id);
          that.setData({
            mainContent: new_arry.concat(old_content),
            scrollId: that.data.mainContent[0].id,
            pageTop_request: true
          })
          console.log(that.data.scrollId);
          console.log("滚动到", that.data.mainContent[0].id);
          setTimeout(function(){
            wx.hideLoading()
          },2000)
        }
      })
    }, 0)
  },

  // 返回直播
  backLive: function() {
    var that = this;
    that.setData({
      discussStatic: false
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

  // 生命周期函数--监听页面隐藏
  onHide: function() {
    //console.log("页面隐藏");
  },

  // 生命周期函数--监听页面卸载
  onUnload: function() {
    this.data.page_static = false;
    wx.stopBackgroundAudio();
  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {

  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function() {

  },

  // 用户点击右上角分享
  onShareAppMessage: function() {

  }
})
