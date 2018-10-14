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
