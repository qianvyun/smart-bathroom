<template>
  <div class="daily-cleaning-container">
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="project-list">
          <project-list @handleProject="handleProject" />
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
                <img class="avatar" :src="row.avatar">
              </template>
            </el-table-column>
            <el-table-column label="时间" width="150px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="150px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.state | formatState(row.state) }}</span>
              </template>
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
  </div>
</template>

<script>
import { getDaily } from '@/api/daily'
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
  filters: {
    formatState(state) {
      let stateStr = ''
      switch (state) {
        case 1:
          stateStr = '正常'
          break;
        case 2:
          stateStr = '在线'
          break;
        case 3:
          stateStr = '离线'
          break;
        default:
          stateStr = '禁用'
          break;
      }
      return stateStr;
    }
  },
  // directives: { waves },
  data() {
    return {
      cleaner: Object.assign({}, cleanerDefault),
      currentProjectId: '',
      currentProject: '',
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
    ]),
    currentp() {
      return this.$store.getters.currentPageItem
    }
  },
  watch: {
    currentp(toilet) {
      this.currentProjectId = toilet.id;
      this.currentProject = toilet;
      this.getDailyList();
    }
  },
  created() {
    this.getDailyList();
  },
  methods: {
    handleProject(project) {
      this.currentProjectId = project.id;
      this.currentProject = project;
      this.getDailyList();
    },
    async getDailyList() {
      const requestData = {
        // username: this.userMassage.username,
        // mobile: this.userMassage.mobile,
        toiletId: this.currentProjectId,
        page: this.listQuery.page,
        limit: this.listQuery.limit
      }
      this.dailyList = []
      const res = await getDaily(requestData);
      this.dailyList = res.data ? res.data : []
      this.total = res.data.length;
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
  .avatar{
    width: 125px;
  }
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
