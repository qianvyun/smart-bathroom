<template>
  <div :class="className" :style="{height:height,width:width}" />

</template>

<script>
import echarts from 'echarts'
// require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'

export default {
  name: 'PieChart',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '390px'
    },
    height: {
      type: String,
      default: '232px'
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
        { value: 128, name: '女性' },
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
        tooltip: {
          show: false
        },
        color: ['#adb5bd', '#23c7a8'],
        series: [
          {
            name: '厕所使用比例',
            type: 'pie',
            hoverAnimation: false,
            // roseType: 'radius',
            radius: ['60', '84'],
            center: ['195', '116'],
            data: this.usageData,
            label: {
              show: false
            },
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
