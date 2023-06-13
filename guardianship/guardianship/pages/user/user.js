var mqtt = require('../../mqtt/mqtt.min.js');

var client = null;

let{connectstate,toPic,todaytime,downtime,watertime,downcount,watercount,muSic,musicstate,time}=getApp().globalData; //从app.js中接收到数据

const app = getApp()

Page({
    // 页面的初始数据
    // data: {
    //     connectState:connectstate ,

    //     topic: toPic,
    //     todayTime: todaytime, // 今日坐下时间
    //     downTime: downtime, // 久坐提醒时间
    //     waterTime: watertime,
    //     downCount: downcount, // 久坐次数
    //     waterCount: watercount, // 喝水次数
    //     music: muSic,
    //     musicState: musicstate,
    //     time:time
    // },
    // connectMqtt() {
    //     // 配置与连接
    //     const options = {
    //         connectTimeout: 4000, // 超时时间
    //         clientId: 'wx_' + parseInt(Math.random() * 100 + 800, 10),
    //         port: 8083, //重点注意这个,坑了我很久
    //         // username: 'xxx',
    //         // password: 'xxx',
    //     }
    //     client = mqtt.connect('wx://111.67.206.242/mqtt', options) // 连接
    //     client.on('reconnect', (error) => { // 回调函数
    //         console.log('正在重连:', error)
    //     })
    //     client.on('error', (error) => {
    //         console.log('连接失败:', error)
    //     })

    //     // 成功的回调函数
    //     let that = this;
    //     client.on('connect', (e) => {
    //         console.log('成功连接服务器')
    //         // 订阅主题
    //         client.subscribe(that.data.topic, {
    //             qos: 0
    //         }, function (err) {
    //             if (!err) {
    //                 console.log("主题订阅成功: " + that.data.topic)
    //             }
    //         })
    //     })

    //     // 处理接收到的消息
    //     client.on('message', function (topic, message) {
    //         console.log(topic + " : " + message.toString());

    //         // 检测是否连接
    //         if (topic == "connectState") {
    //             connectstate = true;
    //             that.setData({
    //                 connectState: connectstate
    //             })
    //         }
    //         // 检测到久坐
    //         if (topic == "down_state") {
    //             that.data.downTime = parseInt(that.data.downTime)
    //             downcount += 1;
    //             todaytime += downtime;
    //             that.setData({
    //                 downCount: downcount,
    //                 todayTime: todaytime
    //             })
    //         }
    //         // 检测到喝水
    //         if (topic == "water_state") {
    //             watercount += 1;
    //             that.setData({
    //                 waterCount: watercount
    //             })
    //         }
    //     })
    // },

    
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 初始化
        // this.connectMqtt();
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
})
