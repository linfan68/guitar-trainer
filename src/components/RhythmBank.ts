import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { generate4thNotes, generateTripleNotes, IGenerationOptions, mixPatternsToBar, generate16thNotes } from '@/scripts/createPatterns'

enum BankType {
  Rhythm = '节奏练习'
}

@Component
export default class RhythmBank extends Vue {
  public type: BankType = BankType.Rhythm
  public get types () { return Object.values(BankType) }
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

  @Watch('notes', {immediate: true}) public notesChanged(val: RhythmBank['notes']) {
    this.$emit('update:notes', val)
  }
  public get isRhythm () { return this.type === BankType.Rhythm }

  public get notes () {
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
    return []
  }
}
