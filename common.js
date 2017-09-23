var app = getApp()

function backHome() {
  wx.switchTab({
    url: '../index/index'
  })
};

function toShare() {
  wx.navigateTo({
    url: '../sharePoster/sharePoster'
  })
};

function getUser(){
  var wx_name = wx.getStorageSync('wx_name');
  var avatarUrl = wx.getStorageSync('avatarUrl');
   if (!wx_name&&!avatarUrl) {
     wx.login({
       success:function(res){
         if (res.code) {
           wx.request({
            url: 'https://yulufan.playonwechat.com/site/auth',
            data: {
              code: res.code
            },
            success:function(res){
              var sign = res.data.data.sign;
              wx.setStorageSync('sign', res.data.data.sign);
              wx.setStorageSync('mid', res.data.data.mid);
              wx.setStorageSync('sharecode', res.data.data.sharecode);
              wx.getUserInfo({
                 success:function(res){
                    var userData = {};
                    var userInfo = res.userInfo;
                    var wx_name = userInfo.nickName;
                    var avatarUrl = userInfo.avatarUrl;
                    var gender = userInfo.gender;
                    var province = userInfo.province;
                    var city = userInfo.city;
                    var country = userInfo.country;
                    userData = {
                      wx_name: wx_name,
                      avatarUrl: avatarUrl,
                      gender: gender,
                      province: province,
                      city: city,
                      country: country
                    };
                    wx.setStorageSync('nickName', wx_name);
                    wx.setStorageSync('avatarUrl', avatarUrl);
                    wx.request({
                      url: 'https://yulufan.playonwechat.com/site/save-user-info?sign=' + sign,
                      method: "POST",
                      data: {
                        info: userData
                      },
                      success:function(res){
                         console.log("保存用户信息");
                      }
                    })
                 },
                 fail:function() {
                   wx.showModal({
                     title:'提示',
                     confirmText:'前往授权',
                     content:'拒绝授权您无法使用打赏点赞功能',
                     success:function(res){
                       if (res.confirm) {
                         wx.openSetting({
                           success:(res) =>{
                             wx.getUserInfo({
                               success:function(res){
                                 var userData = {};
                                 var userInfo = res.userInfo;
                                 var wx_name = userInfo.nickName;
                                 var avatarUrl = userInfo.avatarUrl;
                                 var gender = userInfo.gender;
                                 var province = userInfo.province;
                                 var city = userInfo.city;
                                 var country = userInfo.country;
                                 userData = {
                                   wx_name: wx_name,
                                   avatarUrl: avatarUrl,
                                   gender: gender,
                                   province: province,
                                   city: city,
                                   country: country
                                 };
                                 wx.request({
                                   url: 'https://yulufan.playonwechat.com/site/save-user-info?sign=' + sign,
                                   method: "POST",
                                   data: {
                                     info: userData
                                   },
                                   success:function(res){
                                      console.log("保存用户信息");
                                   }
                                 })
                               }
                             })
                           }
                         })
                       }else if (res.cancel) {
                         wx.showToast({
                            title: '用户授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                       }
                     }
                   })
                 }
              })
            }
          })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        //  }
       }
     })
   }
};



function getSign(callback) {
   wx.login({
     success(res){
      //  console.log(res);
       wx.request({
         url: app.data.apiUrl,
         data:{
            key:app.data.apiKey,
            type:"auth",
            data:{
               code:res.code
            }
         },
         method:"POST",
         success(res){
          //  console.log(res)
           var sign = res.data.data.sign;
           wx.setStorageSync("sign",sign);
           typeof callback == "function" && callback()
         }
       })

     }
   })
};

// 获取vip_id
function getVipId(tell,callback){
  wx.request({
    url:'https://api.hepulanerp.com/hpl/index.php?s=/Api/hfzx/index',
    method:"POST",
    data:{
      key:"be15d4ca913c91494cb4f9cd6ce317c6",
      type:"getVipinfoByMobile",
      data:{
        mobile:tell
      }
    },
    success(res){
      wx.setStorageSync("vip_id",res.data.data.vip_id)
      if (callback) {
        typeof callback == 'function' && callback();
      }
    }
  })
};

function time(unixtime, withTime) {
      if (!unixtime) {
          unixtime = (new Date()).getTime();
      } else {
          unixtime *= 1000;
      }
      var nd = new Date(unixtime), year = nd.getFullYear(), month = nd.getMonth() + 1, day = nd.getDate();
      if (month < 10) {
          month = '0' + month;
      }
      if (day < 10) {
          day = '0' + day;
      }
      if (!withTime) {
          return year + '-' + month + '-' + day;
      }
      var hour = nd.getHours(), minute = nd.getMinutes(),second = nd.getSeconds();
      if (hour < 10) {
          hour = '0' + hour;
      }
      if (minute < 10) {
          minute = '0' + minute;
      }
      if (second < 10) {
         second = '0' + second;
      }

      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute +':'+ second;
      // return month + '/' + day + ' ' + hour + ':' + minute +':'+ second;
  };

module.exports = {
    time,
    backHome,
    toShare,
    getSign,
    getVipId,
    getUser
}

