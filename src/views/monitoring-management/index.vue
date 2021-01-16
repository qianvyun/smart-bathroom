<template>
  <div class="monitoring-management-container">
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="project-list">
          <project-list @handleProject="handleProject" />
        </div>
      </el-col>
      <el-col :span="21">
        <div class="monitoring-management-content-warp">
          <div class="monitoring-management-content-heard">
            <div class="title"><i class="icon iconfont iconmonitor" />监控管理</div>
            <div class="add-monitor">
              <el-button type="primary" :disabled="queryMonitorList.length===0" @click="handleAddMonitor">
                <i class="icon iconfont iconadd" />添加监控
              </el-button>
            </div>
          </div>
          <div class="monitoring-management-content">
            <ul>
              <template v-for="monitor of showMonitorList">
                <li :key="monitor">
                  <div class="monitoring">
                    <!--监控内容-->
                    <monitor-player :url="monitor" />
                  </div>
                  <span @click="delMonitor(monitor)"><i class="icon iconfont icondelete" /></span><!--{{ monitor.deviceName }}-->
                </li>
              </template>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible" title="添加监控" width="460px" custom-class="create-dialog">
      <el-checkbox-group v-model="monitorCheckList">
        <ul class="dialog-monitor">
          <template v-for="monitor of queryMonitorList">
            <li :key="monitor.hls">
              <el-checkbox :label="monitor.hls" />
              <div class="monitoring-warp">
                <div class="monitoring">
                  <img :src="monitor.coverUrl" alt="">
                </div>
                <!-- <p>{{ monitor.name }}</p>-->
              </div>
            </li>
          </template>
        </ul>
      </el-checkbox-group>
      <div slot="footer">
        <el-button type="primary" plain @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmMonitor">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ProjectList from '@/components/ProjectList/index'
import { getLiveList, updateLives, delLives } from '@/api/monitor'
import MonitorPlayer from '@/components/hls/index'
import { getToiletInfo } from '@/api/map'
export default {
  name: 'MonitoringManagement',
  components: { MonitorPlayer, ProjectList },
  data() {
    return {
      // 当前项目的id
      currentProjectId: '',
      currentProject: null,
      dialogVisible: false,
      // src: 'https://cmgw-vpc.lechange.com:8890/LCO/6F0F566YAZ63C1C/0/1/20201119T084206/e52f22b6bf7ccb734fd26aff3ca7c78e.m3u8?proto=https',
      // 展示的监控
      showMonitorList: [],
      allMonitorList: [],
      // 当前项目的所有监控
      monitorCheckList: []
    }
  },
  computed: {
    // monitorValue(url) {
    //   return `src=${url}&streamType=vod&autoPlay=false&controlBarAutoHide=true&controlBarPosition=bottom`
    // }
    // 当前项目的所有监控
    queryMonitorList() {
      const [currentToilet] = this.allMonitorList.filter(item => item.id === this.currentProjectId);
      const monitorList = [];
      if (currentToilet) {
        currentToilet.lives.forEach(item => {
          monitorList.push(item.streams[0]);
        })
      }
      return monitorList;
    },
    currentp() {
      return this.$store.getters.currentPageItem
    }
  },
  watch: {
    currentp(toilet) {
      this.currentProjectId = toilet.id;
      this.currentProject = toilet;
      this.getToiletMonitor(this.currentProjectId);
    }
  },
  created() {
    this.getMonitorList();
  },
  mounted() {
    this.getToiletMonitor(this.currentProjectId);
  },
  methods: {
    handleAddMonitor() {
      this.dialogVisible = true
    },
    async confirmMonitor() {
      if (!this.monitorCheckList || this.monitorCheckList.length === 0) {
        this.$message.error('请选择监控！');
        return;
      }
      if (this.monitorCheckList.length > 4) {
        this.$message.error('不能超过4个');
        return;
      }
      if (JSON.stringify(this.monitorCheckList) === JSON.stringify(this.showMonitorList)) {
        this.$message.error('选择监控没有变化，请重新选择');
        return;
      }
      for (let i = 0; i < this.showMonitorList.length; i++) {
        await this.delMonitor(this.showMonitorList[i], false);
      }
      const requestData = {
        id: this.currentProjectId,
        livesUrl: this.monitorCheckList
      }
      await updateLives(requestData);
      await this.getToiletMonitor(this.currentProjectId);
      this.dialogVisible = false;
    },
    async getToiletMonitor(id) {
      const requestData = {
        id: id
      }
      const data = await getToiletInfo(requestData);
      this.showMonitorList = data.data.livesUrl;
    },
    handleProject(project) {
      this.currentProjectId = project.id;
      this.currentProject = project;
      this.getToiletMonitor(this.currentProjectId);
    },
    async getMonitorList() {
      // const requestData = {
      //   toiletId: id
      // }
      const res = await getLiveList();
      this.allMonitorList = res.data;
    },
    async delMonitor(url, notify = true) {
      const requestData = {
        id: this.currentProjectId,
        liveUrl: url
      }
      await delLives(requestData);
      for (let i = 0; i < this.showMonitorList.length; i++) {
        if (this.showMonitorList[i] === url) {
          this.showMonitorList.splice(i, 1)
        }
      }
      if (notify) {
        this.$notify({
          title: '监控删除成功！',
          dangerouslyUseHTMLString: true,
          type: 'success'
        });
      }
    }
  }
}
</script>
<style lang="scss">
  .monitoring-management-container{
    .create-dialog{
      .el-dialog__header{
        font-size: 16px;
        color: #222A42;
        font-width: 600;
        text-align: center;
        border-bottom: 1px solid #EFEFEF;
      }
      .el-dialog__body{
        padding: 30px 40px;
      }
      .el-button {
        width: 64px;
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        border-radius: 8px;
        text-align: center;
        padding: 0;
        vertical-align: middle;

        &.is-plain {
          background: #AEC3F2;
          border-color: #AEC3F2;
          color: #fff;

          &:hover {
            background: #2C6AF6;
          }
        }

        & + .el-button {
          margin-left: 16px;
        }
      }
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
      /*width: 800px;*/
      li{
        float: left;
        position: relative;
        .monitoring{
          width: 400px;
          height: 300px;
          margin-top: 50px;
          margin-right: 100px;
          border-radius: 10px;
          overflow: hidden;
          background: #369AFE;
          box-shadow: 0px 2px 4px 0px rgba(28, 41, 90, 0.04);
          > img{
            width: 100%;
          }
        }
        &:nth-of-type(2n) .monitoring{
          margin-right: 0;
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
      > img{
        width: 100%;
        height: 100%;
      }
    }
    p{
      height: 42px;
      line-height: 42px;
      color: rgba(34, 42, 66, .8);
      font-size: 14px;
      text-align: center;
    }
  }
  .dialog-monitor{
    li{
      display: inline-block;
      margin-bottom: 30px;
      &:nth-of-type(2n) .monitoring-warp{
        margin-right: 0;
      }
    }
  }
</style>
