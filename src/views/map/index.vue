<template>
  <div class="map">
    <div class="map-warp">
      <el-amap vid="amap" :zoom="zoom" :center="center" :events="mapEvents">
        <el-amap-marker v-for="(project) in placeList" :key="project.id" :content="content" :position="project.place" :events="markerEvents" :draggable="false" :vid="project.id" />
      </el-amap>
    </div>

    <div class="left-toolbar">
      <ul class="clear">
        <li class="toolbar-item sidebar" :class="{'is-active':isActiveHamburger}" @click="toggleClick">
          <i class="icon iconfont iconhamburger" />
        </li>
        <li class="toolbar-item alarm">
          <alarm-modal v-if="alarmData && !isHandleMapCoordinate" :visible="isShowAlarmModalVisible" :alarm-data="alarmData" @locationMassage="locationHandle" />
          <el-badge v-else :value="alarmNum" :max="99" class="item" style="width: 40px;height: 40px;">
            <i class="icon iconfont iconnotice" style="font-size: 28px;" />
          </el-badge>
        </li>
        <li class="toolbar-item" @click="overviewClick"><i class="icon iconfont iconoverview" /></li>
        <li class="toolbar-item add" :class="{'is-active':isHandleMapCoordinate}" @click="addBathroomClick"><i class="icon iconfont iconadd-to" /></li>
        <li class="toolbar-item add" :class="{'is-active':isHandleMarker}" @click="deleteBathroomClick"><i class="icon iconfont iconreduce" /></li>
        <li class="toolbar-item search">
          <!--          <i v-if="isShowSearch" class="icon iconfont iconsearch" />-->
          <header-search id="header-search" :is-show-ever="isShowSearch" class="right-menu-item" />
        </li>
      </ul>
    </div>
    <div class="right-toolbar">
      <ul class="clear">
        <li>
          <el-dropdown trigger="click" placement="bottom-start">
            <div class="right-toolbar-item address">
              <i class="icon iconfont iconlocation" />请选择<span class="arrow"><i class="icon iconfont icondown" /></span>
            </div>
            <el-dropdown-menu>
              <el-tree
                :data="projectData"
                :props="defaultProps"
                :highlight-current="true"
                :accordion="true"
                :default-expand-all="true"
                @node-click="handleNodeClick"
              />
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li><div class="right-toolbar-item full" @click="handleFullscreenClick"><i class="icon iconfont iconfull-screen" />全屏</div></li>
      </ul>
    </div>

    <el-dialog :fullscreen="true" :visible.sync="isShowControlCenterVisible" custom-class="control-center-modal">
      <control-center v-if="isShowControlCenterVisible" :toilet-details="toiletDetails" :toilet-name="currentToiletName" :close="gettimer" :before-close="beforeClose" />
    </el-dialog>

    <el-dialog :visible.sync="isShowOverviewVisible" :close-on-click-modal="false" :modal="false" width="430px" custom-class="overview-modal">
      <overview :city="center" :project="currentProject" />
    </el-dialog>

    <create-bathroom :place="coordinate" :is-show-add-bathroom-visible="isShowAddBathroomVisible" @close-create-model="closeCreateModel" />

  </div>
</template>

<script>
import controlCenter from './components/control-center/control-center';
import { mapGetters } from 'vuex'
import screenfull from 'screenfull'
import AlarmModal from '@/views/map/components/alarm-modal'
import Overview from '@/views/map/components/Overview/Overview'
import { getAlarmData, getToiletDetails, deleteToilet } from '@/api/map'
import { projectList } from '@/api/user'
import CreateBathroom from '@/views/map/components/create-bathroom'
import HeaderSearch from '@/components/HeaderSearch/index'

