import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import * as Vex from 'vexflow'
import { MidiPlay } from '@/thirdparty/MidiPlay'
import { SimplePlayer } from '@/thirdparty/SimplePlayer';
require('../thirdparty/vextab-div')

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
  
  public barRepeat: number = 4
  public barRepeatOptoins: number[] = [0.5, 1, 2, 4, 8]
  public bpm: number = 30
  public bpmOptions: number[] = [20, 30, 40, 50, 60]
  public playing: boolean = false
  public dingAt: number = 0
  public playVoice: boolean = false
  
  public get allConfigs () {
    return [
      this.barRepeat,
      this.barRepeatOptoins,
      this.bpm,
      this.bpmOptions,
      this.playing,
      this.dingAt,
      this.playVoice,
      this.note
    ]
  }

  @Watch('allConfigs') allConfigsChanged (val: Ticker['allConfigs']) {
    if (this._player) this.onStart()
  }

  public get notesPerBeat () {
    return Math.round(this.beatLength / this.noteLength)
  }
  public mounted () {
  }

  private _player: SimplePlayer | undefined
  public async onStart () {
    this.onStop()
    console.log('onStart')
    await this.$nextTick()
    if (!this.note) return
    // Create VexFlow Renderer from canvas element with id #boo.
    const ele = this.$refs['boo'] as HTMLElement
    while (ele.hasChildNodes()) {
        ele.removeChild(ele.childNodes[0]);
    }
    const renderer = new Renderer(ele, Renderer.Backends.SVG);

    const artist = new Artist(10, 10, 70, {scale: 0.1});
    const vextab = new VexTab(artist);

    try {
        vextab.parse(`tabstave notation=true tablature=false\n notes ${this.note}\n`)
        artist.draw(renderer)
        const voices: Vex.Flow.Voice[][] = artist.getPlayerData().voices
        this._player = MidiPlay.playVexVoice({
          voices: voices,
          bpm: this.bpm,
          repeat: this.barRepeat,
          playVoice: this.playVoice
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

  public onStop () {
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
    if (this._player) this.onStop()
    else this.onStart()
  }
}
