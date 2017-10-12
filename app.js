//app.js
App({
  data: {
    loginData: null,
    sign: "",
    mobile:"",
    username:"",
    mid:"",
    sharecode:"",
    authStatic:false,
    loginStatic:false,
    authSuccess:false,
    apiUrl:"https://api.hepulanerp.com/hpl/index.php?s=/Api/hfzx/index",
    // apiUrl:"https://api2.hepulanerp.com/hpl/index.php?s=/Api/hfzx/index",
    apiKey:"be15d4ca913c91494cb4f9cd6ce317c6"
  },
  onLaunch: function() {
    var that = this;
    //调用API从本地缓存中获取数据
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.login({
      success: function(res) {
        //  console.log(res);
        if (res.code) {
          //发起网络请求
          wx.request({
            url: that.data.apiUrl,
            method:"POST",
            data: {
              key:that.data.apiKey,
              type:"auth",
              data:{
                code: res.code
              }
            },
            success: function(res) {
              console.log(res);

                 that.data.sign = res.data.data.sign;
                 that.data.sharecode = res.data.data.sharecode;
                 that.data.mobile = res.data.data.mobile;
                 that.data.mid = res.data.data.mid;
                wx.setStorageSync('mobile', res.data.data.mobile);
                wx.setStorageSync('sign', res.data.data.sign);
                wx.getUserInfo({
                  success: function(res) {
                    // console.log(res);
                    var userData = {};
                    var encryptedData = res.encryptedData;
                    var iv = res.iv;
                    var userInfo = res.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl
                    var gender = userInfo.gender //性别 0：未知、1：男、2：女
                    var province = userInfo.province
                    var city = userInfo.city
                    var country = userInfo.country
                    wx.setStorageSync('avatarUrl', avatarUrl);
                    wx.setStorageSync('nickName', nickName);
                    that.data.username = nickName;
                    that.data.avatarUrl = avatarUrl;
                    userData = {
                      nickName: nickName,
                      avatarUrl: avatarUrl,
                      gender: gender,
                      province: province,
                      city: city,
                      country: country
                    };
                    wx.request({
                      url:that.data.apiUrl,
                      method: 'POST',
                      data: {
                        key:that.data.apiKey,
                        type:"save-user-info",
                        sign:wx.getStorageSync("sign"),
                        data:{
                          info: userData,
                          encryptedData:encryptedData,
                          iv:iv
                        },
                        success(res){
                          console.log(res)
                        }
                        
                      },
                      success: function(res) {
                        //console.log(res);
                           that.data.authSuccess = true
                          setTimeout(function(){
                           wx.hideLoading()
                         },500)
                      }
                    })
                  },
                  fail:function(){
                    console.log("用户拒绝授权");
                    wx.openSetting({
                      success: (res) => {
                        console.log(res);
                      }
                    })
                  },
                })

            },
          })

        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
        }
      }
    });
  },

  globalData: {
    userInfo: null,
    sign: ""
  }
})
