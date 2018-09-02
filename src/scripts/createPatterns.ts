function breakIntoBeats (pattern: string, n: number) {
  return Array(pattern.length / n).fill(0).map((v, idx) => idx * n)
  .map(cstart => pattern.substr(cstart, n))
}

function repeatCount (pattern: string, win: number) {
  const chunkWin = Math.pow(2, Math.ceil(Math.log2(win)))
  if (pattern.length % chunkWin !== 0) throw new Error('invalid size' + pattern.length + ' ' + chunkWin)
  const chunks = breakIntoBeats(pattern, chunkWin)
  return chunks.map(c => c.substr(0, win)).filter((v, i, s) => s.indexOf(v) === i).length
}

function estimateLevel (pattern: string) {
  let score = 0
  const testSizes = [4, 3, 2]
  testSizes.forEach(v => { score += v * repeatCount(pattern, v) })
  pattern.split('').forEach((v, i, s) => {
    if (i > 0) {
      score += (s[i] !== s[i -1] ? 1 : 0)
    }
  })
  return score
}

export function createRandomPatterns (size: number, count: number) {
  const base = createPatterns(4)
  return Array(count).fill(0).map(v => {
    return Array(size / 4).fill(0).map(vv => {
      return base[Math.floor(Math.random() * base.length)].p
    }).join('')
  })
}

export function createPatterns (n: number) {
  return Array(Math.pow(2, n)).fill(0).map((v, idx) => idx)
  .filter(idx => idx > 0)
  .map(i => i.toString(2).padStart(n, '0'))
  .filter(p => !breakIntoBeats(p, 4).includes('0000') )
  .map(p => ({
    p: p,
    score: estimateLevel(p)
  }))
  .sort((a, b) => a.score - b.score)
}

export function mapPatternToNotes(p: string){
  const pc = Array(p.length / 4).fill(0).map((v, idx) => idx * 4)
  .map(c => p.substr(c, 4))
  .map(pp => pp.replace(/0000/g, 'D'))
  .map(pp => pp.replace(/000/g, 'C'))
  .map(pp => pp.replace(/00/g, 'B'))
  .map(pp => pp.replace(/0/g, 'A'))
  .join('')
  console.log(`${p} ${pc}`)
  const restNoteA = ':16 ##'
  const restNoteB = ':8 ##'
  const restNoteC = ':8d ##'
  const restNoteD = ':q ##'
  const beatNote = ':16 X/4'
  let res = pc.split('').map(n => {
    if (n === 'A') return restNoteA
    if (n === 'B') return restNoteB
    if (n === 'C') return restNoteC
    if (n === 'D') return restNoteD
    if (n === '1') return beatNote
  }).join(' ')
  return res
}
