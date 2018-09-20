import { Component, Vue, Watch } from 'vue-property-decorator'
import { generate4thNotes, generateTripleNotes, IGenerationOptions, mixPatternsToBar, generate16thNotes } from '@/scripts/rhythmPatterns'
import { getScalePractice1 } from '@/scripts/scalePatterns'

enum BankType {
  Rhythm = '节奏练习',
  Scale = '音阶练习'
}

const vexTabHeaders = {
  [BankType.Rhythm]: 'tabstave notation=true tablature=false\n notes ',
  [BankType.Scale]: 'options font-size=10 \ntabstave notation=false\n tablature=true\n notes '
}

@Component
export default class RhythmBank extends Vue {
  public type: BankType = BankType.Scale
  public get types () { return Object.values(BankType) }

  public get notes () {
    switch (this.type) {
      case BankType.Rhythm: return this.rhythemNotes.map(n => vexTabHeaders[BankType.Rhythm] + n)
      case BankType.Scale: return this.scaleNotes.map(n => vexTabHeaders[BankType.Scale] + n)
    }
    return []
  }
  @Watch('notes', {immediate: true}) public notesChanged(val: RhythmBank['notes']) {
    this.$emit('update:notes', val)
  }

  //#region Rhythm
  public get isRhythm () { return this.type === BankType.Rhythm }
  public rhythmIsRepeatOrRandom: boolean = false
  public rhythmIsRepeatOrRandomOptions = [{v: true, l: '重复'}, {v: false, l: '随机'}]
  public rhythmAddRest: boolean = true
  public rhythm16thOnly: boolean = false
  public rhythmAddTupletRest: boolean = false
  public rhythmTupletCount: number = 0
  public rhythmTupletCountOptions = [0, 1, 2, 3, 0.2].map(i => ({
    v: i,
    l: (i === Math.round(i)) ? `${i}个三连音` : `${Math.round(i * 100)}%三连音`
  }))

  public get rhythemNotes () {
    const options: IGenerationOptions = {
      withRest: this.rhythmAddRest,
      shuffle: true
    }
    const fourth = this.rhythm16thOnly ? generate16thNotes(options) : generate4thNotes(options)
    const triplets = generateTripleNotes({
      ...options,
      withRest: this.rhythmAddTupletRest
    })

    if (this.rhythmIsRepeatOrRandom) {
      return [...fourth, ...triplets].map(p => [p, p, p, p].join(' '))
    }
    else {
      return mixPatternsToBar(100, fourth, triplets, this.rhythmTupletCount)
    }
  
  }
  //#endregion

  //#region Scale
  public scaleRoot = 'C'
  public scaleRootOptions = 'C,F,G,D,Bb,A,Eb,E,Ab,B,Gb,Db'.split(',')
  public scaleReverse = false
  public get isScale () { return this.type === BankType.Scale }
  public get scaleNotes () {
    let order = '654321'.split('')
    if (this.scaleReverse)
      order = order.reverse()
    return order.map(s => {
      return getScalePractice1(this.scaleRoot, s, this.scaleReverse)
    })
  }
  //#endregion
}
