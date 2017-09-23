// pages/skinResult/skinResult.js
var common = require('../../common.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        skinType: "",
        danger: "",
        dailyAttention: "",
        improvePlan: "",
        copyTeach: false,
        teach_static: false,
        templateData: [{
            teacher_id: "",
            title_tip: '请咨询您的专属护肤老师'
        }]
    },

    applyBtn: function() {
        var that = this;
        that.setData({
            copyTeach: true
        });
    },

    sureBtn: function() {
        var that = this;
        that.setData({
            copyTeach: false
        });
    },

    cencelBbtn: function() {
        var that = this;
        that.setData({
            copyTeach: false
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var teacherId = wx.getStorageSync("teacherId");
        var that = this;
        var templateData = [];
        var sum = options.sum;
        if (34 <= sum && sum <= 44) {
            that.setData({
                skinType: "非常油的皮肤",
                danger: "易肌肤暗黄泛油，形成黑头白头粉刺，痘痘痤疮",
                dailyAttention: "洗面奶常洗脸，少吃油炸、高热量食物，少熬夜",
                improvePlan: "选择清爽收敛型产品护肤，做好保湿防晒"
            })
        } else if (27 <= sum && sum <= 33) {
            that.setData({
                skinType: "轻微油的皮肤",
                danger: "易导致毛孔粗大、长痘痘，甚至长色素色斑",
                dailyAttention: "多喝水、少吃辛辣刺激的食物，少去灰尘多的地方",
                improvePlan: "定期去角质，调节水油平衡，早晚擦针对的保养品"
            })
        } else if (17 <= sum && sum <= 26) {
            that.setData({
                skinType: "轻微的干性皮肤",
                danger: "易皮肤水分丢失，出现细纹、皱纹，皮脂膜受损",
                dailyAttention: "少食酸性食物、增加护肤品使用量、注重营养均衡",
                improvePlan: "日间做好隔离防晒，晚上做好补修复，每周2-3次面膜"
            })
        } else if (11 <= sum && sum <= 16) {
            that.setData({
                skinType: "非常干的皮肤",
                danger: "易出现色斑、干纹、角质层薄、松弛等肌肤问题",
                dailyAttention: "护肤品选购要补水锁水、少食辛辣易上火食物",
                improvePlan: "每周做3-4次的补水美白面膜，做好防晒-3次面膜"
            })
        }
        wx.showShareMenu({
            withShareTicket: true
        })

        templateData[0] = {};
        templateData[0].teacher_id = teacherId;
        console.log(that.data.templateData)
        if (teacherId == "") {
            that.setData({
                teach_static: true
            })
        } else {
            that.setData({
                teach_static: false
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    // 返回首页
    backHome: function() {
        common.backHome();
    },

    // 分享海报
    toShare: function() {
        common.toShare();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    }
})
