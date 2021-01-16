export enum PUNCTUATION {
  STOP,
  COMMA,
  DOUBLE_QUOTATION_MARK,
  SINGLE_QUOTATION_MARK,
  HYPHEN,
  QUESTION,
  COLON,
  EXCLAMATION,
  SEMICOLON,
  PAUSE,
  SLASH,
  LEFT_PARENTHESIS,
  RIGHT_PARENTHESIS,
  ELLIPSIS,
  LEFT_DOUBLE_QUOTATION_MARK,
  RIGHT_DOUBLE_QUOTATION_MARK,

  UNKNOWN
}

const pMAP={}

function createP(name, v, isFull=false, ensureCN=false, alias=""){
  pMAP[v] = {
    name,
    isFull,
    isCN: ensureCN || isFull
  }
}


createP(PUNCTUATION.STOP, ".", false)
createP(PUNCTUATION.STOP, "。", true)

createP(PUNCTUATION.COMMA, ",", false)
createP(PUNCTUATION.COMMA, "，", true)


createP(PUNCTUATION.DOUBLE_QUOTATION_MARK, '"', false)
createP(PUNCTUATION.SINGLE_QUOTATION_MARK, "'", false)


createP(PUNCTUATION.HYPHEN, '–', false, true,"一字线")
createP(PUNCTUATION.HYPHEN, "-", false, false, "半字线")
createP(PUNCTUATION.HYPHEN, "—", true, true,"短划线")
createP(PUNCTUATION.HYPHEN, "——", true, true,"长横")

createP(PUNCTUATION.QUESTION, '?', false)
createP(PUNCTUATION.QUESTION, "？", true)

createP(PUNCTUATION.COLON, ':', false)
createP(PUNCTUATION.COLON, "：", true)

createP(PUNCTUATION.EXCLAMATION, '!', false)
createP(PUNCTUATION.EXCLAMATION, "！", true)

createP(PUNCTUATION.SEMICOLON, ';', false)
createP(PUNCTUATION.SEMICOLON, "；", true)

createP(PUNCTUATION.PAUSE, "、", true)

createP(PUNCTUATION.SLASH, '/', false, true)

createP(PUNCTUATION.LEFT_PARENTHESIS, '(', false, true)
createP(PUNCTUATION.LEFT_PARENTHESIS, "（", true)

createP(PUNCTUATION.RIGHT_PARENTHESIS, ')', false, true)
createP(PUNCTUATION.RIGHT_PARENTHESIS, "）", true)



createP(PUNCTUATION.ELLIPSIS, "...", false)
createP(PUNCTUATION.ELLIPSIS, "......", false, true)

createP(PUNCTUATION.LEFT_DOUBLE_QUOTATION_MARK, "“", true)
createP(PUNCTUATION.RIGHT_DOUBLE_QUOTATION_MARK, "”", true)

export const node2Punctuation = node => {
  const meta = pMAP[node.value] || {name:PUNCTUATION.UNKNOWN}
  node.ptype = meta.name
  node.isFull = meta.isFull
  node.isCN = meta.isCN
  return;
};


export const isComma = (node)=>{
  return node.ptype === PUNCTUATION.COMMA
}

export const isHyphen= (node)=>{
  return node.ptype === PUNCTUATION.HYPHEN
}
export const isSlash= (node)=>{
  return node.ptype === PUNCTUATION.SLASH
}
export const isPause = (node)=>{
  return node.ptype === PUNCTUATION.PAUSE
}

export const isCnCOLON = (node)=>{
  return node.ptype === PUNCTUATION.COLON && node.isCN === true
}

export const isLeftParenthesis = (node)=>{
  return node.ptype === PUNCTUATION.LEFT_PARENTHESIS
}


export const isRightParenthesis = (node)=>{
  return node.ptype === PUNCTUATION.RIGHT_PARENTHESIS
}
