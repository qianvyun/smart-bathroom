<template>
  <el-popover
    v-model="modalVisible"
    placement="bottom-start"
    width="736"
    :visible-arrow="false"
    popper-class="alarm-warp"
  >
    <div class="close" @click="modalVisible = false"><i class="icon">×</i></div>
    <div class="alarm-modal-heard">
      <i class="icon icon-alarm" />告警信息
    </div>
    <div class="alarm-table-warp">
      <el-table
        :data="tableData"
        height="320"
        border
        header-cell-class-name="alarm-table-heard"
        cell-class-name="alarm-table-cell"
        style="width: 100%"
      >
        <template
          v-for="col of defaultCol"
        >
          <el-table-column
            v-if="col.porp === 'pic'"
            :key="col.porp"
            :prop="col.porp"
            :label="col.lable"
            :width="col.width"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
              <img v-if="scope.row.imgFile" class="image" :src="scope.row.pic">
              <span v-if="!scope.row.imgFile">暂无图片</span>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="col.porp"
            :prop="col.porp"
            :label="col.lable"
            :width="col.width"
            :resizable="false"
            align="center"
          />
        </template>
        <el-table-column label="操作" :resizable="false" align="center" class-name="process">
          <template slot-scope="scope">
            <el-button type="primary" @click.native.prevent="locationHandle(scope.row)"><i class="icon icon-location" />定位</el-button>
            <el-button type="danger" @click.native.prevent="deleteAlarm(scope.$index,scope.row)"><i class="icon icon-delete" />删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="alarm-modal-footer">
      <el-button type="primary" plain @click="modalVisible = false">取消</el-button>
      <el-button type="primary" @click="modalVisible = false">确定</el-button>
    </div>
    <el-badge slot="reference" :value="alarmNum" :max="99" class="item">
      <i class="icon icon-notice" />
    </el-badge>
  </el-popover>
</template>

<script>
import { deleteAlarm } from '@/api/map'
export default {
  name: 'AlarmModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    alarmData: {
      type: Object || null,
      required: true
    }
  },
  data() {
    return {
      modalVisible: this.visible,
      defaultCol: [
        {
          porp: 'toiletId',
          lable: 'ID',
          width: 60
        },
        {
          porp: 'deviceName',
          lable: '厕所名称',
          width: 90
        },
        {
          porp: 'operationValue',
          lable: '告警类型',
          width: 90
        },
        {
          porp: 'createtime',
          lable: '告警时间',
          width: 90
        },
        {
          porp: 'address',
          lable: '地址',
          width: 120
        },
        {
          porp: 'imgFile',
          lable: '图片',
          width: 120
        }
      ],
      tableData: null,
      alarmNum: 0
      // atableData: [{
      //   id: '206',
      //   name: '仙林1号',
      //   type: '缺纸',
      //   time: '2020/08/14 14:00:23',
      //   address: '江苏省南京市玄武区中山东路189号',
      //   pic: require(`../../../assets/images/pic.jpeg`)
      // },
      // {
      //   id: '206',
      //   name: '仙林1号',
      //   type: 'this.alarmData缺纸',
      //   time: '2020/08/14 14:00:23',
      //   address: '江苏省南京市玄武区中山东路189号',
      //   pic: require(`../../../assets/images/pic.jpeg`)
      // },
      // {
      //   id: '206',
      //   name: '仙林1号',
      //   type: '缺纸',
      //   time: '2020/08/14 14:00:23',
      //   address: '江苏省南京市玄武区中山东路189号',
      //   pic: require(`../../../assets/images/pic.jpeg`)
      // },
      // {
      //   id: '206',
      //   name: '仙林1号',
      //   type: '缺纸',
      //   time: '2020/08/14 14:00:23',
      //   address: '江苏省南京市玄武区中山东路189号',
      //   pic: require(`../../../assets/images/pic.jpeg`)
      // }]
    }
  },
  created() {
    this.formatAlarmData();
  },
  methods: {
    formatAlarmData() {
      this.alarmNum = this.alarmData.list.length;
      this.tableData = JSON.parse(JSON.stringify(this.alarmData.list));
    },
    locationHandle(row) {
      this.$emit('locationMassage', row);
    },
    deleteAlarm(index, row) {
      const requestData = {
        toiletId: row.id
      }
      deleteAlarm(requestData).then(res => {
        if (res.msg === 'success') {
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].id === row.id) {
              this.tableData.splice(i, 1);
              break;
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .alarm-warp{
    padding: 0 28px !important;
    .alarm-modal-footer{
      .el-button{
        width: 64px;
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        border-radius: 8px;
        text-align: center;
        padding: 0;
        vertical-align: middle;
        &.is-plain{
          background: #AEC3F2;
          border-color: #AEC3F2;
          color: #fff;
          &:hover{
            background: #2C6AF6;
          }
        }
        &+.el-button{
          margin-left: 16px;
        }
      }
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
  .alarm-table-warp {
    .alarm-table-cell {
      &.process {
        .el-button {
          width: 64px;
          height: 28px;
          font-size: 12px;
          line-height: 28px;
          text-align: center;
          margin-bottom: 15px;
          padding: 0;
          border-radius: 8px;
          vertical-align: middle;

          &.is-plain {
            border-color: #AEC3F2;
            background: #AEC3F2;
          }

          i {
            margin-right: 5px;
          }

          &:last-child {
            margin-bottom: 0;
          }

          & + .el-button {
            margin-left: 0;
          }
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  .alarm-warp{
    position: relative;

    .close{
      position: absolute;
      right: 16px;
      top: 10px;
      color: rgba(236, 37, 13, .5);
      cursor: pointer;
      i{
        font-size: 26px;
      }
    }
    .alarm-modal-heard{
      height: 52px;
      line-height: 52px;
      color: #222A42;
      font-size: 14px;
      font-family: NotoSansCJKRegular;
      .icon-alarm{
        color: #F69286;
        margin-right: 10px;
      }
    }
    .alarm-modal-footer{
      padding: 9px 0;
      text-align: right;
    }
  }
  .item{
    width: 40px;
    height: 40px;
    i{
      line-height: 40px;
      font-size: 28px;
      color: #1D8CF8;
    }
  }
  .alarm-table-warp{
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #EFEFEF;
    .image{
      width: 95px;
      height: 105px;
    }
  }
</style>

