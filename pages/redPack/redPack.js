// pages/redPack/redPack.js
import { http } from '../../common.js'
import { formtime, getSign } from '../../common.js'
import { diffTime } from '../../common.js'
var mta = require('../../utils/mta_analysis.js');
import { statistic } from '../../tunji'

Page({
  data: {
    redPackRule: true,  //规则
    getRedPack: false, //从别人分享进入
    redPackShow: false,
    redpackHeader:'恭喜您，已成功瓜分红包~',
    inviteView: true,  //自己进入
    isChaiWan:true, //用户进来的时候红包拆完了设置false
    inviteTip: false,
    redpackCard:true, //我自己的红包卡片
    coupon_need_more: '',
    isSuccess: false,
    countTime: '00:00:00',  //倒计时
    unique_code: '',  //红包id
    coupon_survival_time: 1, //时间差
    couponInfo: null,
    persion: [{
      avatar: 'http://iph.href.lu/120x120',
      is_group_header: 0,
      nickName: '用户1',
      money: '10',
      is_base_gas: 0
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
    product: []
  },
  // 倒计时
  timeform(coupon_survival_time,that){
    let countTime = that.data.countTime;
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
  },
 
  // 获取头像
  getPersion(coupon_user_list,persion,that){
    for (let i = 0, len = coupon_user_list.length; i < len; i++) {
      persion[i].avatar = coupon_user_list[i].headimgurl;
      persion[i].is_group_header = coupon_user_list[i].is_leader;
      persion[i].nickName = coupon_user_list[i].nickname;
      persion[i].money = coupon_user_list[i].score;
      persion[i].is_base_gas = coupon_user_list[i].is_best;
    }
    return persion;
  },

  onLoad: function (options) {
    console.log('options 红包页面', options);
    // 初始化腾讯统计
    mta.Page.init();


    // 上报后台数据
    statistic();
    wx.setStorageSync('sence', options.scene) 

    let that = this;
    if (!options.unique_code) {
      //红包id不存在 自己进入
      let unique_code = wx.getStorageSync('unique_code');
      http({
        type: 'get-coupon-info', data: {
          unique_code: unique_code
        }
      }, function (res) {
        console.log('获取红包信息', res);
        let persion = that.data.persion;
        let couponInfo = res.data.data;
        that.setData({
          coupon_survival_time: couponInfo.coupon_survival_time
        })
        that.timeform(couponInfo.coupon_survival_time,that);
        persion = that.getPersion(couponInfo.coupon_user_list, persion,that);
        console.log('coupon_status', couponInfo.coupon_status)
        if (couponInfo.coupon_status) {
          console.log('自己进来,组团成功')
          that.setData({
            inviteView: false,
            redPackShow: false,
            getRedPack: false,
            unique_code: unique_code,
            persion: persion,
            isSuccess: 1,
            couponInfo: couponInfo
          })
        } else {
          console.log('自己进来,没组团成功')
          that.setData({
            inviteView: true,
            redPackShow: false,
            getRedPack: false,
            unique_code: unique_code,
            persion: persion,
            isSuccess: 0,
            couponInfo: couponInfo
          })
        }
      })

    } else if (options.unique_code) {
      // 有红包id 从分享进入
      getSign(function(sign) {
         console.log('sign',sign)
         wx.setStorageSync('sign', sign);
        http({
          type: 'get-coupon-info', data: {
            unique_code: options.unique_code
          }
        }, function (res) {
          console.log('从分享进入', res);
          let persion = that.data.persion;
          let couponInfo = res.data.data;
          // let user_is_dismantle = res.data.data.user_is_dismantle;   //当前用户是否拆过此红包
          let countTime = null;
          that.setData({
            coupon_survival_time: couponInfo.coupon_survival_time
          })

          console.log(couponInfo.coupon_user_list, persion)

          persion = that.getPersion(couponInfo.coupon_user_list, persion, that);
          that.timeform(couponInfo.coupon_survival_time, that);
          console.log('couponInfo.coupon_status', couponInfo.coupon_status, 'user_is_dismantle', couponInfo.user_is_dismantle)
          // 滚动用户
          let userArr = couponInfo.coupon_receive_list[0];
          let _i = 1;
          let userTime = setInterval(function () {
            userArr = couponInfo.coupon_receive_list[_i];
            that.setData({
              userArr: userArr
            })
            _i = _i < couponInfo.coupon_receive_list.length ? _i + 1 : 0;
          }, 4000)

          that.setData({
            persion: persion,
            couponInfo: couponInfo,
            userArr: userArr,
            unique_code: options.unique_code
          })

          //先判断用户红包有没有组团成功  在判断红包有没有过期 就算过期还得判断是否拼团成功
          if (couponInfo.coupon_status) {
            //判断红包状态  是否组团成功
            console.log('组团成功')
            that.setData({
              inviteView: false,
              redPackShow: false,
              isSuccess: true,
              getRedPack: false
            })
            if (!couponInfo.user_is_dismantle) {
              console.log('组团成功并且我没有参与')
              that.setData({
                redpackCard: false,
                isChaiWan: false,
                redpackHeader: '您来晚啦！，红包已被拆完，快去拆个新红包'
              })
            } else {
              console.log('组团成功，并且我参与了');
            }

          } else {

            if (couponInfo.user_is_dismantle) {
              console.log('组团中,我参与了')
              // that.setData({
              //   isSuccess:false,
              //   getRedPack:true
              // })
            } else {
              console.log('组团中,我没参与')
              that.setData({
                isSuccess: false,
                inviteView: false,
                getRedPack: true
              })
            }

            if (couponInfo.coupon_survival_time < 0) {
              console.log('红包过期了');
              return false;
            }
          }
        })
      })
      console.log(wx.getStorageSync('sign'));
      
    }
  },

  // 统计分享
  tunjiShare(e) {
    http({
      type: 'save-app-formid',
      data: {
        formid: e.detail.formId
      }
    }, function (res) {
      console.log('分享formId', e.detail.formId)
    })
    mta.Event.stat("redpack_share", {})
  },

  // 领取红包
  getRedPack(e) {
    console.log('领取红包', e);
    let that = this;
    // 统计点击领取红包的次数
    mta.Event.stat("get_redpack", {})
    http({
      type: 'action-dismantle-active-coupon',
      data: {
        formid: e.detail.formId,
        unique_code: that.data.unique_code
      }
    }, function (params) {
      console.log('点击领取红包 返回的数据', params)
      if (params.data.status == '1') {
        http({ type: 'get-coupon-info', data: { unique_code: that.data.unique_code } }, function (res) {
          console.log('111111', res);
          let persion = that.data.persion;
          let couponInfo = res.data.data;
          let countTime = null;
          that.setData({
            coupon_survival_time: couponInfo.coupon_survival_time
          })
          that.timeform(couponInfo.coupon_survival_time, that);
          console.log(couponInfo.coupon_user_list, persion)
          persion = that.getPersion(couponInfo.coupon_user_list,persion,that);
          console.log('coupon_status', couponInfo.coupon_status)
          if (couponInfo.coupon_status) {
            console.log('组团成功')
            that.setData({
              inviteView: false,
              redPackShow: false,
              getRedPack: false,
              persion: persion,
              isSuccess: 1,
              couponInfo: couponInfo
            })
          } else {
            that.setData({
              inviteView: true,
              redPackShow: false,
              getRedPack: false,
              persion: persion,
              isSuccess: 0,
              couponInfo: couponInfo
            })
          }

        })
      } else {
        wx.showModal({
          title: '领取失败',
          content: '您已经拆过该好友的红包了哦,是否自己拆红包？',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              wx.switchTab({
                 url: '../index/index'
              })
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
  toProductDetail(e) {
    wx.navigateTo({
      url: `../pointMallDetail/pointMallDetail?id=${e.currentTarget.dataset.id}`
    })
  },

  // 关闭红包
  closeRedPack() {
    this.setData({
      redPackShow: false
    })
  },

  // 打开规则
  openRule(e) {
    http({
      type: 'save-app-formid',
      data: {
        formid: e.detail.formId
      }
    }, function (res) {
      console.log('打开规则', e.detail.formId)
    })
    this.setData({
      redPackRule: true
    })
  },

  // 关闭规则
  closeRedPack() {
    this.setData({
      redPackRule: false
    })
  },

  // 关闭邀请弹层
  closeRedPackwin() {
    let that = this;
    this.setData({
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

  // 拆新红包
  getNewRedPack(e) {
    let that = this;

    mta.Event.stat("get_newredpack", {})

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
  },

  // 立即使用
  toPointMall(e) {
    if (e.detail.formId) {
      http({
        type: 'save-app-formid',
        data: {
          formid: e.detail.formId
        }
      }, function (res) {
        wx.navigateTo({
          url: '../pointMall/pointMall'
        })
      })
    }

  },

  toHome(){
    wx.switchTab({
      url: '../index/index'
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