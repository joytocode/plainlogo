<template>
  <div>
    <div
      v-if="svg"
      v-html="svg"
    />
  </div>
</template>

<script>
import { normalizeTextOptions } from '~/utils/params'
import { renderSVG } from '~/utils/renderer'

export default {
  props: {
    size: {
      type: Object,
      default: null
    },
    resources: {
      type: Object,
      default: null
    },
    params: {
      type: Object,
      default: null
    }
  },
  asyncComputed: {
    svg () {
      if (!this.size || !this.params) {
        return null
      }
      return renderSVG({
        ...this.size,
        ...this.params,
        texts: this.params.texts.map((text) => normalizeTextOptions(this.resources.fontList, text))
      })
    }
  }
}
</script>
