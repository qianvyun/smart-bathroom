<template>
  <div class="intelligent-control-container">
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="project-list">
          <project-list /><!-- :projectData="projectList"-->
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
                  <div class="item-name">{{ passageway.name }}</div>
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
  </div>
</template>

<script>
import ProjectList from '@/components/ProjectList/index'
export default {
  name: 'IntelligentControl',
  components: { ProjectList },
  data() {
    return {
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
      passagewayList: [
        { id: 'line1', name: '线路1', current: '2.3A', voltage: '220v', state: true },
        { id: 'line2', name: '线路2', current: '2.3A', voltage: '220v', state: true },
        { id: 'line3', name: '线路3', current: '2.3A', voltage: '220v', state: false },
        { id: 'line4', name: '线路4', current: '2.3A', voltage: '220v', state: true },
        { id: 'line5', name: '线路5', current: '2.3A', voltage: '220v', state: true },
        { id: 'line6', name: '线路6', current: '2.3A', voltage: '220v', state: false },
        { id: 'line7', name: '线路7', current: '2.3A', voltage: '220v', state: true },
        { id: 'line8', name: '线路8', current: '2.3A', voltage: '220v', state: true }
      ]
    }
  }
}
</script>

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

