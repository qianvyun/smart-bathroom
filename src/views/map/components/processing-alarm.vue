<template>
  <div class="processing-warp">
    <el-dialog :visible.sync="processingVisible" :destroy-on-close="true" @close="close" width="590px" top="20vh">
      <div slot="title" class="processing-title">
        <i class="icon icon-alarm"></i>编号：<span>206</span>设备编号：<span>n00002</span>时间：<span>2020-2-4 13:12:12</span>
      </div>
      <div class="processing-body">
        <!--<div class="form-item">
          <label>告警类型：</label>
          <el-radio-group v-model="alarmType">
            <el-radio :label="1">缺纸</el-radio>
            <el-radio :label="2">火警</el-radio>
            <el-radio :label="3">求助</el-radio>
            <el-radio :label="4">一键报警</el-radio>
          </el-radio-group>
        </div>-->
        厕所名称：仙林一号</br>
        报警类型：缺纸
      </div>
      <div slot="footer" class="processing-footer">
        <el-button type="primary" plain @click="close(e)">取消</el-button>
        <el-button type="primary" @click="changeProcessing(event)">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProcessingAlarm',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      processingVisible: this.visible,
      alarmType: 1
    }
  },
  computed: {
  },
  watch: {
    processingVisible(old, newValue) {
      this.$emit("changeProcessingVisible", this.processingVisible);
    }
  },
  methods: {
    // 关闭弹窗
    close(e) {
      window.event ? window.event.cancelBubble = true : e.stopPropagation();
      this.processingVisible = false;
    },
    changeProcessing(e) {
      this.close(e)
    }
  }
}
</script>
<style lang="scss">
  .processing-warp{
    .el-dialog__header{
      padding: 0 28px;
    }
    .el-dialog__footer{
      padding: 0 20px;
      .processing-footer{
        .el-button{
          width: 64px;
          height: 28px;
          font-size: 12px;
          line-height: 28px;
          text-align: center;
          margin-bottom: 15px;
          padding: 0;
          border-radius: 8px;
          vertical-align: middle;
          &.is-plain{
            border-color: #AEC3F2;
            background: #AEC3F2;
            color: #fff;
          }
        }
      }
    }

  }

</style>
<style lang="scss" scoped>
  .processing-warp{
    .processing-title{
        padding: 20px 5px 12px;
        border-bottom: 1px solid #EFEFEF;
        line-height: 22px;
        color: rgba(34, 42, 66, .85);
        font-size: 16px;
        font-family: NotoSansCJKRegular;
        vertical-align: middle;
        i{
          color: #F69286;
          margin-right: 10px;
        }
        span{
          display: inline-block;
          margin-right: 15px;
          vertical-align: middle;
        }
      }
    .processing-body{
      .form-item{
        font-size: 14px;
        color: rgba(34, 42, 66, .8);
        &>label{
          display: inline-block;
          width: 100px;
          text-align: right;
        }
      }
    }
  }
</style>
