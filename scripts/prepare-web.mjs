import {mkdir,copyFile,writeFile,readFile,chmod} from 'node:fs/promises';import {spawnSync} from 'node:child_process';import {createHash} from 'node:crypto';
const version=JSON.parse(await readFile('package.json','utf8')).version;
await mkdir('web/downloads',{recursive:true});
await writeFile('releases/PLAY-OFFLINE-TH.txt',`SUNBOUND Alpha ${version}\n\nแตก ZIP แล้วเปิด SUNBOUND/index.html ด้วย Chrome หรือ Edge\nเล่นคนเดียว ไม่ต้องติดตั้ง Node.js\nCo-op และบัญชีออนไลน์ใช้ชุดเซิร์ฟเวอร์แยก\n`);
const zip=spawnSync('python3',['-c',`from zipfile import ZipFile,ZIP_DEFLATED
from pathlib import Path
with ZipFile('releases/SUNBOUND-PLAY-OFFLINE.zip','w',ZIP_DEFLATED) as z:
 z.write('releases/SUNBOUND.html','SUNBOUND/index.html')
 z.write('releases/PLAY-OFFLINE-TH.txt','SUNBOUND/README-TH.txt')
`],{stdio:'inherit'});if(zip.status)process.exit(zip.status);
await copyFile('releases/SUNBOUND.html','web/index.html');
for(const name of ['SUNBOUND-PLAY-OFFLINE.zip','SUNBOUND-online-server.zip','SPRITE-CHECK.png','HUD-REFERENCE-bag.png','HUD-REFERENCE-skill-tree.png','UI-ICON-CHECK.png']){if(name.startsWith('HUD-')||name==='UI-ICON-CHECK.png')await copyFile('.artifacts/'+name,'releases/'+name);await copyFile('releases/'+name,'web/downloads/'+name);await chmod('web/downloads/'+name,0o644)}
const files=['index.html','downloads/SUNBOUND-PLAY-OFFLINE.zip','downloads/SUNBOUND-online-server.zip','downloads/SPRITE-CHECK.png'],manifest={version,files:{}};
for(const name of files){const content=await readFile('web/'+name);manifest.files[name]={bytes:content.length,sha256:createHash('sha256').update(content).digest('hex')}}await writeFile('web/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log('Prepared web snapshot and verified download checksums');
