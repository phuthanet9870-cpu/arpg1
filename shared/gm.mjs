import {WORLD,CLASSES} from './data.mjs';import {MAPS,FARM_ITEMS} from './farming.mjs';import {BASES,CARDS,createEquipment} from './equipment.mjs';import {ACTIVE_GEMS,SUPPORT_GEMS,attributes} from './gems.mjs';import {ISLAND_QUESTS} from './island-quests.mjs';import {refreshGemStats} from './gem-combat.mjs';import {resetCombat} from './combat.mjs';
export const GM_COMMANDS=['heal','revive','level','gold','potions','god','speed','damage','attributes','teleport','map','giveitem','givefarm','givecard','currencies','learnall','resetcooldowns','resetpassives','completequests','spawn','killall','clearloot','pause','timescale','completedungeon','faildungeon'];
function number(v,min,max){if(v===null||v===undefined||typeof v==='boolean'||v==='')throw Error('ระบุค่าตัวเลข');const n=Number(v);if(!Number.isFinite(n)||n<min||n>max)throw Error('จำนวนหรือค่าที่ระบุอยู่นอกขอบเขต');return n;}
export function gmCommand(w,actorId,a,authorized=false){if(!authorized)throw Error('ไม่มีสิทธิ์ GM');if(!a||!GM_COMMANDS.includes(a.command))throw Error('คำสั่ง GM ไม่ถูกต้อง');const p=w.players[a.target||actorId];if(!p)throw Error('ไม่พบผู้เล่นเป้าหมาย');const n=(min,max)=>number(a.value,min,max);let result='ดำเนินการแล้ว';switch(a.command){
 case 'heal':p.hp=p.maxHp;p.mp=p.maxMp;p.stamina=100;break;
 case 'revive':p.dead=false;resetCombat(p);p.hp=p.maxHp;p.mp=p.maxMp;p.invUntil=w.time+3;break;
 case 'level':p.level=Math.floor(n(1,30));p.xp=0;refreshGemStats(p);p.hp=p.maxHp;p.mp=p.maxMp;break;
 case 'gold':p.gold=Math.floor(n(0,1000000000));break;
 case 'potions':p.potions=Math.floor(n(0,999));break;
 case 'god':p.godMode=Boolean(a.enabled);break;
 case 'speed':p.gmSpeed=n(.25,5);break;
 case 'damage':p.gmDamage=n(.1,100);break;
 case 'attributes':{const v=Math.floor(n(0,33));p.attributePoints={str:v,dex:v,int:v};refreshGemStats(p);break;}
 case 'teleport':{const x=number(a.x,70,WORLD.w-70),y=number(a.y,100,WORLD.h-70);if(!w.walkable(x,y))throw Error('ตำแหน่งนี้เดินไม่ได้ หรืออยู่นอกสนามดันเจียน');resetCombat(p);p.x=x;p.y=y;p.invUntil=w.time+3;break;}
 case 'map':{const z=Math.floor(n(0,24));if(!MAPS[z])throw Error('ไม่พบแมพ');w.zoneTo(z);break;}
 case 'giveitem':{const base=BASES.find(b=>b.id===a.base);if(!base)throw Error('ไม่พบฐานอุปกรณ์');const rarity=Math.floor(number(a.rarity??3,0,3)),qty=Math.floor(number(a.quantity??1,1,20));if(p.inventory.length+qty>40)throw Error('ช่องอุปกรณ์ไม่พอ');for(let i=0;i<qty;i++)p.inventory.push(createEquipment(w,base.id,rarity));break;}
 case 'givefarm':{if(!FARM_ITEMS[a.item])throw Error('ไม่พบไอเทมฟาร์ม');const qty=Math.floor(n(1,999999));p.farmBag[a.item]=Math.min(999999,(p.farmBag[a.item]||0)+qty);break;}
 case 'givecard':{if(!CARDS.some(c=>c.id===a.item))throw Error('ไม่พบการ์ด');p.cardBag[a.item]=Math.min(9999,(p.cardBag[a.item]||0)+Math.floor(n(1,9999)));break;}
 case 'currencies':{const qty=Math.floor(n(1,10000));p.supportStones+=qty;p.jewellers+=qty;p.endgameTokens+=qty;for(let i=1;i<=20;i++)p.uncutGems[i]=(p.uncutGems[i]||0)+qty;break;}
 case 'learnall':{const tier=Math.floor(n(1,20));p.level=Math.max(p.level,tier);for(const g of ACTIVE_GEMS)p.gemLevels[g.id]=tier;p.knownSupports=SUPPORT_GEMS.map(s=>s.id);refreshGemStats(p);break;}
 case 'resetcooldowns':p.gemCooldowns={};p.gemActionUntil=0;p.cooldowns={};p.skillCooldowns={};p.dodgeCharges=2;p.dodgeTimers=[];break;
 case 'resetpassives':p.passives=[];p.ascendancy=null;p.attributePoints={str:0,dex:0,int:0};refreshGemStats(p);break;
 case 'completequests':for(const q of ISLAND_QUESTS)p.islandQuests[q.id]={status:'done',start:0};p.rewardClaimed=true;break;
 case 'spawn':{if(MAPS[w.zone].safe)throw Error('ห้ามเรียกศัตรูในเมือง');const qty=Math.floor(n(1,20));if(w.enemies.length+qty>180)throw Error('อสูรเต็ม 180 ตัว');for(let i=0;i<qty;i++)w.spawnEnemy(Math.max(240,Math.min(1700,p.x+160+(i%4)*50)),Math.max(180,Math.min(1250,p.y-80-Math.floor(i/4)*50)),!!a.boss,i%3);break;}
 case 'killall':for(const e of w.enemies)e.hp=0;break;
 case 'clearloot':w.loot=[];w.fields=[];w.hazards=[];break;
 case 'pause':w.paused=!!a.enabled;break;
 case 'timescale':w.timeScale=n(.25,4);break;
 case 'completedungeon':if(!w.dungeon)throw Error('ยังไม่มีดันเจียน');w.dungeon.status='complete';w.dungeon.wave=4;w.dungeon.finished=w.time;w.enemies=[];w.hazards=[];break;
 case 'faildungeon':if(!w.dungeon)throw Error('ยังไม่มีดันเจียน');w.dungeon.status='failed';w.dungeon.finished=w.time;w.enemies=[];w.hazards=[];break;
 }w.event('gm',p.x,p.y-50,{text:'GM • '+a.command,color:'#e8cd8d'});return {ok:true,message:result,command:a.command,target:p.name};}
