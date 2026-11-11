# SUNBOUND — งานเป็นชุดที่ผู้ใช้เลือก

ใช้ checkout และเกมเดิมต่อ ปรับระบบและหน้าตาได้ โลกสว่าง ตัวละครยึดภาพอ้างอิงเดิม

## ชุด 1: ต่อสู้และตัวละคร — เสร็จและตรวจแล้วใน Alpha 0.3

ขอบเขตที่ส่ง: การเดิน/โจมตีหลายทิศ คอมโบ 3 จังหวะ โจมตีหนัก หลบ 2 ชาร์จ สแตมินา ล็อกเป้า/เดินหลบ ตั้งรับ/ปัดป้อง ทรงตัว/สถานะ และ 12 บิลด์ของ 6 คลาส
ภาพ: 4 มุมมองจริง × 4 โพส × 6 คลาส = 96 เฟรม รองรับการเคลื่อนที่/เล็ง 8 ทิศด้วย 4 มุมมองนี้ ภาพหลบ โดนตี และตายยังเป็น procedural transitions
หลักฐาน: 32 simulation tests + browser controls/combat/mobile/offline tests + two-client authoritative sync test

## หัวข้อที่เลือกทำต่อได้

| รหัส | หมวด | สถานะตอนนี้ |
|---|---|---|
| WORLD | เมือง แผนที่เชื่อม NPC เควสต์ และการเดินทาง | ต้นแบบ เลือกขยายได้ |
| UI | หน้าต่างตัวละคร กระเป๋าช่อง สกิล แผนที่ และตั้งค่า | ต้นแบบ เลือกขยายได้ |
| LOOT | อุปกรณ์ เซ็ต อัญมณี ตีบวก คราฟต์ และร้านค้า | ต้นแบบ 4 ช่อง เลือกขยายได้ |
| SKILLS | รายละเอียด 96 ความสามารถ ผังพาสซีฟ และความก้าวหน้า | มีบิลด์เริ่มต้น เลือกขยายได้ |
| DUNGEON | ห้องสุ่ม กับดัก บอสหลายเฟส และท้ายเกม | แมพ/บอสต้นแบบ |
| ONLINE | บัญชี ฐานข้อมูล บันทึกถาวร และการกลับเข้าเกม | Co-op ห้องส่วนตัว ไม่มีข้อมูลถาวร |
| AUTO | ตั้งลำดับสกิล ตัวกรองของ และเงื่อนไขออโต้ | มีออโต้พื้นฐาน |
| SOCIAL | เพื่อน กิลด์ แชต และภารกิจกิลด์ | มีเฉพาะแชตห้อง |
| PETS | สัตว์เลี้ยง พาหนะ และรูปลักษณ์ | ยังไม่ทำ |
| POLISH | เพลง เสียง จอย accessibility และประสิทธิภาพ | มีเสียง/มือถือพื้นฐาน |

ทำชุดที่เลือกให้เล่นได้ ทดสอบ ส่ง HTML5 แล้วให้ผู้ใช้เลือกชุดถัดไป ไม่ถือว่าเกมทั้งโครงการเสร็จจากการส่ง Alpha ชุดเดียว

## ชุด 2 / Alpha 0.4 — WORLD + Hotbar + Concept HUD

**ส่งแล้วและตรวจแล้วในขอบเขต Alpha**:

- Hotbar 20 ช่อง สองหน้า × 10 หรือขยายสองแถว ปรับ binding ในเมือง/ค่ายและบันทึกตามคลาส คูลดาวน์ร่วมตามความสามารถ
- HUD slate/copper/cyan อิงภาพ concept ลูกแก้วเลือด/มานา เมนูคลาส ไอคอน กระเป๋าแบบช่อง/paperdoll และสมุดสกิล
- 5 เขต ขนาดเขตละ 32768² หน่วย; client chunk streaming 512² หน่วย ลบ texture ไกล
- 12 จุดหมายต่อเขต ถนน แม่น้ำ หมู่บ้าน ซากโบราณ และการเผชิญหน้า procedural
- NPC ค่ายพัก, ค้นพบเสาหลัก/วาร์ป, แผนที่ภาพประกอบ, สมุดผู้สำรวจและเควสต์ 3 แบบ พร้อมรางวัล
- หลักฐาน: 43 simulation tests, ทดสอบเดินจริงไปค่าย/เควสต์/วาร์ป, stress กล้องพิกัดไกลและ resident chunks, hotbar สองหน้า/20 ช่องและมือถือ, สถานะสองผู้เล่น

WORLD พื้นฐานและ HUD รุ่นนี้เสร็จตามขอบเขตที่บันทึกไว้ เนื้อเรื่องยาว เมืองเฉพาะทุกเขต และแผนที่วาดมือทั้งโลกยังเปิดให้เลือกขยายต่อ

