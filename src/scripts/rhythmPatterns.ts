import { compose, shuffleArray, shuffle } from '@/scripts/utils'

export function generateSplits(n: number): string[] {
  if (n === 1) return ['1']
  const res: string[] = []
  Array(n - 1).fill(0).map((i, idx) => idx + 1)
  .forEach(leftCount => {
    const left = generateSplits(leftCount)
    const right = generateSplits(n - leftCount)
    left.forEach(l => {
      right.forEach(r => {
        res.push(l + r)
      })
    })
    res.push(`${n}`)
  })
  return res.filter((v, i, s) => s.indexOf(v) === i)
}

interface NoteSpec {
  duration: number
  symbol: string
  rest: boolean
}
const noteLength16th: {[key: number]: string} = {
  1: ':16',
  2: ':8',
  3: ':8d',
  4: ':q'
}

function toVexTabNotation (notes: NoteSpec[]) {
  return notes.map(n => `${noteLength16th[n.duration]} ${n.symbol}`).join(' ')
}

const restSymbol = '##'

function pickPatterns(n: number, noZeros: boolean, noOnes: boolean) {
  return Array(Math.pow(2, n) - (noOnes?1:0)).fill(0).map((v, idx) => idx + (noZeros?1:0))
  .map(v => v.toString(2).padStart(n, '0'))
  .filter(p => p.replace('11', '1').length === p.length)
  .map(v => v.split('').map(c => c === '1'))
}
function insertRests(notes: NoteSpec[]) {
  const newNotes: NoteSpec[][] = []
  const patterns = pickPatterns(notes.length, false, true)
  return patterns.map(pick => {
    return notes.map((v, i): NoteSpec => {
      return pick[i]
      ? {...v, symbol: restSymbol}
      : v
    })
  })
}

export interface IGenerationOptions {
  withRest?: boolean
  shuffle?: boolean
}

export function generate16thNotes(options: IGenerationOptions) {
  let patterns = ['1111'].map(p => {
    return p.split('').map(n => compose<NoteSpec>({
      duration: parseInt(n),
      symbol: '(C/4.E/4.G/4)',
      rest: false
    }))
  })
  patterns = applyOptions(options, patterns)
  return patterns.map(n => toVexTabNotation(n))
}

export function generate4thNotes(options: IGenerationOptions) {
  let patterns = generateSplits(4).map(p => {
    return p.split('').map(n => compose<NoteSpec>({
      duration: parseInt(n),
      symbol: '(C/4.E/4.G/4)',
      rest: false
    }))
  })
  patterns = applyOptions(options, patterns)
  return patterns.map(n => toVexTabNotation(n))
}

function applyOptions(options: IGenerationOptions, patterns: NoteSpec[][]) {
  if (options.withRest) {
    patterns = Array<NoteSpec[]>(0).concat(...patterns.map(n => insertRests(n)))
  }
  if (options.shuffle) {
    patterns = shuffleArray('a very random string', patterns)
  }
  return patterns
}

export function generateTripleNotes(options: IGenerationOptions) {
  let patterns = ['222'].map(p => {
    return p.split('').map(n => compose<NoteSpec>({
      duration: parseInt(n),
      symbol: '(C/4.E/4.G/4)',
      rest: false
    }))
  })
  patterns = applyOptions(options, patterns)
  return patterns.map(n => toVexTabNotation(n) + '^3^')
}

export function mixPatternsToBar(count: number, A: string[], B: string[], bMix: number) {
  const beats = 4
  let templateFn: () => string
  if (bMix === Math.round(bMix)) {
    templateFn = () => {
      return shuffle(('b'.repeat(bMix) + 'a'.repeat(beats - bMix)).split('')).join('')
    }
  } else {
    templateFn = () => {
      return Array(beats).fill(0).map(v => {
        return Math.random() < bMix ? 'b' : 'a'
      }).join('')
    }
  }

  return Array(count).fill(0).map(v => {
    const template = templateFn()
    return template.split('').map(v => {
      const pick = v === 'a' ? A : B
      return pick[Math.floor(Math.random() * pick.length)]
    }).join(' ')
  })
}