<template>
  <div>
    <h1>Preview</h1>
    <div
      ref="svgLogo"
      class="svg-container"
      v-html="svg"
    />
    <v-btn
      color="primary"
      @click="download"
    >Download</v-btn>
    <v-dialog
      v-model="dialog"
      :width="2 * params.width"
    >
      <v-card>
        <v-card-title
          class="pb-0"
          primary-title
        >
          <div class="headline">Download</div>
        </v-card-title>
        <v-card-text class="py-0 text-xs-center">
          <img :src="pngLogo">
          <a
            :href="pngLogo"
            :download="`${params.name}.png`"
            style="display: block;"
          >PNG</a>
          <img :src="svgAsXml">
          <a
            :href="svgAsXml"
            :download="`${params.name}.svg`"
            style="display: block;"
          >SVG</a>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            flat
            @click="dialog = false"
          >Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { loadFont } from '~/utils/font'

export default {
  props: {
    params: {
      type: Object,
      required: true
    },
    fontName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      dialog: false,
      pngLogo: '',
      svgAsXml: ''
    }
  },
  asyncComputed: {
    async svg () {
      // All fields of params must appear here to be watched
      const { name, textColor, width, height, padding } = this.params
      const font = await loadFont(this.fontName)
      const svgPaths = []
      const fontSize = this.calculateFontSize(font, padding)
      const textSize = this.measureTextSize(font, fontSize)
      const textX = (width - textSize.width) / 2
      const textY = (height - textSize.height) / 2 + textSize.upHeight
      const textPath = font.getPath(name, textX, textY, fontSize)
      textPath.fill = this.normalizeColor(textColor)
      svgPaths.push(textPath.toSVG())
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${svgPaths.join('')}</svg>`
    }
  },
  methods: {
    calculateFontSize (font, padding) {
      const { height } = this.params
      let lowFontSize = 10
      let highFontSize = height
      let lastFitFontSize = lowFontSize
      while (lowFontSize <= highFontSize) {
        const midFontSize = Math.floor((lowFontSize + highFontSize) / 2)
        if (this.isFontSizeFit(font, midFontSize, padding)) {
          lastFitFontSize = midFontSize
          lowFontSize = midFontSize + 1
        } else {
          highFontSize = midFontSize - 1
        }
      }
      return lastFitFontSize
    },
    isFontSizeFit (font, fontSize, padding) {
      const { width, height } = this.params
      const textSize = this.measureTextSize(font, fontSize)
      return textSize.width + 2 * padding < width && textSize.height + 2 * padding < height
    },
    measureTextSize (font, fontSize) {
      const { name } = this.params
      const bbox = font.getPath(name, 0, 0, fontSize).getBoundingBox()
      const upHeight = -bbox.y1
      const downHeight = bbox.y2
      return { width: bbox.x2 - bbox.x1, height: upHeight + downHeight, upHeight, downHeight }
    },
    normalizeColor (color) {
      return color.indexOf('#') ? `#${color}` : color
    },
    download () {
      const { width, height } = this.params
      const svgLogo = this.$refs.svgLogo.firstChild
      const canvas = document.createElement('canvas')
      const loader = new Image(width, height)
      canvas.width = width
      canvas.height = height
      loader.onload = () => {
        canvas.getContext('2d').drawImage(loader, 0, 0, width, height)
        this.pngLogo = canvas.toDataURL()
      }
      this.svgAsXml = `data:image/svg+xml,${encodeURIComponent(new XMLSerializer().serializeToString(svgLogo))}`
      loader.src = this.svgAsXml
      this.dialog = true
    }
  }
}
</script>

<style lang="stylus" scoped>

.svg-container >>> svg
  border: 1px dashed black

</style>
