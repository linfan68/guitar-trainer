import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Howl } from 'howler'
import { setInterval } from 'timers';

@Component
export default class HelloWorld extends Vue {
  @Prop({default: 120 }) public bpm: number
  @Prop({default: 4 }) public beatsPerMeasure: number
  @Prop({default: 0 }) public dingAt: number
  @Prop({default: 4 }) public measuresPerBlock: number

  public currentBeat: number = 0
  public currentMeasure: number = 0
  public ticking: boolean = false

  public get beatDots () {
    const dots = Array(this.beatsPerMeasure).fill(0).map((v, idx) => ({key: idx, v}))
    dots[this.currentBeat].v = 1
    if (this.currentBeat === this.dingAt) {
      dots[this.currentBeat].v = 2
    }
    return dots
  }
  private _sounds: Howl[]
  public mounted () {
    this._sounds = [
      new Howl({ src: [require('../assets/ding.wav')] }),
      new Howl({ src: [require('../assets/da.wav')] })
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
    this.currentBeat = this.beatsPerMeasure - 1
    this.currentMeasure = -1
    this._timer = window.setInterval(() => {
      if (this.currentBeat === this.beatsPerMeasure - 1) {
        this.currentMeasure++
      }
      if (this.currentMeasure > 0 && this.currentMeasure & this.measuresPerBlock) {
        this.$emit('nextBlock', this.currentMeasure)
      }

      this.currentBeat = (this.currentBeat + 1) % this.beatsPerMeasure
      if (this.dingAt === this.currentBeat) {
        this._sounds[0].play()
      } else {
        this._sounds[1].play()
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