export default {
  components: { HeaderSearch, CreateBathroom, Overview, AlarmModal, controlCenter },
  data() {
    return {
      visible: false,
      isShowSearch: false,
      // 地图缩放等级
      zoom: 12,
      // 地图中心经纬度
      center: [103.82, 36.07],
      // 显示厕所智能控制中心
      isShowControlCenterVisible: false,
      // 控制中心数据
      toiletDetails: '',
      // 点击marker点的id
      currentToiletName: '',
      // 显示总览
      isShowOverviewVisible: false,
      // 显示告警信息
      isShowAlarmModalVisible: false,
      // 自定义图标
      content: `<div style="font-size: 32px; color: #EA4335"><i class="icon iconfont iconlocation" style="font-size: 22px" /></div>`,
      // 地图事件
      mapEvents: {
        // 初始化地图处理
        init: (o) => {
          // 自定义地图样式
          o.setMapStyle('amap://styles/9e782fce0426486d2d12da4333c40e67');
        },
        click: (m) => {
          if (this.isHandleMapCoordinate) {
            this.coordinate = m.lnglat.lng + ',' + m.lnglat.lat;
            this.isShowAddBathroomVisible = true;
          }
        }
      },
      // 点的事件
      markerEvents: {
        click: (e) => {
          // 没有全局概览
          if (!this.isHandleMapCoordinate && !this.isHandleMarker) {
            // e.target.w.vid 项目的id
            this.getToiletDetails(e.target.w.vid);
          }
          if (this.isHandleMarker) {
            this.deleteToilet(e.target.w.vid);
          }
        }
      },
      // 告警数量
      alarmNum: 0,
      alarmLoction: [],
      isActiveHamburger: true,
      // 项目数据
      projectData: [],
      // 树的默认数据
      defaultProps: {
        children: 'toilets',
        label: 'name'
      },
      // 所有厕所的集合
      placeList: [],
      // 当前项目
      currentToilet: '',
      // 告警信息
      alarmData: null,
      // 是否全屏
      isFullscreen: false,
      // 是否获取地图的坐标
      isHandleMapCoordinate: false,
      // 可以点击Marker
      isHandleMarker: false,
      // 获取的坐标
      coordinate: '',
      // 是否显示添加厕所界面
      isShowAddBathroomVisible: false,
      timer: '',
      // 总项目列表
      totalProjectList: [],
      currentProject: null
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'projectList'
    ]),
    currentp() {
      return this.$store.getters.currentPageItem
    }
  },
  watch: {
    currentp(toilet) {
      this.currentToilet = toilet;
      this.zoom = 16;
      this.setMapCenter(toilet);
      this.getCurrentProject(this.currentToilet.id);
    }
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    init() {
      this.$store.dispatch('settings/changeSetting', {
        key: 'navBar',
        value: false
      })
      this.$store.dispatch('app/closeSideBar', {
        key: 'sidebar'
      })
      if (screenfull.enabled) {
        screenfull.on('change', this.changeFullscreen)
      }
      this.projectData = JSON.parse(JSON.stringify(this.projectList));
      this.formatPlaceList(this.projectData);
      this.setMapCenter();
      this.getprojectList();
    },
    // 格式所有的厕所 平铺
    formatPlaceList(arr) {
      arr.forEach((item) => {
        if (item.toiletList && item.toiletList.length > 0) {
          this.formatPlaceList(item.toiletList)
          return;
        }
        item.place = item.place.split(',')
        this.placeList.push(item);
      })
    },
    // 设置地图的中心
    setMapCenter(project) {
      if (!project) {
        project = this.projectData[0]
      }
      if (typeof project.place === 'string') {
        this.center = project.place.split(',');
      } else {
        this.center = project.place;
      }
      this.currentToilet = project;
      this.getAlarmData();
    },
    // 显示隐藏菜单
    toggleClick() {
      if (!this.isHandleMapCoordinate) {
        this.isActiveHamburger = !this.isActiveHamburger;
        this.$store.dispatch('app/toggleSideBar')
      }
    },
    // 显示概览
    overviewClick() {
      this.isShowOverviewVisible = true;
    },
    // 添加厕所
    addBathroomClick() {
      this.isHandleMapCoordinate = !this.isHandleMapCoordinate;
    },
    // 删除厕所
    deleteBathroomClick() {
      this.isHandleMarker = !this.isHandleMarker
    },
    closeCreateModel(data) {
      this.isHandleMapCoordinate = data
      this.isShowAddBathroomVisible = data
    },
    // 获取告警数据
    async getAlarmData() {
      const requestData = {
        toiletId: this.currentToilet.id
        // operationTypeList: [3]
      }
      const res = await getAlarmData(requestData);
      this.alarmData = res.data;
      this.alarmNum = this.alarmData.list.length;
    },
    // 获取厕所详细信息
    async getToiletDetails(id) {
      const requestData = {
        toiletId: id
      }
      const res = await getToiletDetails(requestData);
      this.toiletDetails = res.data.data;
      if (this.toiletDetails) {
        for (let i = 0; i < this.projectData.length; i++) {
          if (this.projectData[i].id === id) {
            // 根据点击“点”的id获取项目名称
            this.currentToiletName = this.projectData[i].placeName;
          }
        }
        // 显示控制中心
        this.isShowControlCenterVisible = true;
      } else {
        this.$message({
          message: '没有该厕所的详情数据',
          type: 'warning'
        })
        return false
      }
    },
    async getprojectList() {
      const res = await projectList()
      this.totalProjectList = res.data ? res.data : [];
      this.getCurrentProject(this.currentToilet.id);
    },
    getCurrentProject(toiletId) {
      for (let i = 0; i < this.totalProjectList.length; i++) {
        const project = this.totalProjectList[i];
        for (let j = 0; j < project.toilets.length; j++) {
          const toilet = project.toilets[j];
          if (toilet.id === toiletId) {
            this.currentProject = project
            break;
          }
        }
        if (this.currentProject.id === project.id) {
          break
        }
      }
    },
    deleteToilet(id) {
      const requestData = {
        id: id
      }
      this.$store.dispatch('user/getProjectList');
      this.$confirm('此操作将删除厕所, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // return new Promise((resolve, reject) => {
        deleteToilet(requestData).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.isHandleMarker = false;
          for (let i = 0; i < this.placeList.length; i++) {
            if (this.placeList[i].id === id) {
              this.placeList.splice(i, 1);
              break;
            }
          }
          for (let i = 0; i < this.projectData.length; i++) {
            if (this.projectData[i].id === id) {
              this.projectData.splice(i, 1);
              break;
            }
          }
          this.$store.dispatch('user/getProjectList');
        }).catch(error => {
          this.$message({
            type: 'success',
            message: error
          });
        })
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // toggleSideBar() {
    //   this.$store.dispatch('app/toggleSideBar')
    // },
    locationHandle(val) {
      this.alarmLoction = val;
    },
    handleNodeClick(data) {
      this.setMapCenter(data);
    },
    handleFullscreenClick() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    changeFullscreen() {
      this.isFullscreen = screenfull.isFullscreen
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.changeFullscreen)
      }
    },
    gettimer(data) {
      this.timer = data
    },
    beforeClose() {
      clearInterval(this.timer)
    }
    // processingHandle(val) {
    //   this.alarmProcessing = val;
    //   this.alarmProcessingVisible = !!this.alarmProcessing
    // },
    // changeProcessingVisible(val) {
    //   this.alarmProcessingVisible = val;
    // }
  },
  beforeRouteLeave(to, from, next) {
    // this.targetName = to.name  // 提示框点击确认后跳转的 路由
    // if (this.checkEdit()) { // 是否对页面进行了编辑
    //   this.dialogVisible = true    // 打开离开页面的提示框
    //   next(false)
    // } else {
    //   this.dialogVisible = false
    //   next()
    // }
    this.$store.dispatch('settings/changeSetting', {
      key: 'navBar',
      value: true
    })
    next();
  }

}
</script>
<style lang="scss">
  .map{
    .el-dialog__wrapper{
      z-index: 5000 !important;
    }
    .control-center-modal>div {
      padding: 0;

      .el-dialog__headerbtn {
        z-index: 9999;
      }
    }
    /*.right-toolbar{
      .el-tree{
        color: rgba(29, 140, 248, .8);
        padding-right: 10px;
        background: rgba(247, 251, 255, 1);
        border-radius: 6px;
      }
      .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
        color: rgba(29, 140, 248, 1);
        background: transparent;
      }
    }*/
  }
  .amap-logo{
    display: none;
    opacity:0 !important;
  }
  .amap-copyright {
    opacity:0;
  }
  .el-dropdown-menu{
    .el-tree{
      color: rgba(29, 140, 248, .8);
      padding-right: 10px;
      background: rgba(247, 251, 255, 1);
      border-radius: 6px;
    }
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
      color: rgba(29, 140, 248, 1);
      background: transparent;
    }
    &.el-popper{
      margin-top: 0;
    }
    .popper__arrow{
      display: none;
    }
  }
  .item{
    .el-badge__content{
      background: #EC1B32;
      font-size: 10px;
      font-weight: lighter;
      padding: 0 2px;
    }
  }
  .overview-modal {
    .el-dialog__header{
      padding: 0;
      .el-dialog__headerbtn{
        z-index: 5000;
      }
    }
    .el-dialog__body{
      padding: 0;
      .el-tabs.el-tabs--left.el-tabs--border-card{
        margin-left: -35px;
        border: none;
        background: transparent;
        .el-tabs__header{
          border-bottom: none;
          margin-right: 0;
          background: transparent;
        }
        .el-tabs__nav-wrap.is-left{
          padding: 0;
          &>.el-tabs__nav-prev,&>.el-tabs__nav-next{
            display: none;
          }

          .el-tabs__item{
            width: 36px;
            padding: 12px;
            text-align: center;
            line-height: 14px;
            font-size: 12px;
            font-family: NotoSansCJKRegular;
            color: #222A42;
            writing-mode: vertical-lr;
            margin-bottom: 2px;
            margin-left: 0;
            border-radius: 6px 0 0 6px;
            /*background-color: #EEEEEE;*/
            background: -moz-linear-gradient(
                left,
                #cbcbcf 0%,
                #eeeeee 100%
            );
            background: -webkit-gradient(
                linear,
                left bottom,
                right bottom,
                color-stop(0% #cbcbcf),
                color-stop(100%, #eeeeee)
            );
            background: -webkit-linear-gradient(
                left,
                #cbcbcf 0%,
                #eeeeee 100%
            );
            background: -o-linear-gradient(
                left,
                #cbcbcf 0%,
                #eeeeee 100%
            );
            background: -ms-linear-gradient(
                left,
                #cbcbcf 0%,
                #eeeeee 100%
            );
            background: linear-gradient(
                to left,
                #cbcbcf 0%,
                #eeeeee 100%
            );
            &.is-active{
              background: #FFFFFF;
            }
            &:nth-of-type(1){
              height: 80px;
            }
            &:nth-of-type(2){
              height: 87px;
            }
            &:nth-of-type(3){
              height: 60px;
            }
            &:nth-of-type(4){
              height: 103px;
            }
            &:nth-of-type(5){
              height: 80px;
              margin-bottom: 0;
            }
          }
        }
      }
      .el-tabs__content{
        padding: 0;
        .el-tab-pane{
          width: 430px;
          height: 412px;
        }
      }

    }
  }
  .toolbar-item.search{
    display: inline-block;
    width: auto !important;
    .header-search{
      height: 40px;
      line-height: 40px;
      border: none;
      padding: 0 8px;
      &.show .header-search-select {
        margin-top: -20px;
      }
      i{
        font-size: 24px;
        color: #1D8CF8;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .map {
    position: relative;
    .map-warp{
      width: 100%;
      height: 100vh;
    }
    .left-toolbar{
      position: absolute;
      left: 40px;
      top: 22px;
      .toolbar-item{
        position: relative;
        margin-right: 20px !important;
        float: left;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 6px;
        background: #E5E8E9;
        cursor: pointer;
        i{
          line-height: 40px;
          font-size: 24px;
          color: #1D8CF8;
        }
      }
      .sidebar.is-active {
        transform: rotate(180deg);
      }
      .add.is-active{
        background: #1D8CF8;
        i{
          color: #E5E8E9;
        }
      }
    }
    .right-toolbar{
      position: absolute;
      right: 45px;
      top: 22px;
      li{
        float: left;
        margin-left: 25px;
        .right-toolbar-item{
          position: relative;
          width: 100px;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          text-align: center;
          color: rgba(29, 140, 248, 1);
          border-radius: 6px;
          background-color: rgba(255, 255, 255, .85);
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
          vertical-align: middle;
          cursor: pointer;
          i{
            margin-right: 8px;
            vertical-align: middle;
            font-size: 18px;
          }
          &.address{
            width: 108px;
            padding: 0 15px;
            text-align: left;
            z-index: 2300;
            .iconlocation{
              font-size: 14px;
              margin-right: 5px;
            }
            .arrow{
              position: absolute;
              right: 15px;
              top: 0;
              i{
                font-size: 10px;
                color: #737EAC;
                margin-right: 0;
              }
            }
          }
        }
      }
    }
  }
</style>
