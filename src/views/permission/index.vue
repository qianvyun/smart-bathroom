<template>
  <div class="permission-container">
    <div class="permission-container-warp">
      <div class="permission-container-header">
        <div class="title"><i class="icon iconfont iconlist" />用户列表</div>
        <div class="add-user">
          <el-button type="primary" @click="handleAddRole"><i class="icon iconfont iconadd" />添加用户</el-button>
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
            <el-button size="small" type="primary" class="edit" @click="handleEdit(scope)">
              <i class="icon el-icon-edit" />编辑
            </el-button>
            <el-button size="small" class="delete" @click="handleDelete(scope)"><i class="icon iconfont icondelete" />删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total/listQuery.limit > 1" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getUsersList" />
    </div>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新增用户'" custom-class="create-dialpg" width="550px">
      <el-form :model="user" :rules="rules" label-width="85px" label-position="right">
        <el-form-item>
          <el-upload
            class="avatar-uploader"
            :action="avatarUploadUrl"
            :headers="avatarObject"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="user.avatar" :src="user.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="user.username" placeholder="用户名" :disabled="dialogType==='edit'" />
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
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
          <el-input v-model="user.email" type="email" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="电话：" prop="mobile">
          <el-input v-model="user.mobile" type="tel" placeholder="电话" />
        </el-form-item>
        <el-form-item label="用户类别：">
          <el-radio-group v-model="user.userType">
            <el-radio label="0">管理员</el-radio>
            <el-radio label="1">普通用户</el-radio>
            <el-radio label="2">保洁</el-radio>
            <el-radio label="3">维修</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目：" prop="toiletId">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="projectList"
            :props="defaultProps"
            show-checkbox
            node-key="id"
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
import { getUsers, addUser, updateUser, deleteUser } from '@/api/role'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

const defaultUserMassage = {
  username: '',
  name: '',
  password: '',
  sex: '1',
  email: '',
  mobile: '',
  userType: '0',
  avatar: '',
  toiletId: []
}

