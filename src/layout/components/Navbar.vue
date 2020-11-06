<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <header-search id="header-search" class="right-menu-item" />
    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <span class="username">{{ name }}</span>
          <i class="icon icon-arrow" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger';
import HeaderSearch from '@/components/HeaderSearch/index'

export default {
  components: {
    HeaderSearch,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'userMassage',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 78px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    margin-top: 19px;
    line-height: 40px;
    height: 40px;
    margin-left: 10px;
    margin-right: 25px;
    text-align: center;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }


  .header-search{
    float: left;
    margin-top: 23px;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 20px;
        position: relative;
        cursor: pointer;
        line-height: 42px;
        vertical-align: middle;

        .user-avatar {
          width: 42px;
          height: 42px;
          margin-right: 25px;
          border-radius: 21px;
          vertical-align: middle;
        }

        .username{
          display: inline-block;
          height: 42px;
          line-height: 42px;
          color: #242F57;
          vertical-align: middle;
          margin-right: 5px;
        }

        .icon-arrow {
          cursor: pointer;
          font-size: 28px;
          color: #7C88B1;
          line-height: 42px;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
