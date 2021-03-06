//Vars

let inputString: string = ''
let previous: string = ''
let next: string = ''
let clickQ: boolean = false
let strictMode = false

interface Obj {
  readonly str?: string,
  readonly selectionStart?: number,
  readonly selectionEnd?: number,
  readonly flag?: (null | string[])
}


//Elements

const input: any = document.querySelector('#result')
const cleanBtn: any = document.querySelector('#clean')
const calcBtn: any = document.querySelector('#calc')
const strictModeInput: any = document.querySelector('#strict_mode_input')


//Functions

const findAppropriateBracketIndex = (substr: string, bracketIndex: number = -1): number => {
  let chars = substr.split('')
  let len = chars.length
  let stack = []
  let open = '('
  let close = ')'

  if (bracketIndex === -1) {
    for (let i = len - 1; i !== -1; i--) {
      if (close === chars[i]) {
        stack.push(close)
        continue
      }
  
      if (open === chars[i] && stack.pop() !== close) {
        return -1
      }
  
      if (stack.length === 0) return i
    }
  } else if (substr[0] === open) {
    for (let i = 0; i < len; i++) {
      if (open === chars[i]) {
        stack.push(open)
        continue
      }
  
      if (close === chars[i] && stack.pop() !== open) {
        return -1
      }
  
      if (stack.length === 0) return i + bracketIndex
    }
  } 

  return -1
}

const correct = () => {
  if (!('ontouchstart' in window)) document.body.classList.add('notouch')
}

const setCursor = (flag: (string[] | null | undefined), selectionStart: (number | undefined), selectionEnd: (number | undefined)): void => {
  if (flag && selectionEnd && selectionStart) {
    input.selectionEnd = selectionEnd - 1
    input.selectionStart = selectionStart - 1
  }
}

const fac = (n: number): number => {
  if (Number.isInteger(n)) return n ? n * (fac(n-1)) : 1
  return NaN
}

const log = (a: number, b: number): number => {
  return Number((Math.log(a) / Math.log(b)).toFixed(15))
}

