import { compose, shuffleArray, shuffle } from '@/scripts/utils'

// Annotation interfaces
export type DurationText = ':16' | ':8' | ':8d' | ':q' | ':8t'
export interface NoteSpec {
  duration: DurationText
  symbol: string
  isRest: boolean
  isTied: boolean
  tiedDuration?: DurationText
}
export function note2VexTabText (note: NoteSpec) {
  const durationText = note.duration === ':8t' ? ':8' : note.duration
  return `${durationText} ${note.isTied ? 't' : ''} ` + (note.isRest ? `##` : `(${note.symbol})`)
}

export interface BeatNotes {
  notes: NoteSpec[]
  tuplets?: '^3^' | '^5^'
}
export function beat2VexTabText (beat: BeatNotes) {
  return beat.notes.map(n => note2VexTabText(n)).join(' ') + (beat.tuplets || '')
}

export interface BarNotes {
  beats: BeatNotes[]
}
export function bar2VexTabText (bar: BarNotes) {
  return bar.beats.map(b => beat2VexTabText(b)).join(' ')
}
export function bars2VexTabText (bars: BarNotes[]) {
  return bars.map(b => bar2VexTabText(b)).join(' | ')
}

export interface ScriptNotes {
  header: string
  bars: BarNotes[]
}
export function script2VexTabText (s: ScriptNotes) {
  return `${s.header} ${bars2VexTabText(s.bars)}`
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

const noteLengthMapping: {[key: number]: DurationText} = {
  1: ':16',
  2: ':8',
  3: ':8d',
  4: ':q'
}

const restSymbol = '##'

function pickPatterns(n: number, noZeros: boolean, noOnes: boolean) {
  return Array(Math.pow(2, n) - (noOnes?1:0)).fill(0).map((v, idx) => idx + (noZeros?1:0))
  .map(v => v.toString(2).padStart(n, '0'))
  .filter(p => p.replace('11', '1').length === p.length)
  .map(v => v.split('').map(c => c === '1'))
}
function insertRests(beat: BeatNotes) {
  const newBeats: BeatNotes[] = []
  const patterns = pickPatterns(beat.notes.length, false, true)
  return patterns.map(pick => {
    return compose<BeatNotes>({
      notes: beat.notes.map((v, i): NoteSpec => {
        return pick[i]
        ? {...v, symbol: restSymbol, isRest: true}
        : v
      })
    })
  })
}

export interface IGenerationOptions {
  withRest?: boolean
  shuffle?: boolean
}

export function generate16thNotes(options: IGenerationOptions): BeatNotes[] {
  return ['1111'].map(p => {
    return {
      notes: p.split('').map(n => compose<NoteSpec>({
        duration: noteLengthMapping[parseInt(n)],
        symbol: 'C/4.E/4.G/4',
        isRest: false,
        isTied: false,
      }))
    }
  })
}

export function generate4thNotes(options: IGenerationOptions): BeatNotes[] {
  const beatNotes = generateSplits(4).map(p => {
    return {
      notes: p.split('').map(n => compose<NoteSpec>({
        duration: noteLengthMapping[parseInt(n)],
        symbol: 'C/4.E/4.G/4',
        isRest: false,
        isTied: false
      }))
    }
  })
  return applyOptions(options, beatNotes)
}

export function generateTripleNotes(options: IGenerationOptions) {
  let patterns = ['222'].map((p): BeatNotes => {
    return {
      notes: p.split('').map(n => compose<NoteSpec>({
        duration: ':8t',
        symbol: 'C/4.E/4.G/4',
        isRest: false,
        isTied: false
      })),
      tuplets: '^3^'
    }
  })
  return applyOptions(options, patterns)
}

function applyOptions(options: IGenerationOptions, beats: BeatNotes[]) {
  let newBeats = [...beats]
  if (options.withRest) {
    beats.forEach(b => newBeats = newBeats.concat(insertRests(b)))
  }
  if (options.shuffle) {
    newBeats = shuffleArray('a very random string', newBeats)
  }
  return newBeats
}

export function mixPatternsToBar(count: number, A: BeatNotes[], B: BeatNotes[], bMix: number): BarNotes[] {
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

  return Array(count).fill(0).map((v): BarNotes => {
    const template = templateFn()
    return {
      beats: template.split('').map(v => {
        const pick = v === 'a' ? A : B
        return <BeatNotes>JSON.parse(JSON.stringify(pick[Math.floor(Math.random() * pick.length)]))
      })
    }
  })
}

export function insertTiesToBar (bars: BarNotes[], ratio: number = 0.3): BarNotes[] {
  return bars.map(bar => {
    if (bar.beats.length === 0) return bar
    const newBar: BarNotes = {
      beats: [bar.beats[0]]
    }

    for (let i = 1; i <bar.beats.length; i++) {
      const lastB = bar.beats[i - 1]
      const thisB = bar.beats[i]
      if (thisB.notes.length > 0 && lastB.notes.length > 0) {
        if (!(lastB.notes[lastB.notes.length - 1].isRest) &&
          !(thisB.notes[0].isRest)) {
          // OK to connect
          if (Math.random() < ratio) {
            thisB.notes[0].isTied = true
            lastB.notes[lastB.notes.length - 1].tiedDuration = thisB.notes[0].duration
          }
        }
      }
      newBar.beats.push(thisB)
    }
    // console.log(newBar.beats[0].notes[0].isTied)
    return newBar
  })
}