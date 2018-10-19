import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
require('../thirdparty/vextab-div')
import * as Vex from 'vexflow'
import { MidiPlay } from '../thirdparty/MidiPlay'
import { SimplePlayer } from '../thirdparty/SimplePlayer'
import { ScriptNotes } from '@/scripts/rhythmPatterns';

declare const VexTab: any
declare const Artist: any
const Renderer = Vex.Flow.Renderer

export interface ITcker {
  playStop(): void
}

@Component
export default class Ticker extends Vue implements ITcker {
  @Prop({ default: 1/16 }) public noteLength: number
  @Prop({ default: 1/4 }) public beatLength: number
  @Prop({ default: 4 }) public beatsPerBar: number
  @Prop({ default: 1 }) public prepareBeats: number
  @Prop({ default: null }) public script: ScriptNotes | null
  @Prop({ default: null }) public nextScript: ScriptNotes | null
  
  public isLoading: boolean = true
  public barRepeat: number = 4
  public barRepeatOptoins: number[] = [1, 2, 4, 8, 16]
  public bpm: number = 30
  public bpmOptions: number[] = [30, 33, 36, 40, 44, 48, 53, 58, 60, 64, 71, 79, 86, 94, 103, 114, 120, 125, 138, 150, 167, 180]
  public tickAt16th: boolean = false
  public isPlaying: boolean = false
  public dingAt: number = 0
  public beatCount: number = -1
  public playVoice: boolean = false
  public continuePlayWoPrepare: boolean = false
  
  public get allConfigs () {
    return [
      this.barRepeat,
      this.barRepeatOptoins,
      this.bpm,
      this.bpmOptions,
      this.dingAt,
      this.playVoice,
      this.tickAt16th
    ]
  }

  @Watch('allConfigs') allConfigsChanged (val: Ticker['allConfigs']) {
    console.log('allConfigs start')
    if (this.isPlaying && this._player) this.onStart()
  }

  @Watch('isPlaying') isPlayingChanged (val: Ticker['isPlaying']) {
    this.$emit('update:isPlaying', val)
  }

  public get beatDots () {
    return Array(4).fill(0).map((v, idx) => idx)
    .map(i => {
      return { key: i, v: (i === this.beatCount) ? (i === this.dingAt ? 2 : 1) : 0 }
    })
  }

  public async mounted () {
    this.isLoading = true
    console.log('Ticker mounted')
    await MidiPlay.load()
    this.isLoading = false
  }

  private _player: SimplePlayer | undefined
  private async onStart () {
    MidiPlay.activate()
    this.onStop()
    console.log('onStart')
    await this.$nextTick()
    if (!this.script) return
    this.isPlaying = true
    this.scheduleNotes(this.script, 0)
  }

  private onStop () {
    console.log('onStop')
    if (this._player) {
      this._player.stop()
      this._player = undefined
    }
    this.isPlaying = false
  }

  public playStop () {
    const wasPlaying = this._player ? true : false
    if (wasPlaying) this.onStop()
    else this.onStart()
  }

  public onActivate () {
    MidiPlay.activate()
  }

  private scheduleNotes (script: ScriptNotes, targetStartTime?: number, autoContinue: boolean = false) {
    // Create VexFlow Renderer from canvas element with id #boo.
    this.beatCount = -1
    try {
        // console.log('Play: ' + note)
        this._player = MidiPlay.playScriptNotes(
          script,
          {
            bpm: this.bpm,
            repeat: this.barRepeat,
            dingAt: this.dingAt,
            playVoice: this.playVoice,
            delaySec: targetStartTime ? ((targetStartTime - new Date().getTime()) / 1000): 0,
            tickDuration: this.tickAt16th ? ':16' : ':q',
            prepareBeats: (autoContinue && this.continuePlayWoPrepare) ? 0 : (this.tickAt16th ? 1 : 4), // withPrepare ? 1 : 0,
            beatCallback: beatCount => {
              this.beatCount = beatCount
          }
        })

        this._player.start().then(() => {
          if (!this.nextScript) {
            this.onStop()
          }
          this.$emit('finishedPlay')
        })
        this._player.aboutToStop().then((timeToStop) => {
          console.log('about to stop')
          if (this.nextScript) {
            this.scheduleNotes(this.nextScript, timeToStop, true)
          }
        })
    } catch (e) {
        console.log(e);
    }
  }
}
