<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
// import resize from '../mixins/resize'
export default {
  name: 'ReportTrafficChart',
  // mixins: [resize],
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
      default: 'calc(44vh - 38px)'
    },
    chartData: {
      type: Object,
      // required: true
    }
  },
  data() {
    return {
      chart: null,
      xAxisData: ['7/3', '7/4', '7/5', '7/6', '7/7', '7/8', '7/9', '7/10', '7/11'],
      humanData: [16, 15, 22, 26, 34, 43, 28, 12, 34]
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
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        grid: {
          left: '20',
          right: '20',
          bottom: '15',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.xAxisData,
          // 坐标轴两边留白策略
          boundaryGap: false,
          // 坐标轴轴线相关设置
          axisLine: {
            lineStyle: {
              color: 'rgba(225, 78, 202, .1)'
            }
          },
          // 坐标轴刻度标签的相关设置
          axisLabel: {
            fontSize: 12,
            color: '#9A9A9A'
          },
          // 刻度线
          axisTick: {
            show: true
          },
          // 网格线
          splitLine: {
            show: true,
            lineStyle: {
              color: '#E14ECA',
              opacity: 0.2
            }
          }
        },
        yAxis: {
          type: 'value',
          // 坐标轴轴线相关设置
          axisLine: {
            lineStyle: {
              color: 'rgba(225, 78, 202, .1)'
            }
          },
          // 坐标轴刻度标签的相关设置
          axisLabel: {
            fontSize: 12,
            color: '#9A9A9A'
          },
          // 刻度线
          axisTick: {
            show: true
          },
          // 网格线
          splitLine: {
            show: true,
            lineStyle: {
              color: '#E14ECA',
              opacity: 0.2
            }
          }
        },
        axisPointer: {
          show: false
        },
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0],
            // start: 1,
            // end: 35,
            minValueSpan: 5,
            maxValueSpan: 31
          }
        ],
        series: [{
          data: this.humanData,
          type: 'line',
          // 线上点的标记
          symbol: 'circle',
          symbolSize: 7,
          // 一直显示
          showSymbol: true,
          // 是否平滑曲线显示
          smooth: true,
          // 禁用hover拐点的动画
          hoverAnimation: false,
          // 文字提示样式
          label: {
            show: true,
            color: '#699fa3',
            fontFamily: 'NotoSansCJKRegular',
            fontSize: 10
          },
          // 折线拐点标志的样式
          itemStyle: {
            normal: {
              color: '#E14ECA'
            }
          },
          // 线条样式
          lineStyle: {
            color: '#E14ECA',
            width: 2
          },
          // 区域填充样式
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(225, 78, 202, 0.4)' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(216, 216, 216, 0)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            shadowColor: 'rgba(122,236,233,0.1)',
            shadowOffsetX: '4'
          }
        }
        ]
      })
    }
  }
}
</script>

<style scoped>

</style>
