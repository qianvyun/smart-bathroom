<template>
  <el-tabs type="border-card" tab-position="left">
    <el-tab-pane label="厕所总数">
      <div class="overview-item-warp">
        <div class="overview-item-title">{{ currentProject.name }}</div>
        <div class="overview-item-content pie-chart-warp toilets">
          <!--<total-toilets />
          <div class="pie-chart-number">300<span class="unit">个</span></div>
          <div class="pie-chart-title">厕所总数</div>-->
          <div class="total-toilets-table-warp"><total-toilets-table :data-list="toiletList" /></div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="使用总人数">
      <div class="overview-item-warp">
        <div class="overview-item-title">{{ currentProject.name }}</div>
        <div class="overview-item-content pie-chart-warp total-usage">
          <pie-chart :chart-data="personSum" />
          <div class="pie-chart-number">{{ personSum.malePersonSum + personSum.femalePersonSum }}<span class="unit">人</span></div>
          <div class="pie-chart-title">使用总人数</div>
          <div class="pie-chart-massage">
            <p><i class="icon iconfont icongirl" />女性：{{ personSum.femalePersonSum }}人</p>
            <p>占比：{{ personSum.otherProportion }}%</p>
          </div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="好评率">
      <div class="overview-item-warp">
        <div class="overview-item-title">{{ currentProject.name }}</div>
        <div class="overview-item-content pie-chart-warp high-praise-rate">
          <div class="grade-warp">
            <div class="grade grade-header">
              <span class="No">序号</span>
              <span class="name">厕所名称</span>
              <span class="score">评分</span>
            </div>
            <ul class="grade-body">
              <li v-for="(item,index) in tableData" :key="item.date" class="grade grade-item">
                <span class="No">{{ index+1 }}</span>
                <span class="name">{{ item.toiletName }}</span>
                <span class="score">{{ item.evaluateScore }}分</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="设备在线总数">
      <div class="overview-item-warp">
        <div class="overview-item-title">{{ currentProject.name }}</div>
        <div class="overview-item-content device">
          <img :src="require('../../../../assets/images/group.png')" width="133" height="198">
          <p class="device-number">1291<span class="unit">台</span></p>
          <p class="device-msg">设备在线总数</p>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="天气状态">
      <div class="overview-item-warp">
        <div class="overview-item-title">{{ currentProject.name }}</div>
        <div class="overview-item-content weather">
          <div class="weather-warp">
            <i class="icon iconfont" :class="weatherIcon" />
            <p>{{ weather }}</p>
          </div>
          <p class="current-time">{{ reportTime }}</p>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import PieChart from './pie-chart'
// import AMap from 'vue-amap';
import { lazyAMapApiLoaderInstance } from 'vue-amap';
// import TotalToilets from '@/views/map/components/Overview/total-toilets'
import TotalToiletsTable from '@/views/map/components/Overview/total-toilets-table'
// import { deepClone } from '@/utils'
import { getPersonSumByToiletId, getToiletEvaluateByProjectId } from '@/api/map'

