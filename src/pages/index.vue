<template>
  <div class="secondary lighten-5">
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
      <preview
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
      <showcase
        v-if="resources"
        :resources="resources"
      />
      <editor
        v-if="resources && initialParams"
        ref="editor"
        :resources="resources"
        :initial-params="initialParams"
        class="mt-4"
        @params-change="paramsListener"
      />
    </v-container>
  </div>
</template>

<script>
import qs from 'qs'
import debounce from 'lodash.debounce'
import { getFontList } from '~/utils/font'
import { encodeQuery, decodeQuery } from '~/utils/params'

export default {
  head: {
    title: 'PlainLogo'
  },
  components: {
    'showcase': require('~/components/showcase').default,
    'preview': require('~/components/preview').default,
    'editor': require('~/components/editor').default,
    'download-form': require('~/components/download-form').default
  },
  data () {
    return {
      loading: false,
      loadError: null,
      resources: null,
      initialParams: null,
      params: null,
      previewSize: null,
      showDownload: false
    }
  },
  created () {
    this.resizeListener = debounce(this.handleResize, 300)
    this.paramsListener = debounce(this.updateParams, 500)
  },
  mounted () {
    this.loadResources()
    this.updatePreviewSize()
    this.initialParams = this.parseParamsFromUrl()
    window.onpopstate = this.setParamsFromUrl
  },
  beforeDestroy () {
    window.onpopstate = () => {}
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
    updateParams ({ params, first }) {
      this.params = { ...params }
      const querystring = this.getQueryString()
      const nextQuerystring = qs.stringify(encodeQuery(params))
      if (querystring === nextQuerystring) {
        return
      }
      if (first) {
        this.$router.replace(`${this.$route.path}?${nextQuerystring}`)
      } else {
        this.$router.push(`${this.$route.path}?${nextQuerystring}`)
      }
    },
    getQueryString () {
      return this.$route.fullPath.substring(this.$route.path.length + 1)
    },
    parseParamsFromUrl () {
      return decodeQuery(qs.parse(this.getQueryString()))
    },
    setParamsFromUrl () {
      this.$refs.editor.setParams(this.parseParamsFromUrl())
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
