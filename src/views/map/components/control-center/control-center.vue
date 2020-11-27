<template>
  <div class="control-center-warp">
    <div class="control-center-header">
      <h3>智慧公厕调度指挥系统</h3>
      <h5 class="public-toilet-name">{{ currentToiletName }}</h5>
    </div>
    <div class="control-center-body">
      <div class="control-center-left">
        <div class="chart-warp">
          <div class="chart-box-top"><span /></div>
          <div class="chart-box-main">
            <toilet-usage :chart-data="toiletUsageData" />
          </div>
        </div>
        <div class="chart-warp">
          <div class="chart-box-top"><span /></div>
          <div class="chart-box-main">
            <human :chart-data="humanData" />
          </div>
        </div>
        <div class="chart-warp">
          <div class="chart-box-top"><span /></div>
          <hygiene />
        </div>
      </div>
      <div class="control-center-middle">
        <div class="total-warp">
          <ul class="clear">
            <li class="clear">
              <div class="current">
                <h5>今日入厕人数</h5>
                <p>{{ personSum }}<span>人</span></p>
              </div>
              <div class="history">
                <h5>昨日入厕人数</h5>
                <p>{{ oldPersonSum }}</p>
              </div>
            </li>
            <li class="clear">
              <div class="current">
                <h5>本月总服务人数</h5>
                <p>{{ monthPersonSum }}<span>人</span></p>
              </div>
              <div class="history">
                <h5>上月总服务人数</h5>
                <p>{{ oldMonthPersonSum }}</p>
              </div>
            </li>
            <li class="clear">
              <div class="current">
                <h5>当前坑位利用率</h5>
                <p>{{ currentAvailability }}<span>%</span></p>
              </div>
              <div class="history">
                <h5>昨日利用率</h5>
                <p>{{ oldAvailability }}%</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="state-warp">
          <toilet-state toilet-type="man" :closestool-count="manClosestoolCount" :detail="manTolietDetail" :available-closestool-count="manavailableClosestoolCount" />
          <toilet-state toilet-type="woman" :closestool-count="womanClosestoolCount" :detail="womanTolietDetail" :available-closestool-count="womanavailableClosestoolCount" />
        </div>
      </div>
      <div class="control-center-right">
        <toilet-state :is-accessible-toilet="true" toilet-type="accessible" :closestool-count="otherClosestoolCount" :available-closestool-count="otheravailableClosestoolCount" />
        <div class="chart-warp">
          <div class="chart-box-top"><span /></div>
          <div class="chart-box-main">
            <ammonia-hydrothion-current :man-data="manPeculiarSmellData" :woman-data="womanPeculiarSmellData" />
          </div>
        </div>
        <div class="chart-warp">
          <div class="chart-box-top"><span /></div>
          <monitor :url="monitorUrl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ToiletState from './toilet-state'
import ToiletUsage from './toilet-usage'
import AmmoniaHydrothionCurrent from './ammonia-hydrothion-current'
import Human from './human'
import Monitor from './monitor'
import Hygiene from './hygiene'
import { getToiletDetails, getToiletInfo, getPersonDataByMonth } from '@/api/map'