export default {
  components: { Pagination },
  data() {
    return {
      user: Object.assign({}, defaultUserMassage),
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请选择姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入11位电话号码', trigger: 'blur' },
          { min: 11, max: 11, message: '11位数字', trigger: 'blur' }
        ],
        toiletId: [
          { required: true }
        ]
      },
      avatarUploadUrl: process.env.VUE_APP_BASE_API + '/file/upload',
      avatarObject: {
        token: this.$store.getters.token
      },
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
  },
  created() {
    this.getUsersList()
  },
  methods: {
    userType(type) {
      let typeName = '管理员'
      switch (type) {
        case '1':
          typeName = '普通用户'
          break
        case '2':
          typeName = '保洁'
          break
        case '3':
          typeName = '维修'
          break
        default:
          typeName = '管理员'
          break
      }
      return typeName
    },
    async getUsersList() {
      const requestData = {
        // username: this.userMassage.username,
        // mobile: this.userMassage.mobile,
        userType: String(this.userMassage.userType),
        page: this.listQuery.page,
        limit: this.listQuery.limit
      };
      this.listLoading = true;
      const res = await getUsers(requestData);
      this.listLoading = false;
      this.usersList = res.data.list;
      this.total = res.data.totalCount;
    },
    generateArr(projects) {
      let data = [];
      if (projects && projects.length) {
        projects.forEach(project => {
          data.push(project)
          if (project.toiletList) {
            const temp = this.generateArr(project.toiletList)
            if (temp.length > 0) {
              data = [...data, ...temp]
            }
          }
        })
      }
      return data;
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
      this.dialogType = 'edit';
      this.dialogVisible = true;
      this.checkStrictly = true;
      this.user = deepClone(scope.row);
      this.user.sex = this.user.sex.toString();
      this.user.userType = this.user.userType.toString();
      this.$nextTick(() => {
        // const projects = this.generateProjects(this.user.projects)
        this.$refs.tree.setCheckedNodes(this.generateArr(this.user.toiletId));
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false;
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('是否确定删除用户？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser(row.id)
          this.usersList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
    generateTree(projects, checkedKeys) {
      const res = []
      for (const project of projects) {
        if (project.toiletList) {
          project.toiletList = this.generateTree(project.toiletList, checkedKeys)
        }

        if (checkedKeys.includes(project.id) || (project.toiletList && project.toiletList.length >= 1)) {
          res.push(project.id)
        }
      }
      return res
    },
    async confirmUser() {
      const isEdit = this.dialogType === 'edit';
      const checkedKeys = this.$refs.tree.getCheckedKeys();
      this.user.toiletId = this.generateTree(deepClone(this.projectList), checkedKeys);
      if (!this.user.username) {
        this.$message.error('请输入用户名!');
        return;
      }
      if (!this.user.name) {
        this.$message.error('请输入姓名!');
        return;
      }
      if (!this.user.mobile) {
        this.$message.error('请输入电话号码!');
        return;
      }
      if (!this.user.password) {
        this.user.password = this.user.mobile;
      }
      if (!this.user.toiletId || !this.user.toiletId.length) {
        this.$message.error('请选择项目!')
        return
      }
      if (isEdit) {
        await updateUser(this.user.key, this.user);
        for (let index = 0; index < this.usersList.length; index++) {
          if (this.usersList[index].key === this.user.key) {
            this.usersList.splice(index, 1, Object.assign({}, this.user));
            break
          }
        }
      } else {
        const { data } = await addUser(this.user);
        this.user.key = data.key;
        this.usersList.push(this.user);
      }

      const { username, name } = this.user;
      this.dialogVisible = false;
      this.$notify({
        title: '用户创建成功',
        dangerouslyUseHTMLString: true,
        message: `
        <div>用户名: ${username}</div>
        <div>姓名: ${name}</div>
      `,
        type: 'success'
      });
    },
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null;
      const showingChildren = children.filter(item => !item.hidden);

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0];
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path);
        return onlyOneChild;
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true };
        return onlyOneChild
      }

      return false
    },
    handleAvatarSuccess(res, file) {
      if (res.msg === 'success') {
        this.user.avatar = res.data;
      } else {
        this.user.avatar = '';
        this.$message.error('上传头像图片失败!');
      }
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
    }
  }
}
</script>
<style lang="scss">
  .permission-container {
    .el-button--primary {
      background: #369AFE;
      border-color: #369AFE;
    }

    .cell .el-button {
      border-radius: 8px;

      &.delete {
        border-color: #ACC5FF;
        color: #2C6AF6;
        padding: 8px 15px;
      }

      i {
        display: inline-block;
        margin-top: -3px;
        margin-right: 5px;
        font-size: 16px;
        vertical-align: middle;
      }
    }
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
</style>
<style lang="scss" scoped>
  .permission-container {
    width: 100%;
    height: calc(100vh - 78px);
    padding: 25px;
    background: #F2F2F2;
    overflow: hidden;
    font-family: NotoSansCJKRegular;
    font-size: 14px;

    .permission-container-warp {
      background: #fff;
      border-radius: 6px;
      height: calc(100vh - 128px);
      padding: 0 40px;
    }

    .permission-container-header {
      position: relative;
      padding-top: 12px;
      height: 42px;

      .title {
        line-height: 30px;
        color: rgba(72, 83, 133, .8);
        vertical-align: middle;

        i {
          display: inline-block;
          margin-top: -3px;
          margin-right: 10px;
          color: #1E8BF8;
          line-height: 30px;
          vertical-align: middle;
        }
      }

      .add-user {
        position: absolute;
        top: 20px;
        right: 20px;

        i {
          margin-right: 5px;
        }
      }
    }

    .avatar-uploader{
      margin-right: 85px;
      text-align: center;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 108px;
      height: 108px;
      line-height: 108px;
      text-align: center;
    }

    .avatar {
      width: 108px;
      height: 108px;
      display: block;
    }
  }
</style>
