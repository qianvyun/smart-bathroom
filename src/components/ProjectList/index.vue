<template>
  <div class="project-list">
    <ul>
      <li class="project-title">项目名称</li>
      <template v-for="(project,index) of projects">
        <li :key="project.id" class="item" :class="{active: currentSort === index}" @click="handleProject(index,project)">{{ project.name }}</li>
      </template>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProjectList',
  props: {
    projectData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      projects: this.projectData.length > 0 ? this.projectData : JSON.parse(sessionStorage.getItem('projectList')),
      currentSort: 0
    }
  },
  computed: {
    ...mapGetters([
      'projectList',
      'currentPageItem'
    ])
  },
  watch: {
    currentPageItem(v) {
      this.projects.forEach((item, index) => {
        if (item.id === v.id) {
          this.currentSort = index
        }
      })
    }
  },
  created() {
    this.handleProject(0, this.projects[0]);
    sessionStorage.setItem('currentProject', JSON.stringify(this.projects[0]));
  },
  methods: {
    handleProject(index, project) {
      this.$emit('handleProject', project);
      sessionStorage.setItem('currentProject', JSON.stringify(project));
      this.currentSort = index;
    }
  }
}
</script>

<style lang="scss" scoped>
  .project-list{
    background: #fff;
    border-radius: 6px;
    height: calc(100vh - 128px);
    padding: 10px 0;
    text-align: center;
    .project-title{
      position: relative;
      display: inline-block;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      color: #36437A;
      font-weight: 600;
      &:before,&:after{
        content: '';
        display: block;
        position: absolute;
        width: 7px;
        height: 1px;
        background: rgba(36, 46, 87, .3);
        top: 25px;
      }
      &:before{
        left: -18px;
      }
      &:after{
        right: -18px;
      }
    }
    .item{
      height: 45px;
      line-height: 45px;
      color: #97A0C3;
      border-left: 2px solid transparent;
      border-bottom: 1px solid rgba(234, 237, 247, .5);
      &:hover,
      &.active{
         background: #F4FAFF;
         color: #242F57;
      }
      &.active{
        border-left: 2px solid #369AFE;
      }
    }
  }
</style>
