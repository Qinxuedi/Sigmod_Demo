/**
 * Created by luoyuyu on 2017/9/24.
 */
myOption = {
    bar:{
        title: {
            top:'5%',
            text: 'Bar Chart',
            subtext: '',
            x:'center'
        },
        toolbox: {
            top:'5%',
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }

        },
        grid: [
            // {x: '20%', width: '68%'},
            {left: '20%', width: '65%',top:'30%', height: "50%"},
        ],
        tooltip:{},
        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100,
                bottom: '3%',
            },
            {
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                left: '92%',
                start: 0,
                end: 100
            }
        ],
        legend: {
            top:'top',
            type: 'scroll',
            orient: 'horizontal',
            data:[],
            x: 'left',
            z: 0
        },
        xAxis: {
            nameLocation:'middle',
            nameGap: 25,
            axisLabel:{
                interval:'auto',
                rotate:0,

            },
            data: []
        },
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [{
            name: '',
            type: 'bar',
            data: []
        }]
    },
    line:{
        title: {
            top:'5%',
            text: 'Line Chart',
            subtext: '',
            x:'center'
        },
        grid: [
            // {x: '20%', width: '70%'},
            {left: '20%', width: '65%',top:'30%', height: "50%"},
        ],
        toolbox: {
            top:'5%',
            show: true,
            feature: {

                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }

        },
        tooltip:{},
        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100,
                bottom: '3%',
            },
            {
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                left: '92%',
                start: 0,
                end: 100
            }
        ],
        legend: {
            top:'top',
            type: 'scroll',
            orient: 'horizontal',
            data:[],
            x: 'left',
            z: 0
        },
        xAxis: {
            nameLocation:'middle',
            nameGap: 25,
            axisLabel:{
                interval:'auto',
                rotate:0,

            },
            data: []
        },
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [{
            smooth: true,
            name: '',
            type: 'line',
            data: []
        }]
    },

    pie:{
        title : {
            top:'5%',
            text: 'Pie Chart',
            subtext: '',
            x: 'center'
        },
        toolbox: {
            top:'5%',
            show: true,
            feature: {
                saveAsImage: {}
            }
        },
        grid: [
            // {x: '20%', width: '70%'},
            {left: '20%', width: '65%',top:'30%', height: "50%"},
        ],
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            top:'top',
            type: 'scroll',
            orient: 'horizontal',
            left: 'left',
            data: [],//['UA','AA','MQ','OO','EV'],
            z: 0
        },
        series : [
            {
                name: 'Proportion',
                type: 'pie',
                radius : '50%',
                center: ['60%', '60%'],
                data:[
                    // {value:16.2, name:'UA'},
                    // {value:14.7, name:'AA'},
                    // {value:5.8, name:'MQ'},
                    // {value:4.2, name:'OO'},
                    // {value:3.8, name:'EV'},

                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    },

    // single scatter
    scatter:{
        title: {
            top:'5%',
            text: 'Scatter Chart',
            subtext: '',
            x:'center'
        },
        tooltip:{},
        toolbox: {
            top:'5%',
            show: true,
            feature: {

                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                // magicType: {type: ['stack', 'tiled']},
                restore: {},
                saveAsImage: {}
            }

        },
        grid: [
            // {left: '20%', width: '70%',top:'10%',height: "60%"},
            {left: '20%', width: '65%',top:'30%', height: "50%"},
        ],
        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100,
                bottom: '3%',
            },
            {
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                left: '92%',
                start: 0,
                end: 100,
            }
        ],
        legend: {
            top:'top',
            type: 'scroll',
            orient: 'horizontal',
            data:[''],
            x: 'left',
            z: 0
        },
        xAxis: {
            nameLocation:'middle',
            nameGap: 25,
            axisLabel:{
                interval:'auto',
                rotate:0,

            },
            // data: []
        },
        yAxis: [
            {
                name: '',
                type: 'value'
            }
        ],
        series: [{
            name: '',
            type: 'scatter',
            data: [],
            label: {
                emphasis: {
                    show: true,
                    position: 'left',
                    textStyle: {
                        color: 'blue',
                        fontSize: 16
                    }
                }
            },
        }]
    },

    stackedBar:{
        title: {
            top:'6%',
            text: 'flyDelay_Passenger',
            subtext: 'Operation: group by CARRIER, bin date by year',
            x:'center'
        },
        toolbox: {
            top:'6%',
            show: true,
            feature: {

                dataZoom: {
                    yAxisIndex: 'none',

                },
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }

        },
        grid: [
            // {left: '20%', width: '65%',top:'30%', height: "50%"},
            {left: '20%', width: '65%',top:'30%', height: "50%"},
        ],
        tooltip:{},
        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100,
                bottom: '3%',
            },
            {
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                start: 0,
                end: 100,
                left: '92%',
            }
        ],
        legend: {
            data:['UA','AA','MQ','OO','EV'],
            top:'top',
            type: 'scroll',
            orient: 'horizontal',
            left: 'left',
            z: 0
        },
        xAxis: {
            name:'x_name',
            nameLocation:'middle',
            nameGap: 25,
            axisLabel:{
                interval:'auto',
                rotate:0,

            },
            data:["2014","2015","2016"],
        },
        yAxis: [
            {
                type: 'value',
                name: 'number (K)',
                // nameLocation:'start',
                // nameRotate:90,
            }
        ],
        series: [
            {
                name:'UA',
                stack: '广告',
                type:'bar',
                data:[16.2,17,18]
            },

            {
                name:'AA',
                type:'bar',
                stack: '广告',
                data:[14.7,16,16.5]
            },
            {
                name:'MQ',
                type:'bar',
                stack: '广告',
                data:[5.8,6.5,7.3]
            },
            {
                name:'OO',
                type:'bar',
                stack: '广告',
                data:[4.2,5,6]
            },
            {
                name:'EV',
                type:'bar',
                stack: '广告',
                data:[3.8,4.5,6]
            }
        ]
    },

    stackedLine:{
        title: {
            top:'5%',
            text: 'flyDelay_Passenger',
            subtext: 'Operation: group by CARRIER, bin date by year',
            x:'center'
        },
        toolbox: {
            top:'5%',
            show: true,
            feature: {

                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }

        },
        grid: [
            // {x: '20%', width: '70%',y:'25%',height: "60%"},
            {left: '20%', width: '65%',top:'30%', height: "50%"},
        ],
        tooltip:{},
        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100,
                bottom: '3%',
            },
            {
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                left: '92%',
                start: 0,
                end: 100
            }
        ],
        legend: {
            data:['UA','AA','MQ','OO','EV'],
            top:'top',
            type: 'scroll',
            orient: 'horizontal',
            left: 'left',
            z: 0
        },
        xAxis: {
            name:'x_name',
            nameLocation:'middle',
            nameGap: 25,
            axisLabel:{
                interval:'auto',
                rotate:0,

            },
            data:["2014","2015","2016"],
        },
        yAxis: [
            {
                type: 'value',
                name: 'number (K)',
                // nameLocation:'start',
                // nameRotate:90,
            }
        ],
        series: [
            {
                name:'UA',
                type:'bar',
                data:[16.2,17,18]
            },

            {
                name:'AA',
                type:'bar',
                data:[14.7,16,16.5]
            },
            {
                name:'MQ',
                type:'bar',
                data:[5.8,6.5,7.3]
            },
            {
                name:'OO',
                type:'bar',
                data:[4.2,5,6]
            },
            {
                name:'EV',
                type:'bar',
                data:[3.8,4.5,6]
            }
        ]
    },

    stackedScatter:{
        title: {
            top:'5%',
            text: 'flyDelay_Passenger',
            subtext: 'Operation: group by CARRIER, bin date by year',
            x:'center'
        },
        toolbox: {
            top:'5%',
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }

        },
        tooltip:{},
        grid: [
            // {x: '20%', width: '70%',y:'25%',height: "60%"},
            {left: '20%', width: '65%',top:'30%', height: "50%"},
        ],

        dataZoom: [
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0],
                start: 0,
                end: 100,
                bottom: '3%',
            },
            {
                type: 'slider',
                show: true,
                yAxisIndex: [0],
                left: '92%',
                start: 0,
                end: 100
            }
        ],
        legend: {
            data:['UA','AA','MQ','OO','EV'],
            top:'top',
            type: 'scroll',
            orient: 'horizontal',
            left: 'left',
            z: 0
        },
        xAxis: {
            type:"value",
            name:'x_name',
            nameLocation:'middle',
            nameGap: 25,
            axisLabel:{
                interval:'auto',
                rotate:0,

            },
            data:[],
        },
        yAxis: [
            {
                type: 'value',
                name: 'number (K)',
                // nameLocation:'start',
                // nameRotate:90,
            }
        ],
        series: []
    },
};

