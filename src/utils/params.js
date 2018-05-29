export const defaultTextValue = '_'
export const defaultTextColor = '000000'
export const defaultBackgroundColor = 'EEEEEE'
export const defaultSpacing = 15
export const defaultPadding = 20

let nextId = 1

export function createTextItem (fontList, { value = defaultTextValue, color = defaultTextColor, font } = {}) {
  const defaultFont = fontList.items[0]
  return { id: nextId++, value, color, font: font || { name: defaultFont.family, style: defaultFont.variants[0], scale: 1 } }
}

export function normalizeTextOptions (fontList, text) {
  const fontItem = fontList.itemByFamily[text.font.name]
  return {
    ...text,
    font: {
      ...text.font,
      url: fontItem.files[text.font.style]
    }
  }
}

export function encodeQuery (params) {
  const query = {}
  if (params.texts) {
    params.texts.forEach(({ value, color, font }, index) => {
      const id = index + 1
      query[`t${id}`] = value
      query[`c${id}`] = color
      query[`f${id}`] = `${font.name}~${font.style}${font.scale !== 1 ? `~${font.scale}` : ''}`
    })
  }
  if (params.background && !params.background.transparent) {
    query.bg = params.background.color
  }
  if (params.spacing !== defaultSpacing) {
    query.s = params.spacing
  }
  if (params.padding !== defaultPadding) {
    query.p = params.padding
  }
  return query
}

export function decodeQuery (query) {
  const params = {}
  const textIds = []
  Object.keys(query).forEach((key) => {
    const matches = key.match(/t(\d*)/)
    if (matches) {
      textIds.push(+matches[1])
    }
  })
  if (textIds.length) {
    textIds.sort()
    params.texts = textIds.map((id) => {
      const text = {
        id: nextId++,
        value: query[`t${id}`] || defaultTextValue,
        color: query[`c${id}`] || defaultTextColor
      }
      const font = {}
      const parts = (query[`f${id}`] || '').split('~')
      font.name = parts[0]
      font.style = parts[1]
      font.scale = typeof parts[2] !== 'undefined' ? +parts[2] : 1
      text.font = font
      return text
    })
  }
  params.background = {
    transparent: !query.bg,
    color: query.bg || defaultBackgroundColor
  }
  params.spacing = !isNaN(query.s) ? +query.s : defaultSpacing
  params.padding = !isNaN(query.p) ? +query.p : defaultPadding
  return params
}
