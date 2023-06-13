import * as echarts from '../../ec-canvas/echarts';
var util=require('../../utils/util'); 
let{score,xdata,ydata,downcount,watercount}=getApp().globalData; //从app.js中接收到数据
const app = getApp().globalData;

Page({
    // 页面的初始数据
    data: {
        ec1: {
          lazyLoad:true     //仪表
        },
        ec2: {
          lazyLoad:true     //柱状
      },
        ec3: {
          lazyLoad:true   //多柱状
      },

      time:"",
      month:[], //月份
      // xdata:["6:30", "6:45", "9:30","10:00", "13:30", "14:40", "15:50"],  //小时
      alldata:[
        ['product', '久坐次数', '喝水次数', '坐下时长(h)'],  //历史记录
        ['3月1日', 3, 6, 7],
        ['3月2日', 6, 4, 8],
        ['3月3日', 5, 6, 4],
        ['3月4日', 4, 9, 3],
      ],

     downCount:downcount,
     waterCount:watercount,

    },
    /**
     * 生命周期函数--监听页面加载
     */
    //动态刷新
  onLoad: function (options) {
    //获取小时并传到xdata中
    var that = this;
    setInterval(function(){
        that.setData({
            // xdata: util.formatHour(new Date()),   //获取小时并传到xdata中
            month: util.formatMonth(new Date()), //获取月日并传到xdata中
            time: util.formatTime((new Date())),
        });    
    },1000);    
    
    //获取到数据后渲染到图表
   setTimeout(()=>{
    this.lazyComponent=this.selectComponent('#mychart-dom-bar2')  //获取到组件
    this.initone(xdata,ydata),  //坐下时间

    this.lazyComponent=this.selectComponent('#mychart-dom-bar1')  //获取到组件
    this.inittwo(score), //得分

    this.lazyComponent=this.selectComponent('#mychart-dom-bar3')  //获取到组件
    this.initthree(this.data.alldata)   //历史记录
   } ,1000)   //定时为1S

  },
  // 下拉刷新
  onRefresh:function(){
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
  onPullDownRefresh:function(){
    this.onRefresh();
    this.lazyComponent=this.selectComponent('#mychart-dom-bar2')  //获取到组件
    this.initone(xdata,ydata)  //坐下时间
  },

  //得分
 initone(xdata,ydata){  //手动初始化
  this.lazyComponent.init((canvas,width,height,dpr)=>{
  let chart=echarts.init(canvas,null,{
    width:width,
    height:height,
    devicePixelRatio:dpr
  })

  let option=getOption(xdata,ydata)

  chart.setOption(option)

  this.chart=chart  //将图表实例绑定到this上，方便其他函数访问

  return chart
  })
},

//坐下时间
inittwo(Score){ //手动初始化
  this.lazyComponent.init((canvas,width,height,dpr)=>{
  let chart=echarts.init(canvas,null,{
    width:width,
    height:height,
    devicePixelRatio:dpr
  })

  let option=OnitChart(Score)

  chart.setOption(option)

  this.chart=chart  //将图表实例绑定到this上，方便其他函数访问

  return chart
  })
},

//历史记录
initthree(xydata){  //手动初始化
  this.lazyComponent.init((canvas,width,height,dpr)=>{
  let chart=echarts.init(canvas,null,{
    width:width,
    height:height,
    devicePixelRatio:dpr
  })

  let option=MoreinitChart(xydata)

  chart.setOption(option)

  this.chart=chart  //将图表实例绑定到this上，方便其他函数访问

  return chart
  })
},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      //对应的wxml中的ec-canvas id
      this.oneComponent = this.selectComponent('ec1');
      this.oneComponent = this.selectComponent('ec2');
      this.oneComponent = this.selectComponent('ec3');
    },

    /**
     * 生命周期函数--监听页面显示
     */
    // 异步加载数据
  })


// 坐下时间
function getOption (xdata,ydata) {
  return{
    title: {
      text: ''
  },
  xAxis: {
    type: 'category',
    data: xdata
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: ydata,
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }
  ]
}
}

//得分
function OnitChart(Score) {  
  return{
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 1,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.25, '#FF6E76'],
              [0.5, '#FDDD60'],
              [0.75, '#58D9F9'],
              [1, '#7CFFB2']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 2
          }
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto',
            width: 5
          }
        },
        axisLabel: {
          color: '#464646',
          fontSize: 20,
          distance: -60,
          formatter: function (value) {
            if (value === 0.875) {
              return 'A';
            } else if (value === 0.625) {
              return 'B';
            } else if (value === 0.375) {
              return 'C';
            } else if (value === 0.125) {
              return 'D';
            }
            return '';
          }
        },
        title: {
          offsetCenter: [0, '-20%'],
          fontSize: 10
        },
        detail: {
          fontSize: 15,
          offsetCenter: [0, '0%'],
          valueAnimation: true,
          formatter: function (value) {
            return Math.round(value * 100) + '分';
          },
          color: 'auto'
        },
        data: [
          {
            value:Score,
            name: '今日综合得分'
          }
        ]
      }
    ]
  }
}
//历史记录
function MoreinitChart(xydata) {  
  return{
    legend: {},
    tooltip: {},
    dataset: {
      source: xydata,
    },
    xAxis: { type: 'category' },
    yAxis: {},
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
  };
}

