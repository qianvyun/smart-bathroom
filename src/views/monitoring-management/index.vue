<template>
  <div class="monitoring-management-container">
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="project-list">
          <project-list /><!-- :projectData="projectList"-->
        </div>
      </el-col>
      <el-col :span="21">
        <div class="monitoring-management-content-warp">
          <div class="monitoring-management-content-heard">
            <div class="title"><i class="icon icon-monitor" />监控管理</div>
            <div class="add-monitor">
              <el-button type="primary" :disabled="queryMonitorList.length===0" @click="handleAddMonitor">
                <i class="icon icon-add" />添加监控
              </el-button>
            </div>
          </div>
          <div class="monitoring-management-content">
            <ul>
              <template v-for="monitor of showMonitorList">
                <li :key="monitor.id"><!---->
                  <div class="monitoring">
                    <object :id="`StrobeMediaPlaybackOne${monitor.id}`" type="application/x-shockwave-flash" name="StrobeMediaPlayback" align="middle" data="swfs/StrobeMediaPlayback.swf" width="270" height="232">
                      <param name="quality" value="high">
                      <param name="bgcolor" value="#000000">
                      <param name="allowscriptaccess" value="sameDomain">
                      <param name="allowfullscreen" value="true">
                      <param name="flashvars" :value="monitorValue(monitor.url)">
                    </object>
                    监控内容
                  </div>
                  <span><i class="icon icon-delete" /></span><!--{{ monitor.deviceName }}-->
                </li>
              </template>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible" title="添加监控" custom-class="create-dialpg">
      <el-checkbox-group v-model="monitorCheckList">
        <ul class="dialog-monitor">
          <template v-for="monitor of queryMonitorList">
            <li :key="monitor.id">
              <el-checkbox :label="monitor.id" />
              <div class="monitoring-warp">
                <div class="monitoring">
                  <object :id="`StrobeMediaPlaybackOne${monitor.id}`" type="application/x-shockwave-flash" name="StrobeMediaPlayback" align="middle" data="swfs/StrobeMediaPlayback.swf" width="134" height="134">
                    <param name="quality" value="high">
                    <param name="bgcolor" value="#000000">
                    <param name="allowscriptaccess" value="sameDomain">
                    <param name="allowfullscreen" value="true">
                    <param name="flashvars" :value="monitorValue(monitor.url)">
                  </object>
                </div>
                <p>{{ monitor.name }}</p>
              </div>
            </li>
          </template>
        </ul>
      </el-checkbox-group>
      <div slot="footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmMonitor">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ProjectList from '@/components/ProjectList/index'
export default {
  name: 'MonitoringManagement',
  components: { ProjectList },
  data() {
    return {
      dialogVisible: false,
      // 项目列表
      projectList: [
        {
          id: '111',
          name: '項目1'
        },
        {
          id: '222',
          name: '項目1'
        },
        {
          id: '333',
          name: '項目1'
        }
      ],
      // 展示的监控
      showMonitorList: [],
      // 当前项目的所有监控
      queryMonitorList: [],
      monitorCheckList: []
    }
  },
  computed: {
    monitorValue(url) {
      return `src=${url}&streamType=vod&autoPlay=false&controlBarAutoHide=true&controlBarPosition=bottom`
    }
  },
  methods: {
    handleAddMonitor() {
      this.dialogVisible = true
    },
    confirmMonitor() {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss">
  .monitoring-management-container{
    .el-button--primary{
      background: #369AFE;
      border-color: #369AFE;
    }
    .el-checkbox__label{
      display: none;
    }
  }
</style>
<style lang="scss" scoped>

  .monitoring-management-container{
    width: 100%;
    height: calc(100vh - 78px);
    padding: 25px;
    background: #F2F2F2;
    overflow: hidden;
    font-family: NotoSansCJKRegular;
    font-size: 14px;
  }
  .monitoring-management-content-warp{
    background: #fff;
    border-radius: 6px;
    height: calc(100vh - 128px);
    padding: 0 40px;
    .monitoring-management-content-heard{
      position: relative;
      padding-top: 12px;
      height: 42px;
      .title{
        line-height: 30px;
        color: rgba(72, 83, 133, .8);
        vertical-align: middle;
        i{
          display: inline-block;
          margin-top: -3px;
          margin-right: 10px;
          font-size: 22px;
          color: #1E8BF8;
          line-height: 30px;
          vertical-align: middle;
        }
      }
      .add-monitor{
        position: absolute;
        top: 20px;
        right: 20px;

        i{
          margin-right: 5px;
        }
      }
    }
    .monitoring-management-content{
      width: 800px;
      li{
        float: left;
        position: relative;
        .monitoring{
          width: 270px;
          height: 232px;
          margin-top: 50px;
          margin-right: 100px;
          border-radius: 10px;
          overflow: hidden;
          background: #369AFE;
          box-shadow: 0px 2px 4px 0px rgba(28, 41, 90, 0.04);
        }
        span{
          position: absolute;
          padding: 15px;
          top: 50px;
          right: 100px;
          cursor: pointer;
          i{
            font-size: 20px;
            color: #fff;
          }
        }
      }

    }
  }
  .monitoring-warp{
    display: inline-block;
    margin-left: 15px;
    vertical-align: top;
    margin-right: 50px;
    .monitoring{
      width: 134px;
      height: 134px;
      background: #EBEBEB;
      border: 1px solid #369AFE;
      border-radius: 6px;
      overflow: hidden;
    }
    p{
      height: 42px;
      line-height: 42px;
      color: rgba(34, 42, 66, .8);
      font-size: 14px;
      text-align: center;
    }
  }
</style>
