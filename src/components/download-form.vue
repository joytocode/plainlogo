<template>
  <v-card>
    <v-card-title
      class="pb-0"
      primary-title
    ><div class="headline">Download</div></v-card-title>
    <v-tabs
      centered
      value="0"
    >
      <v-tab>
        Image
      </v-tab>
      <v-tab-item>
        <v-card-text>
          <div class="mb-3">
            <div class="subheading grey--text text--darken-2">Width</div>
            <v-text-field
              v-model="width"
              type="number"
              step="50"
              min="100"
              max="1000"
              class="pt-0"
              hide-details
            />
          </div>
          <div class="mb-3">
            <div class="subheading grey--text text--darken-2">Height</div>
            <v-text-field
              v-model="height"
              type="number"
              step="50"
              min="100"
              max="1000"
              class="pt-0"
              hide-details
            />
          </div>
          <div class="text-xs-center">
            <v-btn
              v-for="formatItem in formatItems"
              :key="formatItem.id"
              color="primary"
              @click="downloadImage(formatItem)"
            >{{ formatItem.label }}</v-btn>
          </div>
        </v-card-text>
      </v-tab-item>
      <v-tab>
        Inline HTML
      </v-tab>
      <v-tab-item>
        <v-card-text>
          <div class="mb-3">
            <div class="subheading grey--text text--darken-2">Base font size</div>
            <v-text-field
              v-model="baseFontSize"
              type="number"
              step="50"
              min="100"
              max="1000"
              class="pt-0"
              hide-details
            />
          </div>
          <div>
            <div class="subheading grey--text text--darken-2">Inline HTML</div>
            <v-text-field
              :value="inlineHTML"
              class="pt-0"
              multi-line
              readonly
              hide-details
            />
          </div>
        </v-card-text>
      </v-tab-item>
    </v-tabs>
    <v-card-actions>
      <v-spacer/>
      <v-btn
        flat
        @click.native="$emit('close')"
      >Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Base64 } from 'js-base64'
import { saveAs } from 'file-saver'
import { renderSVG } from '~/utils/renderer'

export default {
  props: {
    resources: {
      type: Object,
      default: null
    },
    params: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      formatItems: [
        { id: 'svg', label: 'SVG', createBlob: this.createSVGBlob },
        { id: 'png', label: 'PNG', createBlob: this.createPNGBlob }
      ],
      width: 400,
      height: 300,
      baseFontSize: 16
    }
  },
  computed: {
    inlineHTML () {
      if (!this.params) {
        return null
      }
      const style = [...new Set(this.params.texts.map((text) => {
        const fontItem = this.resources.fontList.itemByFamily[text.font.name]
        return `@font-face { font-family: '${text.font.name}-${text.font.style}'; src: url(${fontItem.files[text.font.style]}); }`
      }))].join(' ')
      const html = this.params.texts.map((text) => {
        const inlineStyle = `font-family: ${text.font.name}-${text.font.style}; font-size: ${this.baseFontSize * text.font.scale}px; color: #${text.color}`
        return `<span style="${inlineStyle}">${text.value}</span>`
      }).join('')
      return `<style>${style}</style>${html}`
    }
  },
  methods: {
    async createSVGBlob (svg) {
      return new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    },
    async createPNGBlob (svg) {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas')
        canvas.width = this.width
        canvas.height = this.height
        const image = new Image(this.width, this.height)
        image.onload = () => {
          canvas.getContext('2d').drawImage(image, 0, 0, this.width, this.height)
          canvas.toBlob((blob) => {
            resolve(blob, { type: 'image/png' })
          })
        }
        image.src = `data:image/svg+xml;base64,${Base64.encode(svg)}`
      })
    },
    async downloadImage (formatItem) {
      const filename = `${this.params.texts.map(({ value }) => value).join('')}.${formatItem.id}`
      const svg = await renderSVG({
        width: this.width,
        height: this.height,
        ...this.params,
        texts: this.params.texts.map((text) => {
          const fontItem = this.resources.fontList.itemByFamily[text.font.name]
          return {
            ...text,
            font: {
              url: fontItem.files[text.font.style],
              scale: text.font.scale
            }
          }
        })
      })
      const blob = await formatItem.createBlob(svg)
      saveAs(blob, filename)
    }
  }
}
</script>
