import {
  defaultBackgroundColor, defaultTextValue, defaultTextColor,
  createTextItem, normalizeTextOptions, encodeQuery, decodeQuery
} from '../params'

describe('createTextItem', () => {
  let fontList, options
  beforeEach(() => {
    fontList = {
      items: [{ family: 'Y', variants: ['italic', 'bold'] }]
    }
    options = { value: 'A', color: 'FF0000', font: { name: 'X', style: '200', scale: 2 } }
  })
  it('should create text item with value', () => {
    const text = createTextItem(fontList, options)
    expect(text.value).toBe('A')
  })
  it('should create text item with color', () => {
    const text = createTextItem(fontList, options)
    expect(text.color).toBe('FF0000')
  })
  it('should create text item with font', () => {
    const text = createTextItem(fontList, options)
    expect(text.font).toEqual({ name: 'X', style: '200', scale: 2 })
  })
  it('should create text item with default value if no value', () => {
    delete options.value
    const text = createTextItem(fontList, options)
    expect(text.value).toBe(defaultTextValue)
  })
  it('should create text item with default color if no color', () => {
    delete options.color
    const text = createTextItem(fontList, options)
    expect(text.color).toBe(defaultTextColor)
  })
  it('should create text item with default font if no font', () => {
    delete options.font
    const text = createTextItem(fontList, options)
    expect(text.font).toEqual({ name: 'Y', style: 'italic', scale: 1 })
  })
  it('should create text item if no options', () => {
    options = undefined
    const text = createTextItem(fontList, options)
    expect(text.value).toBe(defaultTextValue)
    expect(text.color).toBe(defaultTextColor)
    expect(text.font).toEqual({ name: 'Y', style: 'italic', scale: 1 })
  })
})

describe('normalizeTextOptions', () => {
  let fontList, options
  beforeEach(() => {
    fontList = {
      itemByFamily: {
        X: { family: 'X', variants: ['200'], files: { '200': 'X-200.ttf' } }
      }
    }
    options = { value: 'A', color: 'FF0000', font: { name: 'X', style: '200', scale: 2 } }
  })
  it('should normalize text options', () => {
    const text = normalizeTextOptions(fontList, options)
    expect(text).toEqual({ value: 'A', color: 'FF0000', font: { url: 'X-200.ttf', scale: 2 } })
  })
})

describe('encodeQuery', () => {
  let params
  beforeEach(() => {
    params = {
      background: { transparent: true, color: '333333' },
      texts: [
        { value: 'A', color: 'FF0000', font: { name: 'X', style: '200', scale: 1 } },
        { value: 'B', color: '00FF00', font: { name: 'Y', style: 'italic', scale: 0.5 } },
        { value: 'C', color: '0000FF', font: { name: 'Z', style: 'bold', scale: 2 } }
      ]
    }
  })
  it('should ignore transparent background', () => {
    const query = encodeQuery(params)
    expect(query.bg).toBeUndefined()
  })
  it('should ignore texts if none', () => {
    delete params.texts
    const query = encodeQuery(params)
    expect(query.t1).toBeUndefined()
  })
  it('should encode color background', () => {
    params.background.transparent = false
    const query = encodeQuery(params)
    expect(query.bg).toBe('333333')
  })
  it('should encode text values', () => {
    const query = encodeQuery(params)
    expect(query.t1).toBe('A')
    expect(query.t2).toBe('B')
    expect(query.t3).toBe('C')
  })
  it('should encode text colors', () => {
    const query = encodeQuery(params)
    expect(query.c1).toBe('FF0000')
    expect(query.c2).toBe('00FF00')
    expect(query.c3).toBe('0000FF')
  })
  it('should encode text fonts', () => {
    const query = encodeQuery(params)
    expect(query.f1).toBe('X~200')
    expect(query.f2).toBe('Y~italic~0.5')
    expect(query.f3).toBe('Z~bold~2')
  })
})

describe('decodeQuery', () => {
  let query
  beforeEach(() => {
    query = {
      bg: '333333',
      t2: 'B',
      t1: 'A',
      t3: 'C',
      c2: '00FF00',
      c3: '0000FF',
      c1: 'FF0000',
      f1: 'X~200',
      f3: 'Z~bold~2',
      f2: 'Y~italic~0.5'
    }
  })
  it('should decode transparent background', () => {
    delete query.bg
    const params = decodeQuery(query)
    expect(params.background).toEqual({ transparent: true, color: defaultBackgroundColor })
  })
  it('should decode color background', () => {
    const params = decodeQuery(query)
    expect(params.background).toEqual({ transparent: false, color: '333333' })
  })
  it('should decode text values', () => {
    const params = decodeQuery(query)
    expect(params.texts[0].value).toBe('A')
    expect(params.texts[1].value).toBe('B')
    expect(params.texts[2].value).toBe('C')
  })
  it('should decode text colors', () => {
    const params = decodeQuery(query)
    expect(params.texts[0].color).toBe('FF0000')
    expect(params.texts[1].color).toBe('00FF00')
    expect(params.texts[2].color).toBe('0000FF')
  })
  it('should decode text fonts', () => {
    const params = decodeQuery(query)
    expect(params.texts[0].font).toEqual({ name: 'X', style: '200', scale: 1 })
    expect(params.texts[1].font).toEqual({ name: 'Y', style: 'italic', scale: 0.5 })
    expect(params.texts[2].font).toEqual({ name: 'Z', style: 'bold', scale: 2 })
  })
  it('should give text ids', () => {
    const params = decodeQuery(query)
    expect(params.texts[0].id).toBeLessThan(params.texts[1].id)
    expect(params.texts[1].id).toBeLessThan(params.texts[2].id)
  })
  it('should handle incomplete data', () => {
    query.t4 = ''
    const params = decodeQuery(query)
    expect(params.texts[3].value).toBe(defaultTextValue)
    expect(params.texts[3].color).toBe(defaultTextColor)
  })
  it('should ignore texts if none', () => {
    delete query.t1
    delete query.t2
    delete query.t3
    const params = decodeQuery(query)
    expect(params.texts).toBeUndefined()
  })
})
