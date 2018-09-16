import { Component, Vue, Watch } from 'vue-property-decorator'
import { MidiPlay } from '../thirdparty/MidiPlay'
var Tonal = require("tonal")

@Component
export default class MidiPlayer extends Vue {
  public noteNumber: number = 60
  public async playNote () {
    MidiPlay.playNote(this.noteNumber)
  }
  public async showScales () {
    const scaleNames = [
      'ionian',
      'dorian',
      'phrygian',
      'lydian',
      'mixolydian',
      'aeolian',
      'locrian'
    ]
    const cycleOfFifth = ['C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F']
    scaleNames.forEach(name => {
      cycleOfFifth.forEach(n => {
        const scaleName = `${n} ${name}`
        console.log(`${scaleName.padStart(16)}: [${Tonal.Scale.notes(scaleName).map((c: any) => c.padStart(3, ' ')).join(', ')}]`)
      })  
    })
  }
  public async changeNote(delta: number) {
    this.noteNumber += delta
    await this.playNote()
  } 

  public async mounted () {
    await MidiPlay.load()
    console.log('Loaded')
  }
}
