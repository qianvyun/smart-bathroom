<template>
  <div class="data-update-container">
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="project-list">
          <project-list @handleProject="handleProject" /><!-- :projectData="projectList"-->
        </div>
      </el-col>
      <el-col :span="21">
        <div class="data-update-content-warp">
          <div class="data-update-content-heard">
            <div class="title"><i class="icon iconfont icondata" />数据更新</div>
          </div>
          <div class="data-update-item data-update-video">
            <div class="title">更新视频文件</div>
            <dropzone :id="'videoDropzone'" default-msg="导入视频文件" accepted-files="video/*" @dropzone-file-url="uploadFile" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS" />
          </div>
          <div class="data-update-item data-update-image">
            <div class="title">更新图片文件</div>
            <dropzone :id="'imageDropzone'" default-icon="iconpic" default-msg="导入图片" accepted-files="image/*" @dropzone-file-url="uploadFile" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS" />
          </div>
          <div class="data-update-item data-update-word">
            <div class="title">更新文字新闻</div>
            <dropzone :id="'wordDropzone'" default-icon="iconword" default-msg="导入文字信息" accepted-files=".doc,.docx,.txt" @dropzone-file-url="uploadFile" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ProjectList from '@/components/ProjectList/index'
import Dropzone from '@/components/Dropzone/index'
import { uploadImgAndVideo, uploadTxt, AddToImg } from '@/api/upload'
const defaultUploadTxt = {
  id: '',
  liveUrl: '',
  text: ''
}
const defaultUploadImgAndVideo = {
  id: '',
  imgFile: [],
  videoFile: ''
}
export default {
  name: 'DataUpdate',
  components: { Dropzone, ProjectList },
  data() {
    return {
      // 当前项目的id
      currentProjectId: '',
      currentProject: null,
      uploadTxt: Object.assign({}, defaultUploadTxt),
      uploadImgAndVideo: Object.assign({}, defaultUploadImgAndVideo)
      // url: process.env.VUE_APP_BASE_API + '/toilet/upload'
    }
  },
  computed: {
    currentp() {
      return this.$store.getters.currentPageItem
    }
  },
  watch: {
    currentp(toilet) {
      this.currentProjectId = toilet.id;
      this.currentProject = toilet;
    }
  },
  methods: {
    dropzoneS(file) {
      this.$message({ message: 'Upload success', type: 'success' })
    },
    dropzoneR(file) {
      this.$message({ message: 'Delete success', type: 'success' })
    },
    handleProject(project) {
      this.currentProjectId = project.id;
      this.currentProject = project;
    },
    uploadFile(fileUrl, type) {
      switch (type) {
        case 'image':
          this.uploadImgAndVideo.id = this.currentProjectId;
          this.uploadImgAndVideo.imgFile.push(fileUrl);
          this.upload(this.uploadImgAndVideo, type);
          break
        case 'video':
          this.uploadImgAndVideo.id = this.currentProjectId;
          this.uploadImgAndVideo.videoFile = fileUrl;
          this.upload(this.uploadImgAndVideo, type);
          break
        default:
          this.uploadTxt.id = this.currentProjectId;
          this.uploadTxt.text = fileUrl;
          this.upload(this.uploadTxt, type);
          break
      }
      // console.log(fileUrl, type)
    },
    async upload(data, type) {
      if (type === 'text') {
        await uploadTxt(data)
      } else if (type === 'video') {
        await uploadImgAndVideo(data)
      } else if (type === 'image') {
        await AddToImg(data);
      }
      this.$notify({
        title: '文件上传成功',
        dangerouslyUseHTMLString: true,
        type: 'success'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.data-update-container{
  width: 100%;
  height: calc(100vh - 78px);
  padding: 25px;
  background: #F2F2F2;
  overflow: hidden;
  font-family: NotoSansCJKRegular;
  font-size: 14px;
}
.project-list{
  overflow-y: auto;
}
.data-update-content-warp{
  background: #fff;
  border-radius: 6px;
  height: calc(100vh - 128px);
  padding: 0 40px;
  overflow-y: auto;
  .data-update-content-heard{
    padding-top: 20px;
    height: 42px;
    .title{
      line-height: 22px;
      color: rgba(72, 83, 133, .8);
      vertical-align: middle;
      i{
        display: inline-block;
        margin-top: -3px;
        margin-right: 10px;
        font-size: 16px;
        color: #1E8BF8;
        line-height: 22px;
        vertical-align: middle;
      }
    }
  }
  .data-update-item{
    padding: 25px 10px 0;
    .title{
      height: 18px;
      line-height: 18px;
      margin-bottom: 15px;
      color: rgba(151, 160, 195, .9);
      font-size: 12px;
    }
  }
}
</style>