## การควบคุมงานในรอบถัดไป

ทุกครั้งให้แจ้งหัวข้อที่จะทำก่อนลงมือ สรุปสถานะและไฟล์พร้อมเล่นเมื่อจบ แล้วเสนอหัวข้อให้ผู้ใช้เลือกต่อเสมอ คำตอบ WORLD ที่ส่งมาระหว่างงานชุดนี้ได้ถูกรวมแล้ว ไม่ต้องถามยืนยันซ้ำ

ตัวเลือกที่ตรงกับภาพ concept และยังเหลือ:

1. **LOOT / CRAFT** — ขยายอุปกรณ์ ตีบวก อัญมณี affix รีโรล ตัวกรองของ และคลัง
2. **DUNGEON / PARTY** — ดันเจียนเฉพาะ บอสหลายเฟส ความยากและปาร์ตี้ ready-check
3. **SKILLS / PASSIVES** — ผังพาสซีฟ แต้มสกิล รายละเอียดท่าและรูนเพิ่มเติม
4. **WORLD STORY** — เมืองเฉพาะแต่ละภูมิภาค เนื้อเรื่อง/บทสนทนา และเควสต์ยาว
5. **ONLINE** — บัญชี ฐานข้อมูลถาวร กิลด์และเพื่อน

## ชุด 3 / Alpha 0.5 — SKILL CORE ที่ผู้ใช้เลือก

**เสร็จในขอบเขตแกนระบบ:** 96 Active + 48 Support, STR/DEX/INT, อาวุธสองชุด/สลับอัตโนมัติ, แกะสลักและอัปเกรดเจม, แท็ก/ตระกูลซัพพอร์ต, ช่อง 3→5, มานา/เลือด/Spirit reservation, บันทึกบิลด์ และแทนหน้าสกิลเดิมด้วย Gem Workshop

**ตรวจภาพทุกครั้งก่อนส่ง:** แก้เฟรมข้ามช่อง 5 จุด ใช้ atlas 160px; เก็บ raw source, ตรวจ hash/ขอบครบ 96 โพส และแนบ SPRITE-CHECK.png ทุก release

**การศึกษา:** อ่านข้อมูล PoB2 ที่ commit บันทึกใน docs/POE2-RESEARCH.md; เว็บไซต์ poe2skills.com และเว็บทางการที่ลองถูก CONNECT 403 จึงยังไม่อ้างว่าได้อ่านลิงก์นั้นหรือเทียบกฎทุกข้อกับแพตช์ live แล้ว

**เป้าหมายที่ผู้ใช้ยืนยันแล้ว ไม่ต้องถามจำนวนซ้ำ:**

- 96 Active + 48 Support
- 5 เกาะ × (1 เซฟโซน + 4 แมพฟาร์ม) = 25 แมพ
- ทำ SKILL CORE ก่อน จากนั้นเลือก RO FARM / ITEM CORE / PASSIVE CORE ตามลำดับที่ผู้ใช้ต้องการ

สถานะเดิม ณ Alpha 0.5: 25 แมพยังเป็นแผน ต่อมาลงมือในชุด 4 ด้านล่าง


## ชุด 4 / Alpha 0.6 — RO FARM ที่ผู้ใช้เลือก

เสร็จ: 5 เกาะ / 5 safe towns + 20 farming maps / แมพละ 32768², ชนิดมอนสเตอร์ 20 แบบพร้อม pixel silhouettes, melee/ranged/area variants และหัวหน้า, 60 stackable farm items, owner-specific drops, 45s sector respawn, NPC buyer พร้อมตรวจระยะ/จำนวน, sell junk all, ground-loot display filters, save migration, island atlas และ Co-op authoritative economy.

ตรวจ: 69 unit/integration tests, browser เข้าออกทั้ง 25 แมพ/เดินหา NPC/ขายของ/auto farm/มือถือ, online สองไคลเอนต์ทุกแมพและขายของ, gem regressions, standalone offline. ตรวจ sprite 96 poses และแนบภาพรอบนี้แล้ว

ขอบเขต: แผนที่ใช้ procedural chunks และแม่แบบจุดหมายร่วมกัน ของหายากใหม่เป็นตราฟาร์ม การ์ด/คราฟต์/ตีบวก/อุปกรณ์สุ่มออปชันยังรอ ITEM CORE/CARD ไม่อ้างว่ามีแล้ว

หัวข้อให้เลือกต่อ: ITEM CORE (แนะนำ), CARD SYSTEM, WORLD QUESTS & BOSSES, PASSIVE CORE, SOCIAL/PERSISTENCE. ถามเป็นตัวเลือกทุกครั้งหลังส่งชุดที่เสร็จแล้ว


## ชุด 5 / Alpha 0.7 — ผู้ใช้เลือก 1 → 3 → 2

