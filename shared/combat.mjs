import {WORLD} from './data.mjs';
import {buildFor,combatStats,ELEMENT_COLORS,directionFor} from './builds.mjs';
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function face(p,x,y){if(Math.hypot(x-p.x,y-p.y)<.01)return;p.angle=Math.atan2(y-p.y,x-p.x);p.facing=directionFor(p.angle)}
export function resetCombat(p){p.run=false;p.path=[];p.inputs={};p.targetId=null;p.lockId=null;p.destination=null;p.comboStep=0;p.combo=0;p.comboUntil=0;p.chainUntil=0;p.counterUntil=0;p.stamina=100;p.dodgeCharges=2;p.dodgeTimers=[];p.blocking=false;p.pending=[];p.skillCooldowns={};p.cooldowns={};p.attackUntil=0;p.attackId=0;p.hurtUntil=0;p.dodgeUntil=0;p.facing='south';p.angle=Math.PI/2;p.minions=[];}
export function applyHit(world,p,e,hit){
 if(e.hp<=0)return;const b=hit.gem?{freeze:hit.freeze,dot:hit.dotDuration,heal:1,leech:hit.leech}:buildFor(p);const vulnerable=(e.vulnerableUntil||0)>world.time?1+(e.vulnerabilityPercent||.15):1;const crit=world.random()<hit.crit;let damage=Math.max(1,Math.round(hit.damage*vulnerable*(crit?1.7:1)));
 if(e.brokenUntil>world.time)damage=Math.round(damage*1.25);e.hp-=damage;e.hurtUntil=world.time+.13;e.lastHitAngle=Math.atan2(e.y-p.y,e.x-p.x);
 if(!e.brokenUntil||e.brokenUntil<=world.time){e.poise=Math.min(100,(e.poise||0)+hit.poise);if(e.poise>=100){e.poise=0;e.brokenUntil=world.time+(e.boss?1.4:1.8);e.windup=0;world.event('break',e.x,e.y-35,{text:'เสียการทรงตัว',color:'#ffe1a5'});}}
 if(hit.finisher&&!e.boss){e.x=clamp(e.x+Math.cos(p.angle)*24,70,WORLD.w-70);e.y=clamp(e.y+Math.sin(p.angle)*24,100,WORLD.h-70)}
 const element=hit.element;if(hit.consumeDot&&e.dot>world.time)e.hp-=Math.round((e.dotPower||5)*2);if(hit.vulnerability){e.vulnerableUntil=world.time+4;e.vulnerabilityPercent=hit.vulnerability;}if(element==='ice'){e.slow=world.time+(hit.slowDuration||3);if(hit.finisher&&b.freeze){if(e.boss)e.poise=Math.min(99,(e.poise||0)+30);else e.frozenUntil=world.time+1.3}}
 if(element==='lightning'){e.shockUntil=world.time+3;if((hit.heavy||hit.finisher)&&!hit.vulnerability){e.vulnerableUntil=world.time+3;e.vulnerabilityPercent=.15;}}
 if(['fire','poison','curse'].includes(element)||hit.dotDuration){e.status=element==='physical'?'bleed':element;e.dot=world.time+(b.dot||3);e.dotPower=damage*(hit.dotScale||(element==='curse'?.18:.12));e.dotOwner=p.id;}
 if(hit.heavy&&b.vulnerable)e.vulnerableUntil=world.time+4;
 if(hit.heavy&&element==='poison'&&e.dot>world.time){e.hp-=Math.round(e.dotPower*2);world.fields.push({id:++world.seq,x:e.x,y:e.y,radius:95,until:world.time+3,tick:world.time+.5,damage:damage*.12,owner:p.id,color:ELEMENT_COLORS.poison})}
 const heal=hit.gem?damage*(hit.leech||0):(p.classId==='priest'?5*(b.heal||1):p.classId==='summoner'?3:0)+(hit.heavy?damage*(b.leech||0):0);if(heal){p.hp=Math.min(p.maxHp,p.hp+heal);if(p.classId==='priest'&&p.build===0)for(const ally of Object.values(world.players))if(ally.id!==p.id&&!ally.dead&&distance(ally,p)<260)ally.hp=Math.min(ally.maxHp,ally.hp+heal*.5)}
 world.event('damage',e.x,e.y-32,{text:String(damage)+(crit?'!':''),color:crit?'#ffe083':ELEMENT_COLORS[element]||'#fff7e2',attacker:p.id,critical:crit,finisher:hit.finisher});world.event('hit',e.x,e.y-20,{color:ELEMENT_COLORS[element]||'#fff0cc',angle:e.lastHitAngle,critical:crit,attacker:p.id});
 p.combo=Math.min(5,(p.combo||0)+1);p.comboUntil=world.time+1.5;
 if(hit.rune==='echo')world.fields.push({id:++world.seq,x:e.x,y:e.y,radius:40,until:world.time+.45,tick:world.time+.25,damage:damage*.2,owner:p.id,color:ELEMENT_COLORS[element]||'#fff4c4'});
}
export function resolveAttack(world,p,hit){
 const candidates=world.enemies.filter(e=>e.hp>0);let count=0,primary=null;
 for(const e of candidates){const d=distance(p,e);const delta=Math.atan2(Math.sin(Math.atan2(e.y-p.y,e.x-p.x)-hit.angle),Math.cos(Math.atan2(e.y-p.y,e.x-p.x)-hit.angle));let touches;
 if(hit.mode==='nova')touches=d<=hit.radius;
 else if(hit.mode==='area')touches=distance(e,{x:hit.tx,y:hit.ty})<=hit.radius;
 else if(hit.mode==='cone')touches=d<=hit.range&&Math.abs(delta)<=hit.spread;
 else touches=d<=hit.range&&Math.abs(delta)<=hit.spread;
 if(!touches)continue;applyHit(world,p,e,hit);count++;primary??=e;if(count>=hit.maxHits)break;
 }
 if(primary&&hit.chain){const rest=candidates.filter(e=>e!==primary&&e.hp>0&&distance(e,primary)<230).sort((a,b)=>distance(a,primary)-distance(b,primary)).slice(0,hit.chain);let source=primary;for(const e of rest){applyHit(world,p,e,{...hit,damage:hit.damage*.65,chain:0});world.event('bolt',source.x,source.y,{tx:e.x,ty:e.y,color:ELEMENT_COLORS.lightning,radius:12,area:false});source=e}}
}
export function makeAttack(world,p,c,s,slot,x,y,heavy=false){
 const b=buildFor(p),stats=combatStats(p,c),isUlt=s.type==='ult',basic=s.type==='attack'&&s.index===0;
 if(heavy&&p.stamina<22)return null;
 const cost=s.cost*stats.cost;if(p.mp<cost)return null;
 p.mp-=cost;if(heavy)p.stamina-=22;
 const step=basic&&!heavy?((p.chainUntil||0)>world.time?(p.comboStep||0)%3+1:1):0;
 if(step){p.comboStep=step;p.chainUntil=world.time+1.2}if(heavy){p.comboStep=0;p.chainUntil=0}
 face(p,x,y);const finisher=step===3;const range=isUlt?460:stats.range+(s.index>=3?100:0)+(heavy?45:0);
 const ranged=!['knight','monk'].includes(c.id),spread=heavy?.6:basic&&ranged?.22:1.2;
 let mode=isUlt?'area':ranged?(s.index===3?'area':'line'):'cone';if(s.index===3&&!isUlt&&['mage','priest','monk'].includes(c.id))mode='nova';
 if(s.index===1&&!isUlt)mode='cone';if(heavy&&c.id==='mage'&&b.freeze)mode='area';if(heavy&&c.id==='monk'&&b.element==='lightning')mode='nova';
 const radius=isUlt?(s.index===2?320:240):heavy?125:75+s.index*12;
 const tx=p.x+Math.cos(p.angle)*Math.min(range,distance(p,{x,y})),ty=p.y+Math.sin(p.angle)*Math.min(range,distance(p,{x,y}));
 const power=Object.values(p.gear).reduce((sum,it)=>sum+it.power,0);
 let damage=((isUlt?110:22+s.index*7)+p.level*3+power)*stats.damage*(c.id==='knight'?1.12:1)*(c.id==='monk'?1+Math.min(5,p.combo||0)*.04:1);
 damage*=p.counterUntil>world.time?1.3:1;if(p.counterUntil>world.time)p.counterUntil=0;damage*=heavy?2:step===3?1.65:step===2?1.15:1;damage*=p.runes[slot]==='power'?1.25:1;damage*=p.buffUntil>world.time&&p.buffKind===0?1.35:1;
 const windup=heavy?.26:isUlt?.24:ranged?.1:.11;
 p.attackId=(p.attackId||0)+1;p.attackAt=world.time;p.attackUntil=world.time+(heavy?.55:isUlt?.65:.32);p.attackKind=heavy?'heavy':isUlt?'ultimate':ranged?'cast':'slash';p.attackStep=step;p.attackAngle=p.angle;p.blocking=false;
 const cooldown=(heavy?.9:s.cd)*(p.runes[slot]==='swift'?.65:1)*stats.cooldown;
 p.cooldowns[slot]=world.time+cooldown;
 const maxHits=isUlt||mode==='nova'||mode==='area'||!ranged||s.index===1?99:(b.pierce&&finisher?4:1);
 const hit={due:world.time+windup,mode,range,spread:s.index===1?.72:spread,radius,tx,ty,angle:p.angle,damage,crit:stats.crit,poise:(heavy?50:finisher?38:basic?12:20)*stats.poise,element:b.element,finisher,heavy,maxHits,chain:(heavy||finisher)?b.chain||0:0,rune:p.runes[slot],attackId:p.attackId};
 p.pending.push(hit);
 world.event(heavy?'heavy':isUlt?'ultimate':ranged?'bolt':'slash',p.x,p.y,{tx,ty,color:ELEMENT_COLORS[b.element]||c.color,radius,area:mode==='area'||mode==='nova',angle:p.angle,name:heavy?'โจมตีหนัก':s.name,step,playerId:p.id,windup});
 return hit;
}
