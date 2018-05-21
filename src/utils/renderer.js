import { loadFont } from './font'

export async function renderSVG (renderOptions) {
  const options = {
    ...renderOptions,
    fonts: await Promise.all(renderOptions.texts.map((text) => loadFont(text.font)))
  }
  const { width, height, texts, fonts, background } = options
  const svgPaths = []
  if (!background.transparent) {
    svgPaths.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="${normalizeColor(background.color)}"/>`)
  }
  const fontSize = calculateFontSize(options)
  const { textSizes, textWidth, textHeight, textUpHeight, spacing } = measureTextSizes(fontSize, options)
  let textX = (width - textWidth) * 0.5
  const textY = (height - textHeight) * 0.5 + textUpHeight
  texts.forEach((text, index) => {
    const font = fonts[index]
    const textSize = textSizes[index]
    const textPath = font.getPath(text.value, textX, textY, fontSize)
    textPath.fill = normalizeColor(text.color)
    svgPaths.push(textPath.toSVG())
    textX += textSize.width + spacing
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${svgPaths.join('')}</svg>`
}

function calculateFontSize (options) {
  const { height } = options
  let lowFontSize = 10
  let highFontSize = height
  let lastFitFontSize = lowFontSize
  while (lowFontSize <= highFontSize) {
    const midFontSize = Math.floor((lowFontSize + highFontSize) / 2)
    if (isFontSizeFit(midFontSize, options)) {
      lastFitFontSize = midFontSize
      lowFontSize = midFontSize + 1
    } else {
      highFontSize = midFontSize - 1
    }
  }
  return lastFitFontSize
}

function isFontSizeFit (fontSize, options) {
  const { width, height } = options
  const { textWidth, textHeight, padding } = measureTextSizes(fontSize, options)
  return textWidth + 2 * padding < width && textHeight + 2 * padding < height
}

function measureTextSizes (fontSize, options) {
  const { width, height, texts, fonts } = options
  const spacing = fontSize * 0.2
  const padding = Math.min(width, height) * 0.2
  const textSizes = texts.map((text, index) => {
    const font = fonts[index]
    const bbox = font.getPath(text.value, 0, 0, fontSize).getBoundingBox()
    const upHeight = -bbox.y1
    const downHeight = bbox.y2
    return { width: bbox.x2 - bbox.x1, height: upHeight + downHeight, upHeight, downHeight }
  })
  const textWidth = textSizes.map(({ width }) => width).reduce(sum, 0) + (texts.length - 1) * spacing
  const textUpHeight = textSizes.map(({ upHeight }) => upHeight).reduce(max, 0)
  const textHeight = textUpHeight + textSizes.map(({ downHeight }) => downHeight).reduce(max, 0)
  return { textSizes, textWidth, textHeight, textUpHeight, spacing, padding }
}

function normalizeColor (color) {
  return color.indexOf('#') ? `#${color}` : color
}

function sum (x, y) {
  return x + y
}

function max (x, y) {
  return Math.max(x, y)
}
