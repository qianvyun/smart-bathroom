<template>
  <div class="monitor">
    <div class="monitor-header clear">
      <h5 class="title">监控视频</h5>
      <div class="monitor-switch">
        <el-switch
          v-model="isPlayMonitor"
          :width="52"
          active-text="连接"
          inactive-text="关闭">
          >
        </el-switch>
      </div>
    </div>
    <div class="monitor-box">
      <div class="monitoring">
        <object v-if="url" type="application/x-shockwave-flash" id="StrobeMediaPlaybackOne" name="StrobeMediaPlayback" align="middle" data="swfs/StrobeMediaPlayback.swf" width="100%" height="100%">
          <param name="quality" value="high">
          <param name="bgcolor" value="#000000">
          <param name="allowscriptaccess" value="sameDomain">
          <param name="allowfullscreen" value="true">
          <param name="flashvars" :value="monitorUrl">
        </object>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Monitor',
  props: {
    url: {
      type: String
    }
  },
  data() {
    return {
      isPlayMonitor: false,
      monitorUrl: this.url ? `src=${this.url}&streamType=vod&autoPlay=true&controlBarAutoHide=true&controlBarPosition=bottom`:''
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.monitor{
  .monitor-header{
    h5{
      float: left;
      margin-left: vw(32);
      height: vh(46);
      line-height: vh(46);
      font-size: vw(18);
      font-family: FZZCHJW;
      font-weight: lighter;
    }
    .monitor-switch{
      float: right;
      padding-top: vh(18);
    }
  }
}
</style>
<style lang="scss">
  @import "~@/styles/mixin.scss";
  .monitor-switch{
    width: vw(52);
    .el-switch{
      .el-switch__label{
        opacity: 0;
        &.el-switch__label--left{
          margin-right: vw(-44);
        }
        &.el-switch__label--right{
          margin-left: vw(-44);
        }
        &.is-active{
          opacity: 1;
        }
        span{
          font-size: 10px;
          color: #d7f2ff;
        }
      }
      .el-switch__core{
        width: vw(52);
        height: vh(22);
        background-color:transparent;
        &:after{
          background-color: #dcdfe6;
        }
      }
      &.is-checked{
        .el-switch__core{
          background-color:transparent;
          border-color: #7fadf1;
          &:after{
            background-color: #7fadf1;
          }
        }
      }
    }
  }
</style>
