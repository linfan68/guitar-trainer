import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ScriptNotes, script2VexTabText } from '@/scripts/rhythmPatterns';
require('../thirdparty/vextab-div')

declare const VexTab: any
declare const Artist: any
declare const Vex: any
declare const $: any
const Renderer = Vex.Flow.Renderer;


@Component
export default class StaveLine extends Vue {
  @Prop({ default: null }) public script: ScriptNotes | null

  public isMounted: boolean = false
  public get readyNote () {
    return this.isMounted ? this.script : undefined
  }

  @Watch('readyNote', { immediate: true }) readyNoteChanged(val: StaveLine['readyNote']) {
    if (!val) return
    // Create VexFlow Renderer from canvas element with id #boo.
    const ele = this.$refs['boo'] as HTMLElement
    while (ele.hasChildNodes()) {
        ele.removeChild(ele.childNodes[0]);
    }
    const renderer = new Renderer(ele, Renderer.Backends.SVG);

    const artist = new Artist(10, 10, 700, {scale: 0.8});
    const vextab = new VexTab(artist);

    try {
      const vexStr = script2VexTabText(val)
      // console.log(vexStr)
      vextab.parse(`${vexStr}\n`)
      artist.draw(renderer)
    } catch (e) {
        console.log(e);
    }
    return ''
  }

  mounted () {
    this.isMounted = true
  }
}
