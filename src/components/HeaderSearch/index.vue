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
      <el-option v-for="item in options" :key="item.id" :value="item" :label="item.name" />
    </el-select>
  </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import Fuse from 'fuse.js'

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
    projectList() {
      return this.$store.getters.projectList
    }
  },
  watch: {
    projectList(list) {
      this.searchPool = list;
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
    this.searchPool = this.projectList;
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
      this.$store.dispatch('user/getCurrentPageItem', val);
      this.search = ''
      this.options = []
      // this.$nextTick(() => {
      //   this.show = false
      // })
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
          name: 'name',
          weight: 0.7
        }]
      })
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
