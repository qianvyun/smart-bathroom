<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
// require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'

export default {
  name: 'AmmoniaHydrothionCurrent',
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
    manData: {
      type: Array,
      required: true
    },
    womanData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      // x轴数据
      xAxisData: [],
      // 异味（男）
      manPeculiarSmell: this.manData,
      // 异味（女）
      womanPeculiarSmell: this.womanData
      // // 氨气（男）
      // ammoniaMan: [16, 15, 22, 26, 34, 43, 28],
      // // 氨气（女）
      // ammoniaWoman: [11, 23, 15, 13, 18, 20, 24],
      // // 硫化氢（男）
      // hydrogenMan: [3, 9, 23, 16, 20, 22, 18],
      // // 硫化氢（女）
      // hydrogenWoman: [11, 13, 14, 17, 20, 24, 22]
    }
  },
  watch: {
    manData(newVal, oldVal) {
      this.manPeculiarSmell = newVal;
      this.$nextTick(() => {
        this.initChart()
      })
    },
    womanData(newVal, oldVal) {
      this.womanPeculiarSmell = newVal;
      this.$nextTick(() => {
        this.initChart()
      })
    }
  },
  created() {
    const currentHour = new Date().getHours();
    for (let i = 0; i <= currentHour; i++) {
      this.xAxisData.push(i)
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
          text: '异味今日曲线',
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
        color: ['#e7a218', '#2cccdf'], // '#fff441', '#51ffb3',
        legend: {
          right: '9%',
          top: '6%',
          icon: 'circle',
          itemGap: 20,
          itemWidth: 7,
          itemHeight: 7,
          width: '130',
          textStyle: {
            color: '#d7f2ff',
            fontFamily: 'NotoSansCJKRegular',
            fontSize: 10,
            lineHeight: 1
          },
          data: ['异味(男)', '异味(女)'],
          selectedMode: false
        },
        grid: {
          left: '4%',
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
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#80edf4'],
              opacity: 0.2
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(155, 235, 242, 0.2)'
            }
          },
          axisLabel: {
            fontSize: 11,
            color: '#d7f2ff'
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
          name: '异味(男)',
          data: this.manPeculiarSmell,
          // data: warnCount,
          type: 'line',
          symbolSize: 5,
          showSymbol: false,
          smooth: true,
          label: {
            show: true,
            color: '#9bebf2',
            fontFamily: 'NotoSansCJKRegular',
            fontSize: 10
          },
          itemStyle: {
            // color: '#fff',
            borderColor: 'rgba(255,255,255,0.5)',
            borderWidth: 3,
            shadowBlur: 8,
            shadowColor: 'rgba(255,255,255,1)'
          },
          lineStyle: {
            width: 4
          }
        },
        {
          name: '异味(女)',
          data: this.womanPeculiarSmell,
          // data: warnCount,
          type: 'line',
          symbolSize: 5,
          showSymbol: false,
          smooth: true,
          label: {
            show: true,
            color: '#9bebf2',
            fontFamily: 'NotoSansCJKRegular',
            fontSize: 10
          },
          itemStyle: {
            borderColor: 'rgba(255,255,255,0.5)',
            borderWidth: 3,
            shadowBlur: 8,
            shadowColor: 'rgba(255,255,255,1)'
          },
          lineStyle: {
            width: 4
          }
        }]
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
