export function compose<T>(v: T): T { return v }

// creates a random number generator function.
function createRandomGenerator(seed: number){
  const a = 5486230734  // some big numbers
  const b = 6908969830 
  const m = 9853205067
  var x = seed
  // returns a random value 0 <= num < 1
  return function(seed = x){  // seed is optional. If supplied sets a new seed
    x = (seed  * a + b) % m
    return x / m
  }
}
// function creates a 32bit hash of a string    
function stringTo32BitHash(str: string){
  let v = 0
  for(var i = 0; i < str.length; i += 1){
     v += str.charCodeAt(i) << (i % 24)
  }
  return v % 0xFFFFFFFF
}
// shuffle array using the str as a key.
export function shuffleArray<T>(str: string, arr: T[]){
  var rArr: T[] = []
  var random = createRandomGenerator(stringTo32BitHash(str))        
  while(arr.length > 1){
    rArr.push(arr.splice(Math.floor(random() * arr.length), 1)[0])
  }
  rArr.push(arr[0])
  return rArr
}

export function shuffle<T>(a: T[]) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function partition<T>(a: T[], n: number): T[][] {
  return Array(Math.ceil(a.length / n)).fill(0).map((v, idx) => idx * n)
  .map(start => a.slice(start, start + n))
}