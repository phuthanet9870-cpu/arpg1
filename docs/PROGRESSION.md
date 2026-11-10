# Alpha 0.7 progression rules

The user selected ITEM CORE → WORLD QUESTS & BOSSES → CARD SYSTEM (1–3–2). All names and formulas are original.

Authoritative content: `shared/equipment.mjs` has 80 equipment bases, 8 affix types, 20 cards and transaction rules; `shared/island-quests.mjs` has 15 quests, 20 boss names and damage geometry. `src/progression-ui.ts` renders the three connected panels.

## Equipment

Four slots remain weapon/armor/ring/charm. Each farm map offers four bases; level requirements are enforced on craft and equip. The equipment weapon slot raises generic gear power; the existing two weapon-family selectors still determine which Active Gems can be used. Character artwork does not change to display rolled equipment.

Rarity gives 2/3/4 distinct affixes for Magic/Rare/Legendary (common 1). Each affix rolls its fixed interval plus floor(base level/8). Crafting is available in any safe town. Rare costs 4 source-map materials and 80+4×base-level gold. Legendary costs 8 materials, 3 source-map trophies and 300 gold. Full bags and failed validation spend nothing.

Refine success grants one level, maximum 12. Power = round(basePower × (1 + 0.08×refine)). Source-map material cost ceil(target level/2), gold 40+45×target level. The exact success percentage is shown before action; failures consume costs, preserve the item and level, and add 10 percentage points to the next attempt, capped at 100. Success resets pity. Reroll costs 120 gold + 5 source materials, changes only one selected affix and prevents duplicate affix types in that item. Locks prevent salvage; installed cards also prevent salvage.

Eight real stat hooks: damage/crit/cooldown in gemProfile, HP/mana/Spirit in refreshGemStats, armor in incoming hit resolution and speed in movement. Speed capped +35%, item/card crit contribution +35%, CDR +40%. Generic gear power remains part of gem damage. All stat bonuses require equipped items; inventory items give none.

## Quests and bosses

Five independent island chains, three sequential chapters each. Hunt progress is measured after acceptance; supply consumes two of each of four map materials only on a valid claim; final quest measures boss kills on the island’s fourth farming map after acceptance. Accept/claim in that island’s town. Claims are one-time, saved per character. Final chapter adds three last-map trophies and one Jeweller plus gold/XP. World enemies and quests still progress the whole room’s party using the existing party-sharing policy.

Bosses use 20 names and four shared patterns. Nova: radius 150. Ring: radius 63–150, safe center. Line: forward distance 0–360 and perpendicular distance <45. Burst: nova geometry with a shorter attack cycle. Telegraphs use the same positions/angle/radii. These are four AI patterns, not 20 individually animated boss models.

## Cards and sets

Each species drops its own card, 0.5% normal / 5% boss, independently per player, through a personal ground drop. Walk near to collect. Card slot follows species index modulo the four equipment slots. Rare has one socket, Legendary two. No repeated card ID within one item. Socketing consumes a card; extracting costs 50 gold and returns exactly one. Cards are separate from Active/Support Gem sockets.

All five island equipment sets currently share thresholds: 2 pieces HP+40, 3 damage+10%, 4 Spirit+10. Base names, source map, level and affixes differ; five unique set-effect trees are not claimed. Card bag, refine/pity/affixes/locks/sockets, and quest/boss counters survive solo saves and server session rejoin. Alpha 0.8 adds SQLite-backed accounts; Guest sessions remain memory-only. See ACCOUNTS.md.

## Verification

91 unit/integration checks (including Alpha 0.8 passive/account/boss tests) including economy failure paths, one-time rewards, all five quest chains, stat effects and save migration. Browser workshop checks deliberately seed QA currency/material/card state, then drive real controls. Farming tests and the online progression test earn drops through normal combat; server tests do not expose debug mutation APIs. Sprite audit regenerates and checks all 96 poses on release.
