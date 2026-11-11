import {initInventory,inventoryAction,equipmentOrder} from './inventory.mjs';
import {gmCommand} from './gm.mjs';
import {initTriggers,notifyTrigger,tickTriggers} from './triggers.mjs';
import {initEndgame,endgameAction,tickEndgame,activeDungeon,tuneDungeonEnemy,ARENA} from './endgame.mjs';
import {advanceBoss,tickHazards,BOSS_SIGNATURES} from './boss-encounters.mjs';
import {initPassives,passiveAction} from './passives.mjs';
import {initIslandQuests,islandQuestAction,BOSS_NAMES,bossHit} from './island-quests.mjs';
import {initEquipment,itemAction,createEquipment,BASES,equipmentStats,CARDS} from './equipment.mjs';
import {MAPS,isTown,initFarm,farmDrops,farmAction,FARM_ITEMS} from './farming.mjs';
import {initializeGems,gemById,gemProfile,gemUsability,attributes,STARTERS,WEAPONS} from './gems.mjs';
import {gemAction,castGem,refreshGemStats} from './gem-combat.mjs';
import {defaultBar,normalizeBar,validBinding} from './hotbar.mjs';
import {LANDMARKS,landmarkKey,worldNpcs,safeCamp,sectorAt,discoveryProgress,WORLD_QUESTS} from './overworld.mjs';
import {BUILDS,buildFor,combatStats,directionFor} from './builds.mjs';
import {face,resetCombat,makeAttack,resolveAttack,applyHit} from './combat.mjs';
import {findPath,walkable} from './navigation.mjs';
import {CLASSES,WORLD,ZONES,skillsFor,SOLIDS} from './data.mjs';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export class World {
 constructor(seed=42,options={}){this.allowGM=options.allowGM===true;this.gemMode=options.legacy!==true;this.seed=seed;this.players={};this.enemies=[];this.loot=[];this.effects=[];this.time=0;this.zone=0;this.kills=0;this.bossDead=false;this.seq=0;this.rift=1;this.curse=0;this.fields=[];this.hazards=[];this.exploredSectors=new Set();}
 random(){this.seed=(this.seed*1664525+1013904223)>>>0;return this.seed/4294967296}
 addPlayer(id,classId,name='นักเดินทาง',save){const ci=Math.max(0,CLASSES.findIndex(c=>c.id===classId)),c=CLASSES[ci];const level=clamp(Number(save?.level)||1,1,30);const p={id,classId:c.id,name:String(name).slice(0,20),x:960,y:840,hp:c.hp+(level-1)*14,maxHp:c.hp+(level-1)*14,mp:100,maxMp:100,level,xp:0,gold:0,kills:0,inventory:[],stash:[],gear:{},loadout:[0,1,2,3,6,13],runes:['power','power','power','power','power','power'],cooldowns:{},buffUntil:0,invUntil:0,potions:3,quest:0,rewardClaimed:false,discovered:[landmarkKey(0,'entry')],questRewards:[],talked:[],bossKills:0,hotbar:defaultBar(),dead:false,build:0,auto:false,path:[],targetId:null,inputs:{},...{}};
 if(save){for(const k of ['xp','gold','inventory','stash','gear','loadout','runes','quest','rewardClaimed','kills','potions','build','hotbar','discovered','questRewards','talked','bossKills'])if(save[k]!==undefined)p[k]=save[k];}initFarm(p,save);initInventory(p,save);p.gmAccess=this.allowGM;initEquipment(p,save);initIslandQuests(p,save);initPassives(p,save);initEndgame(p,save);p.hotbar=normalizeBar(p.hotbar,c);p.build=BUILDS[p.classId][p.build]?p.build:0;p.maxHp=Math.round((c.hp+(level-1)*14)*(buildFor(p).hp||1));p.hp=p.maxHp;if(!save)p.loadout=[...BUILDS[p.classId][p.build].loadout];resetCombat(p);if(this.gemMode){initializeGems(p,save);initTriggers(p,save);refreshGemStats(p);p.mp=p.maxMp;p.hp=p.maxHp;}this.seq=Math.max(this.seq,...[...p.inventory,...p.stash,...Object.values(p.gear)].map(it=>Number(String(it.id).slice(1))||0));if(this.gemMode&&this.zone!==0){p.x=960;p.y=1190;}this.players[id]=p;return p;}
 walkable(x,y){return (!activeDungeon(this)||(x>=ARENA.left&&x<=ARENA.right&&y>=ARENA.top&&y<=ARENA.bottom))&&walkable(this.zone,x,y)}
 removePlayer(id){delete this.players[id]}
 zoneTo(z){if(!Number.isInteger(z)||!ZONES[z])return;this.dungeon=null;this.zone=z;this.enemies=[];this.loot=[];this.effects=[];this.fields=[];this.hazards=[];this.kills=0;this.bossDead=false;this.exploredSectors=new Set();for(const p of Object.values(this.players)){p.x=960;p.y=isTown(z)?1190:1190;p.hp=p.maxHp;p.mp=p.maxMp||100;p.dead=false;resetCombat(p);p.potions=Math.max(p.potions,3)}
 if(!isTown(z)){const n=20;for(let i=0;i<n;i++){this.spawnEnemy(200+this.random()*1520,160+this.random()*800,false,i%3)}this.spawnEnemy(960,270,true,3);}this.spawnEpoch=Math.floor(this.time/45);for(const p of Object.values(this.players)){const s=sectorAt(p.x,p.y);this.exploredSectors.add(this.zone+':'+s.x+':'+s.y);}}
 spawnEnemy(x,y,boss,kind){const scale=(1+(this.gemMode?MAPS[this.zone].level/4:this.zone*.45))*(this.zone===4?this.rift:1)*(1+this.curse*.25)*(1+Math.max(0,Object.keys(this.players).length-1)*.35);const hp=Math.round((boss?650:48+kind*15)*scale);this.enemies.push({id:'e'+(++this.seq),x,y,hp,maxHp:hp,boss,kind,speed:boss?45:55+kind*12,cd:1+this.random(),windup:0,slow:0,dot:0,attackRange:this.gemMode&&kind===1?230:50,attackRadius:this.gemMode&&kind===2?85:48,pattern:boss?['nova','ring','line','burst'][MAPS[this.zone].local-1]:null,signature:boss?BOSS_SIGNATURES[MAPS[this.zone].island]:null,name:boss?BOSS_NAMES[MAPS[this.zone].biome]:MAPS[this.zone].monster,mapId:this.zone,tint:MAPS[this.zone].color});tuneDungeonEnemy(this,this.enemies.at(-1));}
 event(type,x,y,extra={}){this.effects.push({id:++this.seq,type,x,y,t:this.time,...extra});}
 action(id,a){const p=this.players[id];if(!p)return;if(a.type==='gm'){if(this.allowGM)try{this.gmNotice=gmCommand(this,id,a,true).message}catch(e){this.gmNotice=e.message}return;}if(inventoryAction(p,a))return;if(a.type==='input'){if(Number(a.x)||Number(a.y)){p.auto=false;p.run=false;p.path=[];p.targetId=null;}p.inputs={x:clamp(Number(a.x)||0,-1,1),y:clamp(Number(a.y)||0,-1,1)};return}
 if(a.type==='respawn'){if(!p.dead)return;p.dead=false;p.hp=p.maxHp;p.mp=p.maxMp||100;resetCombat(p);p.x=960;p.y=this.zone?1220:840;p.invUntil=this.time+3;return}
 if(endgameAction(this,p,a))return;
 if(p.dead)return;
 if(farmAction(this,p,a))return;
 if(p.gemMode&&passiveAction(this,p,a)){refreshGemStats(p);return;}
 if(p.gemMode&&islandQuestAction(this,p,a))return;
 if(p.gemMode&&itemAction(this,p,a)){refreshGemStats(p);return;}
 if(a.type==='stop'){p.auto=false;p.run=false;p.lockId=null;p.blocking=false;p.path=[];p.targetId=null;p.inputs={};return}
 if(a.type==='auto'){p.run=false;p.auto=Boolean(a.enabled);p.path=[];p.inputs={};p.targetId=null;return}
 if(a.type==='move'&&Number.isFinite(a.x)&&Number.isFinite(a.y)){p.auto=false;p.run=Boolean(a.run);p.targetId=null;p.inputs={};p.path=findPath(this.zone,p,{x:activeDungeon(this)?clamp(a.x,ARENA.left,ARENA.right):a.x,y:activeDungeon(this)?clamp(a.y,ARENA.top,ARENA.bottom):a.y});p.destination=p.path.at(-1)||null;return}
 if(a.type==='lock'){const options=this.enemies.filter(e=>e.hp>0&&dist(e,p)<800).sort((a,b)=>dist(a,p)-dist(b,p));if(a.clear)p.lockId=null;else if(a.id){if(options.some(e=>e.id===a.id))p.lockId=a.id}else{const ix=options.findIndex(e=>e.id===p.lockId);p.lockId=options[(ix+1)%options.length]?.id||null;}return}
 if(a.type==='block'){if(p.dodgeUntil>this.time)return;p.blocking=Boolean(a.enabled)&&p.stamina>5;if(p.blocking){p.blockAt=this.time;p.auto=false;p.targetId=null;p.path=[];p.inputs={};p.pending=[];if(Number.isFinite(a.x)&&Number.isFinite(a.y))face(p,a.x,a.y)}return}
 if(a.type==='build'&&!p.gemMode&&this.zone===0&&[0,1].includes(a.index)){p.build=a.index;p.loadout=[...BUILDS[p.classId][p.build].loadout];p.maxHp=Math.round((CLASSES.find(c=>c.id===p.classId).hp+(p.level-1)*14)*(buildFor(p).hp||1));p.hp=p.maxHp;p.cooldowns={};resetCombat(p);return}
 if(a.type==='target'){const e=this.enemies.find(e=>e.id===a.id&&e.hp>0);if(e){p.auto=false;p.targetId=e.id;p.lockId=e.id;p.path=[];p.inputs={};p.repath=0;}return}

 if(p.gemMode&&gemAction(this,p,a))return;
 if(a.type==='bindbar'&&safeCamp(this.zone,p)){if(Number.isInteger(a.slot)&&a.slot>=0&&a.slot<20&&validBinding(a.binding,CLASSES.find(c=>c.id===p.classId))&&(!p.gemMode||!String(a.binding).startsWith('skill:')))p.hotbar[a.slot]=a.binding;return}
 if(a.type==='usebar'&&Number.isInteger(a.slot)&&a.slot>=0&&a.slot<20){const binding=p.hotbar[a.slot];if(!binding)return;if(binding.startsWith('gem:')){const lock=this.enemies.find(e=>e.id===p.lockId&&e.hp>0);castGem(this,p,binding.slice(4),lock?.x||Number(a.x)||p.x+100,lock?.y||Number(a.y)||p.y)}else if(binding.startsWith('skill:')&&!p.gemMode){const ix=Number(binding.split(':')[1]);const lock=this.enemies.find(e=>e.id===p.lockId&&e.hp>0);this.cast(p,0,lock?.x||(Number(a.x)||p.x+100),lock?.y||(Number(a.y)||p.y),false,ix)}else if(['potion','dodge','lock'].includes(binding))this.action(id,{type:binding});else if(binding==='auto')this.action(id,{type:'auto',enabled:!p.auto});else if(binding==='block')this.action(id,{type:'block',enabled:!p.blocking,x:a.x,y:a.y});return}
 if(a.type==='waypoint'&&this.dungeon)return;
 if(a.type==='waypoint'){const mark=LANDMARKS.find(l=>l.id===a.id);if(mark&&p.discovered.includes(landmarkKey(this.zone,mark.id))){p.x=mark.x;p.y=mark.y;p.auto=false;resetCombat(p);p.invUntil=this.time+2;}return}
 if(a.type==='talk'){const npc=worldNpcs(this.zone).find(n=>n.id===a.id);if(npc&&dist(npc,p)<160&&!p.talked.includes(npc.id))p.talked.push(npc.id);return}
 if(a.type==='worldclaim'){const q=WORLD_QUESTS.find(q=>q.id===a.id);if(q&&!p.questRewards.includes(q.id)&&discoveryProgress(p,q)>=q.goal){p.questRewards.push(q.id);p.gold+=q.gold;p.xp+=q.xp;this.giveLoot(p,2)}return}
 if(a.type==='travel'&&this.dungeon)return;
 if(a.type==='waypoint'&&activeDungeon(this))return;
 if(a.type==='travel'){if(this.gemMode?MAPS[Number(a.zone)]&&(isTown(Number(a.zone))||safeCamp(this.zone,p)||this.bossDead):(this.zone===0||a.zone===0||this.bossDead)){this.curse=clamp(Number(a.curse)||0,0,2);if(this.zone===4&&a.zone===4)this.rift++;this.zoneTo(Number(a.zone))}return}
 if(a.type==='loadout'&&!p.gemMode&&this.zone===0){const sk=skillsFor(CLASSES.find(c=>c.id===p.classId));const s=Number(a.slot),i=Number(a.skill);if(Number.isInteger(s)&&s>=0&&s<6&&sk[i]&&sk[i].type===(s<4?'attack':s===4?'ult':'buff'))p.loadout[s]=i;if(['power','echo','swift'].includes(a.rune))p.runes[s]=a.rune;return}
 if(a.type==='equip'){const it=p.inventory.find(x=>x.id===a.item);if(it&&(!p.gemMode||p.level>=it.level)){const old=p.gear[it.slot];p.inventory=p.inventory.filter(x=>x.id!==it.id);p.gear[it.slot]=it;if(old)p.inventory.push(old);if(p.gemMode)refreshGemStats(p)}return}
 if(a.type==='salvage'){const it=p.inventory.find(x=>x.id===a.item);if(it&&!it.locked&&!it.cards?.length){p.gold+=10+it.rarity*12;p.inventory=p.inventory.filter(x=>x.id!==it.id)}return}
 if(a.type==='stash'&&isTown(this.zone)){const src=a.withdraw?p.stash:p.inventory,dst=a.withdraw?p.inventory:p.stash;const ix=src.findIndex(x=>x.id===a.item);if(ix>=0&&dst.length<40)dst.push(src.splice(ix,1)[0]);return}
 if(a.type==='claim'&&p.kills>=8&&!p.rewardClaimed){p.rewardClaimed=true;p.gold+=150;p.xp+=60;this.giveLoot(p,2);return}
 if(a.type==='buy'&&safeCamp(this.zone,p)){if(a.item==='potion'&&p.gold>=25&&p.potions<9){p.gold-=25;p.potions++}if(a.item==='forge'&&p.gold>=100&&p.inventory.length<40){p.gold-=100;this.giveLoot(p,2)}return}
 if(a.type==='potion'&&p.potions>0&&p.hp<p.maxHp){p.potions--;p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.6);this.event('heal',p.x,p.y,{text:'+HP',color:'#87d09a'});return}
 if(a.type==='dodge'){
  const cost=22*(p.gemMode?1:buildFor(p).dodgeCost||1);if(p.dodgeCharges<1||p.stamina<cost||p.dodgeUntil>this.time)return;
  let dx=Number.isFinite(a.x)?a.x:(p.inputs.x||0),dy=Number.isFinite(a.y)?a.y:(p.inputs.y||0);if(Math.hypot(dx,dy)<.01){dx=Math.cos(p.angle);dy=Math.sin(p.angle)}const length=Math.hypot(dx,dy)||1;
  p.dodgeFrom={x:p.x,y:p.y};for(let i=0;i<7;i++){const nx=clamp(p.x+dx/length*25,70,WORLD.w-70),ny=clamp(p.y+dy/length*25,100,WORLD.h-70);if(!this.walkable(nx,ny))break;p.x=nx;p.y=ny}
  p.stamina-=cost;p.dodgeCharges--;p.dodgeTimers.push(this.time+3);p.dodgeUntil=this.time+.32;p.invUntil=this.time+.38;p.pending=[];p.attackUntil=0;p.blocking=false;p.cooldowns.dodge=this.time+.4;face(p,p.x+dx,p.y+dy);notifyTrigger(this,p,'dodge');this.event('dash',p.x,p.y,{fromX:p.dodgeFrom.x,fromY:p.dodgeFrom.y,color:CLASSES.find(c=>c.id===p.classId).color,playerId:p.id});return;
 }
 if(a.type==='cast'&&p.gemMode){const family=p.weaponSets[p.activeWeaponSet];const primary=p.hotbar.find(b=>b?.startsWith('gem:')&&gemById(b.slice(4))?.mode==='basic')?.slice(4)||family+'-0';const id=a.slot===0?primary:a.slot===4?family+'-6':a.slot===5?family+'-10':p.hotbar[a.slot]?.slice(4);const lock=this.enemies.find(e=>e.id===p.lockId&&e.hp>0);castGem(this,p,id,lock?.x||Number(a.x)||p.x+100,lock?.y||Number(a.y)||p.y,Boolean(a.heavy));return}
 if(a.type==='cast'){
  let x=Number(a.x)||p.x+Math.cos(p.angle)*200,y=Number(a.y)||p.y+Math.sin(p.angle)*200;
  const locked=this.enemies.find(e=>e.id===p.lockId&&e.hp>0);if(locked&&a.useLock!==false){x=locked.x;y=locked.y}
  this.cast(p,clamp(Number(a.slot)||0,0,5),x,y,Boolean(a.heavy));
 }
 }
 cast(p,slot,x,y,heavy=false,override=null){
  const c=CLASSES.find(c=>c.id===p.classId),skillIndex=override===null?p.loadout[slot]:override,s=skillsFor(c)[skillIndex],b=buildFor(p),stats=combatStats(p,c);
  if(!s||s.type==='passive'||this.zone===0||p.dead||p.blocking||p.dodgeUntil>this.time||(p.skillCooldowns[skillIndex]||0)>this.time||p.mp<s.cost*stats.cost)return;
  if(heavy&&slot!==0)return;
  if(s.type==='buff'){
   p.mp-=s.cost*stats.cost;p.cooldowns[slot]=this.time+s.cd*stats.cooldown;p.skillCooldowns[skillIndex]=p.cooldowns[slot];p.buffUntil=this.time+7;p.buffKind=s.index;
   if(s.index===0)p.hp=Math.min(p.maxHp,p.hp+(c.id==='priest'?50*stats.heal:15));
   if(s.index===1)p.invUntil=this.time+.8;
   if(s.index===2){p.mp=Math.min(p.maxMp||100,p.mp+30);p.regenUntil=this.time+7}
   this.event('buff',p.x,p.y,{color:c.color,radius:75});if(c.id==='priest')for(const ally of Object.values(this.players))if(dist(p,ally)<400){ally.buffUntil=this.time+7;ally.buffKind=s.index}return;
  }
  const runeSlot=override===null?slot:Math.max(0,p.loadout.indexOf(skillIndex));const hit=makeAttack(this,p,c,s,runeSlot,x,y,heavy);if(!hit)return;p.skillCooldowns[skillIndex]=p.cooldowns[runeSlot];
  if(s.type==='ult'){
   if(s.index===0){p.buffUntil=this.time+10;p.buffKind=0}
   if(s.index===2)p.invUntil=this.time+3;
   if(s.index===3)p.regenUntil=this.time+8;
   if(c.id==='priest')for(const ally of Object.values(this.players))if(dist(p,ally)<500&&!ally.dead)ally.hp=Math.min(ally.maxHp,ally.hp+80*stats.heal);
  }
  if(s.type==='attack'&&s.index===4&&['knight','monk','ranger'].includes(c.id)){
   for(let i=0;i<4;i++){const nx=p.x+Math.cos(p.angle)*25,ny=p.y+Math.sin(p.angle)*25;if(this.walkable(nx,ny)){p.x=nx;p.y=ny}}
  }
  if((s.type==='ult'&&[1,3].includes(s.index))||(s.type==='attack'&&s.index===3))this.fields.push({id:++this.seq,x:hit.mode==='nova'?p.x:hit.tx,y:hit.mode==='nova'?p.y:hit.ty,radius:s.type==='ult'?210:100,until:this.time+(s.type==='ult'?7:4),tick:this.time+.35,damage:hit.damage*.18,owner:p.id,color:c.color});
  if((c.id==='summoner'&&(s.index===2||s.type==='ult'))||(c.id==='ranger'&&s.type==='ult'&&s.index===1)){
   const count=c.id==='summoner'?(b.minions||1):1;p.minions=Array.from({length:count},(_,i)=>({id:'m'+(++this.seq),x:p.x-30+i*25,y:p.y+20,hp:100,until:this.time+18,cd:this.time+i*.2}));p.summonUntil=this.time+18;
  }
 }
 giveLoot(p,rarity,mapOverride=null){if(p.inventory.length>=40)return;if(p.gemMode){const map=mapOverride??(isTown(this.zone)?Math.min(24,this.zone+1):this.zone);const bases=BASES.filter(b=>b.map===map);p.inventory.push(createEquipment(this,bases[Math.floor(this.random()*bases.length)].id,rarity));return;}const slots=['weapon','armor','ring','charm'];const slot=slots[Math.floor(this.random()*4)];const names={weapon:'อาวุธผลึก',armor:'เกราะรุ่งอรุณ',ring:'แหวนสายลม',charm:'เครื่องรางดวงดาว'};p.inventory.push({id:'i'+(++this.seq),name:names[slot],slot,rarity,power:Math.round((4+p.level*2)*(rarity+1)),level:p.level});}
 steer(p){
 const c=CLASSES.find(c=>c.id===p.classId);let enemy=p.targetId?this.enemies.find(e=>e.id===p.targetId&&e.hp>0):null;
 if(p.auto&&!isTown(this.zone)){if(!enemy)enemy=this.enemies.filter(e=>e.hp>0).sort((a,b)=>dist(a,p)-dist(b,p))[0];p.targetId=enemy?.id||null;
  if(p.hp<p.maxHp*.4)this.action(p.id,{type:'potion'});
  const danger=this.enemies.find(e=>e.windup>0&&dist(p,{x:e.tx,y:e.ty})<(e.boss?165:60));if(danger&&p.dodgeCharges>0&&p.dodgeUntil<=this.time){this.action(p.id,{type:'dodge',x:p.x-danger.tx||1,y:p.y-danger.ty||1});p.path=[];p.repath=0;}
 }
 if(enemy){p.lockId=enemy.id;const reach=(p.gemMode?WEAPONS[p.weaponSets[p.activeWeaponSet]].range:combatStats(p,c).range)*.72;if(dist(p,enemy)>reach){if((p.repath||0)<=this.time){p.path=findPath(this.zone,p,enemy);p.repath=this.time+.55}}else{p.path=[];p.inputs={};if(p.auto&&!p.gemMode){if(p.buffUntil<=this.time)this.cast(p,5,enemy.x,enemy.y);for(const slot of [4,3,2,1])this.cast(p,slot,enemy.x,enemy.y);}if(p.gemMode){if(p.auto){for(const binding of p.hotbar){if(binding?.startsWith('gem:')){const id=binding.slice(4),g=gemById(id);if(g&&!['aura','basic'].includes(g.mode)&&!(g.mode==='guard'&&p.hp>p.maxHp*.75)&&p.gemLevels[id]&&!gemUsability(p,g)&&castGem(this,p,id,enemy.x,enemy.y))break}}}const primary=p.hotbar.find(b=>b?.startsWith('gem:')&&gemById(b.slice(4))?.mode==='basic')?.slice(4)||p.weaponSets[0]+'-0';castGem(this,p,primary,enemy.x,enemy.y)}else this.cast(p,0,enemy.x,enemy.y);}}
 else if(p.targetId){p.targetId=null;p.path=[];p.inputs={};}
 if(p.auto&&!enemy&&!isTown(this.zone)){const item=this.loot.filter(l=>!l.taken&&(!l.owner||l.owner===p.id)).sort((a,b)=>dist(a,p)-dist(b,p))[0];if(item&&(p.repath||0)<=this.time){p.path=findPath(this.zone,p,item);p.repath=this.time+.6;}}
 if(p.path?.length){let next=p.path[0];while(next&&dist(p,next)<9){p.path.shift();next=p.path[0]}if(next){const d=dist(p,next);p.inputs={x:(next.x-p.x)/d,y:(next.y-p.y)/d};}else{p.inputs={};p.destination=null;p.run=false;}}
 }
 updateExploration(p){
 for(const l of LANDMARKS){const key=landmarkKey(this.zone,l.id);if(dist(p,l)<230&&!p.discovered.includes(key)){p.discovered.push(key);this.event('discover',l.x,l.y-40,{text:'ค้นพบ '+l.name,color:'#8fe8d8',playerId:p.id});}}
 if(!this.dungeon&&!isTown(this.zone)&& (this.gemMode||p.x>2200||p.y>1700)){
  const epoch=Math.floor(this.time/45);if(this.spawnEpoch!==epoch){this.spawnEpoch=epoch;this.exploredSectors.clear();}
  const sector=sectorAt(p.x,p.y),key=this.zone+':'+sector.x+':'+sector.y;
  if(!this.exploredSectors.has(key)){this.exploredSectors.add(key);for(let i=0;i<6;i++)this.spawnEnemy(sector.x*1024+180+this.random()*680,sector.y*1024+180+this.random()*680,false,i%3);if((sector.x+sector.y)%5===0)this.spawnEnemy(sector.x*1024+512,sector.y*1024+512,true,3);}
 }
 if(this.enemies.length>180)this.enemies=this.enemies.filter(e=>Object.values(this.players).some(q=>dist(e,q)<2600)).slice(-180);
 if(this.loot.length>400)this.loot=this.loot.filter(l=>Object.values(this.players).some(q=>dist(l,q)<2600)).slice(-400);
 }
 updateCombat(p,dt){
  p.stamina=Math.min(100,Math.max(0,p.stamina+dt*(p.blocking?-10:p.dodgeUntil>this.time?0:19+(p.auraEffects?.stamina||0))));
  if(p.stamina<2)p.blocking=false;
  for(const ready of p.dodgeTimers.filter(t=>t<=this.time))p.dodgeCharges=Math.min(2,p.dodgeCharges+1);p.dodgeTimers=p.dodgeTimers.filter(t=>t>this.time);
  if(p.lockId&&!this.enemies.some(e=>e.id===p.lockId&&e.hp>0&&dist(e,p)<1000))p.lockId=null;
  const due=p.pending.filter(hit=>hit.due<=this.time);p.pending=p.pending.filter(hit=>hit.due>this.time);for(const hit of due)resolveAttack(this,p,hit);
  if(p.chainUntil<this.time)p.comboStep=0;
  for(const m of p.minions){if(m.until<this.time)continue;const target=this.enemies.filter(e=>e.hp>0&&dist(e,p)<500).sort((a,b)=>dist(a,m)-dist(b,m))[0];const dest=target||{x:p.x-35,y:p.y+25};const d=dist(m,dest);if(d>90){const amount=Math.min(d,170*dt);m.x+=(dest.x-m.x)/d*amount;m.y+=(dest.y-m.y)/d*amount}if(target&&dist(m,target)<230&&m.cd<=this.time){m.cd=this.time+(m.interval||1.1);applyHit(this,p,target,{gem:m.gem,damage:m.damage||(12+p.level*3)*(buildFor(p).minionDamage||1),crit:.05,poise:5,element:m.element||'astral',leech:m.leech||0,freeze:m.freeze,slowDuration:m.slowDuration,dotDuration:m.dotDuration,dotScale:m.dotScale,vulnerability:m.vulnerability});if(m.chain)for(const other of this.enemies.filter(e=>e!==target&&e.hp>0&&dist(e,target)<230).slice(0,m.chain))applyHit(this,p,other,{gem:true,damage:m.damage*.65,crit:.05,poise:5,element:m.element,leech:m.leech});this.event('bolt',m.x,m.y,{tx:target.x,ty:target.y,color:'#c5a7eb',radius:18,area:false})}}
  for(const m of p.minions)if(m.until<=this.time&&m.sacrifice)this.fields.push({id:++this.seq,x:m.x,y:m.y,radius:130,until:this.time+.6,tick:this.time,damage:m.damage*2,owner:p.id,color:'#c1a2e9'});p.minions=p.minions.filter(m=>m.until>this.time);
 }
 update(dt){if(this.paused)return;dt=Math.min(dt,.1)*(this.timeScale||1);this.time+=dt;this.effects=this.effects.filter(e=>this.time-e.t<1.2);for(const p of Object.values(this.players)){if(p.dead)continue;this.updateExploration(p);this.updateCombat(p,dt);if(p.gemMode)tickTriggers(this,p,castGem);if(p.run){if(p.stamina<12||this.enemies.some(e=>dist(p,e)<500))p.run=false;else p.stamina=Math.max(0,p.stamina-dt*24);}this.steer(p);if(p.comboUntil<this.time)p.combo=0;const dx=p.inputs.x||0,dy=p.inputs.y||0,l=Math.hypot(dx,dy)||1,speed=(p.gemMode?190*(1+(p.auraEffects?.speed||0)):(p.classId==='ranger'?209:190))*(p.gmSpeed||1)*(p.moveSlowUntil>this.time?1-(p.moveSlow||0):1)*(1+(p.gemMode?equipmentStats(p).speed/100:0))*(p.run&&p.stamina>10&&!this.enemies.some(e=>dist(p,e)<600)?2.4:1)*(p.blocking?.35:1)*(p.dodgeUntil>this.time?0:p.attackUntil>this.time?.6:1)*(p.buffUntil>this.time&&p.buffKind===1?1.25:1);const nx=clamp(p.x+dx/l*speed*dt,70,WORLD.w-70),ny=clamp(p.y+dy/l*speed*dt,100,WORLD.h-70);if(this.walkable(nx,p.y))p.x=nx;if(this.walkable(p.x,ny))p.y=ny;if(Math.hypot(dx,dy)>0&&p.attackUntil<=this.time&&!p.blocking){const lock=this.enemies.find(e=>e.id===p.lockId&&e.hp>0);face(p,lock?.x??p.x+dx,lock?.y??p.y+dy)}p.mp=Math.min(p.maxMp||100,p.mp+dt*(p.gemMode?5+attributes(p).int*.12+(p.auraEffects?.mana||0):(p.classId==='mage'?14:10)));if(p.regenUntil>this.time||p.classId==='priest'&&!p.gemMode)p.hp=Math.min(p.maxHp,p.hp+dt*(p.regenUntil>this.time?6:1));if(safeCamp(this.zone,p))p.hp=Math.min(p.maxHp,p.hp+dt*25);
 for(const l of this.loot){if(!l.taken&&(!l.owner||l.owner===p.id)&&dist(p,l)<70){l.taken=true;if(l.kind==='gold')p.gold+=l.amount;else if(l.kind==='card'){p.cardBag[l.card]=(p.cardBag[l.card]||0)+1;}else if(l.kind==='farm'){p.farmBag[l.item]=(p.farmBag[l.item]||0)+l.amount;}else this.giveLoot(p,l.rarity);this.event('pickup',l.x,l.y,{text:l.kind==='gold'?'+'+l.amount+' ทอง':l.kind==='farm'?FARM_ITEMS[l.item].name+' ×'+l.amount:l.kind==='card'?CARDS.find(c=>c.id===l.card).name:'ได้รับอุปกรณ์',color:'#f5d174'})}}
 const xpNeed=p.level*70;while(p.xp>=p.level*70&&p.level<30){p.xp-=p.level*70;p.level++;if(p.gemMode)refreshGemStats(p);else p.maxHp=Math.round((CLASSES.find(c=>c.id===p.classId).hp+(p.level-1)*14)*(buildFor(p).hp||1));p.hp=p.maxHp;p.mp=p.maxMp||100;this.event('level',p.x,p.y,{text:'LEVEL UP',color:'#fff4ae'})}}
 this.loot=this.loot.filter(l=>!l.taken);this.fields=this.fields.filter(f=>f.until>this.time);for(const f of this.fields){if(f.tick<=this.time){f.tick=this.time+(f.interval||.5);for(const e of this.enemies)if(dist(f,e)<f.radius){e.hp-=f.damage;e.lastHitOwner=f.owner;e.lastHitTriggered=!!f.triggered;this.event('damage',e.x,e.y-20,{text:String(Math.round(f.damage)),color:f.color})}}}
 for(const e of this.enemies){if(e.hp>0&&e.dot>this.time){e.hp-=dt*(e.dotPower||12);if(e.hp<=0){e.lastHitOwner=e.dotOwner;e.lastHitTriggered=!!e.dotTriggered;}}if(e.hp<=0){const killer=this.players[e.lastHitOwner];if(killer&&!e.lastHitTriggered)notifyTrigger(this,killer,'kill',e);for(const p of Object.values(this.players)){p.xp+=(e.boss?130:18)+(this.gemMode?MAPS[this.zone].level*2:0);p.kills++;if(p.gemMode){if(e.boss||this.random()<.12){const tier=Math.min(20,p.level);p.uncutGems[tier]=(p.uncutGems[tier]||0)+1;this.event('pickup',e.x,e.y-45,{text:'+ Uncut Gem Lv.'+tier,color:'#8fe2d1',playerId:p.id})}if(e.boss||this.random()<.15){p.supportStones++;this.event('pickup',e.x,e.y-65,{text:'+ Support Stone',color:'#b2c8ef',playerId:p.id})}if(e.boss)p.jewellers++;}if(p.classId==='summoner'&&!p.gemMode)p.mp=Math.min(p.maxMp||100,p.mp+4);if(p.classId==='monk'&&!p.gemMode)p.hp=Math.min(p.maxHp,p.hp+3);p.gold+=Math.round((e.boss?80:3)*(1+this.curse*.5))}if(this.gemMode)for(const p of Object.values(this.players)){p.farmKills[this.zone]=(p.farmKills[this.zone]||0)+1;if(this.random()<(e.boss?.05:.005)){const card=CARDS.find(c=>c.map===this.zone);if(card)this.loot.push({id:++this.seq,owner:p.id,x:e.x-22,y:e.y+12,kind:'card',card:card.id,amount:1});}for(const drop of farmDrops(this.zone,e.boss,()=>this.random()))this.loot.push({id:++this.seq,owner:p.id,x:e.x+(this.random()-.5)*50,y:e.y+(this.random()-.5)*50,kind:'farm',...drop});}this.kills++;this.event('death',e.x,e.y,{color:e.boss?'#f4cc70':'#a5d38b'});for(const p of Object.values(this.players)){this.loot.push({id:++this.seq,owner:p.id,x:e.x,y:e.y,kind:'gold',amount:Math.round((e.boss?100:8)*(1+this.curse*.5))});if(e.boss||this.random()<.35)this.loot.push({id:++this.seq,owner:p.id,x:e.x+25,y:e.y,kind:'item',rarity:e.boss?3:1+Math.floor(this.random()*2)});}if(e.boss){for(const p of Object.values(this.players)){p.bossKills++;p.mapBossKills[this.zone]=(p.mapBossKills[this.zone]||0)+1;}this.bossDead=true;this.event('victory',e.x,e.y,{text:'ฟื้นฟูหัวใจแห่งแสงสำเร็จ',color:'#fff0a0'})}continue}
 if((e.brokenUntil||0)>this.time||(e.frozenUntil||0)>this.time)continue;const ps=Object.values(this.players).filter(p=>!p.dead&&!safeCamp(this.zone,p));const p=ps.sort((a,b)=>dist(a,e)-dist(b,e))[0];if(!p)continue;if(this.gemMode)advanceBoss(this,e,p);const d=dist(p,e);e.cd-=dt;if(e.windup>0){e.windup-=dt;if(e.windup<=0){const radius=e.boss?150:e.attackRadius||48;this.event('impact',e.tx,e.ty,{radius,color:'#e78b70'});for(const q of ps)if((e.boss?bossHit(e,q,radius):dist(q,{x:e.tx,y:e.ty})<radius)&&q.invUntil<this.time&&!q.godMode){const armor=(q.gear.armor?.power||0)+(q.gemMode?equipmentStats(q).armor:0)+(q.classId==='knight'?12:3);let taken=Math.max(3,(e.boss?30:10)+(this.gemMode?MAPS[this.zone].level: this.zone*3)-armor*.3)*(1+this.curse*.15)*(q.buffUntil>this.time&&q.buffKind===1?.6:1);if(!q.gemMode&&q.classId==='knight'&&q.hp<q.maxHp*.35)taken*=.8;
 const frontal=Math.abs(Math.atan2(Math.sin(Math.atan2(e.y-q.y,e.x-q.x)-q.angle),Math.cos(Math.atan2(e.y-q.y,e.x-q.x)-q.angle)))<Math.PI*.6;
 if(q.blocking&&frontal&&q.stamina>=8){notifyTrigger(this,q,'guard',e);const perfect=this.time-q.blockAt<.25;q.stamina=Math.max(0,q.stamina-8-taken*.15);taken*=perfect?.05:1-combatStats(q,CLASSES.find(c=>c.id===q.classId)).block;if(perfect){e.poise=Math.min(100,(e.poise||0)+50);q.counterUntil=this.time+2;this.event('parry',q.x,q.y-30,{text:'ปัดป้อง!',color:'#fff2b2'})}else this.event('block',q.x,q.y-25,{text:'ป้องกัน',color:'#c9e2dc'})}
 if(q.classId==='mage'&&!q.gemMode){const shield=Math.min(q.mp,taken*.3);q.mp-=shield;taken-=shield}
 taken*=e.dungeonDamage||1;taken*=1-(q.auraEffects?.guard||0);taken*=1-Math.min(.4,(q.minions||[]).reduce((n,m)=>Math.max(n,m.guard||0),0));q.hp-=taken;q.hurtUntil=this.time+.16;this.event('damage',q.x,q.y-40,{text:'−'+Math.ceil(taken),color:'#edb297',victim:q.id});if(q.hp<=0){q.hp=0;q.dead=true;q.auto=false;q.path=[];q.targetId=null;q.lockId=null;q.pending=[];q.minions=[];if(q.gemMode){q.activeAuras=[];q.spiritReserved=0}q.blocking=false;q.inputs={}}}}}else if(d< (e.boss?280:e.attackRange||50)&&e.cd<=0){e.windup=e.boss?1.2:e.kind===2?.9:.5;e.tx=p.x;e.ty=p.y;e.attackAngle=Math.atan2(p.y-e.y,p.x-e.x);e.cd=e.boss?(e.pattern==='burst'?1.3:3):1.6;}else if(d<620&&d>35){const speed=e.speed*(e.slow>this.time?.4:1)*(1+this.curse*.1);e.x+=(p.x-e.x)/d*speed*dt;e.y+=(p.y-e.y)/d*speed*dt;}}
 this.enemies=this.enemies.filter(e=>e.hp>0);tickHazards(this,dt);tickEndgame(this);
 }
 snapshot(){for(const p of Object.values(this.players))if(p.bagAutoSort)p.inventory.sort(equipmentOrder);return {gmState:{paused:!!this.paused,timeScale:this.timeScale||1,notice:this.gmNotice||''},players:this.players,enemies:this.enemies,loot:this.loot,effects:this.effects,time:this.time,zone:this.zone,kills:this.kills,bossDead:this.bossDead,rift:this.rift,curse:this.curse,fields:this.fields,hazards:this.hazards,dungeon:this.dungeon||null}}
}
