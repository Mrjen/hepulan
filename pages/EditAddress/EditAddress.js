var app = getApp();
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
          indexCounty:0
       })
     }
   })
},

// 选择市
bindPickerCity(e){
  let that = this;
  let indexCity = Number(e.detail.value);
  let CityId = that.data._City[indexCity].id;
  console.log(indexCity,CityId)
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
         indexCounty:0
      })
     }
  })
},

// 选择区
bindPickerCounty(e){
    let that = this;
    let indexCounty = Number(e.detail.value);
    let CountyId = that.data._County[indexCounty].id;
    console.log(CountyId)
    that.setData({
       CountyId,
       indexCounty
    })
},

// 人物名字
personName(ev){
   this.setData({
     persionName:ev.detail.value
   })
},

// 输入手机号
mobileInput(ev){
  console.log(ev)
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

},

onLoad: function (options) {

},

  onReady: function () {
  
  },

  onShow: function () {
     let that = this;
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