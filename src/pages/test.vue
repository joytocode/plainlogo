<template>
  <div>
    <div
      ref="previewContainer"
      class="white preview-container elevation-4">
      <test-preview
        :size="previewSize"
        :params="params"
      />
    </div>
    <v-container class="editor-container">
      <test-editor
        class="mt-4"
        @paramsChange="updateParams"/>
    </v-container>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  head: {
    title: 'PlainLogo'
  },
  components: {
    'test-preview': require('~/components/test-preview').default,
    'test-editor': require('~/components/test-editor').default
  },
  data () {
    return {
      params: null,
      previewSize: null
    }
  },
  created () {
    this.resizeListener = debounce(this.handleResize, 300)
  },
  mounted () {
    this.updatePreviewSize()
    window.addEventListener('resize', this.resizeListener)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeListener)
  },
  methods: {
    handleResize () {
      this.updatePreviewSize()
    },
    updatePreviewSize () {
      const previewContainer = this.$refs.previewContainer
      this.previewSize = {
        width: previewContainer.clientWidth,
        height: previewContainer.clientHeight
      }
    },
    updateParams ({ params }) {
      this.params = { ...params }
    }
  }
}
</script>

<style lang="stylus" scoped>
.preview-container
  position: fixed
  top: 0
  left: 0
  right: 0
  z-index: 9999
  height: 10rem

.editor-container
  margin-top: 10rem
</style>
