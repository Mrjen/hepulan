var app = getApp();
import { statistic, fromPageData } from '../../tunji'
// pages/EditAddress/EditAddress.js
Page({
  data: {
     Province:['选择省'],
     City:['选择市'],
     County:['选择区'],
     indexProvince:0,
     indexCity:0,
     indexCounty:0
  },

// 选择省
bindPickerProvince(e){
   console.log(e);
   let that = this;
   let Province = that.data.Province;
   let indexProvince = Number(e.detail.value);
   let ProvinceId = that.data._Province[indexProvince].id;
   console.log(indexProvince,ProvinceId);
   that.setData({
     indexProvince,
     ProvinceId
   });
   wx.request({
     url:app.data.apiUrl,
     method:"POST",
     data:{
       sign:wx.getStorageSync("sign"),
       key:app.data.apiKey,
       type:"get-region-list",
       data:{
         region_id:ProvinceId,
         region_type:"city"
       }
     },
     success(res){
       let _City = res.data.data;
       let City = [];
       for (var i = 0; i < _City.length; i++) {
         City.push(_City[i].name)
       }
       City.unshift("选择市");
       _City.unshift({id:0,name:"选择市"});
       that.setData({
          City,
          _City,
          indexProvince,
          indexCity:0,
          indexCounty:0,
          ProvinceName:Province[indexProvince]
       })
     }
   })
},

// 选择市
bindPickerCity(e){
  let that = this;
  let City = that.data.City;
  let indexCity = Number(e.detail.value);
  let CityId = that.data._City[indexCity].id;
  // console.log(indexCity,CityId)
  wx.request({
     url:app.data.apiUrl,
     method:"POST",
     data:{
       sign:wx.getStorageSync("sign"),
       key:app.data.apiKey,
       type:"get-region-list",
       data:{
         region_id:CityId,
         region_type:"district"
       }
     },
     success(res){
      console.log(res)
      let _County = res.data.data;
      let County = [];
      console.log(_County)
      for (var i = 0; i < _County.length; i++) {
        County.push(_County[i].name)
      }
        County.unshift("选择区");
       _County.unshift({id:0,name:"选择区"});
      that.setData({
         _County,
         County,
         indexCity,
         CityId,
         indexCounty:0,
         CityName:City[indexCity]
      })
     }
  })
},

// 选择区
bindPickerCounty(e){
    let that = this;
    let County = that.data.County;
    let indexCounty = Number(e.detail.value);
    let CountyId = that.data._County[indexCounty].id;
    console.log(CountyId)
    that.setData({
       CountyId,
       indexCounty,
       CountyName:County[indexCounty]
    })
},

// 人物名字
personName(ev){
   // console.log(ev)
   this.setData({
     persionName:ev.detail.value
   })
},

// 输入手机号
mobileInput(ev){
  // console.log(ev)
   this.setData({
     mobile:ev.detail.value
   })
},

// 验证手机号
mobileBlur(ev){
   let mobile = this.data.mobile;
   if (!(/^1(3|4|5|7|8)\d{9}$/.test(mobile))) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'success',
        duration: 2000
      })
   }
},

// 详细地址
addressDetail(ev){
   this.setData({
      addressDetail:ev.detail.value
   })
},


// 保存资料
SaveInfo(){
  let that = this;
  let persionName = that.data.persionName;
  let mobile = that.data.mobile;
  let ProvinceId = that.data.ProvinceId;
  let CityId = that.data.CityId;
  let CountyId = that.data.CountyId;
  let addressDetail = that.data.addressDetail;
  let address = `${that.data.ProvinceName}${that.data.CityName}${that.data.CountyName}`;
console.log(persionName,mobile,ProvinceId,CityId,CountyId,addressDetail)

      if (!persionName) {
        wx.showToast({
          title: '请输入姓名',
          icon: 'success',
          duration: 2000
        });
        return false;
      }

      if (!mobile) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'success',
          duration: 2000
        });
        return false;
      }else if(!(/^1(3|4|5|7|8)\d{9}$/.test(mobile))){
         wx.showToast({
          title: '请输入正确的手机号',
          icon: 'success',
          duration: 2000
        });
         return false;
      }

      if (!CountyId) {
        wx.showToast({
          title: '请选择地区',
          icon: 'success',
          duration: 2000
        });
        return false;
      }

      if (!addressDetail) {
         wx.showToast({
          title: '请输入详细地址',
          icon: 'success',
          duration: 2000
        });
         return false
      }

      wx.request({
        url:app.data.apiUrl,
        method:"POST",
        data:{
          sign:wx.getStorageSync("sign"),
          key:app.data.apiKey,
          type:"save-address",
          data:{
             contact:persionName,
             mobile:mobile,
             prov:ProvinceId,
             city:CityId,
             area:CountyId,
             address:address,
             detail:addressDetail
          } 
        },
        success(res){
          console.log(res);
          let addressinfo = that.data.addressinfo;
          console.log(addressinfo)
          console.log("页面堆栈",getCurrentPages());
          if (res.data.errcode=="0"&&!addressinfo) {
             wx.navigateTo({
                url: '../myAddress/myAddress'
              })
          }else if(res.data.errcode=="0"&&addressinfo){
            wx.navigateTo({
                url: `../shopSubmiteOrder/shopSubmiteOrder?name=${persionName}&phone=${mobile}&address=${address}${addressDetail}&addressid=${res.data.data.addressid}`
              })
          }else{
             wx.showToast({
                title: res.data.msg,
                icon: 'success',
                duration: 1000
              })
          }
        }
      })

},

onLoad: function (options) {
   let that= this;

  // 上报后台数据
  statistic();
  wx.setStorageSync('scene', options.scene) 

  // 渠道统计  一定要放在wx.setStorageSync('scene', options.scene) 之后
  fromPageData()

   let addressinfo = options.addressinfo;
   let pagePath = options.pagePath;
   that.setData({
     addressinfo,
     pagePath
   })
},

  onReady: function () {
  
  },

  onShow: function () {
     let that = this;
     let addressId = that.data.addressId;
     wx.request({
        url:app.data.apiUrl,
        method:"POST",
        data:{
          sign:wx.getStorageSync("sign"),
          key:app.data.apiKey,
          type:"get-region-list",
          data:{
            region_id:0,
            region_type:"prov"
          }
        },
        success(res){
          console.log(res);
          let _Province = res.data.data;
           let Province = [];
          for (var i = 0; i < _Province.length; i++) {
             Province.push(_Province[i].name)
          }
          Province.unshift("选择省");
          _Province.unshift({id:0,name:"选择省"});
          that.setData({
             Province,
             _Province
          })
        }
     });
    
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