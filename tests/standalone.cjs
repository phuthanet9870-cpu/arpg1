const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});try{
 const context=await browser.newContext({offline:true,viewport:{width:1366,height:768}});const page=await context.newPage();const errors=[],network=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url())});
 await page.setContent(fs.readFileSync(path.resolve(process.env.GAME_FILE||'dist/index.html'),'utf8'),{waitUntil:'load'});await page.waitForSelector('#solo');assert.equal(await page.locator('#create').isVisible(),false);await page.click('#solo');await page.waitForFunction(()=>window.sunbound?.player);assert.equal(await page.evaluate(()=>window.sunbound.state.zone),0);
 await page.keyboard.press('m');await page.click('[data-travel="1"]');await page.waitForFunction(()=>window.sunbound.state.zone===1);const before=await page.evaluate(()=>window.sunbound.player.y);await page.keyboard.down('w');await page.waitForTimeout(1000);await page.keyboard.up('w');assert.ok(await page.evaluate(()=>window.sunbound.player.y)<before);await page.keyboard.press('Digit2');await page.waitForFunction(()=>window.sunbound.player.mp<sunbound.player.maxMp);await page.keyboard.press('i');await page.waitForSelector('.modal');await page.keyboard.press('Escape');
 fs.mkdirSync('.artifacts',{recursive:true});await page.screenshot({path:'.artifacts/html5-offline.png'});assert.deepEqual(errors,[]);assert.deepEqual(network,[]);console.log('PASS: exported HTML5 boots inline with browser network disabled, embedded assets load, movement, combat, inventory; zero HTTP requests and zero JS errors');
 }finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
