import {mkdir,copyFile,cp,readFile,writeFile,rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const folder='releases';await mkdir(folder,{recursive:true});
await copyFile('dist/index.html',folder+'/SUNBOUND.html');await copyFile('.artifacts/SPRITE-CHECK.png',folder+'/SPRITE-CHECK.png');await copyFile('.artifacts/sprite-audit.json',folder+'/sprite-audit.json');
const stage=folder+'/.server-package';await rm(stage,{recursive:true,force:true});await mkdir(stage,{recursive:true});
for(const f of ['dist','server','shared','package.json','package-lock.json','README.md','ROADMAP.md','docs'])await cp(f,stage+'/'+f,{recursive:true});
await writeFile(stage+'/START-WINDOWS.cmd','@echo off\r\ncd /d "%~dp0"\r\ncall npm ci\r\ncall npm start\r\npause\r\n');
await writeFile(stage+'/START-MAC-LINUX.sh','#!/usr/bin/env sh\nset -eu\ncd "$(dirname "$0")"\nnpm ci\nnpm start\n',{mode:0o755});
await writeFile(stage+'/PLAY.txt','SUNBOUND HTML5\n\nSingle player: open dist/index.html in a browser.\nCo-op: install Node.js 22.13+ (24 LTS recommended), then run npm ci and npm start here.\nOpen the server address on port 3000. Share the room code.\nAccount characters save to .local/accounts.sqlite on this server. Guest saves are memory-only. Keep your database when updating. Public play requires hosting this server.\n');
const zip=spawnSync('python3',['-c',`import os,zipfile\nroot='${stage}'\nwith zipfile.ZipFile('${folder}/SUNBOUND-online-server.zip','w',zipfile.ZIP_DEFLATED) as z:\n for base,dirs,files in os.walk(root):\n  for name in sorted(files):\n   p=os.path.join(base,name);z.write(p,os.path.relpath(p,root))`],{stdio:'inherit'});if(zip.status!==0)process.exit(zip.status||1);
await rm(stage,{recursive:true,force:true});
for(const name of ['RO-FARM-atlas.png','RO-FARM-vendor.png','RO-FARM-combat.png','ITEM-CORE-forge.png','ISLAND-QUESTS-journal.png','CARD-SYSTEM-workshop.png','PASSIVE-CORE-tree.png','PASSIVE-CORE-ascendancy.png','ONLINE-SAVE-account.png','WORLD-ART-town-1.png','WORLD-ART-boss-2.png'])await copyFile('.artifacts/'+name,folder+'/'+name);
const hashes=[];for(const name of ['SUNBOUND.html','SUNBOUND-online-server.zip','SPRITE-CHECK.png','sprite-audit.json','RO-FARM-atlas.png','RO-FARM-vendor.png','RO-FARM-combat.png','ITEM-CORE-forge.png','ISLAND-QUESTS-journal.png','CARD-SYSTEM-workshop.png','PASSIVE-CORE-tree.png','PASSIVE-CORE-ascendancy.png','ONLINE-SAVE-account.png','WORLD-ART-town-1.png','WORLD-ART-boss-2.png']){const content=await readFile(folder+'/'+name);hashes.push(createHash('sha256').update(content).digest('hex')+'  '+name);console.log(name+': '+content.length+' bytes')}
await writeFile(folder+'/SHA256SUMS.txt',hashes.join('\n')+'\n');
