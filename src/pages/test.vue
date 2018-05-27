<template>
  <div>
    <div
      v-resize="resizeListener"
      ref="previewContainer"
      class="white preview-container elevation-4"
    >
      <div class="accent">
        <v-container class="py-0">
          <v-toolbar
            color="accent"
            flat
            dense
            dark
          >
            <v-toolbar-items class="ml-0">
              <v-btn
                title="About"
                flat
              >About</v-btn>
            </v-toolbar-items>
            <v-spacer/>
            <v-btn
              title="Download this logo"
              icon
              @click.native.stop="setShowDownload(true)"
            ><v-icon>fas fa-cloud-download-alt</v-icon></v-btn>
            <v-btn
              href="https://github.com/joytocode/plainlogo"
              target="_blank"
              title="Fork this project on GitHub"
              flat
              icon
            ><v-icon>fab fa-github</v-icon></v-btn>
          </v-toolbar>
        </v-container>
      </div>
      <test-preview
        :size="previewSize"
        :resources="resources"
        :params="params"
      />
    </div>
    <v-dialog
      v-model="showDownload"
      max-width="500"
    >
      <download-form
        :resources="resources"
        :params="params"
        @close="setShowDownload(false)"
      />
    </v-dialog>
    <v-container class="editor-container">
      <div
        v-if="loading"
        class="text-xs-center mt-4"
      >
        <v-progress-circular
          :size="70"
          :width="7"
          indeterminate
          color="primary"
        />
      </div>
      <v-alert
        v-if="loadError"
        :value="true"
        type="error"
        class="mt-3"
        outline
      >{{ loadError }}</v-alert>
      <test-editor
        v-if="resources"
        :resources="resources"
        class="mt-4"
        @params-change="updateParams"
      />
    </v-container>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import { getFontList } from '~/utils/font'

export default {
  head: {
    title: 'PlainLogo'
  },
  components: {
    'test-preview': require('~/components/test-preview').default,
    'download-form': require('~/components/download-form').default,
    'test-editor': require('~/components/test-editor').default
  },
  data () {
    return {
      loading: false,
      loadError: null,
      resources: null,
      params: null,
      previewSize: null,
      showDownload: false
    }
  },
  created () {
    this.resizeListener = debounce(this.handleResize, 300)
  },
  mounted () {
    this.loadResources()
    this.updatePreviewSize()
  },
  methods: {
    async loadResources () {
      if (this.loading) {
        return
      }
      try {
        this.loading = true
        const fontList = await getFontList()
        this.loading = false
        this.resources = { fontList }
      } catch (err) {
        console.error(err)
        this.loading = false
        this.loadError = 'Failed to load resources.'
      }
    },
    handleResize () {
      this.updatePreviewSize()
    },
    updatePreviewSize () {
      const previewContainer = this.$refs.previewContainer
      this.previewSize = {
        width: previewContainer.clientWidth,
        height: previewContainer.clientHeight - 48
      }
    },
    updateParams ({ params }) {
      this.params = { ...params }
    },
    setShowDownload (showDownload) {
      this.showDownload = showDownload
      this.updatePreviewSize()
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
  z-index: 9
  height: 10rem

.editor-container
  margin-top: 10rem
</style>
