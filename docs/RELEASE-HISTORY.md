# SUNBOUND — ผู้พิทักษ์แสงแรก

## HTML5 พร้อมเล่น

- `releases/SUNBOUND.html`: ไฟล์เดียวรวมภาพ ฟอนต์ และโค้ด ดับเบิลคลิกเปิดด้วย Chrome/Edge/Firefox เพื่อเล่นคนเดียว ไม่ต้องติดตั้ง Node หรือดาวน์โหลด asset เพิ่ม
- `releases/SUNBOUND-online-server.zip`: แตกไฟล์ ติดตั้ง Node.js 22+ แล้วรัน START-WINDOWS.cmd หรือ `sh START-MAC-LINUX.sh` เพื่อเปิดเซิร์ฟเวอร์ Co-op
- เมื่อโฮสต์ผ่าน HTTP(S) ปุ่ม Co-op จะปรากฏ เพื่อนต้องเข้าเซิร์ฟเวอร์เดียวกัน; ไฟล์ที่เปิดตรงเล่นคนเดียว
- ส่งออกใหม่ด้วย `npm run release`; ตรวจไฟล์ HTML แบบฝังในเบราว์เซอร์ปิดเครือข่ายด้วย `npm run test:standalone`

เกม HTML แบบไฟล์เดี่ยวไม่ต้องเชื่อมต่อเครือข่ายระหว่างเล่นคนเดียว ตรวจผ่านการเริ่มเกม เดิน ต่อสู้ และกระเป๋าโดยไม่มี HTTP request เบราว์เซอร์คลาวด์ปิดการเข้าถึง file:// จึงตรวจ HTML แบบ inline แทน ไม่ได้ยืนยันการดับเบิลคลิก file:// ในเครื่องคลาวด์


เกม ARPG 2D pixel art โทนสว่าง ภาษาไทย พัฒนาเป็น **playable alpha** จาก repository ว่าง ตัวละคร 6 คลาสยึดสไตล์ภาพอ้างอิงที่ผู้ใช้ให้มา โลกใหม่ใช้หมู่บ้านแสงแรก ทุ่งหญ้า ป่าผลึก และวิหารสุริยะ

## เปิดเล่น

ต้องใช้ Node.js 22 ขึ้นไป (ทดสอบกับ Node 24)

```bash
cd /workspace/arpg1
npm ci --cache /tmp/sunbound-npm-cache
npm run dev
```

เซิร์ฟเวอร์ใช้ port **3000** บนทุก network interface เปิดด้วยเบราว์เซอร์ผ่านที่อยู่เครื่องหรือ port forwarding ของโฮสต์ เลือกคลาสแล้วกด **เริ่มการผจญภัย** เล่นคนเดียวได้โดยไม่ต้องสมัครบัญชี

Production:

```bash
npm run build
npm start
```

ตั้ง `PORT` เพื่อเปลี่ยนพอร์ต เว็บและ Socket.IO ใช้พอร์ตเดียวกัน reverse proxy ต้องรองรับ WebSocket และควรให้บริการด้วย HTTPS

## วิธีเล่น

- WASD / ลูกศร: เดิน; เมาส์: เล็ง; คลิกพื้น: เดินอ้อมอาคาร; คลิกศัตรู: เลือกเป้าหมายและไล่โจมตี; Shift+คลิก / 1: คอมโบปกติ; คลิกขวา / C: โจมตีหนัก
- 2–4: สกิลโจมตี; R: อัลติเมต; F: บัฟ
- Z / ปุ่ม AUTO: เปิด–ปิดออโต้ เลือกเป้าหมาย ใช้สกิล บัฟ ยา หลบวงอันตราย และเก็บของ; เดินด้วย WASD/คลิกพื้น หรือปุ่มหยุด เพื่อกลับมาควบคุมเอง
- Space: หลบ; Q: ยาฟื้นเลือด; E: สนทนาหรือเดินทางต่อ
- I: กระเป๋า; K: สกิลและรูน; M: แผนที่; Escape: ปิดหน้าต่าง/ตั้งค่า
- Enter: แชต Co-op
- มือถือมีปุ่มเดิน หลบ และแถบสกิล แตะพื้นเพื่อเดิน แตะศัตรูเพื่อโจมตี และมีปุ่ม AUTO

