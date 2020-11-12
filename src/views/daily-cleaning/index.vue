<template>
  <div class="daily-cleaning-container">
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="project-list">
          <project-list /><!--:projectData="projectList"-->
        </div>
      </el-col>
      <el-col :span="21">
        <div class="daily-cleaning-container-warp">
          <div class="daily-cleaning-container-header">
            <div class="title"><i class="icon iconfont iconclear-list" />保洁员列表</div>
            <!--<div class="add-user">
              <el-button type="primary" @click="handleAddCleaner"><i class="icon icon-add" />添加保洁员</el-button>
            </div>-->
          </div>
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="dailyList"
            height="calc(100vh - 260px)"
            border
            fit
            highlight-current-row
            style="width: 100%;margin-top:30px;"
          >
            <el-table-column label="姓名" prop="id" align="center" width="150px">
              <template slot-scope="{row}">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="照片" width="150px" align="center">
              <template slot-scope="{row}">
                <img :src="row.avatar" />
              </template>
            </el-table-column>
            <el-table-column label="时间" width="150px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="150px" align="center">
              <!--<template slot-scope="{row}">
                <span>{{ row.state | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </template>-->
            </el-table-column>
            <el-table-column label="联系方式" align="center">
              <template slot-scope="{row}">
                <span>{{ row.mobile }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total/listQuery.limit > 1" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getDailyList" />
        </div>
      </el-col>
    </el-row>

    <!--<el-dialog :visible.sync="dialogVisible" title="新增保洁员" custom-class="create-dialpg">
      <el-form :model="cleaner" label-width="85px" label-position="right">
        <el-form-item label="照片：">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="cleaner.imageUrl" :src="cleaner.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-model="cleaner.name" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio-group v-model="cleaner.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话：">
          <el-input v-model="cleaner.mobile" placeholder="电话" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button plain @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCleaner">确定</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
import { getDaily } from '@/api/daily'
// import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import ProjectList from '@/components/ProjectList/index'
const cleanerDefault = {
  name: '',
  sex: '1',
  mobile: '',
  photo: ''
}
export default {
  name: 'DailyCleaning',
  components: { ProjectList, Pagination },
  // directives: { waves },
  data() {
    return {
      cleaner: Object.assign({}, cleanerDefault),
      // projectList: [
      //   {
      //     id: '111',
      //     name: '項目1'
      //   },
      //   {
      //     id: '222',
      //     name: '項目1'
      //   },
      //   {
      //     id: '333',
      //     name: '項目1'
      //   }
      // ],
      imageUrl: '',
      tableKey: 0,
      dailyList: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'userMassage'
    ])
  },
  created() {
    this.getDailyList()
  },
  methods: {
    async getDailyList() {
      const requestData = {
        username: this.userMassage.username,
        mobile: this.userMassage.mobile,
        page: this.listQuery.page,
        limit: this.listQuery.limit
      }
      const res = await getDaily(requestData);
      console.log(res)
      this.dailyList = res.data;
      console.log(this.dailyList)
      this.total = res.data.totalCount;
    },
    handleAddCleaner() {
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    confirmCleaner() {
      console.log('新增保洁')
    }
  }
}
</script>
<style lang="scss">
  .daily-cleaning-container{
    .el-button--primary{
      background: #369AFE;
      border-color: #369AFE;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 145px;
      height: 145px;
      line-height: 145px;
      text-align: center;
    }
    .avatar {
      width: 145px;
      height: 145px;
      display: block;
    }
  }
</style>
<style lang="scss" scoped>
  .daily-cleaning-container{
    width: 100%;
    height: calc(100vh - 78px);
    padding: 25px;
    background: #F2F2F2;
    overflow: hidden;
    font-family: NotoSansCJKRegular;
    font-size: 14px;
    .daily-cleaning-container-warp{
      background: #fff;
      border-radius: 6px;
      height: calc(100vh - 128px);
      padding: 0 40px;
    }
    .daily-cleaning-container-header{
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
      .add-user{
        position: absolute;
        top: 20px;
        right: 20px;
        i{
          margin-right: 5px;
        }
      }
    }
  }
</style>
