# Alpha 0.9 — ENDGAME → SOCIAL → SKILL TRIGGERS

## Expeditions

Shared `endgame.mjs` owns five dungeon definitions, three difficulties and four modifiers. Entry requires safe town, all party members ready/alive, minimum level and each member’s fee. The server additionally requires the room leader to start/leave. No join is allowed into an active run. Arenas reuse farm maps 4/9/14/19/24 and a bounded battle area; procedural exploration spawns are suppressed while a run exists.

Waves contain 7/9/11 ordinary enemies followed by a boss. Four seconds separate cleared waves. Added boss minions receive the same dungeon scaling. Hard/nightmare scale enemy HP and damage by 1.45/2; vitality adds HP×1.3, haste speed×1.25, wrath damage×1.25, hazard adds warning circles every seven seconds. At most three modifiers are enabled. Three total party deaths or 600 simulation seconds fails the run. Solo menus pause simulation; online menus do not.

Normal/hard/nightmare fee: 0/100/250 gold per person; reward multiplier 1/1.6/2.4, multiplied by 1+0.2×modifier count. Successful claims grant round(5×factor) tokens, round(300×factor) gold, round(200×factor) XP and one Jeweller. Claims are once per participant per run; leave before claim forfeits it. Last 20 claimed runs and tokens are saved. Ten tokens buy one Legendary base appropriate to player level if inventory has space. Run rooms/position are not durable; disconnect cannot rejoin a running expedition in this version.

## Social

`server/social.mjs` adds tables with CREATE IF NOT EXISTS to the existing SQLite file. No destructive migration. Friend requests are symmetric pairs with sender/recipient; only recipient accepts. Names are account names, not character display names. Online status is a live socket observation. Lists refresh on request. No direct messages/automatic party invitation system is claimed.

One guild per account, 20 members maximum. Creation costs 500 gold from the current online character in town. Invites require owner/officer; owner controls role assignment, leadership transfer and disband. Officers may remove ordinary members, not owners/officers. Owners must transfer or disband before leaving. Account foreign keys and parameter-bound statements prevent arbitrary account/table changes. Guild names permit letters/numbers/space/underscore/hyphen only. No guild stash, persistent chat or buffs yet.

Party leadership is independent of guild rank. Only room leader can promote/kick; membership edits are blocked during active expeditions. Kicks disconnect after saving account progress. Guest friends/guild actions are rejected. Party chat and per-player loot remain unchanged.

## Trigger gems and reactions

Six shared trigger definitions. Link at most three distinct meta gems in town to learned, weapon/stat-eligible damaging Active modes: cone/nova/beam/area/field/storm/curse. No basic/aura/summon/guard auto loops. Links start disabled. Enable reserves 10 Spirit (cadence 15), shared with auras. Stat/weapon changes revalidate links. Persist only configuration, not energy/queue/cooldowns.

Events: two critical hits, two credited kills, one successful dodge, one block, three ordinary casts, crossing below 35% HP. Internal cooldowns 4/4/5/4/5/10 seconds. Full energy queues a normal cast for up to 1.2 seconds; normal weapon, mana/life, cooldown, cast/dodge/death checks still apply. Failure expires without free damage. Triggered hits/fields are marked and cannot create more trigger critical/kill/cast events. A low-health latch resets after health returns above threshold.

Reactions compare the previous direct gem-hit element within three seconds, then set a 1.5-second per-enemy reaction lockout: ice→fire deals 35% raw hit damage extra and removes freeze; fire→lightning damages up to three nearby other enemies for 30%; poison→fire deals 50% extra and replaces poison with fire status. Reactions are damage rules plus text feedback, not a new 3D particle/VFX library.

## Evidence and limits

104 unit/integration checks. Browser tests exercise real UI; late-game levels and quick wave-clear screenshots use labelled QA fixtures. The two-client online test seeds late-game gear directly into a temporary test DB, then uses only normal authenticated actions: friend/guild workflows, permissions, readiness, Spirit, dodge trigger, actual auto combat through all waves/boss, one-time reward, return and leadership transfer/kick. Production has no test mutation endpoint. Existing accounts restart, gem core, offline, mobile and sprite checks remain required.
