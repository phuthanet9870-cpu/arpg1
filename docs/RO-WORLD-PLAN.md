# RO-inspired world: selected target, next implementation package

Status: RO FARM implemented in Alpha 0.6. All 25 maps have live travel, 5 towns are safe, and each of the 20 farm maps has a species, boss, pixel sprite, level, terrain palette/motif and three map-specific drops. Landscapes use streamed procedural terrain and shared landmark/road templates; these are not 25 fully hand-painted maps.

## Five islands / 25 maps

| Island | Safe town | Farming maps (4 each) | Distinct monster/loot direction |
|---|---|---|---|
| 1. แสงแรก | 01 ปราการรุ่งอรุณ | 02 ทุ่งหยดน้ำ, 03 ป่าผึ้งเงิน, 04 เหมืองรากหิน, 05 หาดเปลือกมุก | Slimes/jellies, insects/wax, moles/ore scraps, crabs/shells; Lv.1–8 |
| 2. เหมันต์ | 06 นครหิมะกระจก | 07 ทุ่งเขากวาง, 08 ป่าสนไอเย็น, 09 ถ้ำน้ำแข็ง, 10 ยอดผาพายุ | Deer/antlers, wolves/fur, ice insects/crystals, harpies/feathers; Lv.8–14 |
| 3. อำพันเพลิง | 11 เมืองเตาหลอม | 12 ทุ่งเถ้า, 13 รอยแยกลาวา, 14 เหมืองออบซิเดียน, 15 โรงหลอมโบราณ | Ash beasts/charcoal, salamanders/scales, golems/ore, forge constructs/parts; Lv.14–20 |
| 4. พงไพรจันทรา | 16 ท่าเรือใบหยก | 17 ป่าชายเลน, 18 บึงพิษ, 19 ถ้ำเห็ดเรืองแสง, 20 วิหารรากไม้ | Mangrove creatures/roots, frogs/poison sacs, fungi/spores, treants/ancient bark; Lv.20–25 |
| 5. ดาราล่องฟ้า | 21 ป้อมดวงดาว | 22 ทะเลทรายแก้ว, 23 สวนลอยฟ้า, 24 ซากนครดารา, 25 ห้องนิรภัยสุริยะ | Glass scorpions/chitin, sky beasts/fibres, astral constructs/fragments, guardians/cores; Lv.25–30 |

Live drop tables: junk 100% (1–3), material 30% (1), rare trophy 1.5% (1); boss junk 8, materials 3, trophy chance 15%. Each map has melee/ranged/area variants of its species. The existing equipment and gem-currency drops remain additional rewards. Alpha 0.7 uses three map trophies plus eight materials and 300 gold to craft Legendary equipment; affixes, refining, cards and five island quest chains are now implemented. Towns contain a buyer, storage, gem workshop, potion shop and world travel.

## Suggested work packages for the user to choose

1. RO FARM: 25 map identities/connections, 20 distinct drop tables, stackable junk/materials, NPC buy/sell and farm filters.
2. ITEM CORE: weapon/armour bases, STR/DEX/INT requirements, prefix/suffix rolls, refine levels, material costs, previews and failure rules chosen by the user.
3. CARD SYSTEM: equipment cards as a separate mechanic from skill-gem support sockets; rare cards add equipment modifiers.
4. JOB / ASCENDANCY: class specialisations with passive bonuses while keeping active gems weapon/attribute based.
5. SOCIAL: party sharing policies, friend/guild features and eventually persistent online accounts.

## Keep the two inspirations coherent

PoE-inspired gems/supports belong to skills. RO-inspired cards/refining belong to equipment. Junk and craft materials stack and have a vendor economy; they are not represented as dozens of unstackable weapons. Uncut gems are used to engrave/upgrade active gems instead of passively levelling every skill through kills. Base character progression and optional job progression must be shown distinctly if a job system is selected later.