คุยกับลูเมนในหมู่บ้าน หรือเปิด M เพื่อไปทุ่งหญ้า ฆ่าอสูร 8 ตัวแล้วรับรางวัลเควสต์ เดินเข้าใกล้สมบัติเพื่อเก็บ ใช้ I สวมอุปกรณ์/แยกของ K เปลี่ยนสกิลและรูนได้ในหมู่บ้าน หลีกเลี่ยงวงเตือนก่อนบอสโจมตี เมื่อชนะบอสเดินทางต่อหรือกลับเมืองได้ ยาฟื้นเลือดเติมอย่างน้อย 3 ขวดเมื่อเปลี่ยนเขต

## สิ่งที่เล่นได้

- 6 คลาส: อัศวินสุริยัน จอมเวทผลึก พรานพฤกษา ผู้พิทักษ์รุ่งอรุณ ผู้เรียกดวงดาว นักพรตอัสนี
- ต่อคลาส: 6 โจมตี, 4 อัลติเมต, 3 พาสซีฟ, 3 บัฟ รวม **96 ความสามารถ**; จัดช่อง 4 โจมตี + 1 อัลติเมต + 1 บัฟ และพาสซีฟอัตโนมัติ 3 แบบ
- ท่าในกลุ่มเดียวกันใช้กลไกพื้นฐานร่วมกัน มีทิศทาง/พื้นที่ ระยะ คูลดาวน์ เขตเสียหายต่อเนื่อง อัญเชิญ ชะลอ พิษ ฮีล เกราะ และบัฟ แตกต่างตามคลาสและดัชนีท่า ยังไม่ใช่แอนิเมชันเฉพาะ 96 ชุด
- รูนทรงพลัง สะท้อน และรวดเร็ว
- หมู่บ้าน + พื้นที่ต่อสู้ 4 เขต รวมรอยแยกเพิ่มระดับ แต่ละเขตใช้โครงสร้างแผนที่ร่วมกันและมีบอส
- เลเวล 1–30, EXP, ทอง, ยา, ตาย/เกิดใหม่, คำสาปเพิ่มความยากและรางวัล
- อุปกรณ์ 4 ช่อง (อาวุธ เกราะ แหวน เครื่องราง), 4 ระดับความหายาก, สวม/แยก/ฝาก, ร้านยาและหลอมสุ่มอุปกรณ์
- เควสต์เริ่มต้น, มินิแมพ, UI ไทย, เอฟเฟกต์เสียง, ปุ่มมือถือ
- บันทึก solo อัตโนมัติใน localStorage แยกตามคลาส ทุก 5 วินาที/ออกหน้าเลือกคลาส

## Co-op 1–4 คน

1. ผู้เล่นแรกกด **สร้างห้อง Co-op**
2. คัดลอกรหัสจากมุมล่างซ้าย
3. เพื่อนเปิด **เซิร์ฟเวอร์เดียวกัน** แล้วเลือก **เข้าร่วมห้อง** ใส่รหัส
4. หัวหน้าห้องเลือกแมพ ทุกคนเดินทางร่วมกัน เมื่อหัวหน้าออก ผู้เล่นถัดไปเป็นหัวหน้า

เซิร์ฟเวอร์คำนวณการเคลื่อนที่ การโจมตี คูลดาวน์ HP ศัตรู ของดรอป และความก้าวหน้า ของดรอปแยกรายคน มีแชต และ session token สำหรับกลับเข้าห้องเดิมในแท็บเดิมระหว่างเซิร์ฟเวอร์ยังทำงาน ห้องว่างหมดอายุหลัง 30 นาที

**ข้อจำกัด:** ยังไม่มีบัญชี ฐานข้อมูลถาวร กิลด์ ตลาด PvP หรือ matchmaking สาธารณะ สถานะออนไลน์หายเมื่อเซิร์ฟเวอร์รีสตาร์ต การเล่นกับเพื่อนผ่านอินเทอร์เน็ตต้องโฮสต์เซิร์ฟเวอร์และเปิด HTTPS/WebSocket เพิ่มเติม ยังไม่ได้ deploy สาธารณะ

