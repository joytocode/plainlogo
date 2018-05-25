import axios from 'axios'
import * as opentype from 'opentype.js'

const fontPromiseByUrl = {}

export const fontStyleNameById = {
  '100': 'Thin 100',
  '100italic': 'Thin Italic 100',
  '200': 'Extra-Light 200',
  '200italic': 'Extra-Light Italic 200',
  '300': 'Light 300',
  '300italic': 'Light Italic 300',
  'italic': 'Italic',
  'regular': 'Regular 400',
  '500': 'Medium 500',
  '500italic': 'Medium Italic 500',
  '600': 'Semi-Bold 600',
  '600italic': 'Semi-Bold Italic 600',
  '700': 'Bold 700',
  '700italic': 'Bold Italic 700',
  '800': 'Extra-Bold 800',
  '800italic': 'Extra-Bold Italic 800',
  '900': 'Black 900',
  '900italic': 'Black Italic 900'
}

export async function getFontList () {
  const url = `https://www.googleapis.com/webfonts/v1/webfonts?sort=trending&key=${process.env.GOOGLE_API_KEY}`
  const items = (await axios.get(url)).data.items
  const itemByFamily = {}
  const uniqueCategories = {}
  const uniqueVariants = {}
  items.forEach((item) => {
    itemByFamily[item.family] = item
    uniqueCategories[item.category] = true
    item.variants.forEach((variant) => {
      uniqueVariants[variant] = true
      // Make sure font urls are secure
      item.files[variant] = item.files[variant].replace(/^http:\/\//i, 'https://')
    })
  })
  const categories = Object.keys(uniqueCategories)
  categories.sort()
  const variants = Object.keys(uniqueVariants)
  variants.sort()
  return { items, itemByFamily, categories, variants }
}

export async function loadFontByUrl (fontUrl) {
  return fontPromiseByUrl[fontUrl] || (fontPromiseByUrl[fontUrl] = new Promise((resolve, reject) => {
    opentype.load(fontUrl, (err, font) => {
      if (err) {
        reject(err)
        return
      }
      resolve(font)
    })
  }))
}

// TODO deprecated
export function loadFont (fontName) {
  return loadFontByUrl(`https://rawgit.com/google/fonts/master/ofl/${fontName.toLowerCase()}/${fontName}-Bold.ttf`)
}
