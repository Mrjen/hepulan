// pages/skinTest/skinTest.js
var common = require('../../common.js');
import { statistic, fromPageData } from '../../tunji'
Page({
    data: {
        Result: [],
        testStart: false,
        question: [{
            aShow: "",
            quesTitle: "Q1. 洗完脸后的2-3小时,不在脸上涂任何保湿/防晒产品、化妆水、粉底或任何产品,这时如果在明亮的光线下照镜子,你的前额和脸颊部位：",
            _Options: [{
                op: "A. 非常粗糙、出现皮屑,或者如布满灰尘般的晦暗",
                opSelect: ""
            }, {
                op: "B. 仍有紧绷感",
                opSelect: ""
            }, {
                op: "C. 能够回复正常的润泽感而且在镜中看不到反光",
                opSelect: ""
            }, {
                op: "D. 能看到反光",
                opSelect: ""
            }]
        }, {
            aShow: "ques_show",
            quesTitle: "Q2. 在自己以往的照片中,你的脸是否显得光亮：",
            _Options: [{
                op: "A. 从不,或你从未意识到有这种情况",
                opSelect: ""
            }, {
                op: "B. 有时会",
                opSelect: ""
            }, {
                op: "C. 经常会",
                opSelect: ""
            }, {
                op: "D. 历来如此",
                opSelect: ""
            }]
        }, {
            aShow: "ques_show",
            quesTitle: "Q3.上妆或使用粉底,但是不涂干的粉（如质地干燥的粉饼或散粉）,2-3小时后,你的妆容看起来：",
            _Options: [{
                op: "A. 出现皮屑,有的粉底在皱纹里结成小块",
                opSelect: ""
            }, {
                op: "B. 光滑",
                opSelect: ""
            }, {
                op: "C. 出现闪亮",
                opSelect: ""
            }, {
                op: "D. 出现条纹并且闪亮",
                opSelect: ""
            }]
        }, {
            aShow: "ques_show",
            quesTitle: "Q4. 身处干燥的环境中,如果不用保湿产品或防晒产品,你的面部皮肤：",
            _Options: [{
                op: "A. 感觉很干或锐痛",
                opSelect: ""
            }, {
                op: "B. 感觉紧绷",
                opSelect: ""
            }, {
                op: "C. 感觉正常",
                opSelect: ""
            }, {
                op: "D. 看起来有光亮,或从不觉得此时需要用保湿产品",
                opSelect: ""
            }]
        }, {
            aShow: "ques_show",
            quesTitle: "Q5. 照一照有放大功能的化妆镜,从你的脸上能看到多少大头针尖大小的毛孔：",
            _Options: [{
                op: "A. 一个都没有",
                opSelect: ""
            }, {
                op: "B. T区（前额和鼻子）有一些",
                opSelect: ""
            }, {
                op: "C. 很多",
                opSelect: ""
            }, {
                op: "D. 非常多",
                opSelect: ""
            }]
        }, {
            aShow: "ques_show",
            quesTitle: "Q6. 如果让你描述自己的面部皮肤特征,你会选择：",
            _Options: [{
                op: "A. 干性",
                opSelect: ""
            }, {
                op: "B. 中性（正常）",
                opSelect: ""
            }, {
                op: "C. 混合性",
                opSelect: ""
            }, {
                op: "D. 油性",
                opSelect: ""
            }]
        }, {
            aShow: "ques_show",
            quesTitle: "Q7. 当你使用泡沫丰富的皂类洁面产品洗脸后,你感觉：",
            _Options: [{
                op: "A. 感觉干燥、或有刺痛的感",
                opSelect: ""
            }, {
                op: "B. 感觉有些干燥但是没有刺痛感",
                opSelect: ""
            }, {
                op: "C. 感觉没有异常",
                opSelect: ""
            }, {
                op: "D. 感到皮肤出油",
                opSelect: ""
            }]
        }, {
            aShow: "ques_show",
            quesTitle: "Q8.如果不使用保湿产品,你的脸部觉得干吗：",
            _Options: [{
                op: "A. 总是如此",
                opSelect: ""
            }, {
                op: "B. 有时会",
                opSelect: ""
            }, {
                op: "C. 很少",
                opSelect: ""
            }, {
                op: "D. 从不",
                opSelect: ""
            }]
        }, {
            aShow: "ques_show",
            quesTitle: "Q9.你脸上有阻塞的毛孔吗（包括“黑头”和“白头”）：",
            _Options: [{
                op: "A. 从来没有",
                opSelect: ""
            }, {
                op: "B. 很少有",
                opSelect: ""
            }, {
                op: "C. 有时有",
                opSelect: ""
            }, {
                op: "D. 总是出现",
                opSelect: ""
            }]
        }, {
            aShow: "ques_show",
            quesTitle: "Q10.T区（前额和鼻子一带）出油吗：",
            _Options: [{
                op: "A. 从没有油光",
                opSelect: ""
            }, {
                op: "B. 有时会有出油现象",
                opSelect: ""
            }, {
                op: "C. 经常有出油现象",
                opSelect: ""
            }, {
                op: "D. 总是油油的",
                opSelect: ""
            }]
        }, {
            aShow: "ques_show",
            quesTitle: "Q11.脸上涂过保湿产品后2-3小时,你的两颊部位：",
            _Options: [{
                op: "A. 非常粗糙、脱皮或者如布满灰尘般的晦暗",
                opSelect: ""
            }, {
                op: "B. 干燥光滑",
                opSelect: ""
            }, {
                op: "C. 有轻微的油光",
                opSelect: ""
            }, {
                op: "D. 有油光、滑腻、或者你从不觉得有必要、事实上也不怎么使用保湿产品",
                opSelect: ""
            }]
        }],
        typeList: [{
            icon: "https://qncdn.playonwechat.com/hepulan/skin_test_type1.png",
            title: "皮肤干湿度测试",
            type: "未测试肤质",
            color: "#b0ebff",
            discribe: "通过回答这部分的问题，可以准确分析出你的皮肤趋向于发生各种敏感肌肤症状的程度，所有的面疱（痤疮/痘痘）、红肿、潮红、发痒都属于皮肤的敏感症状"
        }, {
            icon: "https://qncdn.playonwechat.com/hepulan/skin_test_type2.png",
            title: "皮肤干湿度测试",
            type: "未测试肤质",
            color: "#80b5a5",
            discribe: "通过回答这部分的问题，可以准确分析出你的皮肤趋向于发生各种敏感肌肤症状的程度，所有的面疱（痤疮/痘痘）、红肿、潮红、发痒都属于皮肤的敏感症状"
        }, {
            icon: "https://qncdn.playonwechat.com/hepulan/skin_test_type3.png",
            title: "皮肤干湿度测试",
            type: "未测试肤质",
            color: "#ffc3e5",
            discribe: "通过回答这部分的问题，可以准确分析出你的皮肤趋向于发生各种敏感肌肤症状的程度，所有的面疱（痤疮/痘痘）、红肿、潮红、发痒都属于皮肤的敏感症状"
        }, {
            icon: "https://qncdn.playonwechat.com/hepulan/skin_test_type4.png",
            title: "皮肤干湿度测试",
            type: "未测试肤质",
            color: "#ffd800",
            discribe: "通过回答这部分的问题，可以准确分析出你的皮肤趋向于发生各种敏感肌肤症状的程度，所有的面疱（痤疮/痘痘）、红肿、潮红、发痒都属于皮肤的敏感症状"
        }]
    },

    onLoad: function(options) {

        // 上报后台数据
        statistic();
        wx.setStorageSync('sence', options.scene)

        // 渠道统计  一定要放在wx.setStorageSync('sence', options.scene) 之后
        fromPageData()
        
        wx.showShareMenu({
            withShareTicket: true
        })

    },

    // 点击测试项目
    skinTest(ev) {
        let that = this;
        let index = ev.currentTarget.dataset.index;
        let win = that.data.typeList[index];
        let testId = that.data.typeList[index].id;
        let pagecolor = that.data.typeList[index].color;
        that.setData({
            win,
            testId,
            pagecolor,
            index,
            testStart: true
        })
    },

    noTest(){
       wx.showToast({
          title: '请完成所有测试',
          icon: 'success',
          duration: 2000
        })
    },


    // 开始测试
    toTest() {
        let that = this;
        let testId = that.data.testId;
        let pagecolor = that.data.pagecolor;
        wx.navigateTo({
            url: `../skinTestDetail/skinTestDetail?testId=${testId}&&pagecolor=${pagecolor}&&index=${that.data.index}`
        })
        this.setData({
            testStart: false
        })
    },

    // 关闭窗口
    closeWin(e) {
        this.setData({
            testStart: false
        })
    },

    onReady: function() {

    },

    onShow: function() {
        let that = this;
        let http = {
            type: "get-skintest-list"
        };
        common.http(http, function(res) {
            console.log(res)
            let typeList = res.data.data.list;
            let _typeList = that.data.typeList;
            let is_all_finish = res.data.data.is_all_finish;
            for (let i = 0; i < typeList.length; i++) {
                typeList[i].color = _typeList[i].color;
                typeList[i].icon = _typeList[i].icon;
            }
            that.setData({
                typeList,
                is_all_finish
            })
        })
    },

    // 查看肤质
    seeSkinResult(){
        wx.navigateTo({
          url: '../skinResult/skinResult'
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

    onHide: function() {

    },

    onUnload: function() {

    },

    onPullDownRefresh: function() {

    },

    onReachBottom: function() {

    },

    onShareAppMessage: function() {

    },

    onReachBottom: function() {

    },

    onPullDownRefresh: function() {

    }
})