/* eslint-disable regexp/no-super-linear-backtracking */
/* eslint-disable regexp/no-unused-capturing-group */
/* eslint-disable no-control-regex */
export const CSS_COLOR_NAMES = [
  'AliceBlue',
  'AntiqueWhite',
  'Aqua',
  'Aquamarine',
  'Azure',
  'Beige',
  'Bisque',
  'Black',
  'BlanchedAlmond',
  'Blue',
  'BlueViolet',
  'Brown',
  'BurlyWood',
  'CadetBlue',
  'Chartreuse',
  'Chocolate',
  'Coral',
  'CornflowerBlue',
  'Cornsilk',
  'Crimson',
  'Cyan',
  'DarkBlue',
  'DarkCyan',
  'DarkGoldenRod',
  'DarkGray',
  'DarkGrey',
  'DarkGreen',
  'DarkKhaki',
  'DarkMagenta',
  'DarkOliveGreen',
  'DarkOrange',
  'DarkOrchid',
  'DarkRed',
  'DarkSalmon',
  'DarkSeaGreen',
  'DarkSlateBlue',
  'DarkSlateGray',
  'DarkSlateGrey',
  'DarkTurquoise',
  'DarkViolet',
  'DeepPink',
  'DeepSkyBlue',
  'DimGray',
  'DimGrey',
  'DodgerBlue',
  'FireBrick',
  'FloralWhite',
  'ForestGreen',
  'Fuchsia',
  'Gainsboro',
  'GhostWhite',
  'Gold',
  'GoldenRod',
  'Gray',
  'Grey',
  'Green',
  'GreenYellow',
  'HoneyDew',
  'HotPink',
  'IndianRed',
  'Indigo',
  'Ivory',
  'Khaki',
  'Lavender',
  'LavenderBlush',
  'LawnGreen',
  'LemonChiffon',
  'LightBlue',
  'LightCoral',
  'LightCyan',
  'LightGoldenRodYellow',
  'LightGray',
  'LightGrey',
  'LightGreen',
  'LightPink',
  'LightSalmon',
  'LightSeaGreen',
  'LightSkyBlue',
  'LightSlateGray',
  'LightSlateGrey',
  'LightSteelBlue',
  'LightYellow',
  'Lime',
  'LimeGreen',
  'Linen',
  'Magenta',
  'Maroon',
  'MediumAquaMarine',
  'MediumBlue',
  'MediumOrchid',
  'MediumPurple',
  'MediumSeaGreen',
  'MediumSlateBlue',
  'MediumSpringGreen',
  'MediumTurquoise',
  'MediumVioletRed',
  'MidnightBlue',
  'MintCream',
  'MistyRose',
  'Moccasin',
  'NavajoWhite',
  'Navy',
  'OldLace',
  'Olive',
  'OliveDrab',
  'Orange',
  'OrangeRed',
  'Orchid',
  'PaleGoldenRod',
  'PaleGreen',
  'PaleTurquoise',
  'PaleVioletRed',
  'PapayaWhip',
  'PeachPuff',
  'Peru',
  'Pink',
  'Plum',
  'PowderBlue',
  'Purple',
  'RebeccaPurple',
  'Red',
  'RosyBrown',
  'RoyalBlue',
  'SaddleBrown',
  'Salmon',
  'SandyBrown',
  'SeaGreen',
  'SeaShell',
  'Sienna',
  'Silver',
  'SkyBlue',
  'SlateBlue',
  'SlateGray',
  'SlateGrey',
  'Snow',
  'SpringGreen',
  'SteelBlue',
  'Tan',
  'Teal',
  'Thistle',
  'Tomato',
  'Turquoise',
  'Violet',
  'Wheat',
  'White',
  'WhiteSmoke',
  'Yellow',
  'YellowGreen',
]

export function isValidColor(color: string): boolean {
  const trimmedColor = color.trim()
  if (!trimmedColor)
    return false

  // Check for Raycast color names (case-insensitive)
  if (trimmedColor.toLowerCase().startsWith('raycast-')) {
    return true
  }

  // Check for CSS color keywords (case-insensitive)
  if (CSS_COLOR_NAMES.some(name => name.toLowerCase() === trimmedColor.toLowerCase())) {
    return true
  }

  // Check for HEX and short HEX
  const hexRegex = /^#([A-F0-9]{6}|[A-F0-9]{3})$/i
  if (hexRegex.test(trimmedColor)) {
    return true
  }

  // Check for RGB and RGBA
  // Handles formats like: rgb(255,0,0), rgba(255,0,0,1), rgb(255 0 0 / 1)
  const rgbaRegex = /^rgba?\(\s*(\d{1,3})[\x09-\x0D\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(?: |(?: \s*)?,)\s*(\d{1,3})[\x09-\x0D\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(?: |(?: \s*)?,)\s*(\d{1,3})\s*([, /]\s*(0|1|0?\.\d+))?\s*\)$/
  if (rgbaRegex.test(trimmedColor)) {
    return true
  }

  // Check for HSL and HSLA
  // Handles formats like: hsl(120,100%,50%), hsla(120,100%,50%,1), hsl(120 100% 50% / 1)
  const hslaRegex = /^hsla?\(\s*(\d{1,3})[\x09-\x0D\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(?: |(?: \s*)?,)\s*(\d{1,3})%[\x09-\x0D\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(?: |(?: \s*)?,)\s*(\d{1,3})%\s*([, /]\s*(0|1|0?\.\d+))?\s*\)$/
  if (hslaRegex.test(trimmedColor)) {
    return true
  }

  return false
}
