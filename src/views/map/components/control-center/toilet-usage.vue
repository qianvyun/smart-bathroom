<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
// require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'

export default {
  name: 'ToiletUsage',
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
      required: true
    }
  },
  data() {
    return {
      chart: null,
      usageData: [
        { value: this.chartData.woman, name: '女性', selected: true },
        { value: this.chartData.man, name: '男性' }
      ]
    }
  },
  watch: {
    chartData(newValue, oldValue) {
      this.usageData[0].value = newValue.woman;
      this.usageData[0].value = newValue.man;
      this.$nextTick(() => {
        this.initChart()
      })
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
          text: '厕所使用比率',
          textStyle: {
            color: '#d7f2ff',
            fontFamily: 'FZZCHJW',
            fontSize: 18,
            fontWeight: 'lighter'
          },
          left: '4%',
          top: '9.6%',
          textVerticalAlign: 'middle'
        },
        tooltip: {
          show: false
        },
        color: ['#e7a218', '#2cccdf'],
        graphic: {
          type: 'text',
          left: 'center',
          top: '54%',
          style: {
            text: Number(this.chartData.woman) + Number(this.chartData.man),
            textAlign: 'center',
            textVerticalAlign: 'middle',
            fill: '#80edf4',
            font: '1vw LiquidCrystalBold'
          }
        },
        legend: {
          right: '9%',
          top: '11%',
          icon: 'circle',
          itemGap: 20,
          itemWidth: 9,
          itemHeight: 9,
          // 设置文本为红色
          textStyle: {
            color: '#d7f2ff',
            fontFamily: 'NotoSansCJKRegular'
          },
          data: ['女性', '男性']
        },
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            selectedOffset: 4,
            hoverAnimation: false,
            // roseType: 'radius',
            radius: ['22%', '36%'],
            center: ['50%', '58%'],
            label: {
              formatter: ('{b|{b}:}{c|{c}}{unite|人次}\n{b|占比:}{c|{d}}{unite|%}'),
              rich: {
                b: {
                  fontSize: 14,
                  lineHeight: 26,
                  verticalAlign: 'bottom'
                },
                c: {
                  fontSize: 16,
                  lineHeight: 26,
                  color: '#80edf4',
                  fontFamily: 'LiquidCrystalBold',
                  verticalAlign: 'bottom'
                },
                unite: {
                  color: '#d7f2ff',
                  fontSize: 10,
                  verticalAlign: 'bottom'
                }
              }
            },
            data: this.usageData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
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
