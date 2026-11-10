// Original RO-inspired map identities and server-owned economy.
export const ISLANDS=['แสงแรก','เหมันต์','อำพันเพลิง','พงไพรจันทรา','ดาราล่องฟ้า'];
const LEVELS=[[1,3,5,7],[8,10,12,13],[14,16,18,19],[20,22,24,25],[25,27,28,29]];
const rows=[
['ปราการรุ่งอรุณ','ทุ่งหยดน้ำ','ป่าผึ้งเงิน','เหมืองรากหิน','หาดเปลือกมุก'],
['นครหิมะกระจก','ทุ่งเขากวาง','ป่าสนไอเย็น','ถ้ำน้ำแข็ง','ยอดผาพายุ'],
['เมืองเตาหลอม','ทุ่งเถ้า','รอยแยกลาวา','เหมืองออบซิเดียน','โรงหลอมโบราณ'],
['ท่าเรือใบหยก','ป่าชายเลน','บึงพิษ','ถ้ำเห็ดเรืองแสง','วิหารรากไม้'],
['ป้อมดวงดาว','ทะเลทรายแก้ว','สวนลอยฟ้า','ซากนครดารา','ห้องนิรภัยสุริยะ']];
const monsters=['สไลม์หยดน้ำ','ผึ้งเงิน','ตุ่นรากหิน','ปูมุก','กวางเหมันต์','หมาป่าไอเย็น','แมลงน้ำแข็ง','ฮาร์ปีพายุ','อสูรเถ้า','ซาลาแมนเดอร์','โกเลมออบซิเดียน','จักรกลเตาหลอม','ปูรากโกงกาง','กบพิษ','เห็ดเรืองแสง','พฤกษาผู้เฝ้าวิหาร','แมงป่องแก้ว','วิหคลอยฟ้า','จักรกลดารา','ผู้พิทักษ์สุริยะ'];
const junk=['วุ้นใส','ปีกผึ้งเงิน','ฟันตุ่น','เศษเปลือกมุก','เขากวางแตก','ขนหมาป่า','ขาแมลงเย็น','ขนนกพายุ','ถ่านเถ้า','เกล็ดไหม้','เศษหินดำ','เฟืองชำรุด','รากโกงกาง','ถุงพิษ','สปอร์เรืองแสง','เปลือกไม้เก่า','กระดองแก้ว','เส้นใยเมฆ','เศษจักรกลดารา','ชิ้นส่วนสุริยะ'];
const mats=['แก่นน้ำ','ไขผึ้งบริสุทธิ์','แร่รากหิน','ไข่มุกดิบ','หนังเหมันต์','หนังหมาป่าชั้นดี','ผลึกน้ำแข็ง','อัญมณีวายุ','คาร์บอนอำพัน','แก่นเพลิง','แร่ออบซิเดียน','โลหะโบราณ','ยางไม้หยก','สารสกัดพิษ','ผงสปอร์จันทร์','แก่นพฤกษา','ทรายผลึก','เส้นใยฟ้า','โลหะดารา','แก่นสุริยะ'];
const colors=[0xb6cd86,0xc2dbe0,0xd5af83,0x96c6a0,0xc1b9db];
export const MAPS=rows.flatMap((names,island)=>names.map((name,local)=>{const farm=island*4+local-1,level=local?LEVELS[island][local-1]:0;return {id:island*5+local,name,en:local?'FARMING GROUNDS':'SAFE HAVEN',subtitle:ISLANDS[island]+' • '+(local?'Lv.'+level+'–'+Math.min([8,14,20,25,30][island],level+2):'เมืองปลอดภัย • ท่าเรือและตลาด'),island,local,safe:local===0,level,color:colors[island],biome:farm,monster:local?monsters[farm]:null,junk:local?'junk-'+farm:null,material:local?'mat-'+farm:null,rare:local?'rare-'+farm:null}}));
export const FARM_ITEMS=Object.fromEntries(monsters.flatMap((name,i)=>[['junk-'+i,{id:'junk-'+i,name:junk[i],type:'junk',price:4+i*2,map:MAPS.find(m=>m.biome===i&&!m.safe)?.id}],['mat-'+i,{id:'mat-'+i,name:mats[i],type:'material',price:22+i*5}],['rare-'+i,{id:'rare-'+i,name:'ตรา'+name,type:'rare',price:250+i*35}]]));
export const isTown=z=>!!MAPS[z]?.safe;
export function farmDrops(z,boss,random){const m=MAPS[z];if(!m||m.safe)return [];const out=[{item:m.junk,amount:boss?8:1+Math.floor(random()*3)}];if(boss||random()<.3)out.push({item:m.material,amount:boss?3:1});if(random()<(boss ? 0.15 : 0.015))out.push({item:m.rare,amount:1});return out}
export function initFarm(p,save){p.farmBag={};for(const [id,n]of Object.entries(save?.farmBag||{}))if(FARM_ITEMS[id]&&Number.isInteger(n)&&n>0)p.farmBag[id]=Math.min(n,999999);p.farmFilter=['all','materials','rare'].includes(save?.farmFilter)?save.farmFilter:'all';p.farmKills=save?.farmKills||{};}
export function farmAction(w,p,a){if(a.type==='farmfilter'){if(['all','materials','rare'].includes(a.value))p.farmFilter=a.value;return true}if(a.type!=='sellfarm')return false;const npc=(isTown(w.zone)?{x:1180,y:1250}:null);if(!npc||Math.hypot(p.x-npc.x,p.y-npc.y)>180)return true;const ids=a.all?Object.keys(p.farmBag).filter(id=>FARM_ITEMS[id]?.type==='junk'):[a.item];for(const id of ids){const it=FARM_ITEMS[id],owned=p.farmBag[id]||0,n=a.all?owned:Number(a.amount);if(!it||!Number.isInteger(n)||n<=0||n>owned)continue;p.gold+=it.price*n;p.farmBag[id]-=n;if(!p.farmBag[id])delete p.farmBag[id];}return true}