const calcAllFac = (str: any): string => {
  if (str.includes('!')) {
    let first: number = str.indexOf('!')

    if (str[first - 1] === ')') {

      let bracketIndex = findAppropriateBracketIndex(str.slice(0, first))
      let substr0 = str.slice(0, bracketIndex)
      let substr = calcAllLog(str.slice(bracketIndex, first))
      let substr1 = str.slice(first + 1)

      return calcAllFac(substr0 + fac(eval(substr)) + substr1)
    } else {
      
      let substr = str.slice(0, first).split(/[\+\-\*\/\(_]|(log)/).pop()
      let substr0 = str.slice(0, first - substr.length)
      let substr1 = str.slice(first + 1)
      
      return calcAllFac(substr0 + fac(eval(substr)) + substr1)
    }
  }

  return str
}

const calcAllLog = (str: any): string => {
  if (str.includes('_')) {
    let first: number = str.indexOf('_')

    if (str[first + 1] === '(') {

      let bracketIndex = findAppropriateBracketIndex(str.slice(first + 1), first + 1)
      let substr = str.slice(0, first).split('log').pop()
      let substr0 = str.slice(0, first - substr.length - 3)
      let substr1 = str.slice(first + 1, bracketIndex + 1)
      let substr2 = str.slice(first + 1 + substr1.length)
      
      substr1 = calcAllLog(substr1)

      return calcAllLog(substr0 + log(eval(substr1), eval(substr)) + substr2)
    } else {
      
      let flag = '_'

      if (str[first + 1] === 'l') flag = ''

      let re = new RegExp(`[\\+\\-\\*\\/\\)${flag}]`)

      let substr = str.slice(0, first).split('log').pop()
      let substr0 = str.slice(0, first - substr.length - 3)
      let substr1 = str.slice(first + 1).split(re).shift()
      let substr2 = str.slice(first + 1 + substr1.length)

      substr1 = calcAllLog(substr1)

      console.log(substr0, substr, substr1, substr2)

      return calcAllLog(substr0 + log(eval(substr1), eval(substr)) + substr2)
    }
  }
  
  return str
}

const calc = () => {
  try {
    if (!Number(input.value)) previous = input.value
    inputString = input.value.replace(',', '.')
    inputString = calcAllLog(calcAllFac(inputString))
    input.value = inputString && String(eval(inputString)).replace('.', ',')
  } catch(e) {
    console.log('calc error')
  }
}

const clean = (str: string, hardMode: boolean): {} => {
  try {
    let flag = str.slice(input.selectionStart - 1, input.selectionEnd)
    .match(/[^0-9\-\/\*\+()\.\,\!elog\_]/g)
    let selectionStart: number = input.selectionStart
    let selectionEnd: number = input.selectionEnd 

    str = str.replace(/[^0-9\-\/\*\+()\.\,\!elog\_]/g, '')

    if (strictMode || hardMode) {
      str = str.replace(/(\*[\+\-\.\,\/\!])/g, '*')
      .replace(/(\*{3})/g, '**')
      .replace(/(\![0-9])|(\!+)/g, '!')
      .replace(/(\+[\*\-\.\,\/\!])|(\++)/g, '+')
      .replace(/(\-[\+\*\.\,\/\!])|(\-+)/g, '-')
      .replace(/(\/[\+\-\.\,\*\!])|(\/+)/g, '/')
      .replace(/(\,[\+\-\.\*\/\!])|(\,+)/g, ',')
      .replace(/(\.[\+\-\*\,\/\!])|(\.+)/g, '.')
      .replace(/e[^0-9]/g, 'e')
      .replace(/\([^\-0-9l\(\)]/g, '(')

      if (!['-', 'l', '(', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(str[0])) str = str.slice(1)
    }

    let obj: Obj = {str, selectionStart, selectionEnd, flag}

    return obj
  } catch(e) {
    console.log('filter error')
    return {str}
  }
}
const showInputErrors = () => {
  input.setSelectionRange(2, 5)
}


//Handlers

const cleanBtnHandler = (event: any) => {
  let cleanInput: Obj = clean(input.value, true)
  input.value = cleanInput.str
}

const inputHandler = (event: any) => {
  let value: any = event.target.value
  
  let cleanInput: Obj = clean(value, false)
  input.value = cleanInput.str

  setCursor(cleanInput.flag, cleanInput.selectionStart, cleanInput.selectionEnd)
}

const calcBtnHandler = (event: any) => {
  calc()
}

const onkeydownHandler = (event: KeyboardEvent)  => {

  if (event.key === 'Enter') {
    event.preventDefault();
    calc()
  }

  if (event.ctrlKey && ['z', 'Z', '??', '??'].includes(event.key)) {
    event.preventDefault();
    if (input.value !== previous ) {
      next = input.value
      input.value = previous
    }
  }

  if ((event.ctrlKey && event.shiftKey && ['z', 'Z', '??', '??'].includes(event.key)
      || event.ctrlKey && ['y', 'Y', '??', '??'].includes(event.key))) {
    event.preventDefault();
    if (input.value !== next) {
      previous = input.value
      input.value = next
    }
  }

  if (event.key === ' ') {
    event.preventDefault();
    let cleanInput: Obj = clean(input.value, true)
    input.value = cleanInput.str
    setCursor(cleanInput.flag, cleanInput.selectionStart, cleanInput.selectionEnd)
  }

  if (['r', 'R', '??', '??'].includes(event.key)) {
    strictModeInput.checked = !strictModeInput.checked
    strictModeInputHandler(null)
  }
  
  // console.log(event.key)
}

const onkeypressHandler = (event: KeyboardEvent) => {
  if (['q', 'Q', '??', '??'].includes(event.key)) {
    event.preventDefault();
    if (clickQ) {
      input.setSelectionRange(input.value.length, input.value.length)
      clickQ = false
    } else {
      showInputErrors()
      clickQ = true
    }
  }

  if (['d', 'D', '??', '??'].includes(event.key)) {
    event.preventDefault();
    input.selectionStart += 1
  }

  if (['a', 'A', '??', '??'].includes(event.key)) {
    event.preventDefault();
    if (input.selectionEnd > 0) input.selectionEnd -= 1
  }

  if (['s', 'S', '??', '??'].includes(event.key)) {
    event.preventDefault();
    input.selectionStart += 5
  }

  if (['w', 'W', '??', '??'].includes(event.key)) {
    event.preventDefault();
    input.selectionEnd > 5 ? input.selectionEnd -= 5 : input.selectionEnd -= input.selectionEnd
  }

  // console.log(event.key)
}

const strictModeInputHandler = (event: any) => {
  strictMode = strictModeInput.checked 
  if (strictMode) {
    let cleanInput: Obj = clean(input.value, false)
    input.value = cleanInput.str
  }
}


//Listeners

cleanBtn.addEventListener('click', cleanBtnHandler)
calcBtn.addEventListener('click', calcBtnHandler)
input.addEventListener('input', inputHandler)
document.body.onkeydown = onkeydownHandler
input.onkeypress = onkeypressHandler
strictModeInput.addEventListener('click', strictModeInputHandler)


//Code

correct()