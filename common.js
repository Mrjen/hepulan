var app = getApp();
import Api from './api'
import { fromPageData } from './tunji'

// 返回首页
function backHome() {
  wx.switchTab({
    url: '../index/index'
  })
};

// 分享
function toShare() {
  wx.navigateTo({
    url: '../sharePoster/sharePoster'
  })
};

// 获取用户信息
function getUser() {
  var wx_name = wx.getStorageSync('nickName');
  var avatarUrl = wx.getStorageSync('avatarUrl');
  if (!wx_name && !avatarUrl) {
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: Api.apiUrl,
            data: {
              code: res.code
            },
            success: function (res) {
              console.log(res)
              let thirdkey = res.data.data.thirdkey;
              var sign = res.data.data.sign;
              if (sign) {
                wx.setStorageSync('sign', res.data.data.sign);
              }
              wx.setStorageSync('mid', res.data.data.mid);
              wx.getUserInfo({
                success: function (res) {
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
                    url: Api.apiUrl,
                    method: "POST",
                    data: {
                      type: "actionAuth",
                      sign: wx.getStorageSync("sign"),
                      key: "be15d4ca913c91494cb4f9cd6ce317c6",
                      data: {
                        info: userData,
                        encryptedData: encryptedData,
                        iv: iv,
                        thirdkey: wx.getStorageSync("thirdkey")
                      }
                    },
                    success: function (res) {
                      console.log('用户信息',res)
                    
                    }
                  })
                },
                fail: function () {
                  wx.showModal({
                    title: '提示',
                    confirmText: '前往授权',
                    content: '拒绝授权部分功能将受影响',
                    success: function (res) {
                      if (res.confirm) {
                        wx.openSetting({
                          success: (res) => {
                            wx.getUserInfo({
                              success: function (res) {
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
                                  success: function (res) {
                                    console.log("保存用户信息");

                                    if (wx.getStorageSync('sence')) {
                                      fromPageData();
                                    }
                                  }
                                })
                              }
                            })
                          }
                        })
                      } else if (res.cancel) {
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

// 请求   禾葡兰技术那边请求
function http(http={},cb) {
  wx.request({
    url: Api.apiUrl,
    method: 'POST',
    data: {
      sign: wx.getStorageSync("sign"),
      key: "be15d4ca913c91494cb4f9cd6ce317c6",
      type: http.type,
      data: http.data ? http.data : ''
    },
    success(res) {
      typeof cb == "function" && cb(res);
    }
  })
};


// 我们技术部门的请求
function wxRequest(data={},cb) {
    wx.request({
      url: data.url,
      data: data.data,
      method: data.method ? data.method:'get', 
      success: function(res){
      },
      fail: function(res) {
      },
      complete: function(res) {
        cb(res)
      }
    })
}

// 获取sign
function getSign(callback) {
  wx.login({
    success(res) {
      //  console.log(res);
      wx.request({
        url: Api.apiUrl,
        data: {
          key: 'be15d4ca913c91494cb4f9cd6ce317c6',
          type: "get-third-key",
          data: {
            code: res.code
          }
        },
        method: "POST",
        success(res) {
          console.log(res)
          let sign = wx.getStorageSync("sign");
          if (!sign) {
            wx.getUserInfo({

            })
          }
          let thirdkey = res.data.data.thirdkey;
          wx.setStorageSync("sign", sign);
          wx.setStorageSync("thirdkey", thirdkey);
          typeof callback == "function" && callback(sign)
        },
        fail(res) {
          let sign = JSON.stringify(res)
          typeof callback == "function" && callback(sign)
        }
      })

    }
  })
};

// 获取key
function getThirdKey(cb) {
  wx.login({
    success(res) {
      let code = res.code;
      wx.request({
        url: Api.apiUrl,
        method: "POST",
        data: {
          key: "be15d4ca913c91494cb4f9cd6ce317c6",
          type: "get-third-key",
          data: {
            code: code
          }
        },
        success(res) {
          console.log(res);
          typeof cb == 'function' && cb(res);
        }
      })
    }
  })
};

// 获取vip_id
function getVipId(tell, callback) {
  wx.request({
    url: Api.apiUrl,
    method: "POST",
    data: {
      key: "be15d4ca913c91494cb4f9cd6ce317c6",
      type: "getVipinfoByMobile",
      data: {
        mobile: tell
      }
    },
    success(res) {
      wx.setStorageSync("vip_id", res.data.data.vip_id)
      if (callback) {
        typeof callback == 'function' && callback();
      }
    }
  })
};

// 时间格式化
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
  var hour = nd.getHours(), minute = nd.getMinutes(), second = nd.getSeconds();
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  if (second < 10) {
    second = '0' + second;
  }

  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  // return month + '/' + day + ' ' + hour + ':' + minute +':'+ second;
};


function diffTime(diff) {
  // var diff = endDate.getTime() - startDate.getTime();
  //时间差的毫秒数  

  //计算出相差天数  
  var days = Math.floor(diff / (24 * 3600 * 1000));

  //计算出小时数  
  var leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数  
  var hours = Math.floor(leave1 / (3600 * 1000));
  //计算相差分钟数  
  var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数  
  var minutes = Math.floor(leave2 / (60 * 1000));

  //计算相差秒数  
  var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数  
  var seconds = Math.round(leave3 / 1000);

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  return hours + ':' + minutes + ':' + seconds;
}


function couPondiffTime(startDate, endDate) {
  var diff = (endDate - startDate)*1000;//时间差的毫秒数  

  //计算出相差天数  
  var days = Math.floor(diff / (24 * 3600 * 1000));

  //计算出小时数  
  var leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数  
  var hours = Math.floor(leave1 / (3600 * 1000));
  //计算相差分钟数  
  var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数  
  var minutes = Math.floor(leave2 / (60 * 1000));

  //计算相差秒数  
  var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数  
  var seconds = Math.round(leave3 / 1000);

  var returnStr = seconds + "秒";
  if (minutes > 0) {
    returnStr = minutes + "分";
  }
  if (hours > 0) {
    returnStr = hours + "小时";
  }
  if (days > 0) {
    returnStr = days + "日";
  }
  return returnStr;
}

module.exports = {
  time,
  diffTime,
  couPondiffTime,
  backHome,
  toShare,
  getSign,
  getVipId,
  getUser,
  http,
  getThirdKey,
  wxRequest
}