Solo หยุดการจำลองขณะเปิดเมนู; ออนไลน์ยังเดินเวลาตามปกติ ตัวละครมี sheet 16 เฟรมต่อคลาส: 4 มุมมอง × idle/เดิน 2 จังหวะ/โจมตี การหลบ โดนตี และตายยังใช้การแปลงภาพ/เอฟเฟกต์ ระบบผังพาสซีฟขนาดใหญ่และเรื่องราวเต็มยังไม่อยู่ในรุ่นนี้

## ตรวจสอบ

```bash
npm test
npm run build
```

ชุดทดสอบ simulation ครอบคลุมโครงสร้างคลาสและสกิล การใช้ active skills ทั้ง 78 ท่า ความเสียหาย คูลดาวน์ การหลบวงบอส เลเวล ของดรอปส่วนตัว คลัง เควสต์ เกิดใหม่ และบันทึกอุปกรณ์ ทดสอบเบราว์เซอร์ด้วย Playwright + Chromium: เลือกคลาส เริ่มเกม เดิน เปลี่ยนพื้นที่ เปิดกระเป๋า ใช้สกิล และสองผู้เล่นร่วมห้อง/เปลี่ยนพื้นที่พร้อมกัน ภาพตรวจอยู่ใน `.artifacts/` (ไม่ track)

## โครงสร้าง

- `shared/data.mjs`: คลาส สกิล เขต NPC ค่าตั้งต้น
- `shared/navigation.mjs`: A* หาเส้นทางอ้อมอาคาร ใช้กติการ่วมกันระหว่าง solo และออนไลน์
- `shared/simulation.mjs`: กติกาเกม ใช้ร่วมกันใน solo และ authoritative server
- `server/index.mjs`: Express + Socket.IO + Vite development middleware
- `src/main.ts`: Phaser scene, อินพุต, UI, ตัวเชื่อม simulation
- `src/art.ts`: ฉากพื้น procedural และการจัดวาง asset
- `public/assets/`: ภาพ pixel art สร้างใหม่ตามแนวภาพอ้างอิงของผู้ใช้ ไอคอนสร้างเป็น SVG ในโค้ด

ใช้ checkout เดิมในสภาพแวดล้อมที่แยกไว้แล้ว ไม่จำเป็นต้องสร้าง Git worktree

Browser smoke test (เริ่ม `npm run dev` ในอีก terminal ก่อน):

```bash
# ใช้ Chromium ของระบบโดยอัตโนมัติถ้ามี /usr/bin/chromium
# ถ้าไม่มี ให้ติดตั้ง browser ของ Playwright ก่อน: npx playwright install chromium
npm run test:browser
```

ภาพตัวละคร ฉาก และศัตรูสร้างด้วยเครื่องมือสร้างภาพของเซสชันนี้ จากนั้นตัด asset และจัด baseline สำหรับเกม มีการลบเศษภาพเล็กที่หลงจากการตัด sheet ด้วยการตรวจ connected components ขั้นตอนนี้เป็นการเตรียม asset ในโปรเจกต์ ไม่ใช่ผลจาก pipeline แอนิเมชัน Sprite-gen (เครื่องมือดังกล่าวไม่พร้อมใช้งานในเครื่องนี้)

## Alpha 0.2 — คลิกเดิน, ออโต้ และ HUD ใหม่

คลิกพื้นเพื่อเดินตามเส้นทาง A* คลิกอาคารจะเดินไปยังจุดที่เดินได้ใกล้เคียง คลิก NPC จะเดินเข้าไปสนทนา คลิกศัตรูจะไล่เข้าระยะและโจมตีหลักซ้ำจนเป้าหมายตาย Shift+คลิกโจมตีปกติไปยังตำแหน่งเมาส์ คลิกขวาใช้โจมตีหนัก

