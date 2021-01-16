<template>
  <div class="player-container">
    <video-player ref="videoPlayer" class="vjs-custom-skin" :options="playerOptions" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" />
  </div>
</template>

<script>
export default {
  name: 'MonitorPlayer',
  props: {
    url: {
      type: String,
      default: ''
    },
    coverUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isPlayMonitor: false,
      videoUrl: this.url,
      videoCoverUrl: this.coverUrl,
      playerOptions: {},
      videoTimer: ''
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
        this.videoUrl = newValue;
        this.playerOptions.sources[0].src = this.videoUrl;
      }
    },
    coverUrl(newValue, oldValue) {
      if (newValue) {
        this.videoCoverUrl = newValue;
        this.playerOptions.poster = this.videoCoverUrl;
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
        aspectRatio: '4:3',
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        sources: [{
          type: 'application/x-mpegURL',
          src: this.videoUrl
        }],
        // 你的封面地址
        poster: '',
        width: document.documentElement.clientWidth,
        // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: '此视频暂无法播放，请稍后再试'
      }
    },
    onPlayerPlay(player) {
      this.isPlayMonitor = true;
      this.videoTimer = setTimeout(() => {
        this.player.pause();
        this.player.src('');
        this.isPlayMonitor = false;
        clearTimeout(this.videoTimer);
      }, 1000 * 60 * 10)
    },
    onPlayerPause(player) {
      clearTimeout(this.videoTimer);
    }
  }
}
</script>

<style scoped>

</style>
