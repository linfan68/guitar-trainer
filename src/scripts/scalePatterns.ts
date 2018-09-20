import { partition } from '@/scripts/utils';

var Tonal = require("tonal")

class FredBoard {
  private static _board = FredBoard.initBoard()
  private static _chordShapes = FredBoard.initChordShape()

  private static initBoard () {
    const board: {[stringName: string]: string[][]} = {}
    'E2-A2-D3-G3-B3-E4'.split('-').reverse().map((openNote, idx) => {
      const stringNotes = Array(18).fill(0).map((v, idx) => idx)
      .map(fred => {
        return Tonal.Array.unique([true, false].map(useSharp => Tonal.Note.fromMidi(Tonal.Note.midi(openNote) + fred, useSharp)))
        .map((name: string) => name.substr(0, name.length - 1)) // remove octave number
      })
      board[(idx + 1).toString()] = stringNotes
    })
    return board
  }

  private static initChordShape () {
    const chordShapes: {[stringName: string]: {[stringName: string]: number}} = {}
    chordShapes['4'] = {['4']: +0, ['3']: -1, ['2']: -2, ['1']: -2}
    chordShapes['5'] = {['5']: +0, ['4']: +2, ['3']: +2, ['2']: +2, ['1']: +0}
    chordShapes['6'] = {['6']: +0, ['5']: +2, ['4']: +2, ['3']: +1, ['2']: +0, ['1']: +0}
    return chordShapes
  }

  public static findFred (noteName: string, stringNo: string, aroundFred: number = 0, noOpen: boolean = true) {    
    const stringNotes = this._board[stringNo]
    // console.log(noteName + '-->' + stringNotes.map(sn => sn.join('/')).join(','))
    const matches = stringNotes.map((names, fredNo) => {
      return {
        match: !(noOpen && fredNo === 0) && names.includes(noteName),
        dist: Math.abs(aroundFred - fredNo),
        fredNo
      }
    }).filter(r => r.match).sort((a, b) => a.dist - b.dist)
    return matches[0].fredNo
  }
  public static findFredPair (noteA: string, noteB: string, stringNo: string, aroundFred: number = 0, noOpen: boolean = true) {
    let fredA = FredBoard.findFred(noteA, stringNo, aroundFred, noOpen)
    let fredB = FredBoard.findFred(noteB, stringNo, aroundFred, noOpen)
    if (Math.abs(fredA - fredB) <= 3) return fredA

    fredA = FredBoard.findFred(noteA, stringNo, fredB, noOpen)
    return fredA
  }


  public static stringShift (from: string, delta: number) {
    let stringNo = (parseInt(from) - 1 + delta) % 6
    while (stringNo < 0) stringNo += 6
    return (stringNo + 1).toString()
  }

  public static textBelowPos(stringNo: string, shift: number = 0) {
    return `.${parseInt(stringNo) + 3 + shift}`
  }
  public static buildChord (rootString: string, fred: number) {
    const shape = this._chordShapes[rootString]
    if (!shape) return `(${fred}/${rootString})`
    const notes = Object.keys(shape).map(str => {
      return `${fred + shape[str]}/${str}`
    }).join('.')
    return `(${notes})`
  }
}

export function getScalePractice1 (scaleName: string, startString: string, reverse: boolean) {
  let notes = (Tonal.Scale.notes(`${scaleName} major`) as string[])
  notes = notes.concat(notes).concat(notes)
  notes.push(notes[0])
  let stringShifts = [0, 0, -1, -1, -2, -2, -3, -3, -4, -4, -5, -5, -6, -6, -7]
  if (reverse) {
    notes = notes.reverse()
    stringShifts = stringShifts.map(s => -s)
  }
  
  let lastFred = 0
  const seq = stringShifts.map(s => FredBoard.stringShift(startString, s)).map((stringNo, idx) => {
    let fred = 0
    if (idx != stringShifts.length - 1 && stringShifts[idx] === stringShifts[idx + 1]) {
      fred = FredBoard.findFredPair(notes[idx], notes[idx + 1], stringNo, lastFred)
    } else {
      fred = FredBoard.findFred(notes[idx], stringNo, lastFred)
    }
    lastFred = fred
    return {
      fred,
      stringNo,
      msg: `${notes[idx]}-` +  (idx%7 + 1)// String.fromCharCode(0x2170 + idx%7)
    }
    // return `${stringNo}:${notes[idx]}`
  })
  const lastNote = seq[seq.length - 1]
  // console.log(seq)
  // console.log(partition(seq, 8))
  const stave = partition(seq, 8)
  .map(subseq => subseq.map(s => `${s.fred}/${s.stringNo}`).join(' '))
  .join('|')

  const staveText1 = partition(seq, 8)
  .map(subseq => subseq.map(s => `${FredBoard.textBelowPos(s.stringNo, 1)},${s.msg}`).join(','))
  .join(',|,')
  // const staveText2 = partition(seq, 8)
  // .map(subseq => subseq.map(s => `${FredBoard.textBelowPos(s.stringNo, 2)},${s.msg2}`).join(','))
  // .join(',|,')

  return `:8 ${stave} ${FredBoard.buildChord(lastNote.stringNo, lastNote.fred)} \n`
         + `text :8,${staveText1},${FredBoard.textBelowPos('6')} \n`
        //  + `text ++,|,:8,${staveText2},${FredBoard.textBelowPos('6')}, ,| \n`
}
