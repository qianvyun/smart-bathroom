<template>
  <div class="monitor">
    <div class="monitor-header clear">
      <h5 class="title">监控视频</h5>
      <div class="monitor-switch">
        <el-switch
          v-model="isPlayMonitor"
          :width="52"
          active-text="连接"
          inactive-text="关闭"
          @change="playChange"
        />
      </div>
    </div>
    <div class="monitor-box">
      <div class="monitoring">
        <div class="player-container">
          <video-player ref="videoPlayer" class="vjs-custom-skin" :options="playerOptions" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入video样式
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

// 引入hls.js
import 'videojs-contrib-hls.js/src/videojs.hlsjs'

export default {
  name: 'Monitor',
  props: {
    url: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isPlayMonitor: false,
      monitorUrl: this.url,
      playerOptions: {},
      timer: ''
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    }
  },
  watch: {
    url(newValue, oldValue) {
      if (newValue) {
        this.monitorUrl = newValue;
        this.playerOptions.sources[0].src = this.monitorUrl;
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.playerOptions = {
        // 播放速度
        // playbackRates: [0.7, 1.0, 1.5, 2.0],
        // 如果true,浏览器准备好时开始回放。
        autoplay: false,
        // 控制条
        controls: true,
        // 视频预加载
        preload: 'auto',
        // 默认情况下将会消除任何音频。
        muted: false,
        // 导致视频一结束就重新开始。
        loop: false,
        language: 'zh-CN',
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        aspectRatio: '4:2',
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        sources: [{
          type: 'application/x-mpegURL',
          // src: this.monitorUrl
          src: 'https://cmgw-vpc.lechange.com:8890/LCO/5G0341DPAK95DF5/0/1/20201117T142148/46d60ff8a46f3099caca338393c97e57.m3u8?proto=https'
        }],
        // 你的封面地址
        poster: '',
        width: document.documentElement.clientWidth,
        // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: '此视频暂无法播放，请稍后再试'
      }
      console.log(this.playerOptions.src)
    },
    playChange() {
      if (this.isPlayMonitor) {
        // this.playerOptions.sources[0].src = 'https://cmgw-vpc.lechange.com:8890/LCO/5G0341DPAK95DF5/0/1/20201117T142148/46d60ff8a46f3099caca338393c97e57.m3u8?proto=https'
        // this.player.src('https://cmgw-vpc.lechange.com:8890/LCO/5G0341DPAK95DF5/0/1/20201117T142148/46d60ff8a46f3099caca338393c97e57.m3u8?proto=https');
        this.player.src(this.monitorUrl)
        this.player.play()
      } else {
        this.player.pause()
        this.player.src('')
      }
    },
    onPlayerPlay(player) {
      this.isPlayMonitor = true;
      this.timer = setTimeout(() => {
        this.player.pause();
        this.player.src('');
        this.isPlayMonitor = false;
        clearTimeout(this.timer);
      }, 1000 * 60 * 10)
    },
    onPlayerPause(player) {
      clearTimeout(this.timer);
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
