<template>
  <div class="mt-3 mb-4">
    <div class="display-1 mb-3">Examples</div>
    <v-container
      fluid
      grid-list-md
    >
      <v-layout
        row
        wrap
      >
        <v-flex
          v-for="(logo, index) in logos"
          :key="logo.id"
          class="text-xs-center"
          xs12
          sm6
          md4
        >
          <a
            v-if="svgs"
            :href="urls[index]"
            target="_blank"
            v-html="svgs[index]"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import qs from 'qs'
import { renderSVG } from '~/utils/renderer'
import { normalizeTextOptions, encodeQuery } from '~/utils/params'
import logos from '~/utils/logos'

export default {
  props: {
    resources: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      logos
    }
  },
  computed: {
    urls () {
      return this.logos.map((logo) => `?${qs.stringify(encodeQuery(logo.params))}`)
    }
  },
  asyncComputed: {
    svgs () {
      return Promise.all(
        this.logos.map((logo) => renderSVG({
          width: 180,
          height: 100,
          ...logo.params,
          texts: logo.params.texts.map((text) => normalizeTextOptions(this.resources.fontList, text))
        }))
      )
    }
  }
}
</script>
