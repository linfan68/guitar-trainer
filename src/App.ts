import { Component, Vue, Watch } from 'vue-property-decorator'
import StaveLine from './components/StaveLine.vue'
import Ticker from './components/Ticker.vue'
import { Flow as VF }  from 'vexflow'
import { createPatterns } from '@/scripts/createPatterns'

function mapPatternToNotes(p: string){
  return p.split('').map(n => {
    if (n === '0') return ':16 #3#'
    if (n === '1') return ':16 X/4'
  }).join(' ')
}

@Component({
  components: { StaveLine, Ticker},
})
export default class App extends Vue {
  public currentIdx = 0
  public get patterns () {
    return createPatterns(4)
  }

  @Watch('currentIdx') currentIdxChanged(val: number) {
    const ele = document.getElementById('stave-line-' + this.notes[val].idx)
    ele!.scrollIntoView({
      behavior: 'smooth'
    })
  }
  
  public get notes () {
    return this.patterns
    .map(p => mapPatternToNotes(p.p).repeat(4))
    .map((notes, idx) => ({
      noteStr: notes,
      idx
    }))
  }
  
  public onNewBlock() {
    this.currentIdx = (this.currentIdx + 1) % this.notes.length
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
