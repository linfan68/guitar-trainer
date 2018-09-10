import { compose, shuffleArray, shuffle } from '@/scripts/utils';
import { randomBytes } from 'crypto';

function breakIntoParts (pattern: string, n: number) {
  return Array(pattern.length / n).fill(0).map((v, idx) => idx * n)
  .map(cstart => pattern.substr(cstart, n))
}

function repeatCount (pattern: string, win: number) {
  const chunkWin = Math.pow(2, Math.ceil(Math.log2(win)))
  if (pattern.length % chunkWin !== 0) throw new Error('invalid size' + pattern.length + ' ' + chunkWin)
  const chunks = breakIntoParts(pattern, chunkWin)
  return chunks.map(c => c.substr(0, win)).filter((v, i, s) => s.indexOf(v) === i).length
}

function estimateLevel (pattern: string) {
  let score = 0
  const testSizes = [4, 3, 2]
  testSizes.forEach(v => { score += v * repeatCount(pattern, v) })
  pattern.split('').forEach((v, i, s) => {
    if (i > 0) {
      score += (s[i] !== s[i -1] ? 1 : 0)
    }
  })
  return score
}

export function createRandomPatterns (size: number, count: number) {
  const base = createPatterns(4)
  return Array(count).fill(0).map(v => {
    return Array(size / 4).fill(0).map(vv => {
      return base[Math.floor(Math.random() * base.length)].p
    }).join('')
  })
}

export function createPatterns (n: number) {
  return Array(Math.pow(2, n)).fill(0).map((v, idx) => idx)
  .filter(idx => idx > 0)
  .map(i => i.toString(2).padStart(n, '0'))
  .filter(p => !breakIntoParts(p, 4).includes('0000') )
  .map(p => ({
    p: p,
    score: estimateLevel(p)
  }))
  .sort((a, b) => a.score - b.score)
}

export function mapPatternToNotes(p: string){
  const pc = Array(p.length / 4).fill(0).map((v, idx) => idx * 4)
  .map(c => p.substr(c, 4))
  .map(pp => pp.replace(/0000/g, 'D'))
  .map(pp => pp.replace(/000/g, 'C'))
  .map(pp => pp.replace(/00/g, 'B'))
  .map(pp => pp.replace(/0/g, 'A'))
  .join('')
  console.log(`${p} ${pc}`)
  const restNoteA = ':16 ##'
  const restNoteB = ':8 ##'
  const restNoteC = ':8d ##'
  const restNoteD = ':q ##'
  const beatNote = ':16 X/4'
  let res = pc.split('').map(n => {
    if (n === 'A') return restNoteA
    if (n === 'B') return restNoteB
    if (n === 'C') return restNoteC
    if (n === 'D') return restNoteD
    if (n === '1') return beatNote
  }).join(' ')
  return res
}

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
export function generateVtNotes(n: number, options: IGenerationOptions) {
  let patterns = generateSplits(n).map(p => {
    return p.split('').map(n => compose<NoteSpec>({
      duration: parseInt(n),
      symbol: '(B/4)',
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
      symbol: '(B/4)',
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