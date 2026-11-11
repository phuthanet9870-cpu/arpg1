import assets from 'virtual:game-assets';
const paths:Record<string,string>={
 hero:'M16 18a8 8 0 1 0 16 0a8 8 0 1 0-16 0M10 41v-6c0-6 6-9 14-9s14 3 14 9v6Z',
 bag:'M10 17h28l3 23H7ZM17 17v-5a7 7 0 0 1 14 0v5M17 29h14M21 26v6M27 26v6',
 gem:'m24 5 15 14-15 24L9 19ZM9 19h30M24 5l-6 14 6 24 6-24Z',
 passives:'M24 20V8M20 23H8M28 23h12M22 27l-9 12M26 27l9 12M20 24a4 4 0 1 0 8 0a4 4 0 1 0-8 0M20 6h8v4h-8ZM5 20h6v6H5Zm32 0h6v6h-6ZM9 37h7v7H9Zm23 0h7v7h-7Z',
 forge:'m11 8 10 1 18 17-9 9-17-18ZM24 25 10 40l-5-5 14-15M27 38h16v5H24Z',
 refine:'m24 5 5 12 13 2-10 9 2 14-10-7-11 7 3-14-10-9 13-2ZM24 14v15M18 23l6-6 6 6',
 card:'M11 5h26v38H11ZM16 10h16v17H16ZM18 34h12M20 29h8M20 17a4 4 0 1 0 8 0a4 4 0 1 0-8 0',
 quests:'M13 8h26v29H15c-5 0-7 6-2 7h24M13 8v29M20 16h12M20 23h12M20 30h7M7 7h6v30H7Z',
 dungeon:'M8 42V20L24 6l16 14v22ZM17 42V24a7 7 0 0 1 14 0v18M8 20h8M32 20h8M22 12h4',
 world:'m6 10 12-5 12 5 12-5v33l-12 5-12-5-12 5ZM18 5v33M30 10v33M26 17l-5 9 5 5 4-8Z',
 friends:'M10 16a6 6 0 1 0 12 0a6 6 0 1 0-12 0M28 14a6 6 0 1 0 12 0a6 6 0 1 0-12 0M4 38v-4c0-6 5-9 12-9s12 3 12 9v4M28 25c10-3 16 2 16 8v5M32 30v10M27 35h10',
 guild:'M12 4v40M12 8h27l-5 11 5 11H12M20 15l4 10 7-8M7 44h11',
 party:'M18 12a6 6 0 1 0 12 0a6 6 0 1 0-12 0M10 24a5 5 0 1 0 10 0a5 5 0 1 0-10 0M30 24a5 5 0 1 0 10 0a5 5 0 1 0-10 0M16 42v-6c0-6 16-6 16 0v6M4 42v-5c0-5 7-7 12-4M32 33c8-3 12 0 12 5v4',
 triggers:'m28 4-17 23h12l-4 17 18-24H25ZM5 13h7M36 36h7M36 8l5 5M6 37l5-5',
 settings:'m20 5 8 0 2 7 7 3 7-2 2 8-6 5v6l5 5-5 6-7-3-6 3-2 7h-8l-2-7-6-3-7 3-5-6 5-5v-6l-6-5 2-8 7 2 7-3ZM17 25a7 7 0 1 0 14 0a7 7 0 1 0-14 0',
 gm:'m5 13 10 8 9-15 9 15 10-8-5 24H10ZM11 37h26v6H11ZM24 25v6M21 28h6',
 hotbar:'M5 10h38v28H5ZM5 24h38M18 10v28M31 10v28M10 15h3M23 29h3',
 stash:'M7 19h34v24H7ZM7 19v-7c0-9 34-9 34 0v7M4 19h40M20 17h8v13h-8ZM12 30v8M36 30v8',
 close:'m12 12 24 24M36 12 12 36',check:'m8 24 10 10L40 12',sort:'M9 10h30M9 20h22M9 30h14M9 40h6M34 24v18M28 36l6 6 6-6',search:'M8 20a12 12 0 1 0 24 0a12 12 0 1 0-24 0M29 29l13 13',
 coin:'M6 24a18 18 0 1 0 36 0a18 18 0 1 0-36 0M12 24a12 12 0 1 0 24 0a12 12 0 1 0-24 0M24 14v20M29 18H21a4 4 0 0 0 0 7h6a4 4 0 0 1 0 7h-9',
 potion:'M18 5h12v7l9 14c5 9-2 17-15 17S4 35 9 26l9-14ZM17 10h14M13 27h22M24 29v10M19 34h10',
 material:'m8 30 7-20 18-3 9 22-14 14-20-9ZM15 10l7 17 11-20M8 30l14-3 6 16 14-14M22 27l20 2',
 junk:'m8 18 13-9 15 6 6 20-20 8L6 31ZM9 18l15 8 12-11M24 26l-2 17M9 31l15-5 16 9',
 relic:'M24 5 8 16l5 20 19 7 13-16-9-21ZM16 15l8 6 9-6M13 31l11-10 11 9M24 21v18',
 weapon:'m10 41-5-5 10-11 7 7ZM17 23 35 5h8v8L25 31ZM13 22l13 13M25 21l10-10',armor:'m16 6 8 5 8-5 12 9-6 10-5-3v21H15V22l-5 3-6-10ZM18 8l6 9 6-9M21 24h6v12h-6',ring:'M9 29a15 15 0 1 0 30 0a15 15 0 1 0-30 0M15 29a9 9 0 1 0 18 0a9 9 0 1 0-18 0M16 9l8-5 8 5-8 11Z',charm:'M10 5c0 22 28 22 28 0M24 24l11 10-11 10-11-10ZM24 28v12',
 menu:'M8 12h32M8 24h32M8 36h32',expand:'m10 18 14 14 14-14',collapse:'m10 30 14-14 14 14',minus:'M10 24h28',plus:'M10 24h28M24 10v28',undo:'M7 18h15M7 18V5M8 18c6-18 30-15 32 3 3 14-12 23-24 15',trash:'M9 13h30M18 7h12M13 13l3 30h16l3-30M21 20v16M27 20v16',play:'m16 8 25 16-25 16Z',pause:'M13 8h8v32h-8ZM28 8h8v32h-8',target:'M5 24h10M33 24h10M24 5v10M24 33v10M12 24a12 12 0 1 0 24 0a12 12 0 1 0-24 0',exit:'M22 6H8v36h14M24 24h19M34 15l9 9-9 9',account:'M7 8h34v32H7ZM13 17a5 5 0 1 0 10 0a5 5 0 1 0-10 0M11 33v-3c0-6 14-6 14 0v3M29 16h7M29 23h7M29 30h7'
};
export function glyph(name:string,cls=''){const mapped=({refine:'weapon',relic:'passives'} as Record<string,string>)[name]||name;const art=assets['ui-painted-'+mapped];if(art)return `<img class="ui-glyph painted-icon ${cls}" src="${art}" alt="" aria-hidden="true"/>`;return `<svg class="ui-glyph ${cls}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.gem}"/></svg>`}
export const MENU_ITEMS=[['hero','ตัวละคร','hero'],['inventory','กระเป๋า','bag'],['skills','เจมสกิล','gem'],['passives','พาสซีฟ','passives'],['craft','คราฟต์','forge'],['refine','ตีบวก','refine'],['cards','การ์ด','card'],['islandquests','ภารกิจ','quests'],['endgame','ดันเจียน','dungeon'],['map','แผนที่โลก','world'],['friends','เพื่อน','friends'],['guild','กิลด์','guild'],['party','ปาร์ตี้','party'],['triggers','ทริกเกอร์','triggers'],['hotbar','จัด Hotbar','hotbar'],['stash','คลัง','stash'],['settings','ตั้งค่า','settings'],['gm','ผู้ดูแล GM','gm'],['account','บัญชี','account']];
const menuNames:Record<string,string>={hero:'HERO',inventory:'BAG',skills:'GEMS',passives:'PASSIVES',craft:'CRAFT',refine:'REFINE',cards:'CARDS',islandquests:'QUESTS',endgame:'DUNGEON',map:'WORLD',friends:'FRIENDS',guild:'GUILD',party:'PARTY',triggers:'TRIGGERS',hotbar:'HOTBAR',stash:'STASH',settings:'SETTINGS',gm:'GM',account:'ACCOUNT'};
export function launcherHTML(gm:boolean,open:boolean,scale:number){return `<aside id="game-launcher" class="game-launcher interactive ${open?'expanded':'collapsed'}" style="--menu-scale:${scale}"><div class="launcher-head"><span>${glyph('menu')} MENU</span><button id="menu-smaller" title="ลดขนาดเมนู">${glyph('minus')}</button><button id="menu-larger" title="เพิ่มขนาดเมนู">${glyph('plus')}</button><button id="menu-toggle" aria-expanded="${open}" title="ย่อหรือขยายเมนู">${glyph(open?'expand':'collapse')}</button></div><nav class="launcher-grid">${MENU_ITEMS.filter(([id])=>id!=='gm'||gm).map(([id,label,icon])=>`<button data-system="${id}" class="launcher-item ${id==='gm'?'staff-item':''}" title="${label}">${glyph(icon)}<span>${menuNames[id]||label}</span>${id==='gm'?'<small>STAFF</small>':''}</button>`).join('')}</nav></aside>`;}
export function decorateActions(root:Element){root.querySelectorAll('button').forEach(btn=>{if(btn.querySelector('svg,img'))return;const text=btn.textContent||'';let name=/ยกเลิก|ปิด|×/.test(text)?'close':/ลบ|แยก|ยุบ|ออกจาก/.test(text)?'trash':/รีเซ็ต|คืนแต้ม/.test(text)?'undo':/ค้นหา/.test(text)?'search':/พร้อม|รับ|เรียน|เลือก|เปิด|ส่ง/.test(text)?'check':/คราฟต์|หลอม|สุ่ม/.test(text)?'forge':/ตีบวก|เพิ่ม/.test(text)?'refine':/ซื้อ|ขาย|แลก/.test(text)?'coin':/ไป|เดิน|วาร์ป/.test(text)?'world':'gem';if(btn.classList.contains('close')){btn.innerHTML=glyph('close');return;}btn.insertAdjacentHTML('afterbegin',glyph(name,'action-icon'));});}
