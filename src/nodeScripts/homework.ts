const Tonal = require('tonal')

const distance5 = ['01.冠音·4根音5．', '02.冠音4根音3．', '03.冠音·5根音b2', '04.冠音7根音#1．', '05.冠音6根音b5．', '06.冠音#1根音5．', '07.冠音#·3根音b7．', '08.冠音#1根音b4．', '09.冠音3根音5．', '10.冠音#5根音4', '11.冠音#7根音b5', '12.冠音b7根音bb2．', '13.冠音bb7根音#3', '14.冠音7根音b2．', '15.冠音b3根音#6．', '16.冠音4根音b7．', '17.冠音·2根音b3', '18.冠音b3根音5．', '19.冠音b3根音b5．', '20.冠音b5根音b6．', '21.冠音b2根音7．', '22.冠音##·3根音6', '23.冠音·5根音b6', '24.冠音#4根音b2．', '25.冠音b3根音2', '26.冠音6根音#5．', '27.冠音#4根音bb2', '28.冠音2根音#5．', '29.冠音#4根音3', '30.冠音#7根音##4．', '31.冠音#2根音2', '32.冠音b2根音#5．', '33.冠音#·5根音7', '34.冠音#7根音#4．', '35.冠音b7根音5．', '36.冠音7根音5', '37.冠音#4根音#3', '38.冠音#6根音2．', '39.冠音#7根音bb5', '40.冠音#4根音bb2', '41.冠音b·2根音b4', '42.冠音#1根音b2．', '43.冠音#6根音b4', '44.冠音1根音2．', '45.冠音#5根音#3', '46.冠音6根音b7．', '47.冠音b·2根音bb4', '48.冠音#·1根音#5', '49.冠音#5根音b5．', '50.冠音b·4根音b5', '51.冠音G根音C', '52.冠音Cb根音B', '53.冠音G根音Gb', '54.冠音Gb根音G', '55.冠音Ab根音A', '56.冠音Eb根音D', '57.冠音E根音Db', '58.冠音Cb根音D', '59.冠音Gb根音Bb', '60.冠音C#根音Fb', '61.冠音C#根音D#', '62.冠音Db根音Gb', '63.冠音G#根音G#', '64.冠音E#根音A', '65.冠音Bb根音Fb', '66.冠音Eb根音E', '67.冠音Gb根音A#', '68.冠音Ab根音D', '69.冠音Ab根音Gb', '70.冠音D根音B#', '71.冠音G#根音A', '72.冠音Cb根音E', '73.冠音Fb根音E#', '74.冠音E根音B#', '75.冠音E根音A#', '76.冠音F根音F#', '77.冠音Fb根音B', '78.冠音A根音E#', '79.冠音A#根音C', '80.冠音Fb根音F#', '81.冠音E#根音Fb', '82.冠音C根音F#', '83.冠音F根音E#', '84.冠音Eb根音G', '85.冠音Eb根音A#', '86.冠音E#根音F#', '87.冠音A#根音Gb', '88.冠音E#根音G#', '89.冠音Fb根音Eb', '90.冠音D根音Fb', '91.冠音B#根音C', '92.冠音Cb根音Db', '93.冠音E根音A', '94.冠音A#根音E', '95.冠音D根音Bb', '96.冠音D#根音G#', '97.冠音Cb根音A', '98.冠音G根音E', '99.冠音D#根音Ab', '100.冠音A根音E']
const distance6 = ['01.冠音1根音7．', '02.冠音#5根音3', '03.冠音b4根音#5．', '04.冠音##7根音7', '05.冠音#2根音b7．', '06.冠音#1根音b3．', '07.冠音#5根音bb2', '08.冠音#1根音#7．', '09.冠音b·7根音b3', '10.冠音bb1根音#6．', '11.冠音7根音#5', '12.冠音#4根音b7．', '13.冠音b7根音4', '14.冠音3根音b2', '15.冠音#6根音2．', '16.冠音b6根音b1．', '17.冠音7根音b6．', '18.冠音1根音b4．', '19.冠音#·2根音3', '20.冠音7根音b5', '21.冠音7根音3', '22.冠音b2根音b5．', '23.冠音6根音b3', '24.冠音·1根音#3', '25.冠音#3根音b2', '26.冠音b7根音#3', '27.冠音#3根音5．', '28.冠音b2根音#7．', '29.冠音b4根音#7．', '30.冠音#3根音b5．', '31.冠音3根音bb6．', '32.冠音·6根音#3', '33.冠音##·3根音#5', '34.冠音4根音b5．', '35.冠音#7根音b6．', '36.冠音b1根音5．', '37.冠音b1根音#7．', '38.冠音bb6根音#3', '39.冠音b1根音b3．', '40.冠音#·3根音#1', '41.冠音b7．根音bb5．', '42.冠音4根音b1', '43.冠音b1根音#3．', '44.冠音·4根音##5', '45.冠音2根音#7．', '46.冠音7根音b5', '47.冠音#·1根音b5．', '48.冠音#·3根音b4', '49.冠音#·2根音6', '50.冠音4根音#6．', '51.冠音E#根音A#', '52.冠音B根音E', '53.冠音Eb根音E', '54.冠音B#根音E', '55.冠音Bb根音A#', '56.冠音G根音Gb', '57.冠音G根音Bb', '58.冠音D#根音G', '59.冠音Ab根音Cb', '60.冠音E根音D#', '61.冠音D#根音F', '62.冠音Fb根音Fb', '63.冠音C#根音A', '64.冠音G#根音Ab', '65.冠音C根音Ab', '66.冠音Gb根音Cb', '67.冠音A#根音Db', '68.冠音C#根音E#', '69.冠音C#根音E', '70.冠音C#根音Fb', '71.冠音F根音E', '72.冠音G#根音B', '73.冠音B#根音C', '74.冠音F#根音D', '75.冠音C#根音G', '76.冠音E#根音Db', '77.冠音D#根音B', '78.冠音D#根音G#', '79.冠音Ab根音Gb', '80.冠音E#根音B', '81.冠音Ab根音Fb', '82.冠音G#根音Gb', '83.冠音D根音B#', '84.冠音Fb根音B', '85.冠音B#根音B', '86.冠音F#根音C#', '87.冠音F#根音G', '88.冠音G#根音C#', '89.冠音Gb根音Db', '90.冠音G根音D', '91.冠音Bb根音G#', '92.冠音G根音Eb', '93.冠音G根音A', '94.冠音E根音Ab', '95.冠音Gb根音C#', '96.冠音C#根音F#', '97.冠音D根音E#', '98.冠音C根音B', '99.冠音A根音B', '100.冠音Ab根音Ab']

