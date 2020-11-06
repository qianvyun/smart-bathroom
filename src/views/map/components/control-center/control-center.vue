<template>
  <div class="control-center-warp">
    <div class="control-center-header">
      <h3>智慧公厕调度指挥系统</h3>
      <h5 class="public-toilet-name">仙林一号公厕</h5>
    </div>
    <div class="control-center-body">
      <div class="control-center-left">
        <div class="chart-warp">
          <div class="chart-box-top"><span></span></div>
          <div class="chart-box-main">
            <toilet-usage />
          </div>
        </div>
        <div class="chart-warp">
          <div class="chart-box-top"><span></span></div>
          <div class="chart-box-main">
            <human />
          </div>
        </div>
        <div class="chart-warp">
          <div class="chart-box-top"><span></span></div>
          <hygiene/>
        </div>
      </div>
      <div class="control-center-middle">
        <div class="total-warp">
          <ul class="clear">
            <li class="clear">
              <div class="current">
                <h5>今日入厕人数</h5>
                <p>346<span>人</span></p>
              </div>
              <div class="history">
                <h5>昨日入厕人数</h5>
                <p>346</p>
              </div>
            </li>
            <li class="clear">
              <div class="current">
                <h5>本月总服务人数</h5>
                <p>34623<span>人</span></p>
              </div>
              <div class="history">
                <h5>上月总服务人数</h5>
                <p>346345</p>
              </div>
            </li>
            <li class="clear">
              <div class="current">
                <h5>当前坑位利用率</h5>
                <p>20<span>%</span></p>
              </div>
              <div class="history">
                <h5>昨日利用率</h5>
                <p>30%</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="state-warp">
          <toilet-state toiletType="man" />
          <toilet-state toiletType="woman" />
        </div>
      </div>
      <div class="control-center-right">
        <toilet-state :isAccessibleToilet="true" toiletType="accessible" />
        <div class="chart-warp">
          <div class="chart-box-top"><span></span></div>
          <div class="chart-box-main">
            <ammonia-hydrothion-current />
          </div>
        </div>
        <div class="chart-warp">
          <div class="chart-box-top"><span></span></div>
          <monitor/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ToiletState from './toilet-state';
import ToiletUsage from './toilet-usage';
import AmmoniaHydrothionCurrent from './ammonia-hydrothion-current';
import Human from './human';
import Monitor from './monitor';
import Hygiene from './hygiene';
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
  data() {
    return {
      chartWidth: '',
      chartHeight: ''
    }
  },
  created() {
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
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/fonts/font.css";
@import "~@/styles/mixin.scss";
$fontSize: vw(16);
$textShadow: 4px 4px 7px rgba(9, 9, 84, 0.2);
$letterSpacing: vw(5);
$font-color:#d7f2ff;

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
  .control-center-header{
    position: relative;
    height: vh(81);
    line-height: vh(81);
    text-align: center;
    background: url("../../../../assets/images/center-modal-header-bg.png") no-repeat bottom center;
    background-size: cover;
    font-family: FZZCHJW;
    h3{
      height: vh(81);
      line-height: vh(81);
      font-size: vw(36);
      letter-spacing: $letterSpacing;
      font-weight: inherit;
    }
    .public-toilet-name{
      position: absolute;
      left: vw(60);
      top: 0;
      height: vh(50);
      line-height: vh(50);
      font-size: vw(20);
      font-weight: inherit;
    }
  }
  .control-center-body{
    padding: vh(20) vw(62);
    display: -webkit-flex; /* Safari */
    display: flex;
    /*font-size: 0;*/
    .control-center-left,.control-center-right{
      box-sizing: border-box;
      .chart-warp{
        width: vw(385);
        height: vh(286);
        margin-bottom: vh(28);
        background: rgba(14,33,97,.5);
        border: 1px solid rgba(47,86,135,.7);
        border-radius: 5px;
        .chart-box-top{
          margin-top: -1px;
          position: relative;
          padding: 0 vw(50);
          height: vh(16);
          background: #0d0d73;
          opacity: .8;
          &:before,&:after{
            content: '';
            display: block;
            position: absolute;
            top: 0;
            width: vh(3);
            height: vh(16);
            background: #4fade8;
          }
          &:before{
            left: -1px;
          }
          &:after{
            right: -1px;
          }
          span{
            position:relative;
            display: block;
            width: vw(286);
            height: vh(16);
            background: #2a559d;
            &:before,&:after{
              content: '';
              display: block;
              position: absolute;
              top: 0;
              height: vh(16);
            };
            &:before{
              left: vw(50);
              width:vw(186);
              background: #0590d0;
            }
            &:after{
              left: vw(100);
              width: vw(86);
              background: #79d4ff;
            }
          }
        }
        .chart-container{
          position: relative;
          width: 100%;
          height: calc(24vh - 84px);
        }
      }
    }
    .control-center-middle{
      box-sizing: border-box;
      width: vw(1026);
      padding: vh(5) 0 vh(28);
      .total-warp{
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
        ul{
          display: inline-block;
          li{
            float: left;
            padding: vh(17) vw(45) vh(12);
            position: relative;
            &:before{
              content: '';
              position: absolute;
              display: block;
              width: 1px;
              height: vh(34);
              top: vh(38);
              right: 0;
              background: rgba(97,238,255,.5);
            }
            .current{
              float: left;
              margin-right: vw(15);
              h5{
                height: vh(26);
                line-height: vh(26);
                font-size: vw(14);
              }
              p{
                height: vh(40);
                line-height: vh(40);
                font-size: vw(30);
                font-family: LiquidCrystalBold;
                color: #80edf4;
                text-align: right;
                vertical-align: baseline;
                font-weight: normal;
                span{
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
            .history{
              float: left;
              padding-top: vh(22);
              padding-left: vw(10);
              h5{
                height: vh(18);
                line-height: vh(18);
                font-size: vh(12);
                color: #90d7f9;
                position: relative;
                &:before{
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
              p{
                height: vh(26);
                line-height: vh(26);
                font-size: vh(18);
                font-family: LiquidCrystalBold;
                color: #80edf4;
              }
            }
            &:last-child{
              &:before{
                display: none;
              }
              .current p{
                text-align: center;
              }
            }
          }
        }
      }
      .state-warp{
        padding: 0 vw(50);
        display: -webkit-flex; /* Safari */
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