ออโต้เปิดด้วย Z หรือปุ่ม AUTO และปิดโดยกดซ้ำ, เดินด้วยมือ, เปิดเมนู, ปุ่มหยุด หรือเมื่อหน้าต่างเสียโฟกัส คำนวณฝั่ง authoritative server ใน Co-op และใช้กติกาความเสียหาย/คูลดาวน์เดียวกับผู้เล่น ออโต้ไม่เปลี่ยนแมพ ไม่รับเควสต์ ไม่ซื้อขาย และไม่เกิดใหม่เอง

HUD ใหม่ใช้กรอบงาช้าง–ทอง ลูกแก้วเลือด/มานา แถบสกิลพร้อมภาพไอคอนและ tooltip กรอบเป้าหมาย สถานะออโต้ และเมนู responsive แบบใหม่ ใช้ภาพไอคอนสร้างใหม่ 8 แบบร่วมกับ SVG เข็มทิศและเฟือง ไม่มีการนำภาพ UI ของเกมอ้างอิงมาใช้

ทดสอบเพิ่มเติม: `npm run test:controls` ตรวจคลิกเดิน ออโต้ การยกเลิกด้วยมือ และขอบเขต HUD บน desktop/mobile ชุด simulation รวม 19 ข้อ

## Alpha 0.3 — ชุดที่ 1: ต่อสู้และตัวละคร

- เดิน/เล็งเชิงกติกา 8 ทิศ ภาพตัวละครวาดจริง 4 มุมมอง (หน้า/ขวา/หลัง/ซ้าย) × 4 โพสต่อคลาส รวม 96 เฟรม ไม่ใช่ภาพวาดแยก 8 มุมมอง
- คอมโบพื้นฐาน 3 จังหวะ: ความเสียหาย 1× / 1.15× / 1.65× ต้องต่อภายใน 1.2 วินาที ท่าจบทำลายทรงตัวและผลักศัตรูธรรมดา
- โจมตีหนัก: คลิกขวา / C ง้าง 0.26 วินาที ใช้สแตมินา 22 หน่วย ความเสียหาย 2× มีพฤติกรรมพิเศษตามบิลด์
- หลบ: Space มี 2 ชาร์จ ฟื้นแยกชาร์จละ 3 วินาที ใช้สแตมินา มีช่วงอมตะ และยกเลิกการโจมตีที่ยังไม่ออก
- ตั้งรับ: กด V ค้าง ป้องกันเฉพาะด้านหน้า ลดความเร็วและใช้สแตมินา กดภายใน 0.25 วินาทีก่อนโดนจะปัดป้องและเสริมพลังสวนครั้งถัดไป
- ล็อกเป้า: Tab หรือปุ่ม ◎ สลับศัตรูใกล้ตัว เดินด้วย WASD ยกเลิกการไล่แต่ยังล็อกเป้าอยู่ สกิลเล็งเป้าที่ล็อกอัตโนมัติ
- เกจทรงตัว 0–100; เมื่อแตกจะขัดท่าโจมตีและสร้างช่วงรับความเสียหายเพิ่ม มีสถานะเผาไหม้ พิษ ช้า แช่แข็ง ช็อก และคำสาป
- 2 บิลด์ต่อคลาสรวม 12 แบบ เลือกที่ K ในหมู่บ้าน มีค่าสถานะ ธาตุ รูปแบบคอมโบ และชุดสกิลต่างกัน บิลด์บันทึกกับตัวละคร
- ผู้เรียกดวงดาวสายกองทัพเรียกบริวาร 3 ตนที่เคลื่อนที่/ยิงอิสระ ผู้พิทักษ์รุ่งอรุณรักษาเพื่อนใกล้เคียงเมื่อโจมตี

ภาพหลายทิศสร้างทั้ง sheet ต่อคลาสในครั้งเดียวจากภาพอ้างอิงเดิม ผ่าน image generation tool จากนั้นเตรียมด้วย `scripts/prepare-motion.py` (ใช้สเกลเดียวและ anchor ร่วมในแต่ละ sheet, alpha threshold และลบเศษภาพเล็กที่ข้ามช่อง) สคริปต์ที่อ้างจาก cloud Sprite Pipeline ไม่สามารถอ่านได้ในเซสชันนี้ จึงใช้สคริปต์ของโปรเจกต์แทน มี raw sources อยู่ใน `/workspace/generated_images` และหลักฐาน normalization ใน `.artifacts/motion-report.json`

