var app = getApp();
import Api from './api'

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
            url:Api.apiUrl,
            data: {
              code: res.code
            },
            success:function(res){
              console.log(res)
              let thirdkey = res.data.data.thirdkey;
              var sign = res.data.data.sign;
              if (sign) {
                 wx.setStorageSync('sign', res.data.data.sign);
              }
              wx.setStorageSync('mid', res.data.data.mid);
              wx.getUserInfo({
                 success:function(res){
                    var userData = {};
                    var encryptedData = res.encryptedData;
                    var iv = res.iv;
                    var userInfo = res.userInfo;
                    var wx_name = userInfo.nickName;
                    var avatarUrl = userInfo.avatarUrl;
                    var gender = userInfo.gender;
                    var province = userInfo.province;
                    var city = userInfo.city;
                    var country = userInfo.country;
                    
                    userData = {
                      nickName: wx_name,
                      avatarUrl: avatarUrl,
                      gender: gender,
                      province: province,
                      city: city,
                      country: country
                    };

                    wx.setStorageSync('nickName', wx_name);
                    wx.setStorageSync('avatarUrl', avatarUrl);
                    wx.request({
                      url:Api.apiUrl,
                      method: "POST",
                      data: {
                        type:"actionAuth",
                        sign:wx.getStorageSync("sign"),
                        key:"be15d4ca913c91494cb4f9cd6ce317c6",
                        data:{
                          info: userData,
                          encryptedData:encryptedData,
                          iv:iv,
                          thirdkey:wx.getStorageSync("thirdkey")
                        }
                      },
                      success:function(res){
                        console.log(res)
                         console.log("保存用户信息");
                      }
                    })
                 },
                 fail:function() {
                   wx.showModal({
                     title:'提示',
                     confirmText:'前往授权',
                     content:'拒绝授权部分功能将受影响',
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
                                   url: Api.apiUrl,
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


function http(http,cb){
   wx.request({
     url:Api.apiUrl,
     method:'POST',
     data:{
       sign:wx.getStorageSync("sign"),
       key:"be15d4ca913c91494cb4f9cd6ce317c6",
       type:http.type,
       data:http.data?http.data:''
     },
     success(res){
       typeof cb == "function"&& cb(res);
     }
   })
};


function getSign(callback) {
   wx.login({
     success(res){
      //  console.log(res);
       wx.request({
         url: Api.apiUrl,
         data:{
            key:'be15d4ca913c91494cb4f9cd6ce317c6',
            type:"get-third-key",
            data:{
               code:res.code
            }
         },
         method:"POST",
         success(res){
           console.log(res)
           let sign = wx.getStorageSync("sign");
           if (!sign) {
              wx.getUserInfo({

              })
           }
           let thirdkey = res.data.data.thirdkey;
           wx.setStorageSync("sign",sign);
           wx.setStorageSync("thirdkey",thirdkey);
           typeof callback == "function" && callback(sign)
         },
         fail(res){
           let sign = JSON.stringify(res)
           typeof callback == "function" && callback(sign)
         }
       })

     }
   })
};

function getThirdKey(cb){
    wx.login({
       success(res){
         let code = res.code;
         wx.request({
           url:Api.apiUrl,
           method:"POST",
           data:{
             key:"be15d4ca913c91494cb4f9cd6ce317c6",
             type:"get-third-key",
             data:{
               code:code
             }
           },
           success(res){
            console.log(res);
            typeof cb =='function'&&cb(res);
           }
         })
       }
    })
};

// 获取vip_id
function getVipId(tell,callback){
  wx.request({
    url:Api.apiUrl,
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
    getUser,
    http,
    getThirdKey
}

