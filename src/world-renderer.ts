import {drawWorldDetails} from './world-details';
import {MAPS,isTown} from '../shared/farming.mjs';
import Phaser from 'phaser';
import {WORLD} from '../shared/data.mjs';
import {CHUNK_SIZE,LANDMARKS,worldHash,roadDistance} from '../shared/overworld.mjs';
import {makeWorld} from './art';
/** Fixed-size terrain chunks; no world-sized canvas or texture is allocated. */
export class WorldRenderer{
 scene:Phaser.Scene;chunks=new Map<string,Phaser.GameObjects.Image>();zone=-1;peak=0;
 constructor(scene:Phaser.Scene){this.scene=scene}
 clear(){for(const [key,img]of this.chunks){img.destroy();this.scene.textures.remove(key)}this.chunks.clear()}
 hide(){for(const img of this.chunks.values())img.setVisible(false)}
 update(zone:number,p:any,camera:Phaser.Cameras.Scene2D.Camera){
  if(this.zone!==zone){this.clear();this.zone=zone}
  const left=Math.max(0,Math.floor((camera.scrollX-256)/CHUNK_SIZE)),top=Math.max(0,Math.floor((camera.scrollY-256)/CHUNK_SIZE));
  const right=Math.min(WORLD.w/CHUNK_SIZE-1,Math.floor((camera.scrollX+camera.width/camera.zoom+256)/CHUNK_SIZE)),bottom=Math.min(WORLD.h/CHUNK_SIZE-1,Math.floor((camera.scrollY+camera.height/camera.zoom+256)/CHUNK_SIZE));
  const wanted=new Map<string,{x:number,y:number,d:number}>();for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++)wanted.set(`chunk:${zone}:${x}:${y}`,{x,y,d:Math.hypot(x*512+256-p.x,y*512+256-p.y)});
  for(const [key,img]of this.chunks)if(!wanted.has(key)){img.destroy();this.scene.textures.remove(key);this.chunks.delete(key)}
  let budget=4;for(const [key,at]of [...wanted].sort((a,b)=>a[1].d-b[1].d)){const existing=this.chunks.get(key);if(existing){existing.setVisible(true);continue}if(budget--<=0)break;this.draw(zone,at.x,at.y,key);const image=this.scene.add.image(at.x*512,at.y*512,key).setOrigin(0).setScale(2).setDepth(-10000);this.chunks.set(key,image)}
  this.peak=Math.max(this.peak,this.chunks.size);
 }
 draw(zone:number,cx:number,cy:number,key:string){
  const cv=document.createElement('canvas');cv.width=256;cv.height=256;const c=cv.getContext('2d')!;c.imageSmoothingEnabled=false;
  const originX=cx*512,originY=cy*512,biome=MAPS[zone].island;
  const palettes=[['#899c79','#91a27e','#788d6e'],['#788e83','#82958a','#6e827b'],['#91958b','#9da092','#80887d'],['#a69e83','#b0a68a','#96927b'],['#82939d','#91a0a3','#74878d']];const mapPal=[['#a5bd83','#afc98d','#96af78'],['#b5d3d5','#c8dfe0','#9dbdc5'],['#c7b090','#d6bd9b','#b89b82'],['#90b799','#a1c7a7','#7fa48b'],['#bbb5d0','#cfc8de','#a4a1bd']];const pal=mapPal[biome];c.fillStyle=pal[0];c.fillRect(0,0,256,256);
  for(let y=0;y<256;y+=16)for(let x=0;x<256;x+=16){const wx=originX+x*2,wy=originY+y*2,h=worldHash(wx>>5,wy>>5,zone);c.fillStyle=pal[Math.floor(h*3)];c.globalAlpha=.32;c.fillRect(x,y,16,16);c.globalAlpha=1;if(roadDistance(wx,wy)<65){c.fillStyle=h>.5?'#a39c86':'#93947f';c.fillRect(x,y,17,17);c.fillStyle='#535f592b';c.fillRect(x,y,16,1);c.fillRect(x,y,1,8)}else{c.fillStyle='#c7c9a13d';c.fillRect(x+h*12,y+h*10,2,1);c.fillStyle='#354d3c33';c.fillRect(x+5,y+9,3,1)}}
  // Map-specific strata: lakes, pine litter, ore seams, shells and ruins.
  const local=MAPS[zone].local;
  for(let i=0;i<24;i++){const h=worldHash(cx*31+i,cy*17+i,zone),x=Math.floor(h*240),y=Math.floor(worldHash(i+cy,cx,zone)*240);c.fillStyle=['#d4ceaf','#b9d9cf','#748f7566','#87949f','#dfd0ac'][local];if(local===1){c.fillStyle=biome===2?'#ca9878':'#85b4bf';c.fillRect(x,y,15+h*18,5+h*7)}else if(local===2){c.fillRect(x,y,2,9);c.fillRect(x-3,y+2,8,3)}else if(local===3){c.fillStyle=['#8e969b','#9dd6e6','#817e94','#a2c3c0','#9d9ec9'][biome];c.fillRect(x,y,8,10);c.fillStyle='#d9ead5';c.fillRect(x+1,y,3,3)}else if(local===4){c.strokeStyle='#d8d0b0';c.strokeRect(x,y,12,8)}}
  // Continuous winding river, with crossings where the trail passes.
  for(let y=0;y<256;y+=4){const wy=originY+y*2,river=2800+Math.sin(wy/1800)*550;const x=(river-originX)/2;if(x>-80&&x<336){const bridge=roadDistance(river,wy)<100;c.fillStyle=bridge?'#9a8c6e':'#567f86';c.fillRect(x-22,y,44,5);c.fillStyle=bridge?'#b6a780':'#6c9b9d';c.fillRect(x-18,y,36,3);if(!bridge){c.fillStyle='#b5d0c044';c.fillRect(x-5,y,8,1)}}}
  const prop=(asset:string,wx:number,wy:number,width:number)=>{if(!this.scene.textures.exists(asset))return;const image=this.scene.textures.get(asset).getSourceImage() as HTMLImageElement;const w=width/2,h=w*image.height/image.width;c.filter=['none','saturate(.28) brightness(1.3)','sepia(.35) saturate(.8)','hue-rotate(12deg) saturate(.9)','saturate(.55) hue-rotate(50deg) brightness(1.15)'][MAPS[zone].island];c.drawImage(image,Math.round((wx-originX)/2-w/2),Math.round((wy-originY)/2-h),w,h);c.filter='none'};
  for(let gy=Math.floor(originY/192)-1;gy<=Math.ceil((originY+512)/192)+1;gy++)for(let gx=Math.floor(originX/192)-1;gx<=Math.ceil((originX+512)/192)+1;gx++){const h=worldHash(gx,gy,zone),wx=gx*192+h*130,wy=gy*192+worldHash(gy,gx,zone)*130;if(h>.32&&roadDistance(wx,wy)>140&&!LANDMARKS.some(l=>Math.hypot(wx-l.x,wy-l.y)<370)){prop(h>.91?'ruin':'tree',wx,wy,h>.91?95:100+h*60)}}
  for(const l of LANDMARKS){if(l.x<originX-500||l.x>originX+1000||l.y<originY-500||l.y>originY+1000)continue;const x=(l.x-originX)/2,y=(l.y-originY)/2;c.fillStyle='#a6a894';c.beginPath();c.ellipse(x,y,92,47,0,0,Math.PI*2);c.fill();c.strokeStyle='#626f66';c.lineWidth=2;c.stroke();
   if(l.type==='village'){prop(this.scene.textures.exists('townhouse')?'townhouse':'cottage',l.x-180,l.y-90,180);prop(this.scene.textures.exists('market')?'market':'smith',l.x+180,l.y-60,150)}
   if(l.type==='ruin'||l.type==='sanctuary')prop(l.type==='ruin'?'ruin':this.scene.textures.exists('gate')?'gate':'portal',l.x,l.y-30,180);
   prop(this.scene.textures.exists('waystone')?'waystone':'portal',l.x,l.y+20,65);
  }
  // The hand-authored opening town / arena is blended into the streamed world.
  if(originX<1920&&originY<1440){const core=this.scene.textures.get(makeWorld(this.scene,zone)).getSourceImage() as HTMLCanvasElement;c.drawImage(core,-originX/2,-originY/2)}
  drawWorldDetails(c,zone,originX,originY);this.scene.textures.addCanvas(key,cv);
 }
}