ตรวจด้วย `npm test` (32 ข้อ), `npm run test:combat-browser`, `npm run test:controls`, `npm run test:standalone` และ `BASE_URL=<server> node tests/online-controls.mjs`

ยังอยู่ในขอบเขต Alpha: ทุกท่าไม่ได้มี animation วาดเฉพาะของตนเอง อัลติเมตบางท่าใช้กลไกพื้นที่ร่วมกัน และยังไม่มีผังพาสซีฟขนาดใหญ่ หัวข้อเหล่านี้จะพัฒนาต่อในชุดสกิล/ความก้าวหน้า

## Alpha 0.4 — Concept HUD, Hotbar 20 ช่อง และ WORLD

หัวข้อที่ผู้ใช้เลือกในรอบนี้: WORLD พร้อมคำขอ Hotbar/HUD และขยายโลกตามภาพคอนเซปต์ เมืองใช้ภาพหินชนวน ธงร้านค้า ผลึกฟ้า และตะเกียงที่สร้างใหม่ UI เปลี่ยนเป็น slate/copper/cyan ตัวละครยังใช้ภาพอ้างอิงเดิม

### Hotbar

- **20 ช่องจริง** แบ่งสองหน้า หน้าละ 10 ช่อง หรือขยายให้เห็น 2 แถวพร้อมกัน
- **X** สลับหน้า; **1–0** ใช้แถวที่แสดง; **Shift+1–0** ใช้แถวสอง; มีปุ่ม I/II และขยาย/ย่อสำหรับเมาส์/สัมผัส
- ค่าเริ่มต้น: สกิลใช้งาน 13 ท่า (6 โจมตี + 4 อัลติเมต + 3 บัฟ) และคำสั่ง 7 แบบ (ยา หลบ ออโต้ ล็อกเป้า ตั้งรับ สนทนา แผนที่) พาสซีฟ 3 ท่ายังทำงานอัตโนมัติ
- จัดสกิลหรือคำสั่งลงช่องได้ที่ **จัดช่อง** ในเมือง/ค่ายพัก; วางสกิลซ้ำได้ แต่คูลดาวน์และทรัพยากรใช้ร่วมกันตามสกิล ป้องกันการสลับหน้าหลบคูลดาวน์
- แสดงคูลดาวน์ ทรัพยากร จำนวนยา สถานะเปิดใช้งาน และ tooltip ตำแหน่งช่อง บันทึก binding แยกตามตัวละคร ส่วนหน้า/รูปแบบ HUD บันทึกเป็น preference ของเบราว์เซอร์
- R/F/Q/Space/Z/Tab/C/V ยังเป็นปุ่มลัดตามรุ่นก่อน

### โลกขนาดใหญ่

**แต่ละเขตมีขนาด 32,768 × 32,768 หน่วย** เท่ากับ 1,024 × 1,024 ไทล์ขนาด 32 หน่วย หรือพื้นที่ประมาณ **388 เท่าของแมพเดิม 1,920 × 1,440** มี 5 เขตที่ใช้โครงสร้างโลกขนาดนี้

นี่คือขอบเขตที่นำไปทดสอบจริง ไม่ใช่การอ้างว่าไม่มีขีดจำกัดของเครื่องยนต์ เนื้อหานอกพื้นที่เปิดเกมใช้ procedural terrain, ถนน แม่น้ำ ต้นไม้ ซากโบราณ และหมู่บ้านจากชุด asset ร่วมกัน ยังไม่ใช่เมืองหรือเควสต์วาดมือทุกตารางไทล์

