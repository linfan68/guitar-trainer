require('./inc/shim/Base64')
require('./inc/shim/Base64binary')
require('./inc/shim/WebAudioAPI')
require('./inc/shim/WebAudioAPI')
require('./inc/jasmid/midifile')
require('./inc/jasmid/replayer')
require('./inc/jasmid/stream')
require('./MIDI')
require('../thirdparty/vextab-div')
var Tonal = require("tonal");
var MidiWriter = require('midi-writer-js')

import * as Vex from 'vexflow'
import { start } from 'repl';
import { SimplePlayer } from '@/thirdparty/SimplePlayer';

declare const MIDI: any

// https://www.midi.org/specifications-old/item/gm-level-1-sound-set
const instrumnets = {
  // 'synth_drum': 118,
  // 'tinkle_bell': 112,
  // 'steel_drums': 114,
  // 'melodic_tom': 117,
  'acoustic_grand_piano': 0,
  'woodblock': 115
}
enum MidiMessage {
  On = 144,
  Off = 128
}

export module MidiPlay {
  export async function load () {
    console.log('====MidiPlay.load() ====')
    return new Promise(res => {
      MIDI.loadPlugin({
        soundfontUrl: 'http://guitar-trainer.oss-cn-beijing.aliyuncs.com/sound-fonts/FluidR3_GM/',
        // soundfontUrl: 'http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/',
        instruments: Object.keys(instrumnets),
        onsuccess: () => {
          console.log('====MidiPlay.load() DONE ====')
          res()
        }
      })
    })
  }

  export async function activate () {
    MIDI.programChange(0, instrumnets['acoustic_grand_piano'])
    MIDI.chordOn(0, [60], 1, 0)
    MIDI.chordOff(0, [30], 0.05)
  }

  export async function playNote (note: number) {
    MIDI.programChange(0, instrumnets['acoustic_grand_piano'])
    MIDI.chordOn(0, [note], 127, 0)
    MIDI.chordOff(0, [note], 0.5)
  }

  export interface PlayConfig {
    voices: Vex.Flow.Voice[][]
    repeat: number
    bpm: number
    delaySec: number
    notePerBeat: number
    prepareBeats: number
    playVoice: boolean
    dingNote: number
    daNote: number
    prepareNote: number
    tickDuration: string
    dingAt: number
    beatCallback: ((i: number) => void) | undefined
  }
  const defaultConfig: PlayConfig = {
    voices: [],
    playVoice: false,
    repeat: 1,
    bpm: 30,
    delaySec: 0.0,
    tickDuration: '16',
    prepareBeats: 1,
    notePerBeat: 1/4,
    dingNote: 100,
    daNote: 50,
    prepareNote: 30,
    dingAt: 0,
    beatCallback: undefined
  }


  export function playVexVoice (inputConfig: Partial<PlayConfig>) {
    activate()
    const config = {
      ...defaultConfig,
      ...inputConfig
    }

    const player = new SimplePlayer()

    const beatDuration = 60 / config.bpm
    const noteDuration = beatDuration / config.notePerBeat!
    const durationMap: {[key:string]: number} = {
      'h': 1/2 * noteDuration,
      'q': 1/4 * noteDuration,
      '8': 1/8 * noteDuration,
      '16': 1/16 * noteDuration
    }
    
    player.addEvent(-1, () => {
      MIDI.programChange(0, instrumnets['acoustic_grand_piano'])
      MIDI.setVolume(0, 63)
      MIDI.programChange(1, instrumnets['woodblock'])
      MIDI.setVolume(1, 127)
      return 0
    })
    
    const addTicks = (startTime: number, duration: number, isPrepare: boolean) => {
      let time = 0
      while (time < duration - 0.001) {
        const d = durationMap[config.tickDuration]
        let n = config.daNote
        const beatCount = Math.round(time / d) % 4
        if (beatCount === config.dingAt) {
          n = config.dingNote
        }
        if (isPrepare) n = config.prepareNote
        player.addEvent(startTime + time, () => {
          if (!isPrepare && config.beatCallback) {
            config.beatCallback(beatCount)
          } 
          MIDI.noteOn(1, n, 127, 0)
          MIDI.noteOff(1, n, d)
          return d
        })
        time += d
      }
      return duration
    }

    let currentTime = config.delaySec
    if (config.prepareBeats) {
      currentTime += addTicks(currentTime, config.prepareBeats * beatDuration, true)
    }
    const addVoices = (startTime: number) => {
      let time = 0
      Array(config.repeat).fill(0).forEach(v => {
        config.voices.forEach(vv => {
          vv.forEach(v => {
            v.getTickables().forEach(t => {
              const n = (t as (Vex.Flow.TabNote | Vex.Flow.StaveNote | Vex.Flow.BarNote))
              const keys = (n.getPlayNote() || []).map((pn: string) => Tonal.Note.midi(pn.replace('/', '')))
              let d = durationMap[n.getDuration()]
              if (!d) return
              const tup = n.getTuplet()
              if (tup) {
                d = d * (tup as any).getNotesOccupied() / tup.getNotes().length
              }
              if (n.getDots()) d *= 1.5
              if (keys.length > 0 && n.getNoteType() !== 'r' && config.playVoice) {
                player.addEvent(startTime + time, () => {
                  MIDI.chordOn(0, keys, 63, 0)
                  MIDI.chordOff(0, keys, d)
                  return d
                })
              } else {
                player.addEvent(startTime + time, () => {
                  return d
                })
              }
              time += d
            })
          })
        })
      })
      return time
    }
  
    const voiceDuration = addVoices(currentTime)
    addTicks(currentTime, voiceDuration, false)

    return player
  }
}