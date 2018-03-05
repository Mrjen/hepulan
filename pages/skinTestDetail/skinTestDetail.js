// pages/skinTestDetail/skinTestDetail.js
var common = require('../../common.js');
import { statistic, fromPageData } from '../../tunji'
Page({
    data: {
        testStart: false,
        questionIndex: 1,  // 当前题目索引
        isSelect:false,  //当前是否选中选项
        navLeft: 340,
        typeList: [{
            icon: "https://qncdn.playonwechat.com/hepulan/skin_test_type1.png",
            id: 1,
            title: "皮肤干湿度测试",
            type: "未测试肤质",
            color: "#b0ebff",
            discribe: "通过回答这部分的问题，可以准确分析出你的皮肤趋向于发生各种敏感肌肤症状的程度，所有的面疱（痤疮/痘痘）、红肿、潮红、发痒都属于皮肤的敏感症状"
        }, {
            icon: "https://qncdn.playonwechat.com/hepulan/skin_test_type2.png",
            id: 1,
            title: "皮肤干湿度测试",
            type: "未测试肤质",
            color: "#80b5a5",
            discribe: "通过回答这部分的问题，可以准确分析出你的皮肤趋向于发生各种敏感肌肤症状的程度，所有的面疱（痤疮/痘痘）、红肿、潮红、发痒都属于皮肤的敏感症状"
        }, {
            icon: "https://qncdn.playonwechat.com/hepulan/skin_test_type3.png",
            id: 1,
            title: "皮肤干湿度测试",
            type: "未测试肤质",
            color: "#ffc3e5",
            discribe: "通过回答这部分的问题，可以准确分析出你的皮肤趋向于发生各种敏感肌肤症状的程度，所有的面疱（痤疮/痘痘）、红肿、潮红、发痒都属于皮肤的敏感症状"
        }, {
            icon: "https://qncdn.playonwechat.com/hepulan/skin_test_type4.png",
            id: 1,
            title: "皮肤干湿度测试",
            type: "未测试肤质",
            color: "#ffd800",
            discribe: "通过回答这部分的问题，可以准确分析出你的皮肤趋向于发生各种敏感肌肤症状的程度，所有的面疱（痤疮/痘痘）、红肿、潮红、发痒都属于皮肤的敏感症状"
        }],
        test: [{
            id: 0,
            active: true,
            question: "Q1. 洗完脸后的2-3小时,不在脸上涂任何保湿/防晒产品、化妆水、粉底或任何产品,这时如果在明亮的光线下照镜子,你的前额和脸颊部位：",
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
            id: 0,
            active: false,
            question: "Q2. 在自己以往的照片中,你的脸是否显得光亮：",
            _Options: [{
                op: "A. 非常粗糙、出现皮屑,或者如布满灰尘般的晦暗",
                scroe: 2,
                opSelect: ""
            }, {
                op: "B. 仍有紧绷感",
                opSelect: "",
                scroe: 2
            }, {
                op: "C. 能够回复正常的润泽感而且在镜中看不到反光",
                opSelect: "",
                scroe: 2
            }, {
                op: "D. 能看到反光",
                opSelect: "",
                scroe: 2
            }]
        }, {
            id: 0,
            active: false,
            question: "Q3. 在自己以往的照片中,你的脸是否显得光亮：",
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
            id: 0,
            active: false
        }, {
            id: 0,
            active: false
        }, {
            id: 0,
            active: false
        }, {
            id: 0,
            active: false
        }, {
            id: 0,
            active: false
        }, {
            id: 0,
            active: false
        }]
    },

    onLoad: function(options) {
        let that = this;
        // 上报后台数据
        statistic();
        wx.setStorageSync('scene', options.scene)

        // 渠道统计  一定要放在wx.setStorageSync('scene', options.scene) 之后
        fromPageData()
        
        that.setData({
            pagecolor: options.pagecolor,
            testId: options.testId,
            index:options.index
        })

        let http = {
            type: "get-skintest-info",
            data: {
                id: that.data.testId
            }
        }
        common.http(http, function(res) {
            console.log(res);
            let test = res.data.data.list;
            let testLength = that.data.test.length;
            that.setData({
                test,
                testLength
            })
        })
    },

    //  上一题
    prevQuestion() {
        let that = this,
        test = that.data.test,
        navLeft = that.data.navLeft + 98,
        questionIndex = that.data.questionIndex;
        test[questionIndex - 1].active = false;
        test[questionIndex-2].active = false;
        test[questionIndex - 2].options.map(el=>{
            el.active = false;
        })
        that.setData({
            navLeft:navLeft,
            questionIndex: questionIndex-1,
            test: test
        })
    },

    // 下一题
    nextQuestion(ev) {
        // console.log(ev)
        let that = this;
        let test = that.data.test;
        let navLeft = that.data.navLeft;
        let questionIndex = that.data.questionIndex;
        let item_score = ev.currentTarget.dataset.score;
        
        if (!that.data.isSelect){
            wx.showToast({
                title: '请先选择一项',
                icon: 'success',
                duration: 500
            })
            return false;
        }

        if (questionIndex === test.length) {
            questionIndex = test.length;
            let _score = that.TotalScore(test);
            console.log('这里计算分数',_score)
            // test[test.length-1].active = true;
            navLeft = navLeft;
            let http = {
                type: "save-skintest-info",
                data: {
                    quest_id: that.data.testId,
                    result: _score
                }
            }
            common.http(http, function(res) {
                if (res.data.status === 1) {
                    let index = that.data.index;
                    let win = that.data.typeList[index];
                        win.title = res.data.data.title;
                        win.discribe = res.data.data.result;
                    console.log(win)

                    that.setData({
                      testStart:true,
                      win:win
                    })
                }else{
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'success',
                    duration: 2000
                  })
                }
            })

        } else if (questionIndex < test.length) {
            questionIndex += 1; //题目序号+1
            navLeft = navLeft - 98;
        }

        for (var i = 0; i < questionIndex; i++) {
            test[i].active = true;
        } //题目下标点
        that.setData({
            questionIndex,
            test,
            navLeft,
            isSelect: false
        })
    },

    // 选中题目内容
    selectItem(e){
      console.log(e.currentTarget.dataset)
      let Edata = e.currentTarget.dataset,
          that = this,
          questionIndex = that.data.questionIndex,
          test = that.data.test,
          currentQuest = test[questionIndex - 1].options;
        currentQuest.map(el=>{
            el.active = false;
        })
        currentQuest[Edata.opx].active = true;
        test[questionIndex - 1].options = currentQuest;
      that.setData({
          test,
          isSelect:true
      })
    },

    // 计算总分
    TotalScore(arr){
        let score = new Number();
        console.log(arr)
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].options.length; j++) {
                if (arr[i].options[j].active){
                    score += Number(arr[i].options[j].score);
                }
            }            
        }
        return score;
    },

    closeWin(){
        wx.reLaunch({
          url: '../skinTest/skinTest'
        })
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

    // onShareAppMessage: function () {

    // }
})