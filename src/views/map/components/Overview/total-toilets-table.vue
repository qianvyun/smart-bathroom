<template>
  <el-table
    :data="atableData"
    height="272"
    border
    header-cell-class-name="alarm-table-heard"
    cell-class-name="alarm-table-cell"
    style="width: 100%">
    <template
      v-for="col of defaultCol">
      <el-table-column
        :prop="col.porp"
        :label="col.lable"
        :width="col.width"
        :key="col.porp"
        :resizable="false"
        align="center">
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
export default {
  name: 'TotalToiletsTable',
  data() {
    return {
      defaultCol: [
        {
          porp: 'name',
          lable: '厕所名称',
          width: 95
        },
        {
          porp: 'address',
          lable: '项目位置'
        }
      ],
      atableData: [{
        name: '仙林1号',
        address: '江苏省南京市玄武区中山东路189号'
      },
      {
        name: '仙林1号',
        address: '江苏省南京市玄武区中山东路189号'
      },
      {
        name: '仙林1号',
        address: '江苏省南京市玄武区中山东路189号'
      }]
    }
  }
}
</script>

