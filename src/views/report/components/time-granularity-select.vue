<template>
  <div class="granularity-select">
    <el-select v-model="value" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'TimeGranularitySelect',
  data() {
    return {
      options: [{
        value: 'year',
        label: '年统计'
      },
      {
        value: 'month',
        label: '月统计'
      },
      {
        value: 'day',
        label: '日统计'
      }],
      value: 'year'
    }
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$emit('granularity', newValue);
      }
    }
  }
}
</script>

<style lang="scss">
  .granularity-select{
    .el-input--medium{
      font-size: 12px;
      color: #636E95;
      .el-input__inner{
        line-height: 26px;
        height: 26px;
        background: #FAFCFE;
        border-radius: 21px;
        border-color: #97A0C3;
      }
      .el-input__icon{
        line-height: 26px;
      }
    }
    .el-select .el-input .el-select__caret{
      font-size: 10px;
      color: #7C88B1;
    }
  }
  .el-select-dropdown__item{
    font-size: 12px;
  }
  .el-popper[x-placement^=bottom]{
    margin-top: 0;
    .popper__arrow{
      display: none;
    }
  }
</style>
