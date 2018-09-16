import { readdirSync, statSync, accessSync, writeFileSync, existsSync, mkdirSync } from "fs"
import { join, resolve, relative } from 'path'
import fetch from 'node-fetch'
import { tmpdir } from 'os';
const OSS = require('ali-oss')

function walk (dir: string): string[] {
  let results: string[] = []
  const files = readdirSync(dir)
  files.forEach(file => {
    const filePath = join(dir, file)
    const stat = statSync(filePath)
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath))
    } else {
      results.push(filePath)
    }
  })
  return results
}

async function deploy (accessKeySecret: string) {
  const client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: 'LTAI4WHpu7p2Y3f1',
    accessKeySecret: accessKeySecret,
    bucket: 'guitar-trainer'
  })

  let files: string[] = ((await client.list()).objects || []).map((o: any) => o.name)
  files = files.filter(f => !f.includes('sound-fonts'))
  console.log(files)
  if (files.length > 0) await client.deleteMulti(files)
  const distPath = join(__dirname, '../../dist')
  
  for (const file of walk(distPath)) {
    const objName = relative(distPath, file).split('\\').join('/')
    console.log(`${file} => ${objName}`)
    await client.put(objName, file)
  }
}

async function downloadSoundFonts(rootUrl: string) {
  const instruments = `${rootUrl}/names.json`
  const bankName = rootUrl.split('/').reverse()[0]
  const tmpFolder = join(tmpdir(), bankName)

  const res = await fetch(instruments)
  const list: string[] = await res.json()
  console.log(tmpFolder)
  if (!existsSync(tmpFolder)) mkdirSync(tmpFolder)
  for (const instName of list) {
    const types = ['ogg', 'mp3']
    for (const type of types) {
      const filename = `${instName}-${type}.js`
      const localFile = join(tmpFolder, filename)
      if (existsSync(localFile)) continue
      const res = await fetch(`${rootUrl}/${filename}`)
      writeFileSync(localFile, await res.text())
    }
    console.log(instName)
  }
  console.log(tmpFolder)
}

if (!module.parent) {
  const accessKeySecret = process.argv[2]
  // downloadSoundFonts('http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM').then(() => {
  //   process.exit()
  // })

  deploy(accessKeySecret).then(() => {
    process.exit()
  })
}
