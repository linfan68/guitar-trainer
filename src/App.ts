import { Component, Vue, Watch } from 'vue-property-decorator'
import StaveLine from './components/StaveLine.vue'
import Ticker from './components/Ticker.vue'
import RhythmBank from './components/RhythmBank.vue'
import MidiPlayer from './components/MidiPlayer.vue'
import { ITcker } from './components/Ticker'
import { BarNotes } from '@/scripts/rhythmPatterns'

const BLOCK_SIZE = 5
@Component({
  components: { StaveLine, Ticker, RhythmBank, MidiPlayer },
})
export default class App extends Vue {
  public currentIdx = 0
  public startFrom: number = 0
  public lines: BarNotes[] = []
  public isTickerPlaying: boolean = false

  public get paging () {
    return this.lines.length > 20
  }

  public get startFromOptions() {
     return Array(Math.ceil(this.lines.length / BLOCK_SIZE))
    .fill(0).map((v, idx) => idx * BLOCK_SIZE)
  }

  @Watch('startFrom') startFromChanged(val: number) {
    if (this.getBlockStart() !== this.startFrom) {
      this.currentIdx = this.startFrom
    }
  }
  @Watch('currentIdx') currentIdxChanged(val: number) {
    if (this.getBlockStart() !== this.startFrom) {
      this.startFrom = this.getBlockStart()
    }
  }
  @Watch('notes') notesChanged(val: number) {
    this.currentIdx = 0
  }

  private getBlockStart () {
    return Math.floor(this.currentIdx / BLOCK_SIZE) * BLOCK_SIZE
  }

  private get notesWithIdx () { return this.lines.map((n, idx) => ({ line: n, idx, key: JSON.stringify(n) + idx })) }
  public get noteBlock () {
    if (this.paging)
      return this.notesWithIdx.slice(this.startFrom, this.startFrom + BLOCK_SIZE)
    else
    return this.notesWithIdx
  }
  public get previewNote () {
    if (this.paging)
      return this.notesWithIdx[this.startFrom + BLOCK_SIZE]
    else
      return undefined
  }
  public get currentNote () {
    const current = this.notesWithIdx[this.currentIdx]
    return current ? current.line : null
  }

  public get nextNote () {
    const current = this.notesWithIdx[this.currentIdx + 1]
    return current ? current.line : null
  }

  public onNewLine() {
    this.currentIdx = (this.currentIdx + 1) % this.lines.length
  }

  public onSelect (idx: number) {
    if (idx < 0) return
    this.currentIdx = idx;
  }

  public playStop () {
    this.getTicker().playStop()
  }

  private getTicker () {
    return (this.$refs['ticker'] as any as ITcker)
  }
      
  created() {
    console.log()
  }
}
