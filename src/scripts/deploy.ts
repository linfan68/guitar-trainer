import { readdirSync, statSync } from "fs"
import { join, resolve, relative } from 'path'

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

  const files: string[] = ((await client.list()).objects || []).map((o: any) => o.name)
  if (files.length > 0) await client.deleteMulti(files)
  const distPath = join(__dirname, '../../dist')
  
  for (const file of walk(distPath)) {
    const objName = relative(distPath, file).split('\\').join('/')
    console.log(`${file} => ${objName}`)
    await client.put(objName, file)
  }
}

if (!module.parent) {
  const accessKeySecret = process.argv[2]
  deploy(accessKeySecret).then(() => {
    process.exit()
  })
}
