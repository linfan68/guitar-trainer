"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const node_fetch_1 = require("node-fetch");
const os_1 = require("os");
const OSS = require('ali-oss');
function walk(dir) {
    let results = [];
    const files = fs_1.readdirSync(dir);
    files.forEach(file => {
        const filePath = path_1.join(dir, file);
        const stat = fs_1.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        }
        else {
            results.push(filePath);
        }
    });
    return results;
}
function deploy(accessKeySecret) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new OSS({
            region: 'oss-cn-beijing',
            accessKeyId: 'LTAI4WHpu7p2Y3f1',
            accessKeySecret: accessKeySecret,
            bucket: 'guitar-trainer'
        });
        let files = ((yield client.list()).objects || []).map((o) => o.name);
        files = files.filter(f => !f.includes('sound-fonts'));
        console.log(files);
        if (files.length > 0)
            yield client.deleteMulti(files);
        const distPath = path_1.join(__dirname, '../../dist');
        for (const file of walk(distPath)) {
            const objName = path_1.relative(distPath, file).split('\\').join('/');
            console.log(`${file} => ${objName}`);
            yield client.put(objName, file);
        }
    });
}
function downloadSoundFonts(rootUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const instruments = `${rootUrl}/names.json`;
        const bankName = rootUrl.split('/').reverse()[0];
        const tmpFolder = path_1.join(os_1.tmpdir(), bankName);
        const res = yield node_fetch_1.default(instruments);
        const list = yield res.json();
        console.log(tmpFolder);
        if (!fs_1.existsSync(tmpFolder))
            fs_1.mkdirSync(tmpFolder);
        for (const instName of list) {
            const types = ['ogg', 'mp3'];
            for (const type of types) {
                const filename = `${instName}-${type}.js`;
                const localFile = path_1.join(tmpFolder, filename);
                if (fs_1.existsSync(localFile))
                    continue;
                const res = yield node_fetch_1.default(`${rootUrl}/${filename}`);
                fs_1.writeFileSync(localFile, yield res.text());
            }
            console.log(instName);
        }
        console.log(tmpFolder);
    });
}
if (!module.parent) {
    const accessKeySecret = process.argv[2];
    // downloadSoundFonts('http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM').then(() => {
    //   process.exit()
    // })
    deploy(accessKeySecret).then(() => {
        process.exit();
    });
}
