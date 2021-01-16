<template>
  <div :id="id" :ref="id" :action="url" class="dropzone" :class="{mb: changeHeight}">
    <input type="file" name="file">
  </div>
</template>

<script>
import Dropzone from 'dropzone'
import 'dropzone/dist/dropzone.css'

Dropzone.autoDiscover = false

export default {
  name: 'Dropzone',
  props: {
    id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      default: process.env.VUE_APP_BASE_API + '/file/upload'
      // required: true
    },
    clickable: {
      type: Boolean,
      default: true
    },
    defaultMsg: {
      type: String,
      default: '上传图片'
    },
    defaultIcon: {
      type: String,
      default: 'iconvideo'
    },
    acceptedFiles: {
      type: String,
      default: ''
    },
    thumbnailHeight: {
      type: Number,
      default: 85
    },
    thumbnailWidth: {
      type: Number,
      default: 85
    },
    showRemoveLink: {
      type: Boolean,
      default: true
    },
    maxFilesize: {
      type: Number,
      default: 500
    },
    maxFiles: {
      type: Number,
      default: 1
    },
    autoProcessQueue: {
      type: Boolean,
      default: true
    },
    useCustomDropzoneOptions: {
      type: Boolean,
      default: false
    },
    defaultImg: {
      default: '',
      type: [String, Array]
    },
    couldPaste: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dropzone: '',
      initOnce: true,
      changeHeight: false
    }
  },
  watch: {
    defaultImg(val) {
      if (val.length === 0) {
        this.initOnce = false
        return
      }
      if (!this.initOnce) return
      this.initImages(val)
      this.initOnce = false
    }
  },
  mounted() {
    const element = document.getElementById(this.id)
    const vm = this
    this.dropzone = new Dropzone(element, {
      clickable: this.clickable,
      thumbnailWidth: this.thumbnailWidth,
      thumbnailHeight: this.thumbnailHeight,
      maxFiles: this.maxFiles,
      maxFilesize: this.maxFilesize,
      headers: {
        token: this.$store.getters.token
      },
      dictRemoveFile: 'Remove',
      addRemoveLinks: this.showRemoveLink,
      acceptedFiles: this.acceptedFiles,
      autoProcessQueue: this.autoProcessQueue,
      dictDefaultMessage: `<div class="dropzone-default"><span class="default-msg">${this.defaultMsg}</span><span class="icon-warp"><i class="icon iconfont iconadd"></i> <i class="icon iconfont ${this.defaultIcon}"></i></span></div>`,
      dictMaxFilesExceeded: '只能一个图',
      previewTemplate: `<div class="dz-preview dz-file-preview">
                          <div class="dz-image" style="width:${this.thumbnailWidth}px;height:${this.thumbnailHeight}px" >
                              <img style="width:${this.thumbnailWidth}px;height:${this.thumbnailHeight}px" data-dz-thumbnail />
                          </div>
                          <div class="dz-details">
                            <div class="dz-size"><span data-dz-size></span></div>
                            <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                            <!--<div class="dz-error-message"><span data-dz-errormessage></span></div>-->
                            <!--<div class="dz-success-mark"><i class="material-icons">done</i> </div>-->
<!--                            <div class="dz-error-mark"><i class="material-icons">error</i></div>-->
                          </div>
                        </div>`,
      init() {
        /* const val = vm.defaultImg
        if (!val) return
        if (Array.isArray(val)) {
          if (val.length === 0) return
          val.map((v, i) => {
            const mockFile = { name: 'name' + i, size: 12345, url: v }
            this.options.addedfile.call(this, mockFile)
            this.options.thumbnail.call(this, mockFile, v)
            mockFile.previewElement.classList.add('dz-success')
            mockFile.previewElement.classList.add('dz-complete')
            vm.initOnce = false
            return true
          })
        } else {
          const mockFile = { name: 'name', size: 12345, url: val }
          this.options.addedfile.call(this, mockFile)
          this.options.thumbnail.call(this, mockFile, val)
          mockFile.previewElement.classList.add('dz-success')
          mockFile.previewElement.classList.add('dz-complete')
          vm.initOnce = false
        }*/
      },
      accept: (file, done) => {
        /* 七牛*/
        // const token = this.$store.getters.token;
        // getToken(token).then(response => {
        //   file.token = response.data.qiniu_token;
        //   file.key = response.data.qiniu_key;
        //   file.url = response.data.qiniu_url;
        //   done();
        // })
        done()
      },
      sending: (file, xhr, formData) => {
        // const token = this.$store.getters.token;
        // const currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
        // formData.append('token', token);
        // formData.append('id', currentProject.id);
        // switch (this.acceptedFiles) {
        //   case 'video/*':
        //     formData.append('vedioFile', file);
        //     break;
        //   case 'image/*':
        //     formData.append('imgFile', file);
        //     break;
        //   default:
        //     break;
        // }
        vm.initOnce = false
      }
    })

    if (this.couldPaste) {
      document.addEventListener('paste', this.pasteImg)
    }

    this.dropzone.on('success', file => {
      this.changeHeight = true;
      let type = 'text';
      switch (this.acceptedFiles) {
        case 'video/*':
          type = 'video';
          break;
        case 'image/*':
          type = 'image';
          break;
        default:
          type = 'text'
          break;
      }
      const successUrl = JSON.parse(file.xhr.response);
      vm.$emit('dropzone-file-url', successUrl.data, type)
    })
    // this.dropzone.on('addedfile', file => {
    //   vm.$emit('dropzone-fileAdded', file)
    // })
    // this.dropzone.on('removedfile', file => {
    //   vm.$emit('dropzone-removedFile', file)
    // })
    // this.dropzone.on('error', (file, error, xhr) => {
    //   vm.$emit('dropzone-error', file, error, xhr)
    // })
    this.dropzone.on('successmultiple', (file, error, xhr) => {
      vm.$emit('dropzone-successmultiple', file, error, xhr)
    })
  },
  destroyed() {
    document.removeEventListener('paste', this.pasteImg)
    this.dropzone.destroy()
  },
  methods: {
    removeAllFiles() {
      this.dropzone.removeAllFiles(true)
    },
    processQueue() {
      this.dropzone.processQueue()
    },
    pasteImg(event) {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items
      if (items[0].kind === 'file') {
        this.dropzone.addFile(items[0].getAsFile())
      }
    }
    /* initImages(val) {
      if (!val) return
      if (Array.isArray(val)) {
        val.map((v, i) => {
          const mockFile = { name: 'name' + i, size: 12345, url: v }
          this.dropzone.options.addedfile.call(this.dropzone, mockFile)
          this.dropzone.options.thumbnail.call(this.dropzone, mockFile, v)
          mockFile.previewElement.classList.add('dz-success')
          mockFile.previewElement.classList.add('dz-complete')
          return true
        })
      } else {
        const mockFile = { name: 'name', size: 12345, url: val }
        this.dropzone.options.addedfile.call(this.dropzone, mockFile)
        this.dropzone.options.thumbnail.call(this.dropzone, mockFile, val)
        mockFile.previewElement.classList.add('dz-success')
        mockFile.previewElement.classList.add('dz-complete')
      }
    }*/

  }
}
</script>
<style lang="scss">
  .dropzone{
    /*max-height: 42px;*/
    .dz-message{
      margin: 0;
    }
    &.dz-started .dz-message{
      display: block;
      height: 42px;
    }
    .dropzone-default{
      padding: 0 24px;
      width: 650px;
      height: 40px;
      line-height: 38px;
      border-radius: 6px;
      border: 1px solid #D2D5E1;
      background: #FAFCFE;
      .default-msg{
        float: left;
        color: #97A0C3;
      }
      .icon-warp{
        float: right;
        i{
          height: 42px;
          line-height: 42px;
          font-size: 16px;
          color: #97A0C3;
          &.icon-add{
            color: #3496F8
          }
        }
      }
    }
    .dz-preview{
      border-radius: 6px;
      /*border: 1px solid #D2D5E1;*/
      background: #FAFCFE;
      margin: 10px 10px 0 0;
      padding: 5px;
    }
  }
  .mb{
    margin-bottom: 120px;
  }
</style>
<style lang="scss" scoped>
  .dropzone{
    padding: 0 24px;
    width: 650px;
    min-height: 42px;
    height: 42px;
    /*line-height: 42px;*/
    /*border-radius: 6px;*/
    border: none;
    background: #fff;
    font-family: NotoSansCJKRegular;
    input[name='file'] {
      display: none;
    }

  }
</style>
