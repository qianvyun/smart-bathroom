<template>
  <el-table
    :data="tableData"
    height="320"
    border
    header-cell-class-name="alarm-table-heard"
    cell-class-name="alarm-table-cell"
    style="width: 100%"
  >
    <template v-for="col of defaultCol">
      <el-table-column
        :key="col.porp"
        :prop="col.porp"
        :label="col.lable"
        :width="col.width"
        :resizable="false"
        align="center"
      />
    </template>
  </el-table>
</template>

<script>
export default {
  name: 'TotalToiletsTable',
  props: {
    dataList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      defaultCol: [
        {
          porp: 'name',
          lable: '厕所名称',
          width: 110
        },
        {
          porp: 'address',
          lable: '项目位置'
        }
      ],
      // tableData: [{
      //   name: '仙林1号',
      //   address: '江苏省南京市玄武区中山东路189号'
      // },
      // {
      //   name: '仙林1号',
      //   address: '江苏省南京市玄武区中山东路189号'
      // },
      // {
      //   name: '仙林1号',
      //   address: '江苏省南京市玄武区中山东路189号'
      // }]
      tableData: this.dataList
    }
  },
  watch: {
    dataList(newVal) {
      if (newVal) {
        this.tableData = newVal
      }
    }
  }
}
</script>