ลงมือตามลำดับ: ITEM CORE (80 map bases / 8 affix types / refine +12 / selected reroll / lock / craft Rare & Legendary ด้วยตรา) → ISLAND QUESTS & BOSSES (15 stages / 20 names / 4 attack geometries / matching telegraphs) → CARD SYSTEM (20 cards / equipment sockets / safe extraction / 2–3–4 piece island sets).

ตรวจ 83 unit/integration tests และ browser QA (บางกรณีเติมทรัพยากรเพื่อทดสอบ UI โดยระบุไว้ในสคริปต์) ส่วนการฟาร์มของจริงตรวจแยกใน farming-browser และออนไลน์ ตรวจภาพตัวละคร 96 โพส ไม่มีขอบถูกตัด

ข้อจำกัดปัจจุบัน: 4 ช่องอุปกรณ์เหมือนเดิม อาวุธภาพใช้ต้นแบบตัวละคร ไม่เปลี่ยนตามไอเทม การ์ด 20 ชนิดใช้สถิติ 8 ประเภทและแต่ละเกาะใช้โบนัสเซ็ตตารางเดียวกัน เควสต์เป็นสายล่า/ส่งของ/บอส ยังไม่มีคัตซีน บัญชีออนไลน์ยังเป็น memory-only

หัวข้อถัดไปให้เลือก: PASSIVE CORE, ONLINE SAVE/ACCOUNTS, WORLD ART & BOSS ENCOUNTERS. งาน 1–3–2 รอบนี้ไม่ต้องให้ผู้ใช้เลือกซ้ำ


## ชุด 6 / Alpha 0.8 — ผู้ใช้เลือก 1 → 2 → 3

1. PASSIVE CORE: 48 connected nodes / 8 branches / finite points / 12 level-10 specialisations / free safe-town respec / real stat hooks and save migration.
2. ONLINE SAVE: local SQLite accounts, scrypt passwords, hashed expiring sessions, per-class durable saves, character lease, autosave/important-action saves, logout, rate limit, real SIGKILL/restart verification.
3. WORLD ART & BOSSES: five island color/prop directions using shared painted assets plus pixel motifs; 20 boss ornament variants; five island phase signatures + four shared attack patterns, telegraphed server-owned hazards, slow/adds/healing and cleanup.

91 unit/integration checks plus browser/Co-op/offline/mobile and account restart tests. Check sprite board of all 96 character poses each release. Boss phase and late-game UI screenshots use explicitly documented QA health/level/camera setup; account restart test uses ordinary server actions.

Limits: not 25 hand-painted maps or 20 unrelated AI implementations; specialisations grant stat bonuses, character art uses the approved six prototypes. Guest is not durable; account DB belongs to that one server. Email reset and multi-server replication are not implemented.

Next choices: SOCIAL (friends/guild/party permissions), ENDGAME (dungeons/rewards/modifiers), SKILL TRIGGERS (meta/trigger supports and specialised build interactions). Ask choices after this complete delivery, not for the already approved 1–2–3 again.


## ชุด 7 / Alpha 0.9 — ENDGAME → SOCIAL → SKILL TRIGGERS

เสร็จ: 5 arena expeditions / 3 tiers / 4 modifiers / party-ready / wave director / bounded arena / death-time cap / one-time claims / token exchange and saved history; persistent account friends/guild membership/invites and role checks; room promotion/kick; 6 Spirit-reserving trigger links + 3 elemental reactions with recursion guard and shared skill costs.

ตรวจ: 104 unit/integration tests, real two-client online run through combat/rewards/social permissions, labelled seeded browser fixtures for late-game panels and mobile, existing regressions, 96-pose sprite audit.

Limits: dungeons reuse current maps, running rooms are not restored/rejoinable mid-run; no guild chat/stash/buffs or public matchmaking. Triggered casts do not chain triggers. Docs: ENDGAME-SOCIAL-TRIGGERS.md.

Next choices after completing this round: ITEM DEPTH (weapon families/affix tiers), QUEST STORY (NPC and exploration chains), GAME FEEL & VISUAL POLISH (combat readability, animation and terrain transitions). Do not ask user to choose the completed 1–2–3 again.

## ชุด 8 / Alpha 0.10 — GM / HUD / unified bag / constellation

- เมนูขวาล่าง 19 ระบบแยกหน้าต่าง ปรับขนาด ย่อ/ขยาย
- กระเป๋ารวม ค้นหา กรอง และจัดเรียงอัตโนมัติ
- ไอคอนที่สร้างใหม่ 25 ภาพ ตรวจขอบ atlas และตัวละครเดิม
- Skill Tree 144 โหนด ลาก/ซูมและจัดแต้มจริง
- GM ออฟไลน์และสิทธิ์บัญชีบนเซิร์ฟเวอร์ พร้อม audit และ ban
