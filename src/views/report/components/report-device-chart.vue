<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
// import resize from '../mixins/resize'
export default {
  name: 'ReportDeviceChart',
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
      default: 'calc(56vh - 186px)'
    },
    chartData: {
      type: Object,
      // required: true
    }
  },
  data() {
    return {
      chart: null,
      usageData: [
        { value: 128, name: '女性', selected: true },
        { value: 80, name: '男性' }
      ]
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
        grid: {
          left: '30',
          right: '20',
          bottom: '15',
          containLabel: true
        },
        color: ['#FF8D72', '#1D8CF8'],
        calculable: true,
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          // 坐标轴轴线相关设置
          axisLine: {
            lineStyle: {
              color: 'rgba(29, 140, 248, .1)'
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
              color: '#1D8CF8',
              opacity: 0.2
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: 'rgba(29, 140, 248, .1)'
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
              color: '#1D8CF8',
              opacity: 0.2
            }
          }
        },
        series: [
          {
            name: '蒸发量',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            // 文字提示样式
            label: {
              show: true,
              position: 'top',
              fontFamily: 'NotoSansCJKRegular',
              fontSize: 10
            }
          },
          {
            name: '降水量',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
            label: {
              show: true,
              position: 'top',
              fontFamily: 'NotoSansCJKRegular',
              fontSize: 10
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
