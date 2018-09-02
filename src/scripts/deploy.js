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
        const files = ((yield client.list()).objects || []).map((o) => o.name);
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
if (!module.parent) {
    const accessKeySecret = process.argv[2];
    deploy(accessKeySecret).then(() => {
        process.exit();
    });
}
