export const BUILDS={
 knight:[
  {name:'ป้อมปราการสุริยัน',tag:'ป้องกัน • สวนกลับ',description:'เลือดสูงขึ้น 20% บล็อกด้านหน้าลดความเสียหาย 80% คอมโบจังหวะสามทำลายทรงตัว',hp:1.2,damage:.95,block:.8,poise:1.5,element:'physical',loadout:[0,1,2,5,8,14]},
  {name:'คมดาบรุ่งอรุณ',tag:'โจมตี • เผาไหม้',description:'ความเสียหายเพิ่ม 20% ดาบติดไฟ โจมตีหนักและจังหวะสามเผาศัตรูต่อเนื่อง',damage:1.2,element:'fire',loadout:[0,2,3,4,6,13]}
 ],
 mage:[
  {name:'ราชินีเหมันต์',tag:'น้ำแข็ง • ควบคุม',description:'สกิลทำให้ช้า คอมโบครบสามจังหวะแช่แข็งศัตรูธรรมดา โจมตีหนักระเบิดน้ำแข็ง',element:'ice',freeze:true,loadout:[0,1,3,5,7,14]},
  {name:'ผู้ทอพายุ',tag:'สายฟ้า • ชิ่งเป้า',description:'คริติคอลเพิ่ม 12% โจมตีหนักชิ่งหาอีกสองเป้าหมาย ใช้มานาน้อยลง 15%',crit:.12,cost:.85,chain:2,element:'lightning',loadout:[0,2,4,5,8,15]}
 ],
 ranger:[
  {name:'เนตรเหยี่ยว',tag:'โจมตีไกล • จุดอ่อน',description:'ระยะไกลขึ้น 15% ความเสียหายเพิ่ม 15% ศรจังหวะสามทะลวงแนวศัตรู',range:1.15,damage:1.15,pierce:true,element:'physical',loadout:[0,1,4,5,8,15]},
  {name:'พรานอสรพิษ',tag:'พิษ • กับดัก',description:'โจมตีติดพิษ 5 วินาที ท่าหนักระเบิดพิษเดิมและสร้างแอ่งพิษ ลดความเสียหายตรงเล็กน้อย',damage:.95,dot:5,element:'poison',loadout:[0,2,3,5,9,13]}
 ],
 priest:[
  {name:'ผู้รักษารุ่งอรุณ',tag:'ฟื้นฟู • ปาร์ตี้',description:'โจมตีรักษาตนเองและเพื่อนใกล้เคียง บัฟและอัลติเมตฟื้นเลือดแรงขึ้น 40%',heal:1.4,element:'holy',loadout:[0,2,3,5,9,13]},
  {name:'ตุลาการแสง',tag:'โจมตี • พิพากษา',description:'ความเสียหายเพิ่ม 25% ท่าหนักทำให้ศัตรูรับความเสียหายเพิ่ม 15% เป็นเวลา 4 วินาที',damage:1.25,vulnerable:true,element:'holy',loadout:[0,1,4,5,8,14]}
 ],
 summoner:[
  {name:'กองทัพดารา',tag:'อัญเชิญ • คุ้มกัน',description:'สกิลเรียกผู้พิทักษ์สร้างบริวาร 3 ตน เคลื่อนที่ไล่เป้าหมายและยิงเป็นอิสระ',minions:3,minionDamage:1.3,element:'astral',loadout:[0,2,3,5,6,13]},
  {name:'ผู้เก็บเกี่ยววิญญาณ',tag:'คำสาป • ดูดชีวิต',description:'คำสาปต่อเนื่องแรงขึ้น 50% ดูดชีวิตเมื่อโจมตีหนัก บริวารหนึ่งตนช่วยยิงสนับสนุน',dot:4,leech:.12,element:'curse',loadout:[0,1,4,5,8,15]}
 ],
 monk:[
  {name:'หมัดวายุ',tag:'คอมโบ • คล่องตัว',description:'คูลดาวน์ลดเพิ่ม 10% จังหวะสามผลักและทำลายทรงตัว หลบใช้สแตมินาน้อยลง',cooldown:.9,dodgeCost:.7,poise:1.35,element:'wind',loadout:[0,1,3,4,7,14]},
  {name:'อัสนีสะท้านฟ้า',tag:'สายฟ้า • ระเบิดพลัง',description:'ความเสียหายเพิ่ม 15% จังหวะสามชิ่งสายฟ้า ท่าหนักปล่อยวงคลื่นไฟฟ้า',damage:1.15,chain:1,element:'lightning',loadout:[0,2,4,5,6,13]}
 ]
};
export function buildFor(p){return BUILDS[p.classId]?.[p.build||0]||BUILDS.knight[0]}
export function directionFor(angle){return ['east','southeast','south','southwest','west','northwest','north','northeast'][((Math.round(angle/(Math.PI/4))%8)+8)%8]}
export function combatStats(p,c){const b=buildFor(p);return {damage:b.damage||1,range:c.range*(b.range||1),crit:(c.id==='ranger'?.27:.15)+(b.crit||0),cost:b.cost||1,cooldown:(c.id==='monk'?.85:.94)*(b.cooldown||1),block:b.block||.65,heal:b.heal||1,poise:b.poise||1,element:b.element,minions:b.minions||1,leech:b.leech||0}}
export const ELEMENT_COLORS={physical:'#f2d39a',fire:'#f4a264',ice:'#a4dced',lightning:'#86cde9',poison:'#a7c86d',holy:'#ffe29c',astral:'#c4a2ee',curse:'#bc91d5',wind:'#8de2d2'};
