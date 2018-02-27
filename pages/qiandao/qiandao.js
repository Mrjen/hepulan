import {http} from '../../common';
import { statistic, fromPageData } from '../../tunji';
import tip from '../../utils/tips.js';

Page({
  data: {
     info:{},
     signData:[],
     punchData:{},
     popup:false
  },

    onLoad: function (options) {

    },

    onReady: function () {

    },

    onShow: function () {
        let signData = Array(20),
            that = this;
        for (let i = 0; i < signData.length;i++){
            signData[i] = {}
        }
        let info = {
            avatarUrl: wx.getStorageSync('avatarUrl'),
            nickName: wx.getStorageSync('nickName')
        }
        http({
            type:'get-app-signin-list'
        },function(res){
            // console.log('签到数据',res)
            let punchData = res.data.data;
            punchData = that.sign(punchData, signData);
            that.setData({
                punchData,
                signData,
                info
            })
        })
    },

    // 计算签到
    sign(punchData, signData){
        let keepSign = punchData.sign_keep % 20;
        let keepNum = Math.floor(punchData.sign_keep / 20);
        let initNum = punchData.sign_keep - keepSign;
        signData.map((el, index) => {
            el.index = initNum + (++index)
            if (index <= keepSign) {
                el.hasSign = 1;
            }
        })
        return punchData;
    },

    //   签到
    savePunch(e) {
        console.log(e.detail.formId)
        let that = this,
         signData = that.data.signData,
         punchData = that.data.punchData;
         
        console.log(signData)
        http({
            type:'save-app-signin',
            data:{
                form_id: e.detail.formId
            }
        },function(res){
            console.log(res.data.data.punchData);
            if(res.data.status===1){
                punchData.sign_keep++;
                punchData.is_signin = 1;
                punchData.usable_score += res.data.data.score;
                punchData = that.sign(punchData, signData);
                that.setData({
                    punchData,
                    signData,
                    popup:true,
                    getStore: res.data.data.score
                })
            }else{
               console.log(res.data.msg)
               tip.alert(res.data.msg)
            }
        })
    },

    // 关闭弹窗
    closePopup(){
       this.setData({
           popup:false
       })
    },

  onHide: function () {
    
  },

  onUnload: function () {
    
  },

  onPullDownRefresh: function () {
    
  },

  onReachBottom: function () {
    
  },

  onShareAppMessage: function () {
    
  }
})