import {isTown} from './farming.mjs';
import {WORLD,NPCS} from './data.mjs';
export const CHUNK_SIZE=512;
export const LANDMARKS=[
 {id:'entry',name:'ประตูแสงแรก',type:'waypoint',x:960,y:1190},
 {id:'crossroads',name:'ค่ายสี่สายลม',type:'village',x:4096,y:4096},
 {id:'willow',name:'หมู่บ้านวิลโลว์',type:'village',x:8192,y:3072},
 {id:'oldwatch',name:'หอคอยโบราณ',type:'ruin',x:12288,y:8192},
 {id:'lakeside',name:'ท่าเรือกระจกฟ้า',type:'village',x:6144,y:14336},
 {id:'sanctuary',name:'วิหารใจกลางโลก',type:'sanctuary',x:16384,y:16384},
 {id:'ember',name:'แนวเขาอำพัน',type:'ruin',x:24576,y:8192},
 {id:'moonwell',name:'บ่อน้ำจันทรา',type:'waypoint',x:24576,y:24576},
 {id:'frontier',name:'ป้อมสุดขอบฟ้า',type:'village',x:30720,y:28672},
 {id:'wildheart',name:'หัวใจพงไพร',type:'ruin',x:8192,y:28672},
 {id:'astral',name:'ประตูดารา',type:'sanctuary',x:28672,y:16384},
 {id:'sunken',name:'ซากวิหารลุ่มน้ำ',type:'ruin',x:14336,y:24576}
];
export const WORLD_QUESTS=[
 {id:'scout',name:'เส้นทางของผู้สำรวจ',text:'ค้นพบเสาหลักหรือสถานที่สำคัญ 5 แห่ง',goal:5,field:'discovered',gold:200,xp:120},
 {id:'guardian',name:'เสียงเรียกแห่งวิหาร',text:'กำจัดผู้พิทักษ์ 1 ตัว แล้วกลับมารับรางวัล',goal:1,field:'bossKills',gold:250,xp:150},
 {id:'courier',name:'สารถึงค่ายสี่สายลม',text:'เดินทางไปค่ายสี่สายลม และคุยกับผู้สำรวจประจำค่าย',goal:1,field:'talked',gold:180,xp:100}
];
export const landmarkKey=(zone,id)=>zone+':'+id;
export function worldNpcs(zone){return [...(isTown(zone)?NPCS.map((n,i)=>({...n,id:'town-'+i})):[]),{id:'entry-scout',x:1180,y:1250,name:isTown(zone)?'ไอริส • รับซื้อของฟาร์ม':'ไอริส • ผู้สำรวจ',kind:isTown(zone)?'farm':'journal'},...LANDMARKS.filter(l=>l.id!=='entry').map(l=>({id:'scout-'+l.id,x:l.x+90,y:l.y+80,name:l.type==='village'?'ผู้ดูแล • '+l.name:'ผู้สำรวจ • '+l.name,kind:l.type==='village'?'outpost':'journal',landmark:l.id}))]}
export function safeCamp(zone,p){return isTown(zone)||LANDMARKS.some(l=>l.type==='village'&&Math.hypot(l.x-p.x,l.y-p.y)<260)}
export function sectorAt(x,y){return {x:Math.floor(x/1024),y:Math.floor(y/1024)}}
export function regionName(zone,x,y){const a=['ทุ่งหญ้า','ป่าผลึก','เนินเขา','ลุ่มน้ำ','ซากโบราณ','ชายแดน'];return a[((Math.floor(x/8192)*3+Math.floor(y/8192)+zone)%a.length)]}
export function worldHash(x,y,s=0){let n=Math.imul(x+374761393,y+668265263)^Math.imul(s+1,1274126177);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967296}
export function roadDistance(x,y){let best=Infinity;for(let i=1;i<LANDMARKS.length;i++){const a=LANDMARKS[i-1],b=LANDMARKS[i],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));best=Math.min(best,Math.hypot(x-a.x-t*dx,y-a.y-t*dy))}return best}
export function discoveryProgress(p,q){return q.field==='discovered'?p.discovered.length:q.field==='talked'?(p.talked.includes('scout-crossroads')?1:0):p.bossKills||0}