- renderer สร้างชังก์ **512 × 512 หน่วย** (canvas 256 × 256 พิกเซล ขยายสองเท่า) ไม่สร้าง canvas เท่าโลกทั้งใบ
- โหลดเฉพาะบริเวณกล้องและขอบ 256 หน่วย ครั้งละไม่เกิน 4 ชังก์ต่อเฟรม ลบ texture ของชังก์ที่ออกนอกระยะ
- ทดสอบเดินจริงจากเมืองไปค่ายสี่สายลมที่ (4096,4096): มีชังก์ประมาณ 16–20 ชังก์ พร้อมทดสอบกล้องจำลองที่ (16000,16000), (32000,32000), (8000,28000) และกลับเข้าเมือง เพื่อตรวจการคงจำนวนทรัพยากร
- 12 จุดหมายต่อเขต รวมการค้นพบ 60 สถานที่: ค่าย หมู่บ้าน หอคอย ท่าเรือ วิหาร บ่อน้ำ ป้อม และประตูดารา
- ค้นพบเสาหลักเมื่อเข้าใกล้ แล้ววาร์ปไปจุดที่ค้นพบในเขตเดียวกันได้ แผนที่เลือกเดินไปยังจุดหมายด้วยเส้นทางไกลได้ พร้อมวิ่งเดินทางช่วงปลอดภัยและมีสแตมินาพอ
- Wilderness สร้างการเผชิญหน้าตาม sector ที่ผู้เล่นเข้าไปครั้งแรก มีอสูร/ผู้พิทักษ์ จำกัด pool ศัตรู 180 และของดรอป 400 ชิ้น พร้อมตัดวัตถุไกลออกเมื่อเต็ม จึงไม่คงอสูรทั้งโลกไว้ในหน่วยความจำ
- ค่ายหมู่บ้านเป็นที่ปลอดภัย ฟื้นเลือด คุย NPC ซื้อเสบียง/หลอม และจัด Hotbar ได้
- แผนที่ใช้ภาพประกอบที่สร้างใหม่พร้อม marker/เส้นทางจากพิกัดจริงของเกม ภาพภูมิประเทศเป็นเชิงแผนที่ ไม่ได้แสดงไทล์ทุกจุดตรงกับโลก procedural

### WORLD และหน้าต่าง

เพิ่มผู้สำรวจและผู้ดูแลค่าย, เควสต์ค้นพบ 5 สถานที่, ปราบผู้พิทักษ์, และส่งสารถึงค่ายสี่สายลม รางวัลรับได้ครั้งเดียวและบันทึกกับตัวละคร มีสมุดภารกิจจาก NPC/แผนที่

หน้าตัวละครมี paperdoll อุปกรณ์จริง 4 ช่อง กระเป๋า 40 ช่อง เปรียบเทียบ/สวม/แยก/ฝาก หน้าสกิลมีหมวดไอคอน 6/4/3/3 และรายละเอียด ผูกกับหน้าจัด Hotbar เมนูแผนที่และหน้าต่าง responsive อิงภาษาภาพ concept โดยยังใช้ระบบอุปกรณ์เดิม ไม่ได้เพิ่มตีบวก อัญมณี หรือปาร์ตี้ ready-check ในรอบนี้

### ตรวจรุ่นนี้

```bash
npm test
npm run test:world-ui
npm run test:combat-browser
npm run test:standalone
# เริ่มเซิร์ฟเวอร์แล้ว:
BASE_URL=http://127.0.0.1:3000 npm run test:browser
BASE_URL=http://127.0.0.1:3000 node tests/online-world.mjs
```

simulation รวม **43 ข้อ** ครอบคลุมขอบเขตโลก เส้นทางระยะไกล การค้นพบ/วาร์ป เควสต์และรางวัล การย้าย binding 20 ช่อง คูลดาวน์ร่วมข้ามหน้า และการกู้บันทึก ร่วมกับชุดต่อสู้เดิม การทดสอบ UI ตรวจการเดินไปค่ายผ่านอินพุตจริงและแยก renderer stress ที่ตั้งพิกัดกล้องจำลองไว้อย่างชัดเจน

เลือกงานถัดไปจาก `ROADMAP.md` หลังส่งรุ่นแต่ละรอบ ผู้ใช้เป็นคนกำหนดลำดับงานต่อ

## Current release: Alpha 0.5 — SKILL CORE (supersedes the old class skill layout)

The user selected 96 Active Gems + 48 Support Gems, then SKILL CORE as the next work package. The earlier 6-attacks/4-ultimates/3-passives/3-buffs menus are historical and are no longer the active player skill interface. `docs/POE2-RESEARCH.md` records the exact reference snapshot inspected and the direct-site access limitation. New names, skill data, art and balance are original.

