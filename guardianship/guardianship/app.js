// app.js
  
App({
    
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    //index.js
    connectstate: "false",
    toPic: ["music", "music_state", "down_state", "water_state", "down_time", "waterTime", "connectState"],
    todaytime: 0, // 今日坐下时间
    downtime: 10, // 久坐提醒时间
    watertime: 10,
    downcount: 0, // 久坐次数
    watercount: 0, // 喝水次数
    muSic: "",
    musicstate: "off",

    //graph.js
    score:1,  //得分
    xdata:["6:30", "6:45", "9:30","10:00", "13:30", "14:40", "15:50"],  //小时
    ydata:[30, 50, 10, 20, 10, 26, 43],
    alldata:[
      ['product', '久坐次数', '喝水次数', '坐下时长(h)'],  //历史记录
      ['3月1日', 3, 6, 7],
      ['3月2日', 6, 4, 8],
      ['3月3日', 5, 6, 4],
      ['3月4日', 4, 9, 3]
    ],

  },
   /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
 
  },


  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },

})
