import colorString from 'color-string'

export function normalizeColor (color) {
  return color.indexOf('#') ? `#${color}` : color
}

export function rgbaToHex (rgba) {
  return colorString.to.hex([rgba.r, rgba.g, rgba.b, rgba.a]).substring(1)
}
