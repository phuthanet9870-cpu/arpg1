# Accounts and durable saves — Alpha 0.8

Use Node 22.13+ (24 LTS recommended); `node:sqlite` is built into the runtime. No external database service or cloud credentials are required.

## Play

Run `npm ci` and `npm start`. Open the server URL, choose Account, register a username (3–24 ASCII letters/digits/underscore) and password (10–128 characters). Login is remembered with a random bearer token for up to 30 days. Passwords are never put into localStorage; the session token is. Select a class and create or join a room. There is one durable character for each of the six classes per account. Return to character selection and select the same class to resume; room codes themselves are temporary and do not survive a restart.

Solo still uses local browser saves. Guest Co-op still uses in-memory sessions. Signing up starts a separate online character; no unaudited client save import endpoint exists. The account’s character is loaded only from the server database; client-provided gold/level/save payloads are ignored. All combat, currency and progression transactions use the shared authoritative simulation. One account/class can be active on only one socket at a time; other classes can be played independently.

## Storage and backups

Default database: `.local/accounts.sqlite` relative to server working directory. Set `SUNBOUND_DB=/a/writable/persistent/path/accounts.sqlite` to choose another file. SQLite uses WAL journaling. Keep this directory on persistent storage; deleting it deletes the local accounts and characters. Release ZIPs deliberately contain no database, passwords or live accounts.

Autosave runs every 5 seconds, immediately after important progression/economy actions, on disconnect and graceful shutdown. A crash can lose the most recent unsaved combat/loot interval (up to roughly 5 seconds); an acknowledged economy/passive mutation commits synchronously before the next state update. Re-login starts at the current room entrance, healed, with temporary combat state cleared. Map/room position is not a durable checkpoint.

To back up, stop the server gracefully and copy the `.local` directory (or configured database directory). To restore, stop the server, replace its database files with that backup and start it. Do not unzip a new release over or delete your database directory. In container hosting, mount it as a persistent volume. Copying only the main file while WAL writes are active is not a safe backup procedure.

## Authentication implementation

Passwords use Node crypto scrypt with random 16-byte salts and 64-byte outputs. Tokens have 32 random bytes; only SHA256 digests are stored in sessions. Prepared SQLite statements bind all account/class values. Sessions expire after 30 days; logout revokes the current session and disconnects its sockets. An IP can attempt register/login at most 12 times per 15 minutes. This in-memory rate limit resets on server restart. No plaintext password/token is logged or placed in room state.

For public hosting serve HTTPS/WSS through your normal reverse proxy. Public deployment, TLS certificates and a managed database are not provided by this local release. Password change/reset by email, account deletion UI, account merging, multi-server replication and administrator recovery tools are not implemented.

## Verification

`npm test` covers credential validation, salted hashes, token digests/revocation, account/class separation, persistence after store close/reopen. `npm run test:accounts-online` boots a temporary server/database, registers and plays, rejects simultaneous same-class play and supplied fake saves, learns a passive, kills the server with SIGKILL, restarts against the same file and verifies token/character restoration. It also tests logout and rate limits. `test:alpha8-browser` drives register, online play, reload and resume in a real browser. All test credentials are generated fixtures.
