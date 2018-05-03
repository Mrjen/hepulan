import {md5} from './md5';
import api from './api';

// 统计页面函数
function statistic(params={}) {
    let url = getCurrentPageUrl();
    var timestamp = Date.parse(new Date());
    let SystemInfo = wx.getSystemInfoSync();
        SystemInfo.page = url,
        SystemInfo.sign = wx.getStorageSync('sign');
        SystemInfo.time = timestamp;
        SystemInfo.app = 'hplcenter';
        SystemInfo.token = md5('BDDkDyYTpgfoRiGDnvt9UdrwF#' + timestamp);
    params.data = SystemInfo;
    wx.request({
        url: 'https://tj.zealcdn.cn/?_a_=clientReport',
        data: params.data,
        method: 'POST', 
        success: function(res){
            console.log(res)
        },
        fail: function() {
            // fail
        },
        complete: function() {
            // complete
        }
    })
}

// 获取当前页面路径
function getCurrentPageUrl() {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    return url
}


// 获取用户相关信息
function getUserData(){
    
}


// 统计用户来源
function fromPageData(params={}) {
    wx.login({
        success(res){
            wx.request({
                url:api.apiUrl,
                method:'post',
                data:{ key:'be15d4ca913c91494cb4f9cd6ce317c6',
                  type: 'auth',
                  data:{
                      code: res.code
                  }
                },
                success(res){
                    console.log('获取到用户信息', res)
                    var timestamp = Date.parse(new Date());
                    let userData = res.data.data;
                    userData.scene = wx.getStorageSync('scene') || params.scene;
                    console.log('userData',userData)
                    if (userData.app_openid && userData.scene && userData.is_fresh>-1){
                        //有参数才上报
                        params = {
                            openid: userData.app_openid,
                            unionid: userData.unionid,
                            scene: userData.scene || wx.getStorage({key: 'scene'}) || params.scene,
                            sign: userData.sign,
                            is_fresh: userData.is_fresh,
                            time: timestamp,
                            token: md5('BDDkDyYTpgfoRiGDnvt9UdrwF#' + timestamp),
                            app: 'hplcenter',
                            gender: userData.gender || 0 
                        }
                        wx.request({
                            url: 'https://tj.zealcdn.cn/?_a_=serverReport',
                            data: params,
                            method: 'POST',
                            success: function (res) {
                                console.log('上报来源数据成功', res)
                            },
                            complete: function (res) {
                                // complete
                                console.log('complete', res)
                            }
                        })
                    }

                }
            })
        }
    })
     

    

    
}

// 用户事件
function userEvent(params = {}) {
    let timestamp = Date.parse(new Date());
    params.time = timestamp;
    console.log('秒数',timestamp)
    params.sign = wx.getStorageSync('sign');
    params.token = md5('BDDkDyYTpgfoRiGDnvt9UdrwF#' + timestamp);
    params.app = 'hplcenter'
     wx.request({
         url: 'https://tj.zealcdn.cn/?_a_=clientEvent',
         data: params,
         method: 'POST', 
         success: function(res){
             // success
         },
         fail: function() {
             // fail
         },
         complete: function() {
             // complete
         }
     })
}


// 统计用户咨询按钮
function userClickCantact() {
     wx.request({
         url: api.tunJiContact,
         data: {
             openid: wx.getStorageSync('openid')
         },
         method: 'GET',
         success: function(res){
             // success
             console.log('上报客服统计', res)
         },
         fail: function() {
             // fail
         },
         complete: function() {
             // complete
         }
     })
}

module.exports = {
    statistic,
    fromPageData,
    userEvent,
    userClickCantact,
    getUserData
}