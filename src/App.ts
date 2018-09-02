import { Component, Vue, Watch } from 'vue-property-decorator'
import StaveLine from './components/StaveLine.vue'
import Ticker from './components/Ticker.vue'
import { Flow as VF }  from 'vexflow'
import { createPatterns, mapPatternToNotes, createRandomPatterns } from '@/scripts/createPatterns'

type TraingType = 'EachBeat-15' | '2Beats-200+' | 'Random-100'

const BLOCK_SIZE = 5
@Component({
  components: { StaveLine, Ticker},
})
export default class App extends Vue {
  public currentIdx = 0

  public type: TraingType = 'EachBeat-15'
  public typeOptions: TraingType[] = ['EachBeat-15', '2Beats-200+', 'Random-100']

  public startFrom: number = 0
  public get startFromOptions() {
    return Array(Math.floor(this.patterns.length / BLOCK_SIZE))
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

  private getBlockStart () {
    return Math.floor(this.currentIdx / BLOCK_SIZE) * BLOCK_SIZE
  }

  public get patterns () {
    switch (this.type) {
      case 'EachBeat-15': return createPatterns(4).map((pp, i) => ({ p: pp.p.repeat(4), i }))
      case '2Beats-200+': {
        let patterns = createPatterns(8)
        patterns = patterns.filter(p => p.p.substr(0, 4) !== p.p.substr(4, 4))
        return patterns.map((pp, i) => ({ p: pp.p.repeat(2), i }))
      }
      case 'Random-100': {
        let patterns = createRandomPatterns(16, 100)
        return patterns.map((pp, i) => ({ p: pp, i }))
      }
    }
  }

  public get notes () {
    return [
      this.patterns.slice(this.startFrom, this.startFrom + BLOCK_SIZE)
      .map(p => ({
        noteStr: mapPatternToNotes(p.p),
        idx: p.i
      })),
      this.patterns.slice(this.startFrom + BLOCK_SIZE, this.startFrom + BLOCK_SIZE + 1)
      .map(p => ({
        noteStr: mapPatternToNotes(p.p),
        idx: p.i
      })),
    ]
  }
  
  public onNewBlock() {
    this.currentIdx = (this.currentIdx + 1) % this.patterns.length
  }

  public onSelect (idx: number) {
    if (this.currentIdx === idx) {
      (this.$refs['ticker'] as any).onClick()
    } else {
      (this.$refs['ticker'] as any).onStart()
    }
    this.currentIdx = idx;
  }
      
  created() {
    console.log()
  }
}
