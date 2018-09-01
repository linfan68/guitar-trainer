function repeatCount (pattern: string, win: number) {
  const chunkWin = Math.pow(2, Math.ceil(Math.log2(win)))
  if (pattern.length % chunkWin !== 0) throw new Error('invalid size' + pattern.length + ' ' + chunkWin)
  const chunks = Array(pattern.length / chunkWin).fill(0).map((v, idx) => idx * chunkWin)
  .map(cstart => pattern.substr(cstart, chunkWin))

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

export function createPatterns (n: number) {
  return Array(Math.pow(2, n)).fill(0).map((v, idx) => idx)
  .filter(idx => idx > 0)
  .map(i => i.toString(2).padStart(n, '0'))
  .map(p => ({
    p: p,
    score: estimateLevel(p)
  }))
  .sort((a, b) => a.score - b.score)
}
