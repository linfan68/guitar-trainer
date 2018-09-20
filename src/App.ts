import { Component, Vue, Watch } from 'vue-property-decorator'
import StaveLine from './components/StaveLine.vue'
import Ticker from './components/Ticker.vue'
import RhythmBank from './components/RhythmBank.vue'
import MidiPlayer from './components/MidiPlayer.vue'


const BLOCK_SIZE = 5
@Component({
  components: { StaveLine, Ticker, RhythmBank, MidiPlayer },
})
export default class App extends Vue {
  public currentIdx = 0
  public startFrom: number = 0
  public notes: string[] = []

  public get paging () {
    return this.notes.length > 10
  }

  public get startFromOptions() {
     return Array(Math.ceil(this.notes.length / BLOCK_SIZE))
    .fill(0).map((v, idx) => idx * BLOCK_SIZE)
  }

  @Watch('startFrom') startFromChanged(val: number) {
    if (this.getBlockStart() !== this.startFrom) {
      this.currentIdx = this.startFrom
    }
    (this.$refs['ticker'] as any).newPage()
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

  private get notesWithIdx () { return this.notes.map((n, idx) => ({ noteStr: n, idx })) }
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
    return current ? current.noteStr : ''
  }
  
  public onNewLine() {
    this.currentIdx = (this.currentIdx + 1) % this.notes.length
  }

  public onSelect (idx: number) {
    if (idx < 0) return
    if (this.currentIdx === idx) {
      (this.$refs['ticker'] as any).onClick(true)
    } else {
      if (this.previewNote && idx === this.previewNote.idx) {
        this.currentIdx = this.previewNote.idx
      } else {
        (this.$refs['ticker'] as any).onClick(false)
      }
    }
    this.currentIdx = idx;
  }
      
  created() {
    console.log()
  }
}
