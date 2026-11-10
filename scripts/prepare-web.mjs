import {mkdir,copyFile,writeFile,readFile,chmod} from 'node:fs/promises';import {spawnSync} from 'node:child_process';import {createHash} from 'node:crypto';
await mkdir('web/downloads',{recursive:true});
const zip=spawnSync('python3',['-c',`from zipfile import ZipFile,ZIP_DEFLATED
from pathlib import Path
with ZipFile('releases/SUNBOUND-PLAY-OFFLINE.zip','w',ZIP_DEFLATED) as z:
 z.write('releases/SUNBOUND.html','SUNBOUND/index.html')
 z.writestr('SUNBOUND/README-TH.txt','SUNBOUND Alpha 0.8\\n\\nแตก ZIP แล้วเปิด SUNBOUND/index.html ด้วย Chrome หรือ Edge\\nเล่นคนเดียว ไม่ต้องติดตั้ง Node.js\\nCo-op และบัญชีออนไลน์ใช้ชุดเซิร์ฟเวอร์แยก\\n')
`],{stdio:'inherit'});if(zip.status)process.exit(zip.status);
await copyFile('releases/SUNBOUND.html','web/index.html');
for(const name of ['SUNBOUND-PLAY-OFFLINE.zip','SUNBOUND-online-server.zip','SPRITE-CHECK.png']){await copyFile('releases/'+name,'web/downloads/'+name);await chmod('web/downloads/'+name,0o644)}
const files=['index.html','downloads/SUNBOUND-PLAY-OFFLINE.zip','downloads/SUNBOUND-online-server.zip','downloads/SPRITE-CHECK.png'],manifest={version:'0.8.0',files:{}};
for(const name of files){const content=await readFile('web/'+name);manifest.files[name]={bytes:content.length,sha256:createHash('sha256').update(content).digest('hex')}}await writeFile('web/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log('Prepared web snapshot and verified download checksums');