const defaultDetail = {
  ammonia: '',
  dampness: '',
  hydrogenSulfide: '',
  peculiarSmell: '',
  pm25: '',
  temperature: ''
}
export default {
  name: 'ControlCenter',
  components: {
    ToiletState,
    ToiletUsage,
    AmmoniaHydrothionCurrent,
    Human,
    Monitor,
    Hygiene
  },
  props: {
    toiletDetails: {
      type: Object,
      required: true
    },
    toiletName: {
      type: String,
      default: '仙林一号'
    }
  },
  data() {
    return {
      toiletDetailMsg: this.toiletDetails,
      chartWidth: '',
      chartHeight: '',
      currentToiletName: this.toiletName,
      toiletUsageData: {
        woman: 0,
        man: 0
      },
      // 近八天的总人流量
      humanData: [],
      // 今日入厕人数
      personSum: 0,
      // 昨日入厕人数
      oldPersonSum: 0,
      // 本月服务人数
      monthPersonSum: 0,
      // 上月服务人数
      oldMonthPersonSum: 0,
      // 当前坑位利用率
      currentAvailability: 0,
      // 昨日坑位利用率
      oldAvailability: 0,
      // 男厕坑位
      manClosestoolCount: 0,
      // 女厕坑位
      womanClosestoolCount: 0,
      // 无障碍
      otherClosestoolCount: 1,
      womanavailableClosestoolCount: 0,
      manavailableClosestoolCount: 0,
      otheravailableClosestoolCount: 0,
      // 男厕坑位
      manTolietDetail: {},
      womanTolietDetail: {},
      // 异味数据
      manPeculiarSmellData: [],
      womanPeculiarSmellData: [],
      manToiletMsg: [],
      womanToiletMsg: [],
      otherToiletMsg: [],
      monitorUrl: '',
      timer: ''
    }
  },
  computed: {
    // chartWidth() {
    //   const chartBox = document.getElementsByClassName('chart-warp')[0];
    //   const chartW = window.getComputedStyle(chartBox).width;
    //   console.log(chartW)
    //   return chartW;
    // },
    // chartHeight() {
    //   let chartH;
    //   return chartH;
    // }
  },
  created() {
    this.getToiletInfo(this.toiletDetailMsg.toiletId);
    this.getPersonDataByMonth(this.toiletDetailMsg.toiletId);
    this.init();
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getToiletDetails(this.toiletDetailMsg.toiletId);
      this.init();
    }, 10000)
    this.$emit('close', this.timer)
  },
  methods: {
    init() {
      // 获取男女适用比例
      this.toiletUsageData.woman = this.toiletDetailMsg.femalePersonSum;
      this.toiletUsageData.man = this.toiletDetailMsg.malePersonSum;
      // 今日人流量
      this.personSum = this.toiletDetailMsg.personSum || 0;
      this.oldPersonSum = this.toiletDetailMsg.personSumYesterday || 0;
      // 计算人流量数据
      this.toiletDetailMsg.femalePersonSumDetail.forEach((item, index) => {
        this.humanData.unshift(Number(item) + Number(this.toiletDetailMsg.malePersonSumDetail[index]))
      })
      if (this.toiletDetailMsg.femaleClosestoolCount) {
        this.womanClosestoolCount = this.toiletDetailMsg.femaleClosestoolCount
      }
      if (this.toiletDetailMsg.maleClosestoolCount) {
        this.manClosestoolCount = this.toiletDetailMsg.maleClosestoolCount
      }
      if (this.toiletDetailMsg.availableClosestoolCount2) {
        this.womanavailableClosestoolCount = this.toiletDetailMsg.availableClosestoolCount2
      }
      if (this.toiletDetailMsg.availableClosestoolCount1) {
        this.manavailableClosestoolCount = this.toiletDetailMsg.availableClosestoolCount1
      }
      if (this.toiletDetailMsg.detailRemark1 && this.toiletDetailMsg.detailRemark1.length > 0) {
        this.manPeculiarSmellData = this.formatPeculiarSmellData(this.toiletDetailMsg.detailRemark1)
      }
      if (this.toiletDetailMsg.detailRemark2 && this.toiletDetailMsg.detailRemark2.length > 0) {
        this.womanPeculiarSmellData = this.formatPeculiarSmellData(this.toiletDetailMsg.detailRemark2)
      }
      if (this.toiletDetailMsg.remark1 && this.toiletDetailMsg.remark1.closestoolCountUsableDetail && this.toiletDetailMsg.remark1.closestoolCountUsableDetail.length > 0) {
        const remark = this.toiletDetailMsg.remark1;
        this.manToiletMsg = this.formatToiletState(this.manClosestoolCount, remark.errorDetail, remark.sosDetail, remark.closestoolCountUsableDetail);
        this.manTolietDetail = this.formatDetail(remark);
      }
      if (this.toiletDetailMsg.remark2 && this.toiletDetailMsg.remark2.closestoolCountUsableDetail && this.toiletDetailMsg.remark2.closestoolCountUsableDetail.length > 0) {
        const remark = this.toiletDetailMsg.remark2;
        this.womanToiletMsg = this.formatToiletState(this.womanClosestoolCount, remark.errorDetail, remark.sosDetail, remark.closestoolCountUsableDetail);
        this.womanTolietDetail = this.formatDetail(remark);
      }
      if (this.toiletDetailMsg.remark3 && this.toiletDetailMsg.remark3.closestoolCountUsableDetail && this.toiletDetailMsg.remark3.closestoolCountUsableDetail.length > 0) {
        const remark = this.toiletDetailMsg.remark3;
        this.otherToiletMsg = this.formatToiletState(this.otherClosestoolCount, remark.errorDetail, remark.sosDetail, remark.closestoolCountUsableDetail);
      }
    },
    /**
     * 格式化异味数据
     * @param data
     * @returns {*}
     */
    formatPeculiarSmellData(data) {
      const formatData = [];
      if (data && data.length) {
        data.forEach(item => {
          const number = item?.peculiarSmell ? item.peculiarSmell : 0
          formatData.unshift(number)
        })
      }
      return formatData;
    },
    /**
     * 格式化详情
     * @param data
     * @returns {{oldUrl: string, newUrl: string}}
     */
    formatDetail(data) {
      const detail = JSON.parse(JSON.stringify(defaultDetail))
      detail.ammonia = data.ammonia ? data.ammonia : null
      detail.dampness = data.dampness ? data.dampness : null
      detail.hydrogenSulfide = data.hydrogenSulfide ? data.hydrogenSulfide : null
      detail.peculiarSmell = data.peculiarSmell ? data.peculiarSmell : null
      detail.pm25 = data.pm25 ? data.pm25 : null
      detail.temperature = data.temperature ? data.temperature : null
      return detail
    },
    /**
     * 格式化坑位状态
     * @param errorData
     * @param sosData
     * @param useData
     */
    formatToiletState(total, errorData, sosData, useData) {
      const stateData = []
      for (let i = 0; i < total; i++) {
        stateData.push(0)
      }
      if (errorData && errorData.length) {
        errorData.forEach((item, index) => {
          if (item === '1') {
            stateData[index] = '3'
          }
        })
      }
      if (sosData && sosData.length) {
        sosData.forEach((item, index) => {
          if (item === '1') {
            stateData[index] = '2'
          }
        })
      }
      if (useData && useData.length) {
        useData.forEach((item, index) => {
          if (item === '1') {
            stateData[index] = item
          }
        })
      }
      return stateData
    },
    async getToiletInfo(id) {
      const requestData = {
        id: id
      }
      const data = await getToiletInfo(requestData);
      this.monitorUrl = data.data.liveUrl;
      // console.log(this.monitorUrl)
    },
    async getToiletDetails(id) {
      const requestData = {
        toiletId: id
      }
      const res = await getToiletDetails(requestData);
      this.toiletDetailMsg = res.data.data;
    },
    getPersonDataByMonth(id) {
      return new Promise((resolve, reject) => {
        const requestData = {
          toiletId: id
        }
        getPersonDataByMonth(requestData).then(response => {
          const { data } = response

          const { personSumPreMonth, personSumThisMonth } = data.data // introduction
          this.monthPersonSum = personSumThisMonth || 0;
          this.oldMonthPersonSum = personSumPreMonth || 0;
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~@/assets/fonts/font.css";
  @import "~@/styles/mixin.scss";

  $fontSize: vw(16);
  $textShadow: 4px 4px 7px rgba(9, 9, 84, 0.2);
  $letterSpacing: vw(5);
  $font-color: #d7f2ff;

  .control-center-warp {
    position: absolute;
    z-index: 5000;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: url("../../../../assets/images/center-modal-bg.png") no-repeat;
    background-size: 100% 100%;
    color: #d7f2ff;
    font-family: NotoSansCJKRegular;
    font-weight: lighter;

    .control-center-header {
      position: relative;
      height: vh(81);
      line-height: vh(81);
      text-align: center;
      background: url("../../../../assets/images/center-modal-header-bg.png") no-repeat bottom center;
      background-size: cover;
      font-family: FZZCHJW;

      h3 {
        height: vh(81);
        line-height: vh(81);
        font-size: vw(36);
        letter-spacing: $letterSpacing;
        font-weight: inherit;
      }

      .public-toilet-name {
        position: absolute;
        left: vw(60);
        top: 0;
        height: vh(50);
        line-height: vh(50);
        font-size: vw(20);
        font-weight: inherit;
      }
    }

    .control-center-body {
      padding: vh(20) vw(62);
      display: -webkit-flex; /* Safari */
      display: flex;
      /*font-size: 0;*/
      .control-center-left, .control-center-right {
        box-sizing: border-box;

        .chart-warp {
          width: vw(385);
          height: vh(286);
          margin-bottom: vh(28);
          background: rgba(14, 33, 97, .5);
          border: 1px solid rgba(47, 86, 135, .7);
          border-radius: 5px;

          .chart-box-top {
            margin-top: -1px;
            position: relative;
            padding: 0 vw(50);
            height: vh(16);
            background: #0d0d73;
            opacity: .8;

            &:before, &:after {
              content: '';
              display: block;
              position: absolute;
              top: 0;
              width: vh(3);
              height: vh(16);
              background: #4fade8;
            }

            &:before {
              left: -1px;
            }

            &:after {
              right: -1px;
            }

            span {
              position: relative;
              display: block;
              width: vw(286);
              height: vh(16);
              background: #2a559d;

              &:before, &:after {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                height: vh(16);
              }
            ;

              &:before {
                left: vw(50);
                width: vw(186);
                background: #0590d0;
              }

              &:after {
                left: vw(100);
                width: vw(86);
                background: #79d4ff;
              }
            }
          }

          .chart-container {
            position: relative;
            width: 100%;
            height: calc(24vh - 84px);
          }
        }
      }

      .control-center-middle {
        box-sizing: border-box;
        width: vw(1026);
        padding: vh(5) 0 vh(28);

        .total-warp {
          margin-bottom: vh(45);
          height: vh(90);
          text-align: center;
          background: -moz-linear-gradient(
              left,
              rgba(44, 44, 150, 0) 0%,
              rgba(44, 44, 150, 0.7) 50%,
              rgba(44, 44, 150, 0) 100%
          );
          background: -webkit-gradient(
              linear,
              left bottom,
              right bottom,
              color-stop(0% rgba(44, 44, 150, 0)),
              color-stop(50% rgba(44, 44, 150, 0.7)),
              color-stop(100%, rgba(44, 44, 150, 0))
          );
          background: -webkit-linear-gradient(
              left,
              rgba(44, 44, 150, 0) 0%,
              rgba(44, 44, 150, 0.7) 50%,
              rgba(44, 44, 150, 0) 100%
          );
          background: -o-linear-gradient(
              left,
              rgba(44, 44, 150, 0) 0%,
              rgba(44, 44, 150, 0.7) 50%,
              rgba(44, 44, 150, 0) 100%
          );
          background: -ms-linear-gradient(
              left,
              rgba(44, 44, 150, 0) 0%,
              rgba(44, 44, 150, 0.7) 50%,
              rgba(44, 44, 150, 0) 100%
          );
          background: linear-gradient(
              to left,
              rgba(44, 44, 150, 0) 0%,
              rgba(44, 44, 150, 0.7) 50%,
              rgba(44, 44, 150, 0) 100%
          );

          ul {
            display: inline-block;

            li {
              float: left;
              padding: vh(17) vw(45) vh(12);
              position: relative;

              &:before {
                content: '';
                position: absolute;
                display: block;
                width: 1px;
                height: vh(34);
                top: vh(38);
                right: 0;
                background: rgba(97, 238, 255, .5);
              }

              .current {
                float: left;
                margin-right: vw(15);

                h5 {
                  height: vh(26);
                  line-height: vh(26);
                  font-size: vw(14);
                }

                p {
                  height: vh(40);
                  line-height: vh(40);
                  font-size: vw(30);
                  font-family: LiquidCrystalBold;
                  color: #80edf4;
                  text-align: right;
                  vertical-align: baseline;
                  font-weight: normal;

                  span {
                    display: inline-block;
                    margin-left: vw(5);
                    height: vh(40);
                    line-height: vh(40);
                    font-size: vw(14);
                    font-family: NotoSansCJKRegular;
                    color: #d7f2ff;
                    vertical-align: baseline;
                  }
                }
              }

              .history {
                float: left;
                padding-top: vh(22);
                padding-left: vw(10);

                h5 {
                  height: vh(18);
                  line-height: vh(18);
                  font-size: vh(12);
                  color: #90d7f9;
                  position: relative;

                  &:before {
                    content: '';
                    display: block;
                    position: absolute;
                    left: vw(-10);
                    top: vh(3);
                    width: vw(3);
                    height: vh(12);
                    background: #fdd20a;
                    border-radius: vh(3);
                  }
                }

                p {
                  height: vh(26);
                  line-height: vh(26);
                  font-size: vh(18);
                  font-family: LiquidCrystalBold;
                  color: #80edf4;
                }
              }

              &:last-child {
                &:before {
                  display: none;
                }

                .current p {
                  text-align: center;
                }
              }
            }
          }
        }

        .state-warp {
          padding: 0 vw(50);
          display: -webkit-flex; /* Safari */
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
</style>
