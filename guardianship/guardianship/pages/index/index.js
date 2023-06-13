var mqtt = require('../../mqtt/mqtt.min.js');
var util = require('../../utils/util');
var client = null;

let {
    connectstate,
    toPic,
    todaytime,
    downtime,
    watertime,
    downcount,
    watercount,
    muSic,
    musicstate,
    xdata,
    ydata
} = getApp().globalData; //从app.js中接收到数据

Page({
    // 页面的初始数据
    data: {
        connectState: connectstate,

        topic: toPic,
        todayTime: todaytime, // 今日坐下时间
        downTime: downtime, // 久坐提醒时间
        waterTime: watertime,
        downCount: downcount, // 久坐次数
        waterCount: watercount, // 喝水次数
        music: muSic,
        musicState: musicstate,
    },
    connectMqtt() {
        // 配置与连接
        const options = {
            connectTimeout: 4000, // 超时时间
            clientId: 'wx_' + parseInt(Math.random() * 100 + 800, 10),
            port: 8083, //重点注意这个,坑了我很久
            // username: 'xxx',
            // password: 'xxx',
        }
        client = mqtt.connect('wx://111.67.206.242/mqtt', options) // 连接
        client.on('reconnect', (error) => { // 回调函数
            console.log('正在重连:', error)
        })
        client.on('error', (error) => {
            console.log('连接失败:', error)
        })

        // 成功的回调函数
        let that = this;
        client.on('connect', (e) => {
            console.log('成功连接服务器')
            // 订阅主题
            client.subscribe(that.data.topic, {
                qos: 0
            }, function (err) {
                if (!err) {
                    console.log("主题订阅成功: " + that.data.topic)
                }
            })
        })

        // 处理接收到的消息
        client.on('message', function (topic, message) {
            console.log(topic + " : " + message.toString());

            // 检测是否连接
            if (topic == "connectState") {
                connectstate = true;
                that.setData({
                    connectState: connectstate
                })
            }
            // 检测到久坐
            if (topic == "down_state") {
                downtime = parseInt(downtime)
                downcount += 1;
                todaytime += downtime;
                that.setData({
                    downCount: downcount,
                    todayTime: todaytime
                })
                ydata.shift()
                ydata.push(downtime)
                xdata.shift()
                xdata.push(util.myTime(new Date()))
            }
            // 检测到喝水
            if (topic == "water_state") {
                watercount += 1;
                that.setData({
                    waterCount: watercount
                })
            }
        })
    },

    // 设置久坐提醒时间
    setTime1(e) {
        downtime = e.detail.value;
        this.setData({
            downTime: downtime
        })
        client.publish('down_time', this.data.downTime)
        console.log(downtime)
    },
    // 设置喝水提醒时间
    setTime2(e) {
        watertime = e.detail.value;
        this.setData({
            waterTime: watertime
        })
        client.publish('water_time', this.data.waterTime)
    },
    setTime3(e) {
        muSic = e.detail.value;
        this.setData({
            music: muSic
        })
        if(muSic == "眼保健操"){
            client.publish('music', "6")
        }
        if(muSic == "按摩环境"){
            client.publish('music', "5")
        }
        if(muSic == "path"){
            client.publish('music', "7")
        } 
    },
    musicList(e) {
        wx.navigateTo({
            url: '../music/music',
        })
    },

    selectMusic(e) {
        wx.navigateTo({
            url: '../music/music',
        })
    },
    selectVideo(e) {
        wx.navigateTo({
            url: '../video/video',
        })
    },
    // test(e) {
    //     console.log(util.myTime(new Date()))
    //     ydata.shift()
    //     ydata.push(70)
    //     xdata.shift()
    //     xdata.push("12:45")
    // },

    onLoad: function (options) {
        this.connectMqtt();
    },

    onReady: function () {

    },

    onShow: function () {

    },
    // 下拉刷新
    onRefresh: function () {
        //导航条加载动画
        wx.showNavigationBarLoading()
        //loading 提示框
        wx.showLoading({
            title: 'Loading...',
        })
        console.log("下拉刷新啦");
        setTimeout(function () {
            wx.hideLoading();
            wx.hideNavigationBarLoading();
            //停止下拉刷新
            wx.stopPullDownRefresh();
        }, 1500)
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.onRefresh();
    },
})