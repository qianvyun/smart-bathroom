<template>
  <div class="report-container">
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="project-list">
          <project-list /><!-- :projectData="projectList"-->
        </div>
      </el-col>
      <el-col :span="21">
        <div class="project-content-warp">
          <el-row :gutter="20">
            <el-col :span="15">
              <div class="project-content report-traffic">
                <div class="project-content-heard clear">
                  <div class="title"><i class="icon iconfont iconline" />人流量</div>
                  <div class="project-content-granularity">
                    <time-granularity-select @granularity="getTrafficReport" />
                  </div>
                </div>
                <div class="project-content-chart">
                  <report-traffic-chart />
                </div>
              </div>
            </el-col>
            <el-col :span="9">
              <div class="project-content report-statistic">
                <div class="project-content-heard clear">
                  <div class="title"><i class="icon iconfont iconpie" />评价统计</div>
                  <div class="project-content-granularity">
                    <time-granularity-select @granularity="getStatisticReport" />
                  </div>
                </div>
                <div class="project-content-chart">
                  <report-statistic-chart />
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="project-content report-device">
            <div class="project-content-heard clear">
              <div class="title"><i class="icon iconfont iconbar" />设备良好率</div>
              <div class="project-content-granularity">
                <time-granularity-select @granularity="getDeviceReport" />
              </div>
            </div>
            <div class="project-content-chart">
              <report-device-chart />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import TimeGranularitySelect from '@/views/report/components/time-granularity-select'
import ReportTrafficChart from '@/views/report/components/report-traffic-chart'
import ReportStatisticChart from '@/views/report/components/report-statistic-chart'
import ReportDeviceChart from '@/views/report/components/report-device-chart'
import ProjectList from '@/components/ProjectList/index'
export default {
  name: 'Report',
  components: { ProjectList, ReportDeviceChart, ReportStatisticChart, ReportTrafficChart, TimeGranularitySelect },
  data() {
    return {
      projectList: [
        {
          id: '111',
          name: '項目1'
        },
        {
          id: '222',
          name: '項目1'
        },
        {
          id: '333',
          name: '項目1'
        }
      ]
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {

  },
  methods: {
    getTrafficReport(val) {
      console.log(val)
    },
    getStatisticReport(val) {
      console.log(val)
    },
    getDeviceReport(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .report-container{
    /*width: calc(100vw - 180px);*/
    width: 100%;
    height: calc(100vh - 78px);
    padding: 25px;
    background: #F2F2F2;
    overflow: hidden;
    font-family: NotoSansCJKRegular;
    font-size: 14px;
    .project-content-warp{
      height: calc(100vh - 128px);
      .project-content{
        border-radius: 6px;
        background: #fff;
        .project-content-heard{
          padding: 13px 26px 0 20px;
          height: 38px;
          .title{
            float: left;
            line-height: 18px;
            color: rgba(72, 83, 133, .8);
            i{
              display: inline-block;
              margin-right: 10px;
              font-size: 18px;
              margin-top: -2px;
              vertical-align: middle;
              &.iconline{
                color: #E14ECA;
              }
              &.iconpie{
                color: #1D8CF8;
              }
              &.iconbar{
                color: #FF8D72;
              }
            }
          }
          .project-content-granularity{
            float: right;
            width: 92px;
          }
        }
      }
      .report-traffic{
        height: 44vh;
      }
      .report-statistic{
        height: 44vh;
      }
      .report-device{
        margin-top: 20px;
        height: calc(56vh - 148px);
      }
    }
  }
</style>
