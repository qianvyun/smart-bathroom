<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
// import resize from '../mixins/resize'
export default {
  name: 'ReportStatisticChart',
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
      usageData: [
        { value: 128, name: '好评' },
        { value: 80, name: '差评' }
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
        color: ['#0080FF', '#FA5087'],
        legend: {
          width: '16px',
          height: '16px',
          top: '70%',
          right: '10%',
          itemGap: 24,
          itemWidth: 16,
          itemHeight: 16,
          selectedMode: false,
          // // 设置文本为红色
          // textStyle: {
          //   color: '#636D96',
          //   fontFamily: 'NotoSansCJKRegular'
          // },
          // data: ['好评', '差评']
          formatter: (name) => {
            let currentData = 0;
            let total = 0;
            this.usageData.forEach((item) => {
              total += item.value;
              if (item.name === name) {
                currentData = item.value;
              }
            })
            let c = parseInt((currentData / total) * 100);
            return '{b|' + name + '}{c|' + c + '%}';
            // return name;
          },
          textStyle: {
            rich: {
              b: {
                color: '#636D96',
                fontSize: 14,
                lineHeight: 24,
                verticalAlign: 'center',
                padding: [0, 0, 0, 12]
              },
              c: {
                fontSize: 14,
                lineHeight: 24,
                color: '#97A0C3',
                verticalAlign: 'center',
                padding: [0, 0, 0, 30]
              }
            }
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['60', '90'],
            center: ['35%', '50%'],
            hoverOffset: 15,
            label: {
              normal: {
                show: false
              }
            },
            data: this.usageData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
      // 设置默认选中高亮部分
      this.chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 0
      });
      this.chart.on('mouseover', (e) => {
        // 当检测到鼠标悬停事件，取消默认选中高亮
        this.chart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: 0
        });
        // 高亮显示悬停的那块
        this.chart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: e.dataIndex
        });
      });
      // 检测鼠标移出后显示之前默认高亮的那块
      this.chart.on('mouseout', (e) => {
        this.chart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: 0
        });
      });
    }
  }
}
</script>

<style scoped>

</style>
