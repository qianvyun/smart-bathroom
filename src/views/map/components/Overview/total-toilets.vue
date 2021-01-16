<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from '../mixins/resize'

export default {
  name: 'TotalToilets',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '140px'
    },
    height: {
      type: String,
      default: '232px'
    },
    chartData: {
      type: Object,
      default: () => {}
      // required: true
    }
  },
  data() {
    return {
      chart: null,
      usageData: [
        { value: 128, name: 'a' },
        { value: 0, name: 'b' },
        { value: 0, name: 'c' }
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
        color: ['#ADB5BD', '#1C8BF8', '#FF8D71'],
        series: [
          {
            name: '厕所总数',
            type: 'pie',
            hoverAnimation: false,
            // roseType: 'radius',
            radius: ['45', '67'],
            center: ['70', '150'],
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

