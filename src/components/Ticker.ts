import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
require('../thirdparty/vextab-div')
import * as Vex from 'vexflow'
import { MidiPlay } from '../thirdparty/MidiPlay'
import { SimplePlayer } from '../thirdparty/SimplePlayer'

declare const VexTab: any
declare const Artist: any
const Renderer = Vex.Flow.Renderer;

@Component
export default class Ticker extends Vue {
  @Prop({ default: 1/16 }) public noteLength: number
  @Prop({ default: 1/4 }) public beatLength: number
  @Prop({ default: 4 }) public beatsPerBar: number
  @Prop({ default: 1 }) public prepareBeats: number
  @Prop({ default: null }) public note: string | null
  
  public isLoading: boolean = true
  public isReadyPlay: boolean = false
  public barRepeat: number = 4
  public barRepeatOptoins: number[] = [0.5, 1, 2, 4, 8]
  public bpm: number = 30
  public bpmOptions: number[] = [20, 30, 40, 50, 60]
  public playing: boolean = false
  public dingAt: number = 0
  public beatCount: number = -1
  public playVoice: boolean = false
  
  public get allConfigs () {
    return [
      this.barRepeat,
      this.barRepeatOptoins,
      this.bpm,
      this.bpmOptions,
      this.playing,
      this.dingAt,
      this.playVoice
    ]
  }

  @Watch('allConfigs') allConfigsChanged (val: Ticker['allConfigs']) {
    console.log('allConfigs start')
    if (this._player) this.onStart(true)
  }

  @Watch('note') noteChanged (val: Ticker['note']) {
    console.log('note start')
    this.onStart(false)
  }

  public get beatDots () {
    return Array(4).fill(0).map((v, idx) => idx)
    .map(i => {
      return { key: i, v: (i === this.beatCount) ? (i === this.dingAt ? 2 : 1) : 0 }
    })
  }

  public async mounted () {
    this.isLoading = true
    await MidiPlay.load()
    this.isLoading = false
  }

  private _player: SimplePlayer | undefined
  private async onStart (withPrepare: boolean = true) {
    this.onStop()
    console.log('onStart')
    await this.$nextTick()
    if (!this.note) return
    // Create VexFlow Renderer from canvas element with id #boo.
    const ele = this.$refs['boo'] as HTMLElement
    if (!ele) return
    while (ele.hasChildNodes()) {
        ele.removeChild(ele.childNodes[0]);
    }
    const renderer = new Renderer(ele, Renderer.Backends.SVG);

    const artist = new Artist(10, 10, 70, {scale: 0.01});
    const vextab = new VexTab(artist);
    this.beatCount = -1
    try {
        vextab.parse(`tabstave notation=true tablature=false\n notes ${this.note}\n`)
        artist.draw(renderer)
        const voices: Vex.Flow.Voice[][] = artist.getPlayerData().voices
        this._player = MidiPlay.playVexVoice({
          voices: voices,
          bpm: this.bpm,
          repeat: this.barRepeat,
          dingAt: this.dingAt,
          playVoice: this.playVoice,
          velocity: 127,
          prepareBeats: 1, // withPrepare ? 1 : 0,
          beatCallback: beatCount => {
            this.beatCount = beatCount
          }
        })
        this._player.start().then(() => {
          this.onStop()
          this.$emit('finishedPlay')
        })
    } catch (e) {
        console.log(e);
    }
    this.playing = true
  }

  private onStop () {
    console.log('onStop')
    if (this._player) {
      this._player.stop()
      this._player = undefined
    }
  }
  public newPage () {
    if (this.bpm <= 210) return
    if (this._player) {
      this.onStop()
      setTimeout(() => {
        this.onStart()
      }, 200)
    }
  }
  public onClick () {
    const wasPlaying = this._player ? true : false
    if (wasPlaying) this.onStop()
    else this.onStart(true)
  }

  public begin () {
    MidiPlay.playNote(60)
    this.isReadyPlay = true
  }
}