### New playable gem system

- 96 Active Gems: 8 weapon families × 12 abilities, with basic combos, cones, novas, movement attacks, persistent fields, beams, ground attacks, storms, curses, autonomous summons, reserved auras and guards. They share reusable behavior engines; these are not 96 individually drawn animation sets.
- 48 Support Gems: actual damage/cost/timing/area/duration/projectile/pierce/chain/repeat/conversion/ailment/minion/life-cost/reservation/level effects. Tag compatibility, incompatible families, known supports and socket limits are checked by the server.
- Six character looks are starting archetypes. STR/DEX/INT and the two chosen weapon sets determine eligibility, rather than class-exclusive spells. Weapon swaps happen automatically for eligible skills, or manually with **T**.
- Start with six learned active gems, six known supports, six tier-1 Uncut Gems, eight support-learning stones and two socket stones. The 96/48 catalogues are accessible in **K**. Engrave additional skills, learn supports and arrange **20 hotbar slots** to make a build.
- Gem levels 1–20 are engraved from the matching tier of Uncut Gem. Kills do not automatically level every gem. Enemies/bosses can reward Uncut Gems, support stones and socket stones.
- Three support sockets per gem initially; upgrade to five with socket stones. Reusing the same active skill on multiple hotbar pages shares its actual cooldown.
- Mana, optional life cost and Spirit reservation have separate accounting. Auras toggle and reserve Spirit; weapon/attribute changes revalidate them. Spirit starts at 40 and can be increased by equipped charm power in this prototype.
- Name/save/load up to five gem builds, including attributes, weapon sets, support links and hotbar bindings. This never duplicates gems/currency.
- **K**: Gem Workshop; **T**: weapon set; **1–0 / Shift+1–0**: hotbar; **X**: page; **F**: aura shortcut; **R**: powerful family skill shortcut (must first be learned); **C**: heavy basic attack. Other movement/guard/dodge controls remain.

### Character frame correction and mandatory audit

The previous equal-column extraction cut weapons that crossed into neighbouring slots. The new extraction reads connected character silhouettes across each whole row, then applies a common scale and head/foot anchors. It recovered five crossing frames: knight 7/15, mage 15, summoner 7/15 (zero-based).

All 96 normalized poses now use **160 × 160** cells in 640 × 640 sheets, with a verified margin on all sides. Menu portraits are made from the same complete idle silhouettes. `assets-source/characters/` retains the six raw source sheets; `assets-source/sprite-audit.json` records source/atlas SHA256 hashes, bounds and recovered crossings.

`npm run release` always runs `npm run audit:sprites` before building. Rebuilding art requires Python 3 + Pillow; playing the exported HTML or starting the packaged server does not. The release includes **SPRITE-CHECK.png** and **sprite-audit.json** for review. A hash/bounds regression test prevents silently shipping changed or clipped sheets.

### Scope and validation

`npm test`: **61 checks** total, including 17 gem-core checks that execute all 96 active definitions and inspect all 48 support profiles, the sprite hash/bounds audit, and 43 explicitly legacy-mode regression tests. Compatibility fixtures can construct `World(...,{legacy:true})`; connected players and normal solo play cannot invoke that mode or the retired class skill API.

`npm run test:gems-browser` exercises engraving, attributes, two weapon sets, support linking/socket expansion, build save/load, real hotbar casts, Spirit toggles, automatic swaps, guard/dodge and mobile layout. `npm run test:world-ui` retains the large-world/hotbar/NPC checks. `npm run test:standalone` tests the exported HTML with network disabled. The Cloud browser blocks direct file:// navigation, so offline HTML is tested inline instead.

Still future work: the approved **25-map RO world** (5 towns + 20 farming maps across 5 islands), stackable junk/material economy, complete equipment refining/card system, larger passive tree, meta/trigger gems and persistent online accounts. The current running game retains five large procedural regions; the 25-map content plan is in `docs/RO-WORLD-PLAN.md` and is not counted as delivered maps yet. Character weapon visuals still follow the six original costumes/poses rather than redrawing every equipment family.
