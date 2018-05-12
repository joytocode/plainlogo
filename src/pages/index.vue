<template>
  <v-container fluid>
    <editor
      v-if="initialParams"
      ref="editor"
      :initial-params="initialParams"
      @paramsChange="updateParams"/>
  </v-container>
</template>

<script>
import debounce from 'lodash.debounce'
import qs from 'qs'

export default {
  head: {
    title: 'Home'
  },
  components: {
    'editor': require('~/components/editor').default
  },
  data () {
    return {
      initialParams: null
    }
  },
  created () {
    this.updateParams = debounce(this.syncUrlFromParams, 500)
  },
  mounted () {
    this.initialParams = this.parseParamsFromUrl()
    window.onpopstate = this.syncParamsFromUrl
  },
  beforeDestroy () {
    window.onpopstate = () => {}
  },
  methods: {
    getQueryString () {
      return this.$route.fullPath.substring(this.$route.path.length + 1)
    },
    parseParamsFromUrl () {
      const querystring = this.getQueryString()
      return querystring ? qs.parse(querystring) : {}
    },
    syncParamsFromUrl () {
      this.$refs.editor.setParams(this.parseParamsFromUrl())
    },
    syncUrlFromParams ({ params, first }) {
      const querystring = this.getQueryString()
      const nextQuerystring = qs.stringify(params)
      if (querystring === nextQuerystring) {
        return
      }
      if (first) {
        this.$router.replace(`${this.$route.path}?${nextQuerystring}`)
      } else {
        this.$router.push(`${this.$route.path}?${nextQuerystring}`)
      }
    }
  }
}
</script>
