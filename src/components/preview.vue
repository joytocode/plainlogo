<template>
  <div>
    <h1>Preview</h1>
    <div v-html="svg" class="svg-container"/>
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
  asyncComputed: {
    async svg () {
      const { name, textColor, width, height } = this.params
      const font = await loadFont(this.fontName)
      const svgPaths = []
      const fontSize = this.calculateFontSize(font)
      const textSize = this.measureTextSize(font, fontSize)
      const textX = (width - textSize.width) / 2
      const textY = (height - textSize.height) / 2 + textSize.upHeight
      const textPath = font.getPath(name, textX, textY, fontSize)
      textPath.fill = textColor
      svgPaths.push(textPath.toSVG())
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${svgPaths.join('')}</svg>`
    }
  },
  methods: {
    calculateFontSize (font) {
      const { height } = this.params
      let lowFontSize = 10
      let highFontSize = height
      let lastFitFontSize = lowFontSize
      while (lowFontSize <= highFontSize) {
        const midFontSize = Math.floor((lowFontSize + highFontSize) / 2)
        if (this.isFontSizeFit(font, midFontSize)) {
          lastFitFontSize = midFontSize
          lowFontSize = midFontSize + 1
        } else {
          highFontSize = midFontSize - 1
        }
      }
      return lastFitFontSize
    },
    isFontSizeFit (font, fontSize) {
      const { width, height, padding } = this.params
      const textSize = this.measureTextSize(font, fontSize)
      return textSize.width + 2 * padding < width && textSize.height + 2 * padding < height
    },
    measureTextSize (font, fontSize) {
      const { name } = this.params
      const bbox = font.getPath(name, 0, 0, fontSize).getBoundingBox()
      const upHeight = Math.ceil(-bbox.y1)
      const downHeight = Math.floor(bbox.y2)
      return { width: Math.ceil(bbox.x2) - Math.floor(bbox.x1), height: upHeight + downHeight, upHeight, downHeight }
    }
  }
}
</script>

<style lang="stylus" scoped>
.svg-container >>> svg
  border: 1px dashed black
</style>
