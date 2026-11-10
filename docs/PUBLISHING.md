# Game downloads and static website

`web/index.html` is the tested self-contained game. `web/downloads` contains release archives; no database, passwords or live account files are included.

The default branch workflow publishes a GitHub Release and a Pages artifact. For the first Pages deployment, the repository owner must select **Settings → Pages → Build and deployment → Source: GitHub Actions**. Then run **Actions → Publish SUNBOUND game → Run workflow** if the initial run failed before Pages was enabled. A workflow GITHUB_TOKEN cannot itself enable a new Pages site; this requires repository administration permission.

The expected Pages address after a successful deployment is https://phuthanet9870-cpu.github.io/arpg1/. Do not describe it as live until deployment succeeds. Static hosting hides account/Co-op controls; use the server archive for those features.

Direct GitHub download links remain usable even if Pages has not been enabled. The repository files can also be rendered by a static HTML CDN such as raw.githack.com; CDN availability is separate from GitHub Pages.

To update the snapshot: run `npm run release`, copy releases/SUNBOUND.html to web/index.html, then update the ZIP files and review image in web/downloads. Do not put web/downloads inside the server package. Do not commit .local, databases, node_modules or credentials.
