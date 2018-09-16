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
  'acoustic_grand_piano': 0,
  'synth_drum': 118,
  'woodblock': 115,
  'tinkle_bell': 112,
  'steel_drums': 114,
  'melodic_tom': 117
}
enum MidiMessage {
  On = 144,
  Off = 128
}

export module MidiPlay {
  export async function load () {
    return new Promise(res => {
      MIDI.loadPlugin({
        soundfontUrl: 'http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/',
        instruments: Object.keys(instrumnets),
        onsuccess: () => res()
      })
    })
    MIDI.Player.removeListener(); // removes current listener.
    MIDI.Player.addListener(function(data: any) { // set it to your own function!
        const end = data.end; // time when song ends
        console.log(data.note + ':' + MidiMessage[data.message] + '|' + MIDI.Player.currentTime)
    });
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
    notePerBeat: number
    prepareBeats: number
    playVoice: boolean
    velocity: number
    dingNote: number
    daNote: number
    prepareNote: number
    dingAt: number
    beatCallback: ((i: number) => void) | undefined
  }
  const defaultConfig: PlayConfig = {
    voices: [],
    playVoice: false,
    repeat: 1,
    bpm: 30,
    prepareBeats: 1,
    notePerBeat: 1/4,
    velocity: 64,
    dingNote: 100,
    daNote: 50,
    prepareNote: 30,
    dingAt: 0,
    beatCallback: undefined
  }


  export function playVexVoice (inputConfig: Partial<PlayConfig>) {
    const config = {
      ...defaultConfig,
      ...inputConfig
    }

    const player = new SimplePlayer()
    MIDI.setVolume(0, config.velocity!)

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
      MIDI.programChange(1, instrumnets['woodblock'])
      return 0
    })
    
    const addTicks = (startTime: number, duration: number, isPrepare: boolean) => {
      let time = 0
      while (time < duration) {
        const d = durationMap['16']
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
          MIDI.noteOn(1, n, config.velocity, 0)
          MIDI.noteOff(1, n, d)
          return d
        })
        time += d
      }
      return duration
    }

    let currentTime = 0
    if (config.prepareBeats) {
      currentTime += addTicks(0, config.prepareBeats * beatDuration, true)
    }
    const addVoices = (startTime: number) => {
      let time = 0
      Array(config.repeat).fill(0).forEach(v => {
        config.voices.forEach(vv => {
          vv.forEach(v => {
            v.getTickables().forEach(t => {
              const n = (t as Vex.Flow.StaveNote)
              const keys = n.getKeyProps().map(kp => kp.int_value)
              let d = durationMap[n.getDuration()]
              const tup = n.getTuplet()
              if (tup) {
                d = d * (tup as any).getNotesOccupied() / tup.getNotes().length
              }
              if (n.getDots()) d *= 1.5
              if (n.getNoteType() !== 'r' && config.playVoice) {
                player.addEvent(startTime + time, () => {
                  MIDI.chordOn(0, keys, config.velocity, 0)
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