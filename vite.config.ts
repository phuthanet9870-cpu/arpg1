import {defineConfig} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';
import {readdirSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
export default defineConfig({
 base:'./',
 plugins:[{
  name:'embedded-game-assets',
  resolveId(id){if(id==='virtual:game-assets')return '\0game-assets'},
  load(id){if(id!=='\0game-assets')return;const folder=resolve('public/assets');const assets=Object.fromEntries(readdirSync(folder).filter(f=>f.endsWith('.png')).map(f=>[f.slice(0,-4),'data:image/png;base64,'+readFileSync(resolve(folder,f)).toString('base64')]));return 'export default '+JSON.stringify(assets);}
 },viteSingleFile()],
 build:{copyPublicDir:false,assetsInlineLimit:10000000,chunkSizeWarningLimit:6000}
});
