# Alpha 0.10 — GM / HUD / unified bag

The lower-right menu opens 19 independent systems, supports collapse and UI scaling, and stores its preferences locally. The bag combines equipment, consumables, cards, farming resources and gem currencies into one view, with search, filters, manual sort and persistent auto-sort. Equipment capacity remains 40; stack resources retain their real quantities. The paperdoll shows the four supported gear slots.

25 generated painted icons are embedded in the standalone HTML. Their source atlas, recovered boundaries and SHA256 audit are under assets-source. The passive constellation contains 144 functional nodes with prerequisites and point costs, drag/zoom and reset. Existing six-node branch saves remain valid. Maximum level and point budget are unchanged.

## GM configuration

Offline single-player exposes GM as a local sandbox. Online GM is disabled by default. Start the server with `GM_ACCOUNTS=your_username` (comma-separated account usernames) to allow authenticated administrators. The browser cannot grant itself access; saved GM flags are ignored. Never distribute a shared administrator account.

GM can adjust level, gold, attributes, inventory, cards, gems, skills, cooldowns, quests, map position, monsters and dungeon state; heal/revive players; change simulation speed or pause; and inspect accounts/audit history or kick/ban/unban accounts. Commands validate their bounds and record a server audit entry. Runtime invulnerability, speed and damage overrides are temporary. Account bans persist in the server SQLite database. There is no SQL or shell execution console.

Run `node tests/gm-online.mjs` to verify server permissions, forged requests, peer mutations, bans and persistence. Run `node tests/gm-hud-browser.cjs` after building to verify real UI actions, separate windows, bag sorting and mobile viewport fit.
