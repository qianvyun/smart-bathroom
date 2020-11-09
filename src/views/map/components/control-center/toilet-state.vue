<template>
  <div class="toilet-state-warp" :class="{'accessible-toilet-state':isAccessibleToilet}">
    <div class="top-warp">
      <h4><i class="icon" :class="iconClass"></i>厕所状态</h4>
      <div class="state-list clear">
        <ul class="clear">
          <li>有人</li>
          <li>空闲</li>
          <li>故障</li>
          <li>求助</li>
        </ul>
        <div class="total">剩余坑位：<span>12个</span></div>
      </div>
      <ul class="state-details-list clear">
        <li v-for="item in stateList" :key="item.state" class="state-details-item">
          <div class="icon-warp"><i class="icon" :class="iconClass"></i></div>
          <p class="name">{{item.name}}</p>
        </li>
      </ul>
    </div>
    <div class="middle-warp">最新打扫时间：<span class="time">2020-1-1</span></div>
    <div class="bottom-warp" v-if="!isAccessibleToilet">
      <ul class="clear">
        <li class="weather">
          <div class="icon-warp"><i class="icon icon-temperature" /></div>
          <div class="describe">温度</div>
          <div class="current-weather">24℃</div>
        </li>
        <li class="weather">
          <div class="icon-warp"><i class="icon icon-hydrothion" /></div>
          <div class="describe">硫化氢</div>
          <div class="current-weather">24℃</div>
        </li>
        <li class="weather">
          <div class="icon-warp"><i class="icon icon-ammonia" /></div>
          <div class="describe">氨气</div>
          <div class="current-weather">24℃</div>
        </li>
        <li class="weather">
          <div class="icon-warp"><i class="icon icon-primary-air-system" /></div>
          <div class="describe">新风系统</div>
          <div class="current-weather">24℃</div>
        </li>
        <li class="weather">
          <div class="icon-warp"><i class="icon icon-pm25" /></div>
          <div class="describe">PM2.5</div>
          <div class="current-weather">24℃</div>
        </li>
        <li class="weather">
          <div class="icon-warp"><i class="icon icon-fumee help" /></div>
          <div class="describe">烟雾报警</div>
          <div class="current-weather">24℃</div>
        </li>
        <li class="weather">
          <div class="icon-warp"><i class="icon icon-eclairage" /></div>
          <div class="describe">光照度</div>
          <div class="current-weather">24℃</div>
        </li>
        <li class="weather">
          <div class="icon-warp"><i class="icon icon-pipeline" /></div>
          <div class="describe">异味</div>
          <div class="current-weather">24℃</div>
        </li>
        <li class="weather">
          <div class="icon-warp"><i class="icon icon-humidite" /></div>
          <div class="describe">湿度</div>
          <div class="current-weather">24℃</div>
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
    }
  },
  data() {
    return {
      stateList: [{
        'name': '1号'
      },
      {
        'name': '1号'
      },
      {
        'name': '1号'
      },
      {
        'name': '1号'
      },
      {
        'name': '1号'
      },
      {
        'name': '1号'
      },
      {
        'name': '1号'
      },
      {
        'name': '1号'
      },
      {
        'name': '1号'
      },
      {
        'name': '1号'
      },
      {
        'name': '1号'
      },
      {
        'name': '1号'
      }]
    };
  },
  computed: {
    iconClass() {
      let iconC = '';
      switch (this.toiletType) {
        case 'woman':
          iconC = 'icon-woman';
          break;
        case 'accessible':
          iconC = 'icon-handicapees';
          break;
        default:
          iconC = 'icon-man';
          break;
      }
      return iconC;
    }
  }
}
</script>

