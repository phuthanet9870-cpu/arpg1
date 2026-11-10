# PoE2 system study and implementation boundary

Reference snapshot inspected: Path of Building Community for Path of Exile 2, commit `601768bd105869618c3d6581b883e5d7aeec91b2`.

Sources actually read:

- https://github.com/PathOfBuildingCommunity/PathOfBuilding-PoE2/blob/601768bd105869618c3d6581b883e5d7aeec91b2/README.md — skill/support planning, passives, item modifiers, ailments, charges, life/mana/ES and reservations.
- https://github.com/PathOfBuildingCommunity/PathOfBuilding-PoE2/blob/601768bd105869618c3d6581b883e5d7aeec91b2/src/Data/Gems.lua — gem identifiers and STR/DEX/INT requirement metadata.
- https://github.com/PathOfBuildingCommunity/PathOfBuilding-PoE2/blob/601768bd105869618c3d6581b883e5d7aeec91b2/src/Data/Skills/act_str.lua — weaponTypes, skillTypes, level scaling and mana costs.
- https://github.com/PathOfBuildingCommunity/PathOfBuilding-PoE2/blob/601768bd105869618c3d6581b883e5d7aeec91b2/src/Data/Skills/sup_int.lua — requireSkillTypes/excludeSkillTypes, gemFamily, triggered skills, damage/area/projectile/persistent tags.
- https://github.com/PathOfBuildingCommunity/PathOfBuilding-PoE2/blob/601768bd105869618c3d6581b883e5d7aeec91b2/src/Classes/SkillsTab.lua — gem stat requirements, skill groups, support compatibility and Spirit reservation across weapon sets.

The community README contains inherited planner wording. It is not treated as a definitive current-patch rulebook. Generated skill data explicitly credits Grinding Gear Games; the game project does not copy these data files, descriptions, skill icons or game assets. New names, data, art and balance values are authored for SUNBOUND.

Direct requests to https://poe2skills.com/, https://pathofexile2.com/game and https://www.poe2wiki.net/wiki/Skill_gem were rejected by the environment CONNECT proxy with HTTP 403. They have not been represented as read. Configuration-draft reads could not be verified, so no network configuration was overwritten. The exact requested website can be compared later if these domains are allowed in environment settings.

## Verified architectural observations

1. Active gems and support gems are distinct. Support applicability is constrained by skill tags, exclusions and gem families; it is not a universal damage-only attachment.
2. Active skills have weapon/level/attribute metadata. A class-based fixed attack/ultimate/buff list is a poor representation of this architecture.
3. Skill levels, costs, cast/attack timing, hit damage, damage over time, projectiles, area effects, persistent skills and minions are separate concerns.
4. Builds combine skills/supports, equipment, attributes and a passive tree. Character class identity is not equivalent to owning an exclusive list of spells.
5. Mana and Spirit reservation need separate accounting for persistent effects. A toggle consuming a one-time mana cost does not model a reservation.
6. Weapon-set-aware skill use and derived statistics must be validated in the authoritative simulation, not solely by the UI.

## SUNBOUND design selected by the user

- 96 original active gems in 8 weapon families × 12 abilities.
- 48 original support gems, with tag/family compatibility and explicit tradeoffs.
- STR/DEX/INT, two weapon sets, gem engraving/upgrading through uncut-gem resources, socket links, Spirit reservation and named build presets.
- 6 existing character looks become starting archetypes; gem eligibility uses the selected weapon and attributes rather than a hard class lock.
- Own balance values, initially 3 support sockets per active gem and up to 5 through unlocks; no claim that every limit/formula exactly matches a particular live PoE2 patch.
- Legacy six-slot skill layout and attack/ultimate/buff taxonomy are replaced in the player-facing flow. Compatibility code may remain for migration tests but is unavailable to connected gem-mode players.

## RO-inspired world target (planned, not completed by SKILL CORE)

Five islands, each with one safe town and four distinct farming maps: 5 safe zones + 20 farming maps = 25. Each farming map will have its own monster roster, common sellable junk, crafting materials, rare equipment and a boss/MVP-like target. NPC junk buying, refine materials, safe upgrade brackets and equipment affixes belong to the later RO FARM / ITEM CORE work packages.
