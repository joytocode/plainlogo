import * as opentype from 'opentype.js'

const fontPromiseByName = {}

// TODO use Google Fonts API

export async function loadFont (fontName) {
  return fontPromiseByName[fontName] || (fontPromiseByName[fontName] = new Promise((resolve, reject) => {
    opentype.load(`https://rawgit.com/google/fonts/master/ofl/${fontName.toLowerCase()}/${fontName}-Bold.ttf`, (err, font) => {
      if (err) {
        reject(err)
        return
      }
      resolve(font)
    })
  }))
}
