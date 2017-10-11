// pages/skinTestDetail/skinTestDetail.js
var common = require('../../common.js');
Page({
    data: {
        testStart: false,
        questionIndex: 1,
        allScore: 0,
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

    // 点击题目选项
    selectItem(ev) {
        // console.log(ev)
        let that = this;
        let test = that.data.test;
        let navLeft = that.data.navLeft;
        let allScore = that.data.allScore;
        let questionIndex = that.data.questionIndex;
        let item_score = ev.currentTarget.dataset.score;

        allScore = Number(allScore) + Number(item_score);
        if (questionIndex === test.length) {
            questionIndex = test.length;
            // test[test.length-1].active = true;
            navLeft = navLeft;
            let http = {
                type: "save-skintest-info",
                data: {
                    quest_id: that.data.testId,
                    result: allScore
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
                      win
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
            allScore
        })
    },

    closeWin(){
        wx.navigateTo({
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