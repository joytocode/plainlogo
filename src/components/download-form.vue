<template>
  <v-card>
    <v-card-title
      class="pb-0"
      primary-title
    ><div class="headline">Download</div></v-card-title>
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
      <div class="mb-3">
        <div class="subheading grey--text text--darken-2 mb-1">Format</div>
        <v-btn-toggle
          v-model="formatIndex"
          mandatory
        >
          <v-btn
            v-for="formatItem in formatItems"
            :key="formatItem.id"
            flat
          >{{ formatItem.label }}</v-btn>
        </v-btn-toggle>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn
        flat
        @click.native="$emit('close')"
      >Cancel</v-btn>
      <v-btn
        color="primary"
        style="width: 10rem;"
        @click.native="download"
      >Download {{ valueFormatItem.label }}</v-btn>
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
      formatIndex: 0
    }
  },
  computed: {
    valueFormatItem () {
      return this.formatItems[this.formatIndex]
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
    async download () {
      const filename = `${this.params.texts.map(({ value }) => value).join('')}.${this.valueFormatItem.id}`
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
      const blob = await this.valueFormatItem.createBlob(svg)
      saveAs(blob, filename)
      this.$emit('close')
    }
  }
}
</script>
