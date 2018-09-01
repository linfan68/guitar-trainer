import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Howl } from 'howler'
import { setInterval } from 'timers';

@Component
export default class Ticker extends Vue {
  @Prop({ default: 120 }) public bpm: number
  @Prop({ default: 1/16 }) public noteLength: number
  @Prop({ default: 1/4 }) public beatLength: number
  @Prop({ default: 4 }) public beatsPerMeasure: number
  @Prop({ default: 1 }) public prepareBeats: number
  
  public measuresPerBlock: number = 4
  public measuresPerBlockOptoins: number[] = [1, 2, 4]
  public totalNotes: number = 0
  public ticking: boolean = false
  public dingAt: number = 0

  public get notesPerBeat () {
    return Math.round(this.beatLength / this.noteLength)
  }
  public get currentNote () {
    if (this.totalNotes < 0) return 0
    return (this.totalNotes % this.notesPerBeat)
  }
  public get totalBeats () {
    if (this.totalNotes < 0) return 0
    return (this.totalNotes / this.notesPerBeat)
  }
  public get totalMeasure () {
    return Math.floor(this.totalBeats / this.beatsPerMeasure)
  }
  public get currentBlock() {
    return Math.floor(this.totalMeasure / this.measuresPerBlock)
  }
  @Watch('currentBlock') public currentBlockChanged(val: Ticker['currentBlock']) {
    this.$emit('nextBlock', val)
  }


  public get beatDots () {
    const dots = Array(this.notesPerBeat).fill(0).map((v, idx) => ({key: idx, v}))
    dots[this.currentNote].v = 1
    if (this.currentNote === this.dingAt) {
      dots[this.currentNote].v = 2
    }
    return dots
  }
  private _sounds: Howl[]
  public mounted () {
    this._sounds = [
      new Howl({ src: [require('../assets/ding.wav')] }),
      new Howl({ src: [require('../assets/da.wav')] }),
      new Howl({ src: [require('../assets/ka.wav')] })
    ]
  }

  private _timer: number | undefined
  public onStart () {
    this.ticking = true
    if (this._timer) {
      window.clearInterval(this._timer)
      this._timer = undefined
    }
    console.log('onStart')
    this.totalNotes = -this.notesPerBeat - 1
    this._timer = window.setInterval(() => {
      this.totalNotes++
      if (this.totalNotes < 0) {
        this._sounds[2].play()
      }
      else {
        if (this.dingAt === this.currentNote) {
          this._sounds[0].play()
        } else {
          this._sounds[1].play()
        }
      }
    }, 1000 * 60 / 120)
    console.log(this._timer)
  }
  public onStop () {
    this.ticking = false
    console.log(this._timer)
    if (this._timer) {
      window.clearInterval(this._timer)
      this._timer = undefined
    }
  }
}
