<template>
  <div class="toilet-state-warp" :class="{'accessible-toilet-state':isAccessibleToilet}">
    <div class="top-warp">
      <h4><i class="icon iconfont" :class="iconClass" />厕所状态</h4>
      <div class="state-list clear">
        <ul class="clear">
          <li>有人</li>
          <li>空闲</li>
          <li>故障</li>
          <li>求助</li>
        </ul>
        <div class="total">剩余坑位：<span>{{ availableClosestoolCount }}个</span></div>
      </div>
      <ul class="state-details-list clear">
        <li v-for="item in stateList" :key="item.name" class="state-details-item">
          <div class="icon-warp"><i class="icon iconfont" :class="formatClassName(item.state)" /></div>
          <p class="name">{{ item.name }}</p>
        </li>
      </ul>
    </div>
    <div class="middle-warp">最新打扫时间：<span class="time">2020-1-1</span></div>
    <div v-if="!isAccessibleToilet" class="bottom-warp">
      <ul class="clear">
        <li class="weather">
          <div class="icon-warp"><i class="icon iconfont icontemperature" /></div>
          <div class="describe">温度</div>
          <div class="current-weather">{{ formatData(environmentalState.temperature) }}</div>
        </li>
        <li class="weather">
          <div class="icon-warp"><i class="icon iconfont iconhydrothion" /></div>
          <div class="describe">硫化氢</div>
          <div class="current-weather">{{ formatData(environmentalState.hydrogenSulfide) }}</div>
        </li>
        <li class="weather">
          <div class="icon-warp"><i class="icon iconfont iconammonia" /></div>
          <div class="describe">氨气</div>
          <div class="current-weather">{{ formatData(environmentalState.ammonia) }}</div>
        </li>
        <li class="weather">
          <div class="icon-warp"><i class="icon iconfont iconprimary-air-system" /></div>
          <div class="describe">新风系统</div>
          <div class="current-weather">暂无</div>
        </li>
        <li class="weather">
          <div class="icon-warp"><i class="icon iconfont iconpm25" /></div>
          <div class="describe">PM2.5</div>
          <div class="current-weather">{{ formatData(environmentalState.pm25) }}</div>
        </li>
        <li class="weather">
          <div class="icon-warp"><i class="icon iconfont iconfumee help" /></div>
          <div class="describe">烟雾报警</div>
          <div class="current-weather">暂无</div>
        </li>
        <li class="weather">
          <div class="icon-warp"><i class="icon iconfont iconeclairage" /></div>
          <div class="describe">光照度</div>
          <div class="current-weather">暂无</div>
        </li>
        <li class="weather">
          <div class="icon-warp"><i class="icon iconfont iconpeculiar-smell" /></div>
          <div class="describe">异味</div>
          <div class="current-weather">{{ formatData(environmentalState.peculiarSmell) }}</div>
        </li>
        <li class="weather">
          <div class="icon-warp"><i class="icon iconfont iconhumidite" /></div>
          <div class="describe">湿度</div>
          <div class="current-weather">{{ formatData(environmentalState.dampness) }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ToiletState',
  props: {
    isAccessibleToilet: {
      type: Boolean,
      default: false
    },
    toiletType: {
      type: String,
      default: 'man'
    },
    // 坑位总数
    closestoolCount: {
      type: Number,
      required: true
    },
    availableClosestoolCount: {
      type: Number,
      required: true
    },
    // 厕所设备详情
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 坑位状态
    toiletMsg: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      stateList: [],
      environmentalState: this.detail,
      closestoolNum: this.closestoolCount,
      availableCount: this.availableClosestoolCount,
      toiletState: this.toiletMsg || []
    }
  },
  computed: {
    iconClass() {
      let iconC = ''
      switch (this.toiletType) {
        case 'woman':
          iconC = 'iconwoman'
          break
        case 'accessible':
          iconC = 'iconhandicapees'
          break
        default:
          iconC = 'iconman'
          break
      }
      return iconC
    }
  },
  watch: {
    detail(newValue, oldValue) {
      if (newValue) {
        this.environmentalState = newValue
      }
    },
    closestoolCount(newVal, oldVal) {
      if (newVal) {
        this.closestoolNum = newVal
      }
    },
    availableClosestoolCount(newVal, oldVal) {
      if (newVal) {
        this.availableCount = newVal
      }
    },
    toiletMsg(newVal, oldVal) {
      if (newVal) {
        this.toiletState = newVal;
        this.formatStateList();
      }
    }
  },
  created() {
    this.formatStateList();
  },
  methods: {
    /**
     * 格式化数据
     */
    formatData(data) {
      return (data || data === 0) ? data : '暂无'
    },
    /**
     * 厕所信息
     */
    formatStateList() {
      this.stateList = []
      for (let i = 0; i < this.closestoolCount; i++) {
        const item = {
          name: (i + 1) + '号',
          state: this.toiletState[i]
        }
        this.stateList.push(item)
      }
    },
    formatClassName(state) {
      switch (state) {
        case '1': // 有人
          return this.iconClass + ' being';
        case '2': // 故障
          return this.iconClass + ' fault';
        case '3': // 求助
          return this.iconClass + ' help';
        default:
          return this.iconClass
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  /*@import "~@/assets/fonts/font.css";*/
  /*@import "~@/assets/fonts/style.css";*/
  @import "~@/styles/reset.scss";
  @import "~@/styles/mixin.scss";

  $being: #e7a218;
  $unoccupied: #2cccdf;
  $fault: #a9a9a9;
  $help: #bd371c;
  .toilet-state-warp {
    box-sizing: border-box;
    border: 1px solid rgba(47, 86, 135, .7);
    border-radius: 5px;
    width: vw(446);
    color: #d7f2ff;

    .top-warp {
      padding: vh(10) vw(25) 0;
      height: vh(432);
      border-bottom: 1px solid rgba(47, 86, 135, .7);

      h4 {
        margin-left: vw(-10);
        height: vh(36);
        line-height: vh(36);
        font-size: vw(18);
        font-weight: lighter;
        font-family: FZZCHJW;
        color: #d7f2ff;
        vertical-align: middle;

        i {
          margin-right: vw(5);
          font-size: vw(26);
          color: $unoccupied;
          vertical-align: middle;
        }
      }

      .state-list {
        ul {
          float: left;

          li {
            float: left;
            position: relative;
            margin-right: vw(18);
            padding-left: vw(20);
            height: vh(32);
            line-height: vh(32);
            font-size: vw(14);

            &:before {
              content: '';
              display: block;
              position: absolute;
              left: 0;
              top: vh(11);
              width: vw(9);
              height: vw(9);
              border-radius: 50%;
              background: $being;
            }

            &:nth-of-type(2):before {
              background: $unoccupied;
            }

            &:nth-of-type(3):before {
              background: $fault;
            }

            &:nth-of-type(4):before {
              background: $help;
            }
          }
        }

        .total {
          float: right;
          height: vh(32);
          line-height: vh(32);
          font-size: vw(14);
        }
      }

      .state-details-list {
        margin-bottom: vh(24);

        .state-details-item {
          float: left;
          padding-top: vh(22);
          margin-right: vw(15);
          width: vw(64);
          height: vh(110);
          text-align: center;

          &:nth-of-type(5n) {
            margin-right: 0;
          }

          .icon-warp {
            height: vh(64);
            line-height: vh(64);

            .icon {
              font-size: vw(48);
              color: $unoccupied;

              &.being {
                color: $being;
              }

              &.fault {
                color: $fault;
              }

              &.help {
                color: $help;
              }
            }
          }

          .name {
            height: vh(24);
            line-height: vh(24);
            font-size: vw(14);
          }
        }
      }
    }

    .middle-warp {
      padding: 0 vw(25);
      height: vh(48);
      line-height: vh(48);
      font-size: vw(14);

      .time {
        margin-left: vw(15);
        color: #2cccdf;
      }
    }

    .bottom-warp {
      border-top: 1px solid rgba(47, 86, 135, .7);
      height: vh(290);
      padding: vh(30) vw(16) vh(8);

      .weather {
        float: left;
        margin-bottom: vh(30);
        width: vw(80);
        text-align: center;

        .icon-warp {
          height: vh(40);
          line-height: vh(40);

          .icon {
            height: vh(40);
            line-height: vh(40);
            font-size: vw(34);
            color: $unoccupied;

            &.being {
              color: $being;
            }

            &.fault {
              color: $fault;
            }

            &.help {
              color: $help;
            }
          }
        }

        .describe {
          height: vh(28);
          line-height: vh(28);
          font-size: vw(12);
          color: rgba(215, 242, 255, .5);
        }

        .current-weather {
          height: vh(28);
          line-height: vh(28);
          font-size: vw(14);
        }

        /*&:nth-of-type(2), &:nth-of-type(3) {
          .icon-warp .icon {
            font-size: vw(40);
          }
        }

        &:nth-of-type(6), &:nth-of-type(9) {
          .icon-warp .icon {
            font-size: vw(28);
          }
        }*/
      }
    }
  }

  .accessible-toilet-state {
    width: vw(385);
    margin-bottom: vh(28);

    .top-warp {
      padding: vh(10) vw(20) 0;
      height: vh(234);
      overflow: hidden;

      .state-list {
        ul li {
          margin-right: vw(8);
          padding-left: vw(16);
        }
      }

      .state-details-list {
        .state-details-item {
          margin-right: vw(0);
          width: vw(65);
        }
      }
    }
  }
</style>
