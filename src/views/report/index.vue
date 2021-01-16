<template>
  <div class="report-container">
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="project-list">
          <project-list @handleProject="handleProject" />
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
                  <report-traffic-chart :date-list="trafficData.dateList" :human-data="trafficData.humanData" />
                </div>
              </div>
            </el-col>
            <el-col :span="9">
              <div class="project-content report-statistic">
                <div class="project-content-heard clear">
                  <div class="title"><i class="icon iconfont iconpie" />评价统计</div>
                  <div class="project-content-granularity">
                    <time-granularity-select @granularity="getEvaluateReport" />
                  </div>
                </div>
                <div class="project-content-chart">
                  <report-statistic-chart :praise="evaluate.praise" :bad="evaluate.bad" />
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
import {
  getTrafficStatisticsDayData,
  getTrafficStatisticsMonthData,
  getTrafficStatisticsYearData,
  getEvaluateStatisticsData
} from '@/api/report'
export default {
  name: 'Report',
  components: { ProjectList, ReportDeviceChart, ReportStatisticChart, ReportTrafficChart, TimeGranularitySelect },
  data() {
    return {
      // 当前项目的id
      currentProjectId: '',
      currentProject: null,
      trafficData: {
        dateList: [],
        humanData: []
      },
      evaluate: {
        praise: 0,
        bad: 0
      }
    }
  },
  computed: {
    currentp() {
      return this.$store.getters.currentPageItem
    }
  },
  watch: {
    currentp(toilet) {
      this.currentProjectId = toilet.id;
      this.currentProject = toilet;
      this.getTrafficReport('year');
      this.getEvaluateReport('year');
    }
  },
  created() {

  },
  mounted() {
    this.getTrafficReport('year');
    this.getEvaluateReport('year');
  },
  methods: {
    handleProject(project) {
      this.currentProjectId = project.id;
      this.currentProject = project;
      this.getTrafficReport('year');
      this.getEvaluateReport('year');
    },
    async getTrafficReport(val) {
      const requestData = {
        id: this.currentProjectId
      };
      const today = new Date();
      let data = {};
      this.trafficData = {
        dateList: [],
        humanData: []
      };
      switch (val) {
        case 'day':
          data = await getTrafficStatisticsDayData(requestData);
          for (let i = 1; i <= today.getHours(); i++) {
            this.trafficData.dateList.push(i);
          }
          for (let i = 0; i < today.getHours(); i++) {
            this.trafficData.humanData.push(data.data[i].personSum);
          }
          break;
        case 'month':
          // requestData.queryMonth = new Date().getDate();
          requestData.queryDay = '';
          data = await getTrafficStatisticsMonthData(requestData);
          for (let i = 1; i <= today.getDate(); i++) {
            this.trafficData.dateList.push(i);
          }
          for (let i = 0; i < today.getDate(); i++) {
            this.trafficData.humanData.push(data.data[i].personSum);
          }
          break;
        default:
          // requestData.queryMonth = new Date().getDate();
          requestData.queryMonth = '1';
          data = await getTrafficStatisticsYearData(requestData);
          this.trafficData.dateList = Object.keys(data.data).reverse();
          Object.values(data.data).forEach(item => {
            this.trafficData.humanData.unshift(item.personSum);
          })
          break;
      }
    },
    async getEvaluateReport(val) {
      const requestData = {
        toiletId: this.currentProjectId, // 项目id
        queryDay: '', // 查询今日，值固定为1
        queryMonth: '', // 查询今月，值固定为1
        queryYear: '' // 查询今年，值固定为1
      }
      this.evaluate.praise = 0;
      this.evaluate.bad = 0;
      switch (val) {
        case 'day':
          requestData.queryDay = '1';
          break;
        case 'month':
          requestData.queryMonth = '1';
          break;
        default:
          requestData.queryYear = '1';
          break;
      }
      const data = await getEvaluateStatisticsData(requestData);
      this.evaluate.praise = Number(data.data.value1);
      this.evaluate.bad = Number(data.data.value2);
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