const distances = [distance5, distance6]

function ABCfrom123 (note: string) {
  const m = note.match(/\d/)![0]
  const letter = 'CDEFGAB'.split('')[parseInt(m) - 1]
  const sharps = note.split('').filter(s => s === '#').join('')
  const flats = note.split('').filter(s => s === 'b').join('')
  let octave = '4'
  if (note.includes('·')) octave = '5'
  if (note.includes('．')) octave = '3'

  return `${letter}${sharps}${flats}${octave}`
}

function toChinese (i: string) {
  // console.log(i)
  if (i.startsWith('-')) return '题目有错'
  const parse = i.match(/^(\d+)(.+)$/)!
  const num = parse[1]
  if (num === '0') return '题目有错'
  const nameMap:{[key: string]: string} = {
    ['M']: '大',
    ['m']: '小',
    ['P']: '纯',
    ['A']: '增',
    ['AA']: '倍增',
    ['AAA']: '倍倍增',
    ['AAAA']: '倍倍倍增',
    ['AAAAA']: '倍倍倍倍增',
    ['d']: '减',
    ['dd']: '倍减',
    ['ddd']: '倍倍减',
    ['dddd']: '倍倍倍减',
    ['ddddd']: '倍倍倍倍减'
  }
  return `${nameMap[parse[2]]}${num}度`
} 

function doDist () {
  distances.forEach(dist => {
    dist.forEach((d, idx) => {
      const m = d.match(/\d\d\.冠音(.*)根音(.*)/)
      if (!m) throw Error(d)
      let root = m[2]
      let head = m[1]
  
      if (root.match(/\d/)) {
        // console.log(`${root}-${head}/${ABCfrom123(root)}-${ABCfrom123(head)}`)
        root = ABCfrom123(root)
        head = ABCfrom123(head)
      }
      const i = Tonal.Distance.interval(root, head)
      if (!i) throw new Error(`error!`)
      const invI = Tonal.Interval.invert(i)
      // console.log(`${i}/${invI}`)
      console.log(`${idx + 1},${m[2]},${m[1]},${toChinese(i)},${toChinese(invI)}`)
    })
  })
}

function doScale () {
  const scaleNames = [
    'ionian',
    'dorian',
    'phrygian',
    'lydian',
    'mixolydian',
    'aeolian',
    'locrian',
    'harmonic minor',
    'melodic minor',
    'major pentatonic',
    'minor pentatonic',
    'minor blues',
    'major blues',
    'composite blues'
  ]
  const cycleOfFifth = ['C', 'G', 'D', 'A', 'E', 'B', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F']
  scaleNames.forEach(name => {
    cycleOfFifth.forEach(n => {
      const scaleName = `${n} ${name}`
      console.log(`${scaleName.padStart(20)},${Tonal.Scale.notes(scaleName).map((c: any) => c.padStart(3, ' ')).join(',')}`)
      // console.log(`${scaleName.padStart(20)},${Tonal.Scale.notes(scaleName).map((c: any) => ' ').join(',')}`)
    })  
  })

}

doDist()
// doScale()

