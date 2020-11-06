<template>
  <el-dialog :visible.sync="dialogVisible" title="新增厕所" :before-close="beforeCloseHandle" custom-class="create-dialog" width="550px"><!---->
    <el-form :model="createBathroom" label-width="120px" label-position="right">
      <el-form-item label="厕所坐标：">
        <el-input v-model="createBathroom.place" placeholder="坐标" disabled />
      </el-form-item>
      <el-form-item label="厕所名称：">
        <el-input v-model="createBathroom.placeName" placeholder="厕所名称" />
      </el-form-item>
      <el-form-item label="男厕马桶总数：">
        <el-input v-model="createBathroom.manToiletCount" placeholder="男厕所马桶数量" />
      </el-form-item>
      <el-form-item label="女厕马桶总数：">
        <el-input v-model="createBathroom.womanToiletCount" placeholder="女厕所马桶数量" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button plain @click="cancelCreateBathroom">取消</el-button>
      <el-button type="primary" @click="confirmBathroom">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addToilet } from '@/api/map'
import store from '@/store'

const defaultBathroomMassage = {
  place: '',
  placeName: '',
  manToiletCount: '',
  womanToiletCount: ''
}
export default {
  name: 'CreateBathroom',
  props: {
    place: {
      type: String,
      required: true
    },
    isShowAddBathroomVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    defaultBathroomMassage.place = this.place;
    return {
      createBathroom: Object.assign({}, defaultBathroomMassage),
      dialogVisible: this.isShowAddBathroomVisible
    }
  },
  watch: {
    place: function(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.createBathroom.place = newValue
      }
    },
    isShowAddBathroomVisible: function(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.dialogVisible = newValue;
      }
    }
  },
  created() {
  },
  methods: {
    async confirmBathroom() {
      await addToilet(this.createBathroom)
      await store.dispatch('user/getInfo')
      this.dialogVisible = false
      this.$emit('close-create-model', false)
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
          <div>${this.createBathroom.placeName}创建成功</div>
        `,
        type: 'success'
      })
    },
    cancelCreateBathroom() {
      this.dialogVisible = false
      this.$emit('close-create-model', false)
    },
    beforeCloseHandle(done) {
      // this.isShowAddBathroomVisible = false;
      this.$emit('close-create-model', false)
      done()
    }
  }
}
</script>

<style scoped>

</style>
