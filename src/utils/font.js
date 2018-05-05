import * as opentype from 'opentype.js'

const fontPromiseByName = {}

export async function loadFont (fontName) {
  return fontPromiseByName[fontName] || (fontPromiseByName[fontName] = new Promise((resolve, reject) => {
    const type = fontName.split('-')[0].toLowerCase()
    opentype.load(`https://rawgit.com/google/fonts/master/ofl/${type}/${fontName}.ttf`, (err, font) => {
      if (err) {
        reject(err)
        return
      }
      resolve(font)
    })
  }))
}
