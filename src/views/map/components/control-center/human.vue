<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
// require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'

export default {
  name: 'Human',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '25vh'
    },
    chartData: {
      type: Object,
      // required: true
    }
  },
  data() {
    return {
      chart: null,
      xAxisData: ['7/3', '7/4', '7/5', '7/6', '7/7', '7/8', '7/9'],
      humanData: [16, 15, 22, 26, 34, 43, 28]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '今日人流量',
          textStyle: {
            color: '#d7f2ff',
            fontFamily: 'FZZCHJW',
            fontSize: 18,
            fontWeight: 'lighter'
          },
          left: '4%',
          top: '5%',
          textVerticalAlign: 'middle'
        },
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        grid: {
          left: '4%',
          top: '30%',
          right: '6%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.xAxisData,
          axisLine: {
            lineStyle: {
              color: 'rgba(155, 235, 242, 0.2)'
            }
          },
          axisLabel: {
            fontSize: 9,
            color: '#d7f2ff'
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          name: '{a|[次]}',
          nameTextStyle: {
            color: '#d7f2ff',
            rich: {
              a: {
                fontSize: 12,
                width: '5',
                align: 'left'
              }
            }
          },
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(155, 235, 242, 0.2)'
            }
          },
          axisLabel: {
            fontSize: 11,
            color: '#699fa3'
          },
          axisTick: {
            show: false
          }
        },
        axisPointer: {
          lineStyle: {
            color: 'rgba(128,234,244,.4)',
            width: 2,
            type: 'dashed'
          }
        },
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0],
            // start: 1,
            // end: 35,
            minValueSpan: 5,
            maxValueSpan: 8
          }
        ],
        series: [{
          data: this.humanData,
          type: 'line',
          symbolSize: 7,
          showSymbol: false,
          smooth: true,
          label: {
            show: true,
            color: '#699fa3',
            fontFamily: 'NotoSansCJKRegular',
            fontSize: 10
          },
          itemStyle: {
            normal: {
              color: '#699fa3',
              borderColor: 'rgba(100,211,228,0.8)',
              borderWidth: 3,
              shadowBlur: 8,
              shadowColor: 'rgba(160,255,252,1)'
            }
          },
          lineStyle: {
            color: '#43b1f2',
            width: 4
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(67,177,232,0.5)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(122,236,233,0)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            // origin: 'end',
            shadowColor: 'rgba(122,236,233,0.1)',
            shadowOffsetX: '4'
          }
          // sampling:'max'
        }
        ]
      })
    }
  }
}
</script>

<style scoped>
.pie-chart-warp{
  width: 200px;
  height: 200px;
}
</style>
