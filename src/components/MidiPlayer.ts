import { Component, Vue, Watch } from 'vue-property-decorator'
import { MidiPlay } from '../thirdparty/MidiPlay'


@Component
export default class MidiPlayer extends Vue {
  public noteNumber: number = 50
  public async playNote () {
    await MidiPlay.testSingleNote(this.noteNumber)
  }
  public async playTicker () {
    // await MidiPlay.testMidGen(this.noteNumber)
    await MidiPlay.testMidiWriter()
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
