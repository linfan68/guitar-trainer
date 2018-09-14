require('./inc/shim/Base64')
require('./inc/shim/Base64binary')
require('./inc/shim/WebAudioAPI')
require('./inc/shim/WebAudioAPI')
require('./inc/jasmid/midifile')
require('./inc/jasmid/replayer')
require('./inc/jasmid/stream')
require('./MIDI')
require('../thirdparty/vextab-div')

declare const VexTab: any
declare const Artist: any
declare const Vex: any

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

  export async function testSingleNote (note: number) {   
    const velocity = 127 // how hard the note hits

    
    const artist = new Artist(10, 10, 700, {scale: 0.8});
    const vextab = new VexTab(artist)
    vextab.parse(`tabstave notation=true tablature=false\n notes :q Cn-D-E/4 F#/5\n`)
    console.log(vextab)
    return
    // play the note
    MIDI.programChange(0, instrumnets['acoustic_grand_piano'])
    MIDI.setVolume(0, 127)
    console.log(new Date().getTime())
    Array(64).fill(0).map((v, i) => i/16)
    .forEach(delay => {
      MIDI.chordOn(0, [note, note + 4, note + 7], velocity, delay)
      MIDI.chordOn(0, [note, note + 4, note + 7], delay + 1/32)
    })
    console.log(new Date().getTime())


    console.log('started')
  }

}