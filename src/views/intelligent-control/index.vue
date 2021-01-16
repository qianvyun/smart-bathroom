<template>
  <div class="intelligent-control-container">
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="project-list">
          <project-list @handleProject="handleProject" /><!-- :projectData="projectList"-->
        </div>
      </el-col>
      <el-col :span="21">
        <div class="intelligent-control-content-warp">
          <div class="intelligent-control-content-heard">
            <div class="title"><i class="icon iconfont iconpassageway" />通道管理</div>
          </div>
          <template v-for="passageway of passagewayList">
            <div :key="passageway.id" class="intelligent-control-item">
              <el-row :gutter="15">
                <el-col :span="2">
                  <div class="item-name" @click="editName">{{ passageway.name }}</div>
                </el-col>
                <el-col :span="22">
                  <ul class="item-massage">
                    <li>电流：{{ passageway.current }}</li>
                    <li>电压：{{ passageway.voltage }}</li>
                    <li>控制开关：<el-switch v-model="passageway.state" /></li>
                  </ul>
                </el-col>
              </el-row>
            </div>
          </template>
        </div>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogVisible" title="修改名称" width="375px" custom-class="edit-name" center>
      <el-input v-model="input" placeholder="输入修改名称" />
      <div slot="footer">
        <el-button type="primary" plain @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmEditName">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ProjectList from '@/components/ProjectList/index'
export default {
  name: 'IntelligentControl',
  components: { ProjectList },
  data() {
    return {
      currentProjectId: '',
      currentProject: '',
      passagewayList: [
        { id: 'line1', name: '线路1', current: '2.3A', voltage: '220v', state: true },
        { id: 'line2', name: '线路2', current: '2.3A', voltage: '220v', state: true },
        { id: 'line3', name: '线路3', current: '2.3A', voltage: '220v', state: false },
        { id: 'line4', name: '线路4', current: '2.3A', voltage: '220v', state: true },
        { id: 'line5', name: '线路5', current: '2.3A', voltage: '220v', state: true },
        { id: 'line6', name: '线路6', current: '2.3A', voltage: '220v', state: false },
        { id: 'line7', name: '线路7', current: '2.3A', voltage: '220v', state: true },
        { id: 'line8', name: '线路8', current: '2.3A', voltage: '220v', state: true }
      ],
      dialogVisible: false
    }
  },
  methods: {
    handleProject(project) {
      this.currentProjectId = project.id;
      this.currentProject = project;
    },
    editName() {
      // todo 点击名称时的逻辑
      this.dialogVisible = true
    },
    confirmEditName() {
      // todo 修改名称的逻辑
    }
  }
}
</script>

<style lang="scss">
  .edit-name{
    .el-dialog__header{
      border-bottom: 1px solid #EFEFEF;
    }
    .el-dialog__title{
      font-size: 16px;
      color: #222A42;
      font-width: 600;
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

</style>
<style lang="scss" scoped>
  .intelligent-control-container{
    width: 100%;
    height: calc(100vh - 78px);
    padding: 25px;
    background: #F2F2F2;
    overflow: hidden;
    font-family: NotoSansCJKRegular;
    font-size: 14px;
  }
  .intelligent-control-content-warp{
    background: #fff;
    border-radius: 6px;
    height: calc(100vh - 128px);
    padding: 0 40px;
    .intelligent-control-content-heard{
      padding-top: 20px;
      height: 42px;
      .title{
        line-height: 22px;
        color: rgba(72, 83, 133, .8);
        vertical-align: middle;
        i{
          display: inline-block;
          margin-top: -3px;
          margin-right: 10px;
          font-size: 16px;
          color: #1E8BF8;
          line-height: 22px;
          vertical-align: middle;
        }
      }
    }
    .intelligent-control-item{
      padding-top: 20px;
      height: 70px;
      .item-name{
        width: 100%;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        border-radius: 6px;
        background: #1D8CF8;
        cursor: pointer;
      }
      .item-massage{
        width: 100%;
        height: 50px;
        line-height: 50px;
        color: #485385;
        border-radius: 6px;
        background: #F4FAFF;
        font-size: 0;
        li{
          display: inline-block;
          position: relative;
          width: 30%;
          font-size: 14px;
          padding-left: 15%;
          vertical-align: middle;
          &:before{
            content: '';
            display: block;
            position: absolute;
            left: 100px;
            top: 17px;
            width: 3px;
            height: 16px;
            background: #1D8CF8;
            border-radius: 1px;
          }
        }
      }
    }
  }
</style>

