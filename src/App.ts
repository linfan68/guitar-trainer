import { Component, Vue } from 'vue-property-decorator'
import StaveLine from './components/StaveLine.vue'
import Ticker from './components/Ticker.vue'
import { Flow as VF }  from 'vexflow'

@Component({
  components: { StaveLine, Ticker},
})
export default class App extends Vue {
  public testNodes: string = ''
  public testNodes2: string = ''
  public mounted () {
    this.testNodes = ':16 X/4 :8d ## :16 X/4 :q ## :16 X-X-X-X/4 :q ##  | :16 X-X-X-X/4 :q ## :16 X-X-X-X/4 :q ##  '
    this.testNodes2 = ':q (7/5) 5h6/3 7/4 | :8 t12p7p5h7/4 :q 7/3 :8 3s5/5'
  }

  public onNewBlock() {
    console.log('onNewBlock')
  }
      
  created() {
    
  }
}
