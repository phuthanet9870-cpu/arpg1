import {isTown} from './farming.mjs';
import {WORLD,SOLIDS} from './data.mjs';
const CELL=32, COLS=Math.ceil(WORLD.w/CELL), ROWS=Math.ceil(WORLD.h/CELL);
export function walkable(zone,x,y){return x>=70&&x<=WORLD.w-70&&y>=100&&y<=WORLD.h-70&&(!isTown(zone)||!SOLIDS.some(r=>x>r.x-12&&x<r.x+r.w+12&&y>r.y-6&&y<r.y+r.h+8))}
// A* on a small shared navigation grid. Diagonal moves cannot cut obstacle corners.
export function findPath(zone,start,destination){
 const end={x:Math.max(80,Math.min(WORLD.w-80,destination.x)),y:Math.max(112,Math.min(WORLD.h-80,destination.y))};
 const distance=Math.hypot(end.x-start.x,end.y-start.y);const clear=()=>{const steps=Math.ceil(distance/20);for(let i=0;i<=steps;i++)if(!walkable(zone,start.x+(end.x-start.x)*i/Math.max(1,steps),start.y+(end.y-start.y)*i/Math.max(1,steps)))return false;return true};if(clear())return [end];if(distance>2400){const gate={x:1952,y:1184};if(Math.hypot(start.x-gate.x,start.y-gate.y)<Math.hypot(end.x-gate.x,end.y-gate.y))return [...findPath(zone,start,gate),end];return [gate,...findPath(zone,gate,end)];}
 const cell=(x,y)=>({x:Math.max(2,Math.min(COLS-3,Math.floor(x/CELL))),y:Math.max(3,Math.min(ROWS-3,Math.floor(y/CELL)))});
 const s=cell(start.x,start.y);let goal=cell(end.x,end.y);const key=(x,y)=>y*COLS+x, center=n=>({x:n.x*CELL+CELL/2,y:n.y*CELL+CELL/2}),free=(x,y)=>{const c=center({x,y});return walkable(zone,c.x,c.y)};
 if(!free(goal.x,goal.y)){let best=null;for(let r=1;r<=10&&!best;r++){const choices=[];for(let y=goal.y-r;y<=goal.y+r;y++)for(let x=goal.x-r;x<=goal.x+r;x++)if(free(x,y)){const c=center({x,y});choices.push({x,y,d:Math.hypot(c.x-end.x,c.y-end.y)})}best=choices.sort((a,b)=>a.d-b.d)[0]}if(!best)return [];goal=best;}
 const startKey=key(s.x,s.y),goalKey=key(goal.x,goal.y),open=[s],came=new Map(),cost=new Map([[startKey,0]]),closed=new Set();
 for(let iteration=0;open.length&&iteration<4000;iteration++){
  open.sort((a,b)=>(cost.get(key(a.x,a.y))+Math.hypot(a.x-goal.x,a.y-goal.y))-(cost.get(key(b.x,b.y))+Math.hypot(b.x-goal.x,b.y-goal.y)));
  const n=open.shift(),nk=key(n.x,n.y);if(closed.has(nk))continue;if(nk===goalKey){const path=[];let at=nk;while(at!==startKey){path.push(center({x:at%COLS,y:Math.floor(at/COLS)}));at=came.get(at);if(at===undefined)return []}path.reverse();if(walkable(zone,end.x,end.y)&&Math.hypot(center(goal).x-end.x,center(goal).y-end.y)<45)path.push(end);return path;}
  closed.add(nk);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const x=n.x+dx,y=n.y+dy,k=key(x,y);if(!free(x,y)||closed.has(k)||(dx&&dy&&(!free(n.x+dx,n.y)||!free(n.x,n.y+dy))))continue;const next=cost.get(nk)+Math.hypot(dx,dy);if(next<(cost.get(k)??Infinity)){cost.set(k,next);came.set(k,nk);open.push({x,y})}}
 }
 return [];
}
