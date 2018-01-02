// pages/redPack/redPack.js
import { http } from '../../common.js'
import { formtime} from '../../common.js'
import { diffTime } from '../../common.js'
Page({
  data: {
    redPackRule:false,  //规则
    getRedPack:false, //从别人分享进入
    redPackShow:false, 
    inviteView:true,  //自己进入
    inviteTip:false,
    coupon_need_more:'',
    isSuccess:false,
    countTime:'00:00:00',  //倒计时
    unique_code:'',  //红包id
    coupon_survival_time:1, //时间差
    persion:[{
      avatar:'http://iph.href.lu/120x120',
      is_group_header:0,
      nickName:'用户1',
      money:'10',
      is_base_gas:0
    }, {
      avatar: '',
      is_group_header: 0,
      nickName: '用户2',
      money: '10',
      is_base_gas: 0
    }, {
      avatar: '',
      is_group_header: 0,
      nickName: '用户3',
      money: '10',
      is_base_gas: 0
    }, {
      avatar: '',
      is_group_header: 0,
      nickName: '用户3',
      money: '10',
      is_base_gas: 0
    }],
    product:[]
  },

  onLoad: function (options) {
    console.log('options 红包页面', options)
    let that = this;
    if (!options.unique_code) {
       //红包id不存在 自己进入
      let unique_code = wx.getStorageSync('unique_code');
      http({ type:'get-coupon-info',data:{
        unique_code: unique_code
      }},function(res){
        console.log('获取红包信息',res);
        let persion = that.data.persion;
        let coupon_user_list = res.data.data.coupon_user_list;
        let coupon_status = res.data.data.coupon_status;
        let coupon_valid_time = res.data.data.coupon_valid_time;
        let coupon_survival_time = res.data.data.coupon_survival_time;
        let coupon_need_more = res.data.data.coupon_need_more;
        let hot_goods_list = res.data.data.hot_goods_list;
        let coupon_receive_list = res.data.data.coupon_receive_list;
        let countTime = null;
        that.setData({
          coupon_survival_time: coupon_survival_time
        })
        let formTime = setInterval(function(){
          if (coupon_survival_time>0){
            coupon_survival_time--;
            countTime = diffTime(coupon_survival_time * 1000);
             that.setData({
               countTime
             })
           }else{
             clearInterval(formTime);
             that.setData({
               coupon_survival_time:-1
             })
           }
        },1000)
        for (let i = 0, len = coupon_user_list.length;i<len;i++){
          persion[i].avatar = coupon_user_list[i].headimgurl;
          persion[i].is_group_header = coupon_user_list[i].is_leader;
          persion[i].nickName = coupon_user_list[i].nickname;
          persion[i].money = coupon_user_list[i].score;
          persion[i].is_base_gas = coupon_user_list[i].is_best;
        }
        
        console.log('coupon_status', coupon_status)

        if (coupon_status){
           that.setData({
            inviteView:false,
            redPackShow:false,
            getRedPack:false,
            unique_code: unique_code,
            persion: persion,
            isSuccess: 1,
            coupon_need_more: coupon_need_more,
            hot_goods_list: hot_goods_list
          })
        }else{
          that.setData({
            inviteView: true,
            redPackShow: false,
            getRedPack: false,
            unique_code: unique_code,
            persion: persion,
            isSuccess: 0,
            coupon_need_more: coupon_need_more,
            hot_goods_list: hot_goods_list
          })
        }

        
      })

    } else if (options.unique_code){
      // 有红包id 从分享进入
      http({
        type: 'get-coupon-info', data: {
          unique_code: options.unique_code
        }
      }, function (res) {
        console.log('从分享进入', res);
        let persion = that.data.persion;
        let coupon_user_list = res.data.data.coupon_user_list;
        let coupon_status = res.data.data.coupon_status;
        let coupon_valid_time = res.data.data.coupon_valid_time;
        let coupon_survival_time = res.data.data.coupon_survival_time;
        let coupon_need_more = res.data.data.coupon_need_more;
        let hot_goods_list = res.data.data.hot_goods_list;
        let user_coupon_score = res.data.data.user_coupon_score;
        let coupon_receive_list = res.data.data.coupon_receive_list;
        let user_is_dismantle = res.data.data.user_is_dismantle;   //当前用户是否拆过此红包
        let countTime = null;
        that.setData({
          coupon_survival_time: coupon_survival_time
        })
        for (let i = 0, len = coupon_user_list.length; i < len; i++) {
          persion[i].avatar = coupon_user_list[i].headimgurl;
          persion[i].is_group_header = coupon_user_list[i].is_leader;
          persion[i].nickName = coupon_user_list[i].nickname;
          persion[i].money = coupon_user_list[i].score;
          persion[i].is_base_gas = coupon_user_list[i].is_best;
        }
        let formTime = setInterval(function () {
          if (coupon_survival_time > 0) {
            coupon_survival_time--;
            countTime = diffTime(coupon_survival_time * 1000);
            that.setData({
              countTime
            })
          } else {
            clearInterval(formTime);
            that.setData({
              coupon_survival_time: -1
            })
          }
        }, 1000)

        console.log('coupon_status', coupon_status, 'user_is_dismantle', user_is_dismantle)

        // 滚动用户
        let userArr = coupon_receive_list[0];
        let _i = 1;
        let userTime = setInterval(function (){
          userArr = coupon_receive_list[_i];
          that.setData({
            userArr: userArr
          })
          _i = _i < coupon_receive_list.length?_i+1:0;
        },4000)


        that.setData({
          persion: persion,
          unique_code: options.unique_code,
          hot_goods_list: hot_goods_list,
          user_coupon_score: user_coupon_score,
          coupon_need_more: coupon_need_more,
          user_is_dismantle: user_is_dismantle,
          coupon_receive_list: coupon_receive_list,
          userArr: userArr
        })

        if (coupon_survival_time<0) {
           console.log('红包过期了');
           return false;
        }
        if (user_is_dismantle){
           //判断用户是否拆过此红包   拆过
           if (coupon_status) {
             //判断红包状态  是否组团成功
             console.log('组团成功')
             that.setData({
               inviteView: false,
               redPackShow: false,
               isSuccess: true,
               getRedPack: false,
             })
           } else {
              console.log('组团中')
              that.setData({
                inviteView: true,
                redPackShow: true,
                getRedPack: false,
                isSuccess: false
              })
           }
        }else{
          //用户没有拆过此红包
          console.log('用户没有拆过这个红包')
           that.setData({
             inviteView: false,
             redPackShow: false,
             getRedPack: true,
             isSuccess: false
           })
        }
      })  
    }
  },

  // 领取红包
  getRedPack(e){
     console.log('领取红包',e);
     let that = this;
    http({ type: 'action-dismantle-active-coupon', 
           data: { 
             formid: e.detail.formId,
             unique_code: that.data.unique_code
            }
        },function(params) {
        console.log('000000',params)
          if (params.data.status=='1') {
            http({ type: 'get-coupon-info', data: { unique_code: that.data.unique_code}},function(res){
                console.log('111111',res);
              let persion = that.data.persion;
              let coupon_user_list = res.data.data.coupon_user_list;
              let coupon_status = res.data.data.coupon_status;
              let coupon_valid_time = res.data.data.coupon_valid_time;
              let coupon_survival_time = res.data.data.coupon_survival_time;
              let coupon_need_more = res.data.data.coupon_need_more;
              let user_coupon_score = res.data.data.user_coupon_score;
              let coupon_receive_list = res.data.data.coupon_receive_list;
              let countTime = null;
              that.setData({
                coupon_survival_time: coupon_survival_time
              })
              let formTime = setInterval(function () {
                if (coupon_survival_time > 0) {
                  coupon_survival_time--;
                  countTime = diffTime(coupon_survival_time * 1000);
                  that.setData({
                    countTime
                  })
                } else {
                  clearInterval(formTime);
                  that.setData({
                    coupon_survival_time: -1
                  })
                }
              }, 1000)

              for (let i = 0, len = coupon_user_list.length; i < len; i++) {
                persion[i].avatar = coupon_user_list[i].headimgurl;
                persion[i].is_group_header = coupon_user_list[i].is_leader;
                persion[i].nickName = coupon_user_list[i].nickname;
                persion[i].money = coupon_user_list[i].score;
                persion[i].is_base_gas = coupon_user_list[i].is_best;
              }
              console.log('coupon_status', coupon_status)
              if (coupon_status) {
                console.log('组团成功')
                that.setData({
                  inviteView: false,
                  redPackShow: false,
                  getRedPack: false,
                  persion: persion,
                  isSuccess: 1,
                  coupon_need_more: coupon_need_more,
                  user_coupon_score: user_coupon_score
                })
              } else {
                that.setData({
                  inviteView: true,
                  redPackShow: false,
                  getRedPack: false,
                  persion: persion,
                  isSuccess: 0,
                  coupon_need_more: coupon_need_more,
                  user_coupon_score: user_coupon_score
                })
              }

            })
        }else{
            wx.showModal({
              title: '领取失败',
              content: '您已经拆过该好友的红包了哦',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          console.log('领取失败')
        }
    })
  },

  // 马上领取
  toProductDetail(e){
    wx.navigateTo({
      url: `../pointMallDetail/pointMallDetail?id=${e.currentTarget.dataset.id}`
    })
  },

  // 关闭红包
  closeRedPack() {
     this.setData({
       redPackShow:false
     })
  },

  // 打开规则
  openRule(){
    this.setData({
      redPackRule:true
    })
  },

  // 关闭规则
  closeRedPack(){
    this.setData({
      redPackRule:false 
    })
  },

  // 关闭邀请弹层
  closeRedPackwin(){
    let that = this;
      this.setData({
        redPackShow:false,
        inviteTip:true
      },function(){
        setTimeout(() => {
          that.setData({
            inviteTip: false
          })
        }, 1000);
      })
  },

  // 拆新红包
  getNewRedPack(e){
    let that = this;
    console.log(e.detail.formId);
    if (e.detail.formId) {
      http({
        type: 'add-user-active-coupon', data: {
          formid: e.detail.formId
        }
      }, function (res) {
        console.log('生成红包成功', res)
        wx.setStorageSync('unique_code', res.data.data.unique_code);
        wx.redirectTo({
          url: `../redPack/redPack?formid=${e.detail.formId}`
        })
      })

    }
    that.setData({

    })
  },

  // 立即使用
  toPointMall(){
    wx.navigateTo({
      url: '../pointMall/pointMall'
    })
  },

  onReady: function () {
  
  },
  onShow: function () {
     

  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function (res) {
    let that = this;
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: '快来跟我一起瓜分50元红包！',
        path: `/pages/redPack/redPack?unique_code=${this.data.unique_code}`,
        success: function (res) {
          // 转发成功
          that.setData({
            redPackShow: false,
            inviteTip: true
          }, function () {
            setTimeout(() => {
              that.setData({
                inviteTip: false
              })
            }, 1000);
          })
        },
        fail: function (res) {
          // 转发失败
          that.setData({
            inviteTip: true
          }, function () {
            setTimeout(() => {
              that.setData({
                inviteTip: false
              })
            }, 1000);
          })
        }
      }
  }
})