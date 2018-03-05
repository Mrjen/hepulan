// pages/systemInfoWeb/systemInfoWeb.js
Page({
  data: {
    webUrl:'https://wxtest.suoluomei.com/hpl/index.php?s=/Weixin/Home/index'
  },

  onLoad(options) {
    console.log('网页链接', wx.getStorageSync('webUrl'))
     let that = this;
      this.setData({
        webUrl: wx.getStorageSync('webUrl')
      })
    
    http({
      type: 'get-message-info',
      data: {
        message_id: options.id
      }
    }, function (res) {
      console.log(res)

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})