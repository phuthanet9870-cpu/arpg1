import {MAPS,isTown} from '../shared/farming.mjs';
import Phaser from 'phaser';
export function makeWorld(scene:Phaser.Scene,zone:number){
 const key='terrain'+zone;if(scene.textures.exists(key))return key;
 const cv=document.createElement('canvas');cv.width=960;cv.height=720;const c=cv.getContext('2d')!;c.imageSmoothingEnabled=false;
 let seed=56+zone*891;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)};
 const ellipse=(x:number,y:number,rx:number,ry:number,color:string)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()};
 const ground=['#a5bd83','#b5d3d5','#c7b090','#90b799','#bbb5d0'][MAPS[zone].island];rect(0,0,960,720,ground);
 for(let i=0;i<12000;i++){const x=rand()*960,y=rand()*720;rect(x,y,1+Math.floor(rand()*3),1,(isTown(zone)?[ground,'#9ba39b','#7c8984','#8e9a94','#a3aaa1']:[ground,'#b5c29b','#819b79','#98ad8b','#c4c9aa'])[Math.floor(rand()*5)])}
 if(isTown(zone)){for(let y=0;y<720;y+=12)for(let x=0;x<960;x+=24){const offset=(Math.floor(y/12)%2)*12;c.strokeStyle='#586b652e';c.strokeRect(x+offset,y,23,11);if(rand()>.7){c.fillStyle='#bac0ac22';c.fillRect(x+offset+2,y+2,19,2)}}}
 // Rivers and cobblestone trails.
 const path=(points:number[][],width:number,col:string)=>{c.strokeStyle=col;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke()};
 path([[0,570],[150,545],[225,465],[235,330],[185,240],[220,80],[185,0]],68,'#91bba4');path([[0,570],[150,545],[225,465],[235,330],[185,240],[220,80],[185,0]],53,'#83c5cc');path([[0,565],[150,540],[220,460],[230,330],[180,240],[215,80],[180,0]],37,'#91d1d2');
 for(let i=0;i<150;i++){const x=175+rand()*68,y=rand()*700;if((x<230&&y<500)||y>510)rect(x,y,3+rand()*7,1,'#bce8df')}
 const paths=isTown(zone)?[[[220,375],[375,390],[480,440],[635,398],[810,390]],[[480,440],[480,290],[485,180]],[[480,440],[470,600],[520,720]]]:[[[480,720],[480,570],[580,480],[480,340],[480,135]],[[480,340],[330,280],[230,180]],[[580,480],[740,400],[820,220]]];
 for(const p of paths){path(p,39,isTown(zone)?'#63736f':'#899577');path(p,34,isTown(zone)?'#9ca69a':'#b4b094');path(p,27,isTown(zone)?'#8e9c92':'#c6bf9f')}
 for(let i=0;i<700;i++){const x=rand()*960,y=rand()*720;const px=c.getImageData(Math.floor(x),Math.floor(y),1,1).data;if(px[0]>215&&px[1]>200&&px[2]<195)rect(x,y,2+rand()*3,1,'#d0c79f')}
 const stone=(x:number,y:number)=>{rect(x-7,y-4,15,8,'#9ea68a');rect(x-5,y-7,11,8,'#c3c8ac');rect(x-4,y-7,6,2,'#e0e0c8')};
 const prop=(key:string,x:number,y:number,w:number,h:number)=>{if(scene.textures.exists(key)){if(['tree','cottage','townhouse','town-smith','smith'].includes(key))c.filter=['none','saturate(.28) brightness(1.3)','sepia(.35) saturate(.8)','hue-rotate(12deg) saturate(.9)','saturate(.55) hue-rotate(50deg) brightness(1.15)'][MAPS[zone].island];c.drawImage(scene.textures.get(key).getSourceImage() as HTMLImageElement,Math.round(x),Math.round(y),w,h);c.filter='none';}};
 const tree=(x:number,y:number,size=1)=>{if(scene.textures.exists('tree')){ellipse(x,y+3,25*size,8*size,'#6b8b5240');prop('tree',x-36*size,y-84*size,72*size,90*size);return;}c.save();c.translate(Math.round(x),Math.round(y));c.scale(size,size);ellipse(1,6,23,8,'#759f6350');rect(-4,-18,8,26,'#8e7750');rect(-2,-19,3,24,'#b19860');const green=[['#618c52','#79a45c','#98ba6c'],['#7e9fa9','#b2d0d4','#edf3e6'],['#968366','#b39b75','#dcc596'],['#4f9274','#7cb18d','#b1d6a6'],['#7f8eb3','#abb8d0','#e0e6eb']][MAPS[zone].island];rect(-22,-48,43,30,green[0]);rect(-28,-42,55,15,green[0]);rect(-17,-58,34,17,green[0]);rect(-23,-47,42,20,green[1]);rect(-16,-56,29,18,green[1]);rect(-18,-45,11,5,green[2]);rect(-8,-54,15,7,green[2]);rect(7,-37,13,5,green[2]);rect(-20,-24,33,5,green[0]);c.restore()};
 const flower=(x:number,y:number)=>{rect(x,y,1,4,'#6d9b57');const color=['#f6e7b2','#fff5df','#e9afaa','#b8a9d7'][Math.floor(rand()*4)];rect(x-1,y-2,3,3,color);rect(x,y-1,1,1,'#e4c16b')};
 for(let i=0;i<600;i++){const x=rand()*960,y=rand()*720;if(x>280||y<180)flower(x,y)}
 // Boundary groves, scattered clumps and rocks leave paths open.
 for(let i=0;i<140;i++){const x=rand()*960,y=rand()*720;if(x<100||x>880||y<75||y>685)tree(x,y,.85+rand()*.5)}
 for(const [x,y] of [[300,180],[730,180],[790,570],[330,570],[850,310],[300,350],[700,650],[130,380]]){for(let j=0;j<3;j++)tree(x+j*20,y+j*7,.9+rand()*.25)}
 for(let i=0;i<50;i++){const x=rand()*960,y=rand()*720;if(x<100||x>850||y<100)stone(x,y)}
 if(isTown(zone)){
 const house=(x:number,y:number,w:number,h:number,roof:string)=>{if(scene.textures.exists('cottage')){ellipse(x+w/2,y+h, w*.65,10,'#6f8c4c30');prop(roof==='#bf9776'?(scene.textures.exists('town-smith')?'town-smith':'smith'):(scene.textures.exists('townhouse')?'townhouse':'cottage'),x-8,y-h*.8,w+16,h*1.9);return;}roof=['#91ad9b','#94b5c0','#b39779','#71a18c','#a1a3c9'][MAPS[zone].island];ellipse(x+w/2,y+h+5,w*.6,9,'#6f8c4c30');rect(x,y,w,h,'#eee6c9');rect(x,y,w,6,'#bdad82');rect(x+w-5,y,5,h,'#d7cba8');rect(x+7,y+10,12,15,'#658f91');rect(x+6,y+9,14,2,'#a28a56');rect(x+12,y+10,2,15,'#eee1b8');rect(x+7,y+17,12,2,'#eee1b8');rect(x+w-23,y+10,12,15,'#658f91');rect(x+w/2-8,y+h-27,16,27,'#9b8057');rect(x+w/2-6,y+h-25,12,25,'#b39969');rect(x+w/2+4,y+h-13,2,2,'#f1d38b');for(let j=0;j<8;j++){rect(x-9+j*3,y-5-j*4,w+18-j*6,5,roof);rect(x-8+j*3,y-5-j*4,w+16-j*6,1,'#ffffff35')}rect(x+w-22,y-34,9,20,'#d5c7a5');rect(x+w-24,y-36,13,4,'#eee5c7');rect(x-7,y+h, w+14,3,'#a4a27d')};
 house(340,240,75,66,'#a9bbb0');house(535,200,90,74,'#bf9776');house(630,485,80,59,'#a6ac82');house(340,475,58,50,'#a2b7b8');
 // Bridge, fountain plaza, stalls, garden and sun gate.
 rect(204,370,61,29,'#9a8056');for(let x=205;x<265;x+=6)rect(x,372,4,25,'#c7ad78');rect(204,369,61,3,'#ead6a1');rect(204,396,61,3,'#ead6a1');
 ellipse(480,362,48,17,'#8da36a40');prop(scene.textures.exists('crystal-fountain')?'crystal-fountain':'fountain',433,259,94,108);
 rect(550,292,48,25,'#b99e6c');for(let j=0;j<6;j++)rect(546+j*9,286,9,12,j%2?'#f1e2b5':'#95b39b');rect(548,285,55,3,'#f8edcb');rect(555,314,4,14,'#957f57');rect(592,314,4,14,'#957f57');
 for(let j=0;j<4;j++){rect(300+j*9,420,5,45,'#a6ad73');for(let k=0;k<5;k++){rect(301+j*9,422+k*9,3,5,'#7da15a');rect(302+j*9,422+k*9,2,2,'#e8c577')}}
 for(let j=0;j<10;j++){rect(690+j*8,345,3,34,'#d6c99b');rect(690+j*8,352,3,2,'#f8ecc9')}rect(690,352,75,3,'#e8dbad');rect(690,365,75,3,'#e8dbad');
 prop(scene.textures.exists('gate')?'gate':'portal',628,300,62,101);

 }else{
 // Crystal spires, ancient gateways and boss arena.
 ellipse(480,135,100,49,'#b8c89b');ellipse(480,135,85,41,'#e0dab7');ellipse(480,135,72,34,'#ccd2a9');
 for(let i=0;i<8;i++){const a=i*Math.PI/4;rect(480+Math.cos(a)*82-4,135+Math.sin(a)*38-7,8,12,'#f1e7bd')}
 for(const [x,y]of [[320,210],[730,300],[330,500],[720,580]]){rect(x-5,y-25,10,35,zone===4?'#bda8d3':'#8cb6bb');rect(x-2,y-31,5,35,zone===4?'#e1d0f1':'#b9e4e0');rect(x+8,y-12,6,22,'#96c2ba');ellipse(x,y+8,17,5,'#829d7655')}
 prop('ruin',410,55,140,110);for(const [x,y]of [[600,190],[370,360],[690,460]]){rect(x,y-25,10,32,'#c7c7a8');rect(x-3,y-28,16,5,'#ece5c5');rect(x-3,y+4,16,5,'#a9b48f')}
 }
 scene.textures.addCanvas(key,cv);return key;
}
export function iconUrl(i:number,color:string){const paths=['M8 24L23 7M19 6L26 13M7 20L12 25M5 27L9 23','M7 10L16 5L25 10L23 22L16 28L9 22Z','M7 25L24 8M12 7Q28 6 26 22M7 21L11 25','M17 4L8 18H16L13 28L25 13H17Z','M16 4L20 12L28 16L20 20L16 28L12 20L4 16L12 12Z','M6 22Q16 4 26 22M10 24H22M16 9V28'];return 'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="${paths[i%6]}" fill="${i%6===1?color+'66':'none'}" stroke="#4b5941" stroke-width="5" stroke-linejoin="miter"/><path d="${paths[i%6]}" fill="${i%6===1?color:'none'}" stroke="${color}" stroke-width="3" stroke-linejoin="miter"/><path d="M5 5h2v2H5zm21 20h2v2h-2z" fill="#d6af58"/></svg>`)}
