import {MAPS,isTown} from '../shared/farming.mjs';
import {worldHash,roadDistance,LANDMARKS} from '../shared/overworld.mjs';
/** Pixel motifs positioned in world coordinates, so details match across chunk edges. */
export function drawWorldDetails(c:CanvasRenderingContext2D,zone:number,ox:number,oy:number){
 const m=MAPS[zone],pal=[['#668b62','#a8c991','#efe0a4'],['#82aeba','#c9e3e6','#f2f5e7'],['#a08569','#d4b28a','#f5cf8b'],['#5f977e','#94c5a6','#d8df9c'],['#8994bf','#bec8e0','#eee5be']][m.island];
 const rect=(x:number,y:number,w:number,h:number,col:string)=>{c.fillStyle=col;c.fillRect(Math.round((x-ox)/2),Math.round((y-oy)/2),Math.ceil(w/2),Math.ceil(h/2))};
 function motif(wx:number,wy:number,type:number){
 if(type===0){for(let i=0;i<5;i++){const x=wx+(i-2)*10,y=wy+(i%2)*8;rect(x,y,5,14,pal[0]);rect(x-3,y-2,10,6,i%2?pal[2]:pal[1]);rect(x,y-2,4,4,'#f8edc8')}}
 if(type===1){rect(wx-15,wy-34,30,31,pal[0]);rect(wx-22,wy-26,44,16,pal[0]);rect(wx-12,wy-39,24,29,pal[1]);rect(wx-5,wy-43,10,27,pal[2]);rect(wx-16,wy-8,32,5,'#647987')}
 if(type===2){rect(wx-20,wy-28,40,24,'#737774');rect(wx-27,wy-16,54,16,'#929382');rect(wx-17,wy-31,33,8,pal[1]);for(let i=0;i<3;i++){rect(wx-13+i*12,wy-19+i%2*7,7,8,pal[2]);rect(wx-12+i*12,wy-20+i%2*7,3,3,'#fff4cb')}}
 if(type===3){rect(wx-6,wy-13,12,24,'#c4bb91');rect(wx-25,wy-30,50,18,pal[0]);rect(wx-20,wy-37,40,12,pal[1]);rect(wx-11,wy-42,22,12,pal[1]);for(let i=0;i<3;i++)rect(wx-16+i*12,wy-28+i%2*6,7,6,pal[2])}
 if(type===4){rect(wx-24,wy-11,48,12,'#8c9d96');rect(wx-14,wy-42,28,30,pal[0]);rect(wx-17,wy-45,34,6,pal[1]);rect(wx-12,wy-40,22,28,pal[1]);rect(wx-5,wy-35,10,15,pal[2]);rect(wx-2,wy-34,4,12,'#edf0ce')}
 }
 for(let gy=Math.floor(oy/160)-1;gy<=Math.ceil((oy+512)/160);gy++)for(let gx=Math.floor(ox/160)-1;gx<=Math.ceil((ox+512)/160);gx++){const hash=worldHash(gx,gy,zone+81),x=gx*160+hash*110,y=gy*160+worldHash(gy,gx,zone+39)*100;if(hash>.58&&roadDistance(x,y)>95&&!LANDMARKS.some(l=>Math.hypot(l.x-x,l.y-y)<280)&&(!isTown(zone)||x>2000||y>1600)){const type=m.island===1?1:m.island===2?2:m.island===3?(m.local===3?3:0):m.island===4?4:(m.local===3?2:m.local===4?1:0);motif(x,y,type)}}
 // Five towns: banners and architectural ornaments sit beside the navigable plaza.
 if(isTown(zone))for(const [x,y]of [[570,760],[1260,660],[1170,1060]]){rect(x-4,y-70,8,75,'#877759');rect(x-2,y-75,4,5,pal[2]);rect(x+3,y-67,35,38,pal[0]);rect(x+6,y-64,28,31,pal[1]);rect(x+16,y-59,7,19,pal[2]);if(m.island===1){rect(x-8,y-76,20,5,'#f1f3e7');rect(x+6,y-66,28,5,'#edf3e4')}if(m.island===2){rect(x-10,y-10,26,12,'#a78c68');rect(x-6,y-20,18,10,'#f3c780')}if(m.island===3){rect(x-14,y+2,35,5,'#987e60');rect(x-15,y-2,35,2,'#d4b88b')}if(m.island===4){rect(x-13,y-78,30,3,'#d9cc9e');rect(x-3,y-88,5,24,'#eee4b9')}}
}
