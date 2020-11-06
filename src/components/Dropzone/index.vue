<template>
  <div :id="id" :ref="id" :action="url" class="dropzone">
    <input type="file" name="file">
  </div>
</template>

<script>
import Dropzone from 'dropzone'
import 'dropzone/dist/dropzone.css'
// import { getToken } from 'api/qiniu';

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
      required: true
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
      default: 'icon-video'
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
      default: 2
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
      initOnce: true
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
      dictRemoveFile: 'Remove',
      addRemoveLinks: this.showRemoveLink,
      acceptedFiles: this.acceptedFiles,
      autoProcessQueue: this.autoProcessQueue,
      dictDefaultMessage: `<div class="dropzone-default"><span class="default-msg">${this.defaultMsg}</span><span class="icon-warp"><i class="icon icon-add"></i> <i class="icon ${this.defaultIcon}"></i></span></div>`,
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
        const val = vm.defaultImg
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
        }
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
        const token = this.$store.getters.token;
        const currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
        formData.append('token', token);
        formData.append('id', currentProject.id);
        switch (this.acceptedFiles) {
          case 'video/*':
            formData.append('vedioFile', file);
            break;
          case 'image/*':
            formData.append('imgFile', file);
            break;
          default:
            break;
        }
        vm.initOnce = false
      }
    })

    if (this.couldPaste) {
      document.addEventListener('paste', this.pasteImg)
    }

    this.dropzone.on('success', file => {
      vm.$emit('dropzone-success', file, vm.dropzone.element)
    })
    this.dropzone.on('addedfile', file => {
      vm.$emit('dropzone-fileAdded', file)
    })
    this.dropzone.on('removedfile', file => {
      vm.$emit('dropzone-removedFile', file)
    })
    this.dropzone.on('error', (file, error, xhr) => {
      vm.$emit('dropzone-error', file, error, xhr)
    })
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
    },
    initImages(val) {
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
    }

  }
}
</script>
<style lang="scss">
  .dropzone{

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
      line-height: 40px;
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
      border: 1px solid #D2D5E1;
      background: #FAFCFE;
      margin: 10px 10px 0 0;
      padding: 5px;
    }

  }
</style>
<style lang="scss" scoped>
  .dropzone{
    padding: 0 24px;
    width: 650px;
    min-height: 42px;
    /*height: 42px;*/
    /*line-height: 42px;*/
    /*border-radius: 6px;*/
    border: none;
    background: #fff;
    font-family: NotoSansCJKRegular;
    input[name='file'] {
      display: none;
    }

  }

    /*.dropzone {
        border: 2px solid #E5E5E5;
        font-family: 'Roboto', sans-serif;
        color: #777;
        transition: background-color .2s linear;
        padding: 5px;
    }

    .dropzone:hover {
        background-color: #F6F6F6;
    }

    i {
        color: #CCC;
    }

    .dropzone .dz-image img {
        width: 100%;
        height: 100%;
    }

    .dropzone input[name='file'] {
        display: none;
    }

    .dropzone .dz-preview .dz-image {
        border-radius: 0px;
    }

    .dropzone .dz-preview:hover .dz-image img {
        transform: none;
        filter: none;
        width: 100%;
        height: 100%;
    }

    .dropzone .dz-preview .dz-details {
        bottom: 0px;
        top: 0px;
        color: white;
        background-color: rgba(33, 150, 243, 0.8);
        transition: opacity .2s linear;
        text-align: left;
    }

    .dropzone .dz-preview .dz-details .dz-filename span, .dropzone .dz-preview .dz-details .dz-size span {
        background-color: transparent;
    }

    .dropzone .dz-preview .dz-details .dz-filename:not(:hover) span {
        border: none;
    }

    .dropzone .dz-preview .dz-details .dz-filename:hover span {
        background-color: transparent;
        border: none;
    }

    .dropzone .dz-preview .dz-remove {
        position: absolute;
        z-index: 30;
        color: white;
        margin-left: 15px;
        padding: 10px;
        top: inherit;
        bottom: 15px;
        border: 2px white solid;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: 1.1px;
        opacity: 0;
    }

    .dropzone .dz-preview:hover .dz-remove {
        opacity: 1;
    }

    .dropzone .dz-preview .dz-success-mark, .dropzone .dz-preview .dz-error-mark {
        margin-left: -40px;
        margin-top: -50px;
    }

    .dropzone .dz-preview .dz-success-mark i, .dropzone .dz-preview .dz-error-mark i {
        color: white;
        font-size: 5rem;
    }*/
</style>
