import {equipmentStats} from './equipment.mjs';
import {isTown} from './farming.mjs';
import {ACTIVE_GEMS,WEAPONS,gemById,supportById,attributes,gemUsability,gemProfile,compatible} from './gems.mjs';
import {safeCamp} from './overworld.mjs';import {face,clamp} from './combat.mjs';import {WORLD,CLASSES} from './data.mjs';import {ELEMENT_COLORS} from './builds.mjs';
export function refreshGemStats(p){const eq=equipmentStats(p),a=attributes(p);p.maxMp=100+a.int*2+eq.mana;p.maxHp=(CLASSES.find(c=>c.id===p.classId)?.hp||140)+(p.level-1)*14+a.str*2+eq.hp;p.hp=Math.min(p.hp,p.maxHp);p.spirit=40+eq.spirit+Math.min(60,Math.floor((p.gear.charm?.power||0)/2));p.activeAuras=(p.activeAuras||[]).filter(id=>!gemUsability(p,gemById(id)));let reserved=0;p.activeAuras=p.activeAuras.filter(id=>{const cost=gemProfile(p,gemById(id)).reservation;if(reserved+cost>p.spirit)return false;reserved+=cost;return true});p.spiritReserved=reserved;p.mp=Math.min(p.mp,p.maxMp);p.auraEffects={damage:0,guard:0,speed:0,crit:0,mana:0,spell:0,minion:0,stamina:0};for(const id of p.activeAuras){const type=gemById(id).weapon;const buffs={blade:['damage',.1],mace:['guard',.1],bow:['speed',.1],crossbow:['crit',.05],staff:['mana',3],wand:['spell',.1],sceptre:['minion',.2],quarterstaff:['stamina',5]};const [key,value]=buffs[type];p.auraEffects[key]+=value;}}
export function gemAction(w,p,a){
 const safe=safeCamp(w.zone,p),error=text=>{p.gemError=text;return true};
 if(a.type==='attributes'&&safe){if(a.reset)p.attributePoints={str:0,dex:0,int:0};else if(['str','dex','int'].includes(a.stat)&&Object.values(p.attributePoints).reduce((n,v)=>n+v,0)<12+(p.level-1)*3)p.attributePoints[a.stat]++;refreshGemStats(p);return true}
 if(a.type==='weapons'&&safe){if([0,1].includes(a.slot)&&Object.hasOwn(WEAPONS,a.weapon))p.weaponSets[a.slot]=a.weapon;refreshGemStats(p);return true}
 if(a.type==='swapweapon'){p.activeWeaponSet=1-p.activeWeaponSet;return true}
 if(a.type==='engrave'&&safe){const g=gemById(a.id),tier=Number(a.tier)||1;if(!g||!Number.isInteger(tier)||tier<1||tier>20)return error('ระดับเจมไม่ถูกต้อง');if(tier>p.level)return error('เลเวลตัวละครต้องไม่น้อยกว่าระดับเจม');if((p.gemLevels[g.id]||0)>=tier)return error('มีเจมระดับนี้หรือสูงกว่าแล้ว');if(!(p.uncutGems[tier]>0))return error('ไม่มี Uncut Gem ระดับนี้');p.uncutGems[tier]--;p.gemLevels[g.id]=tier;p.gemError='';return true}
 if(a.type==='learnsupport'&&safe){if(!supportById(a.id))return error('ไม่พบ Support Gem');if(p.knownSupports.includes(a.id))return error('เรียนรู้ซัพพอร์ตแล้ว');if(p.supportStones<1)return error('หินซัพพอร์ตไม่พอ');p.supportStones--;p.knownSupports.push(a.id);p.gemError='';return true}
 if(a.type==='linksupport'&&safe){const g=gemById(a.gem),s=supportById(a.support);if(!g||!p.gemLevels[g.id])return error('ต้องมี Active Gem ก่อน');let links=[...(p.gemSupports[g.id]||[])];if(a.remove){p.gemSupports[g.id]=links.filter(id=>id!==a.support);refreshGemStats(p);return true}if(!s||!p.knownSupports.includes(s.id)||!compatible(g,s))return error('แท็กของ Support ไม่ตรงกับสกิลนี้');if(links.some(id=>supportById(id).family===s.family))return error('มีซัพพอร์ตตระกูลเดียวกันในสกิลนี้แล้ว');if(links.length>=(p.gemSockets[g.id]||3))return error('ช่องซัพพอร์ตเต็ม');links.push(s.id);p.gemSupports[g.id]=links;refreshGemStats(p);p.gemError='';return true}
 if(a.type==='socket'&&safe){const g=gemById(a.id);if(!g||!p.gemLevels[g.id]||(p.gemSockets[g.id]||3)>=5)return error('เพิ่มได้สูงสุด 5 ช่องต่อเจม');if(p.jewellers<1)return error('ไม่มีหินเพิ่มช่อง');p.jewellers--;p.gemSockets[g.id]=(p.gemSockets[g.id]||3)+1;p.gemError='';return true}
 if(a.type==='gempreset'&&safe){if(a.save){if(p.gemPresets.length>=5)return error('บันทึกได้สูงสุด 5 ชุด');p.gemPresets.push({name:String(a.name||'บิลด์ '+(p.gemPresets.length+1)).slice(0,24),hotbar:[...p.hotbar],weaponSets:[...p.weaponSets],attributePoints:{...p.attributePoints},gemSupports:JSON.parse(JSON.stringify(p.gemSupports))})}else if(a.remove)p.gemPresets.splice(Number(a.index),1);else{const preset=p.gemPresets[Number(a.index)];if(preset){p.hotbar=[...preset.hotbar];p.weaponSets=[...preset.weaponSets];p.attributePoints={...preset.attributePoints};p.gemSupports=JSON.parse(JSON.stringify(preset.gemSupports));refreshGemStats(p)}}return true}
 return false;
}
export function castGem(w,p,id,x,y,heavy=false){
 const g=gemById(id),reason=gemUsability(p,g);if(reason){if(!p.auto)p.gemError=reason;return false}if(isTown(w.zone)){p.gemError='พื้นที่ปลอดภัย';return false}if(p.dead||p.blocking||p.dodgeUntil>w.time)return false;
 const profile=gemProfile(p,g),m=profile.mods;
 if(g.mode==='aura'){
  if(p.activeAuras.includes(g.id))p.activeAuras=p.activeAuras.filter(id=>id!==g.id);else{if(p.spiritReserved+profile.reservation>p.spirit){p.gemError='Spirit ไม่พอสำหรับสำรองออร่า';return false}p.activeAuras.push(g.id)}refreshGemStats(p);w.event('buff',p.x,p.y,{color:ELEMENT_COLORS[g.element],radius:100});p.gemError='';return true;
 }
 if((p.gemCooldowns[id]||0)>w.time||p.gemActionUntil>w.time)return false;
 const cost=profile.mana;if(m.lifeCost){if(p.hp<=cost+1){p.gemError='พลังชีวิตไม่พอ';return false}}else if(p.mp<cost){if(!p.auto)p.gemError='มานาไม่พอ';return false}
 if(heavy&&p.stamina<22)return false;
 if(m.lifeCost)p.hp-=cost;else p.mp-=cost;if(heavy)p.stamina-=22;
 p.activeWeaponSet=p.weaponSets.indexOf(g.weapon);face(p,x,y);p.gemError='';const basic=g.mode==='basic',step=basic&&!heavy?((p.chainUntil||0)>w.time?(p.comboStep||0)%3+1:1):0;
 if(step){p.comboStep=step;p.chainUntil=w.time+1.2}
 p.attackId++;p.attackAt=w.time;p.attackUntil=w.time+(heavy?.55:g.castTime+.2);p.attackKind=heavy?'heavy':g.tags.includes('spell')?'cast':'slash';p.attackStep=step;p.attackAngle=p.angle;
 p.gemCooldowns[id]=w.time+(heavy?.9:profile.cooldown);p.gemActionUntil=w.time+(heavy?.35:g.castTime);
 const range=profile.range+(heavy?45:0),tx=p.x+Math.cos(p.angle)*Math.min(range,Math.hypot(x-p.x,y-p.y)),ty=p.y+Math.sin(p.angle)*Math.min(range,Math.hypot(x-p.x,y-p.y));
 const color=ELEMENT_COLORS[profile.element]||'#dabd83',duration=profile.duration;
 if(g.mode==='guard'){p.buffUntil=w.time+6*profile.mods.duration;p.buffKind=1;p.hp=Math.min(p.maxHp,p.hp+18+profile.level*4);w.event('buff',p.x,p.y,{color,radius:90});return true}
 if(g.mode==='summon'){p.minions=Array.from({length:1+m.minions},(_,i)=>({id:'gm'+(++w.seq),x:p.x-30+i*24,y:p.y+20,hp:100,until:w.time+duration,cd:w.time+i*.18,interval:1.1*m.minionRate,damage:Math.max(8,profile.damage)*(1+(p.auraEffects?.minion||0)),gem:true,leech:m.leech,guard:m.guard||0,sacrifice:m.sacrifice,chain:m.chain,freeze:m.freeze,slowDuration:m.slow,dotDuration:m.dot,dotScale:m.dotScale,vulnerability:m.vulnerable,element:profile.element}));w.event('buff',p.x,p.y,{color,radius:75});return true}
 if(g.mode==='dash'){for(let i=0;i<5;i++){const nx=clamp(p.x+Math.cos(p.angle)*30,70,WORLD.w-70),ny=clamp(p.y+Math.sin(p.angle)*30,100,WORLD.h-70);if(w.walkable(nx,ny)){p.x=nx;p.y=ny}}}
 const mode=['nova','dash'].includes(g.mode)?'nova':['field','storm','area','curse'].includes(g.mode)?'area':g.mode==='cone'||m.projectiles?'cone':WEAPONS[g.weapon].range<200?'cone':'line';
 const damage=profile.damage*(heavy?2:step===3?1.65*(m.finisher||1):step===2?1.15:1)*(1+(p.auraEffects?.damage||0)+(g.tags.includes('spell')?(p.auraEffects?.spell||0):0));
 const hit={gem:true,due:w.time+(heavy?.26:g.castTime),mode,range,spread:m.projectiles?.22+m.projectiles*.15:g.mode==='cone'?.8:WEAPONS[g.weapon].range<200?1.15:.22,radius:profile.radius||110,tx,ty,angle:p.angle,damage,crit:profile.crit+(p.auraEffects?.crit||0),poise:(heavy?50:step===3?38:12)*m.poise,element:profile.element,finisher:step===3,heavy,maxHits:g.mode==='beam'?4+m.pierce:mode==='line'?1+m.pierce:99,chain:m.chain,leech:m.leech,freeze:m.freeze,slowDuration:m.slow,dotDuration:m.dot,dotScale:m.dotScale,consumeDot:m.consumeDot,vulnerability:m.vulnerable,attackId:p.attackId};
 p.pending.push(hit);if(m.echo)p.pending.push({...hit,due:hit.due+.3,damage:hit.damage*m.echo,attackId:p.attackId});
 if(['field','storm','curse'].includes(g.mode)){w.fields.push({id:++w.seq,x:tx,y:ty,radius:profile.radius,until:w.time+duration,tick:w.time+.4,interval:.5*m.tick,damage:damage*.25,owner:p.id,color});}
 if(g.mode==='curse')for(const e of w.enemies)if(Math.hypot(e.x-tx,e.y-ty)<profile.radius)e.vulnerableUntil=w.time+duration;
 const kind=heavy?'heavy':['area','storm'].includes(g.mode)?'ultimate':g.tags.includes('projectile')||g.tags.includes('spell')?'bolt':'slash';w.event(kind,p.x,p.y,{tx,ty,color,radius:profile.radius||100,area:mode==='nova'||mode==='area',angle:p.angle,name:g.name,step,playerId:p.id});
 for(let i=0;i<m.projectiles;i++){const angle=p.angle+(i-(m.projectiles-1)/2)*.2;w.event('bolt',p.x,p.y,{tx:p.x+Math.cos(angle)*range,ty:p.y+Math.sin(angle)*range,color,radius:30,area:false})}
 return true;
}
