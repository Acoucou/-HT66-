import * as echarts from '../../ec-canvas/echarts'

var mqtt = require('../../mqtt/mqtt.min.js');

var client = null;

var util = require('../../utils/util.js');

Page({
    // 页面的初始数据
    data: {
        ec: {
            onInit: initChart
        },

        topic: ["music", "music_state", "down_state", "down_time"],
        todayTime: 0, // 今日坐下时间
        downTime: 10, // 久坐提醒时间
        downCount: 0, // 次数
        music: "",
        musicState: "off"
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

            // 检测到久坐
            if (topic == "down_state") {
                that.data.downTime = parseInt(that.data.downTime)
                that.setData({
                    downCount: that.data.downCount + 1,
                    todayTime: that.data.downTime + that.data.todayTime
                })
            }
        })
    },

    // 设置久坐提醒时间
    setTime(e) {
        this.setData({
            downTime: e.detail.value
        })
        client.publish('down_time', this.data.downTime)
    },
    setMusic(e) {
        this.setData({
            music: e.detail.value
        })
        client.publish('music', this.data.music)
    },
    musicOn(e) {
        client.publish('music_state', "on")
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 初始化
        this.connectMqtt();
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

function initChart(canvas, width, height, dpr) { // 这部分是固定的不需要 是通用的
    const chart = echarts.init(canvas, null, {
        width: width,
        height: height
    });
    canvas.setChart(chart);
    // 这是 唯一需要更改的，可根据实际情况api更改图标
    // 我这边测试的是一个 普通的折线图,案例网址:
    var option = {
        title: {
            text: '示例'
        },
        xAxis: {
            name: '坐下时间',
            type: 'category',
            data: ['6:30', '12:30', '16:50', '18:00', '19:00', '20:34', '21:00']
        },
        yAxis: {
            name: '开始时间',
            type: 'value'
        },
        series: [{
            data: [120, 300, 150, 80, 70, 110, 130],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
            }
        }]
    };

    chart.setOption(option);
    return chart;
}