export default {
  name: 'Overview',
  components: { TotalToiletsTable, PieChart },
  props: {
    city: {
      type: Array,
      required: true
    },
    project: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      weatherData: '',
      weather: '',
      reportTime: '',
      weatherIcon: '',
      currentProject: this.project,
      personSum: {
        personSumThisMonth: null,
        personSumPreMonth: null,
        malePersonSum: 0, // 男厕所入厕总人数
        femalePersonSum: 0, // 女厕所入厕总人数
        proportion: '', // 男性占比
        otherProportion: '' // 女性占比
      },
      toiletList: [],
      tableData: []
    }
  },
  computed: {

  },
  watch: {
    project(newVal) {
      if (newVal) {
        this.currentProject = newVal;
        this.toiletList = this.currentProject.toilets;
      }
    }
  },
  created() {
    // this.$store.dispatch('user/getProjectList');
    this.toiletList = this.currentProject.toilets;
    this.getPersonSum();
    this.getToiletEvaluateByProjectId()
    lazyAMapApiLoaderInstance.load().then(() => {
      this.getCurrentCity(this.city);
    })
  },
  methods: {
    /**
     * 根据地图中心坐标获取当前城市
     */
    getCurrentCity(center) {
      // eslint-disable-next-line no-undef
      AMap.service('AMap.Geocoder', () => { // 回调函数
        // eslint-disable-next-line no-undef
        const geocoder = new AMap.Geocoder({});
        geocoder.getAddress(center, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            const address = result.regeocode.addressComponent.city;
            this.getCurrentWeather(address);
          } else {
            console.error('地址获取错误')
          }
        });
      });
    },
    /**
     * 根据城市获取当前的天气
     */
    getCurrentWeather(city) {
      const $this = this;
      // eslint-disable-next-line no-undef
      AMap.plugin('AMap.Weather', function() {
        // 创建天气查询实例
        // eslint-disable-next-line no-undef
        const weather = new AMap.Weather();
        // 执行实时天气信息查询
        weather.getLive(city, function(err, data) {
          if (err) {
            console.error(err)
          } else {
            if (data) {
              $this.weatherData = data;
              $this.weather = data.weather;
              $this.reportTime = data.reportTime;
              $this.weatherClass();
            }
          }
        });
      });
    },
    weatherClass() {
      let weatherClass = 'iconweather-unknown';
      switch (this.weather) {
        case '晴':
          weatherClass = 'iconweather-sunshine';
          break;
        case '少云':
        case '晴间多云':
        case '多云':
          weatherClass = 'iconweather-cloudy';
          break;
        case '阴':
          weatherClass = 'iconweather-cloudy1';
          break;
        case '有风':
        case '平静':
        case '微风':
        case '和风':
        case '清风':
        case '强风/劲风':
        case '疾风':
        case '大风':
        case '烈风':
        case '风暴':
        case '狂爆风':
        case '飓风':
        case '热带风暴':
        case '龙卷风':
          weatherClass = 'iconweather-wind'
          break
        case '霾':
        case '中度霾':
        case '重度霾':
        case '严重霾':
          weatherClass = 'iconweather-smog';
          break;
        case '阵雨':
        case '强阵雨':
          weatherClass = 'iconweather-rain1';
          break;
        case '雷阵雨':
        case '强雷阵雨':
          weatherClass = 'iconweather-rain2';
          break;
        case '雷阵雨并伴有冰雹':
          weatherClass = 'iconweather-rain3';
          break;
        case '小雨':
        case '毛毛雨/细雨':
          weatherClass = 'iconweather-rain4';
          break;
        case '中雨':
          weatherClass = 'iconweather-rain5';
          break;
        case '大雨':
          weatherClass = 'iconweather-rain6';
          break;
        case '暴雨':
          weatherClass = 'iconweather-rain7';
          break;
        case '大暴雨':
          weatherClass = 'iconweather-rain8';
          break;
        case '特大暴雨':
        case '极端降雨':
          weatherClass = 'iconweather-rain9';
          break;
        case '雨':
          weatherClass = 'iconweather-rain';
          break;
        case '小雨-中雨':
        case '中雨-大雨':
          weatherClass = 'iconweather-rain16';
          break;
        case '大雨-暴雨':
          weatherClass = 'iconweather-rain17';
          break;
        case '暴雨-大暴雨':
          weatherClass = 'iconweather-rain18';
          break;
        case '大暴雨-特大暴雨':
          weatherClass = 'iconweather-rain19';
          break;
        case '雨雪天气':
        case '雨夹雪':
        case '阵雨夹雪':
          weatherClass = 'iconweather-rain21';
          break;
        case '冻雨':
          weatherClass = 'iconweather-rain23';
          break;
        case '雪':
          weatherClass = 'iconweather-snow';
          break;
        case '阵雪':
          weatherClass = 'iconweather-snow2';
          break;
        case '小雪':
          weatherClass = 'iconweather-snow3';
          break;
        case '中雪':
          weatherClass = 'iconweather-snow4';
          break;
        case '大雪':
          weatherClass = 'iconweather-snow5';
          break;
        case '暴雪':
          weatherClass = 'iconweather-snow6';
          break;
        case '小雪-中雪':
          weatherClass = 'iconweather-snow7';
          break;
        case '中雪-大雪':
          weatherClass = 'iconweather-snow8';
          break;
        case '大雪-暴雪':
          weatherClass = 'iconweather-snow9';
          break;
        case '浮尘':
          weatherClass = 'iconweather-sand-storm1';
          break;
        case '扬沙':
          weatherClass = 'iconweather-sand-storm2';
          break;
        case '沙尘暴':
          weatherClass = 'iconweather-sand-storm3';
          break;
        case '强沙尘暴':
          weatherClass = 'iconweather-sand-storm4';
          break;
        case '雾':
        case '浓雾':
        case '强浓雾':
        case '轻雾':
        case '大雾':
        case '特强浓雾':
          weatherClass = 'iconweather-fog';
          break;
        default:
          weatherClass = 'iconweather-unknown';
          break;
      }
      this.weatherIcon = weatherClass;
      return weatherClass;
    },
    async getPersonSum() {
      const requestData = {
        toiletId: this.currentProject.id
      }
      const data = await getPersonSumByToiletId(requestData);
      this.personSum = data.data.data
    },
    async getToiletEvaluateByProjectId() {
      const requestData = {
        projectId: this.currentProject.id
        // projectId: 1
      }
      const data = await getToiletEvaluateByProjectId(requestData);
      this.tableData = data.data.sort((a, b) => {
        return Number(b.evaluateScore) - Number(a.evaluateScore)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.overview-item-warp{
  padding: 0 20px;
  .overview-item-title{
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: #222A42;
    font-size: 14px;
    border-bottom: 2px solid #EFEFEF;
  }
  .pie-chart-warp{
    position: relative;
    .pie-chart-number{
      position: absolute;
      left: 135px;
      top: 100px;
      width: 120px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      color: #36437A;
      font-size: 30px;
      .unit{
        font-size: 10px;
      }
    }
    .pie-chart-title{
      position: absolute;
      width: 200px;
      height: 20px;
      line-height: 20px;
      left: 95px;
      top: 210px;
      text-align: center;
      color: #36437A;
    }
    .pie-chart-massage{
      padding: 45px 0 45px 150px;
      p{
        height: 20px;
        line-height: 20px;
        margin-bottom: 5px;
        color: #36437A;
        font-size: 14px;
        i{
          font-size: 20px;
          color: #1D8CF8;
          margin-right: 5px;
          margin-left: -26px;
          vertical-align: middle;
        }
      }
    }
    &.toilets{
      .pie-chart-number{
        width: 90px;
        left: 25px;
        top: 134px;
      }
      .pie-chart-title{
        width: 140px;
        left: 0;
        top: 226px;
      }
    }
  }
  .high-praise-rate{
    padding: 12px 0 0;
    /*height: 330px;*/
    .grade-body{
      height: 280px;
      overflow: overlay;
    }
    .grade{
      height: 39px;
      line-height: 39px;
      text-align: center;
      border-bottom: 1px solid #EFEFEF;
      font-size: 0;
      &.grade-header{
        background: #F4F4F4;
        border-radius: 6px;
      }
      .No,.name,.score{
        display: inline-block;
        width: 100px;
        font-size: 12px;
        color: #36437A;
      }
      .name{
        width: 145px;
      }
      .score{
        width: 145px;
      }
    }
  }
  .device{
    text-align: center;
    font-size: 0;
    padding-top: 45px;
    img{
      margin-bottom: 24px;
    }
    .device-number{
      height: 42px;
      line-height: 42px;
      color: #36437A;
      font-size: 36px;
      font-family: NotoSansCJKRegular;
      .unit{
        font-size: 10px;
      }
    }
    .device-msg{
      height: 20px;
      line-height: 20px;
      color: #36437A;
      font-size: 14px;
    }
  }
  .weather{
    text-align: center;
    .weather-warp{
      padding-top: 40px;
      padding-bottom: 40px;
      i{
        font-size: 180px;
        color: #1D8CF8;
      }
      p{
        font-size: 14px;
        color: #36437A;
        line-height: 20px;
      }
    }
    .current-time{
      font-size: 14px;
      color: #36437A;
      line-height: 20px;
    }
  }
  .total-toilets-table-warp{
    position: absolute;
    /*width: 220px;*/
    width: 360px;
    height: 320px;
    /*height: 280px;*/
    /*left: 160px;*/
    /*top: 45px;*/
    top: 20px;
  }
}
</style>
