<template>
  <div class="permission-container">
    <div class="permission-container-warp">
      <div class="permission-container-header">
        <div class="title"><i class="icon icon-list" />用户列表</div>
        <div class="add-user">
          <el-button type="primary" @click="handleAddRole"><i class="icon icon-add" />添加用户</el-button>
        </div>
      </div>

      <el-table v-loading="listLoading" :data="usersList" height="calc(100vh - 260px)" style="width: 100%;margin-top:30px;" border>
        <el-table-column align="center" label="用户名称" width="200">
          <template slot-scope="scope">
            {{ scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户类型" width="180">
          <template slot-scope="scope">
            {{ userType(scope.row.userType) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="电话" width="220">
          <template slot-scope="scope">
            {{ scope.row.mobile }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary" class="edit" @click="handleEdit(scope)"><i class="icon el-icon-edit" />编辑</el-button>
            <el-button size="small" class="delete" @click="handleDelete(scope)"><i class="icon icon-delete" />删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total/listQuery.limit > 1" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getUsersList" />
    </div>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新增用户'" custom-class="create-dialpg" width="550px">
      <el-form :model="user" label-width="85px" label-position="right">
        <el-form-item label="用户名：">
          <el-input v-model="user.username" placeholder="用户名" :disabled="dialogType==='edit'" />
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-model="user.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-model="user.password" show-password placeholder="密码" />
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio-group v-model="user.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
            <el-radio label="4">保密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="user.email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="电话：">
          <el-input v-model="user.mobile" placeholder="电话" />
        </el-form-item>
        <el-form-item label="用户类别：">
          <el-radio-group v-model="user.userType">
            <el-radio label="0">管理员</el-radio>
            <el-radio label="1">普通用户</el-radio>
            <el-radio label="2">保洁</el-radio>
            <el-radio label="3">维修</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目：">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="projectList"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button plain @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getUsers, addUser, updateUser } from '@/api/role'
import Pagination from '@/components/Pagination'
import { fetchList } from '@/api/article'
import { mapGetters } from 'vuex'

const defaultUserMassage = {
  username: '',
  name: '',
  password: '',
  sex: '1',
  email: '',
  mobile: '',
  userType: '0',
  project: []
}

export default {
  components: { Pagination },
  data() {
    return {
      user: Object.assign({}, defaultUserMassage),
      listLoading: true,
      routes: [],
      usersList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      defaultProps: {
        children: 'toiletList',
        label: 'placeName'
      }
    }
  },
  computed: {
    ...mapGetters([
      'userMassage',
      'projectList'
    ])
    // routesData() {
    //   return this.routes
    // }
  },
  created() {
    // Mock: get all routes and roles list from server
    // this.getRoutes()
    this.getUsersList()
  },
  methods: {
    userType(type) {
      let typeName = '管理员';
      switch (type) {
        case '1':
          typeName = '普通用户';
          break;
        case '2':
          typeName = '保洁';
          break;
        case '3':
          typeName = '维修';
          break;
        default:
          typeName = '管理员';
          break;
      }
      return typeName;
    },
    // async getRoutes() {
    //   const res = await getRoutes()
    //   this.serviceRoutes = res.data
    //   this.routes = this.generateRoutes(res.data)
    // },
    async getUsersList() {
      const requestData = {
        username: this.userMassage.username,
        mobile: this.userMassage.mobile,
        page: this.listQuery.page,
        limit: this.listQuery.limit
      }
      this.listLoading = true;
      const res = await getUsers(requestData)
      this.listLoading = false;
      this.usersList = res.data.list;
      this.total = res.data.totalCount;
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    // generateRoutes(routes, basePath = '/') {
    //   const res = []
    //
    //   for (let route of routes) {
    //     // skip some route
    //     if (route.hidden) { continue }
    //
    //     const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
    //
    //     if (route.children && onlyOneShowingChild && !route.alwaysShow) {
    //       route = onlyOneShowingChild
    //     }
    //
    //     const data = {
    //       path: path.resolve(basePath, route.path),
    //       title: route.meta && route.meta.title
    //     }
    //
    //     // recursive child routes
    //     if (route.children) {
    //       data.children = this.generateRoutes(route.children, data.path)
    //     }
    //     res.push(data)
    //   }
    //   return res
    // },
    generateArr(projects) {
      let data = []
      projects.forEach(project => {
        data.push(project)
        if (project.toiletList) {
          const temp = this.generateArr(project.toiletList)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.user = Object.assign({}, defaultUserMassage)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.user = deepClone(scope.row)
      this.user.sex = this.user.sex.toString()
      this.user.userType = this.user.userType.toString()
      console.log(this.user)
      this.$nextTick(() => {
        // const projects = this.generateProjects(this.user.projects)
        this.$refs.tree.setCheckedNodes(this.generateArr(this.user.projects))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('是否确定删除用户？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          console.log('删除用户')
          //   await deleteUser(row.key)
        //   this.usersList.splice($index, 1)
        //   this.$message({
        //     type: 'success',
        //     message: '删除成功!'
        //   })
        })
        .catch(err => { console.error(err) })
    },
    // generateTree(routes, basePath = '/', checkedKeys) {
    //   const res = []
    //
    //   for (const route of routes) {
    //     const routePath = path.resolve(basePath, route.path)
    //
    //     // recursive child routes
    //     if (route.children) {
    //       route.children = this.generateTree(route.children, routePath, checkedKeys)
    //     }
    //
    //     if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
    //       res.push(route)
    //     }
    //   }
    //   return res
    // },
    generateTree(projects, checkedKeys) {
      const res = []

      for (const project of projects) {
        if (project.toiletList) {
          project.toiletList = this.generateTree(project.toiletList, checkedKeys)
        }

        if (checkedKeys.includes(project) || (project.toiletList && project.toiletList.length >= 1)) {
          res.push(project)
        }
      }
      return res
    },
    async confirmUser() {
      console.log('aaa')
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.user.project = this.generateTree(deepClone(this.projectList), checkedKeys)

      if (isEdit) {
        await updateUser(this.user.key, this.user)
        for (let index = 0; index < this.usersList.length; index++) {
          if (this.usersList[index].key === this.user.key) {
            this.usersList.splice(index, 1, Object.assign({}, this.user))
            break
          }
        }
      } else {
        const { data } = await addUser(this.user)

        console.log(data)
        this.user.key = data.key
        this.usersList.push(this.user)
      }

      const { username, name } = this.user
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>用户名: ${username}</div>
            <div>姓名: ${name}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>
<style lang="scss">
  .permission-container{
    .el-button--primary{
      background: #369AFE;
      border-color: #369AFE;
    }
    .cell .el-button{
      border-radius: 8px;
      &.delete{
        border-color: #ACC5FF;
        color: #2C6AF6;
        padding: 8px 15px;
      }
      i{
        display: inline-block;
        margin-top: -3px;
        margin-right: 5px;
        font-size: 16px;
        vertical-align: middle;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .permission-container{
    width: 100%;
    height: calc(100vh - 78px);
    padding: 25px;
    background: #F2F2F2;
    overflow: hidden;
    font-family: NotoSansCJKRegular;
    font-size: 14px;
    .permission-container-warp{
      background: #fff;
      border-radius: 6px;
      height: calc(100vh - 128px);
      padding: 0 40px;
    }
    .permission-container-header{
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
          font-size: 22px;
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