<style lang="scss" scoped>
/*@import "~@/assets/fonts/font.css";*/
/*@import "~@/assets/fonts/style.css";*/
@import "~@/styles/reset.scss";
@import "~@/styles/mixin.scss";
$being:#e7a218;
$unoccupied:#2cccdf;
$fault:#a9a9a9;
$help:#bd371c;
.toilet-state-warp{
  box-sizing: border-box;
  border: 1px solid rgba(47,86,135,.7);
  border-radius: 5px;
  width: vw(446);
  color: #d7f2ff;
  .top-warp{
    padding: vh(10) vw(25) 0;
    height: vh(432);
    border-bottom: 1px solid rgba(47,86,135,.7);
    h4{
      margin-left: vw(-10);
      height: vh(36);
      line-height: vh(36);
      font-size: vw(18);
      font-weight: lighter;
      font-family: FZZCHJW;
      color: #d7f2ff;
      vertical-align: middle;
      i{
        margin-right: vw(5);
        font-size: vw(26);
        color: $unoccupied;
        vertical-align: middle;
      }
    }
    .state-list{
      ul{
        float: left;
        li{
          float: left;
          position: relative;
          margin-right: vw(18);
          padding-left: vw(20);
          height: vh(32);
          line-height: vh(32);
          font-size: vw(14);
          &:before{
            content:'';
            display: block;
            position: absolute;
            left: 0;
            top: vh(11);
            width: vw(9);
            height: vw(9);
            border-radius: 50%;
            background: $being;
          }
          &:nth-of-type(2):before{
            background: $unoccupied;
          }
          &:nth-of-type(3):before{
            background: $fault;
          }
          &:nth-of-type(4):before{
            background: $help;
          }
        }
      }
      .total{
        float: right;
        height: vh(32);
        line-height: vh(32);
        font-size: vw(14);
      }
    }
    .state-details-list{
      margin-bottom: vh(24);
      .state-details-item{
        float: left;
        padding-top: vh(22);
        margin-right: vw(15);
        width: vw(64);
        height: vh(110);
        text-align: center;
        &:nth-of-type(5n){
          margin-right: 0;
        }
        .icon-warp{
          height: vh(64);
          line-height: vh(64);
          .icon{
            font-size: vw(60);
            color: $unoccupied;
            &.being{
              color: $being;
            }
            &.fault{
              color: $fault;
            }
            &.help{
              color: $help;
            }
          }
        }
        .name{
          height: vh(24);
          line-height: vh(24);
          font-size: vw(14);
        }
      }
    }
  }
  .middle-warp{
    padding: 0 vw(25);
    height: vh(48);
    line-height: vh(48);
    font-size: vw(14);
    .time{
      margin-left: vw(15);
      color: #2cccdf;
    }
  }
  .bottom-warp{
    border-top: 1px solid rgba(47,86,135,.7);
    height: vh(290);
    padding: vh(30) vw(16) vh(8);
    .weather{
      float: left;
      margin-bottom: vh(30);
      width: vw(80);
      text-align: center;
      .icon-warp{
        height: vh(40);
        line-height: vh(40);
        .icon{
          height: vh(40);
          line-height: vh(40);
          font-size: vw(34);
          color:$unoccupied;
          &.being{
            color: $being;
          }
          &.fault{
            color: $fault;
          }
          &.help{
            color: $help;
          }
        }
      }
      .describe{
        height: vh(28);
        line-height: vh(28);
        font-size: vw(12);
        color: rgba(215,242,255,.5);
      }
      .current-weather{
        height: vh(28);
        line-height: vh(28);
        font-size: vw(14);
      }
      &:nth-of-type(2),&:nth-of-type(3){
        .icon-warp .icon{
          font-size: vw(40);
        }
      }
      &:nth-of-type(6),&:nth-of-type(9){
        .icon-warp .icon{
          font-size: vw(28);
        }
      }
    }
  }
}
.accessible-toilet-state{
  width: vw(385);
  margin-bottom: vh(28);
  .top-warp{
    padding: vh(10) vw(20) 0;
    height: vh(234);
    overflow: hidden;
    .state-list{
      ul li{
        margin-right: vw(8);
        padding-left: vw(16);
      }
    }
    .state-details-list{
      .state-details-item{
        margin-right: vw(0);
        width: vw(65);
      }
    }
  }
}
</style>
