import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Howl } from 'howler'

@Component
export default class Ticker extends Vue {
  @Prop({ default: 1/16 }) public noteLength: number
  @Prop({ default: 1/4 }) public beatLength: number
  @Prop({ default: 4 }) public beatsPerBar: number
  @Prop({ default: 1 }) public prepareBeats: number
  
  public barsPerBlock: number = 4
  public barsPerBlockOptoins: number[] = [0.5, 1, 2, 4, 8]
  public bpm: number = 120
  public bpmOptions: number[] = [100, 120, 160, 200, 240]
  public totalNotes: number = 0
  public ticking: boolean = false
  public dingAt: number = 0
  public alternateBars:boolean = false

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
  public get totalBars () {
    return Math.floor(this.totalBeats / this.beatsPerBar)
  }
  public get rawBlock () {
    return Math.floor(this.totalBeats / this.beatsPerBar / this.barsPerBlock)
  }
  public get currentBlock() {
    if (!this.alternateBars) return this.rawBlock
    else {
      // 1 - 2 - 1 - 2 ...pattern
      return Math.floor(this.rawBlock / 3) * 2 + (this.rawBlock % 3 === 0 ? 0 : 1) 
    }
  }
  @Watch('currentBlock') public currentBlockChanged(val: Ticker['currentBlock']) {
    if (val !== 0) {
      this.$emit('nextBlock', val)
    }
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
    }, 1000 * 60 / this.bpm)
    console.log(this._timer)
  }
  public onStop () {
    this.totalNotes = -this.notesPerBeat - 1
    this.ticking = false
    console.log(this._timer)
    if (this._timer) {
      window.clearInterval(this._timer)
      this._timer = undefined
    }
  }
  public newPage () {
    if (this.bpm <= 210) return
    if (this.ticking) {
      this.onStop()
      setTimeout(() => {
        this.onStart()
      }, 200)
    }
  }
  public onClick () {
    if (this.ticking) this.onStop()
    else this.onStart()
  }
}
