<template>
  <div class="hello">
    <div ref='boo'>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
require('../vextab-div')

declare const VexTab: any
declare const Artist: any
declare const Vex: any
declare const $: any
const Renderer = Vex.Flow.Renderer;


@Component
export default class HelloWorld extends Vue {
  @Prop() private notes!: string;

  @Watch('notes') notesChanged(val: string) {
    // Create VexFlow Renderer from canvas element with id #boo.
    const renderer = new Renderer(this.$refs['boo'], Renderer.Backends.SVG);
    const artist = new Artist(10, 10, 700, {scale: 0.8});
    const vextab = new VexTab(artist);

    try {
        vextab.parse(`tabstave notation=true tablature=false\n notes ${val}\n`)
        artist.render(renderer);
    } catch (e) {
        console.log(e);
    }
    return ''
  }
}
</script>

</style>
