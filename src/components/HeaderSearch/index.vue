<template>
  <div :class="{'show':show}" class="header-search">
    <i class="icon iconfont iconsearch" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="搜索"
      class="header-search-select"
      @change="change"
    >
      <el-option v-for="item in options" :key="item.path" :value="item" :label="item.title.join(' > ')" />
    </el-select>
  </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from 'fuse.js'
import path from 'path'

export default {
  name: 'HeaderSearch',
  props: {
    isShowEver: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      search: '',
      options: [],
      searchPool: [],
      show: this.isShowEver ? this.isShowEver : false,
      fuse: undefined
    }
  },
  computed: {
    routes() {
      return this.$store.getters.permission_routes
    }
  },
  watch: {
    routes() {
      this.searchPool = this.generateRoutes(this.routes)
    },
    searchPool(list) {
      this.initFuse(list)
    },
    show(value) {
      if (!this.isShowEver) {
        if (value) {
          document.body.addEventListener('click', this.close)
        } else {
          document.body.removeEventListener('click', this.close)
        }
      }
    }
  },
  mounted() {
    this.searchPool = this.generateRoutes(this.routes)
  },
  methods: {
    click() {
      if (!this.isShowEver) {
        this.show = !this.show
        if (this.show) {
          this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
        }
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
      this.options = []
      this.show = false
    },
    change(val) {
      this.$router.push(val.path)
      this.search = ''
      this.options = []
      this.$nextTick(() => {
        this.show = false
      })
    },
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
          name: 'title',
          weight: 0.7
        }, {
          name: 'path',
          weight: 0.3
        }]
      })
    },
    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    generateRoutes(routes, basePath = '/', prefixTitle = []) {
      let res = []

      for (const router of routes) {
        // skip hidden router
        if (router.hidden) { continue }

        const data = {
          path: path.resolve(basePath, router.path),
          title: [...prefixTitle]
        }

        if (router.meta && router.meta.title) {
          data.title = [...data.title, router.meta.title]

          if (router.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data)
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = this.generateRoutes(router.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    },
    querySearch(query) {
      if (query !== '') {
        this.options = this.fuse.search(query)
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;
  height: 34px;
  line-height: 32px;
  border-radius: 18px;
  border: 1px solid #D2D5E1;
  padding: 0 12px;
  .icon-search {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      height: 30px;
      line-height: 30px;
      border-radius: 0;
      border: 0;
      padding-left: 10px;
      padding-right: 0;
      box-shadow: none !important;
      vertical-align: middle;
    }
  }

  &.show {
    .icon-search{
     color: rgba(36, 47, 87, .4);
    }
    .header-search-select {
      width: 400px;
      margin-left: 10px;
      margin-top: -16px;
    }
  }
}
</style>
