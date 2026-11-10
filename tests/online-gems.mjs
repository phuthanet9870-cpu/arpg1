import {io} from 'socket.io-client';import assert from 'node:assert/strict';
const base=process.env.BASE_URL||'http://127.0.0.1:3008',a=io(base),b=io(base);
const connect=s=>new Promise((resolve,reject)=>{s.once('connect',resolve);s.once('connect_error',reject)});
const join=(s,data)=>new Promise((resolve,reject)=>s.timeout(5000).emit('join',data,(err,res)=>err?reject(err):res.error?reject(Error(res.error)):resolve(res)));
const wait=(s,pred)=>new Promise((resolve,reject)=>{const cb=state=>{if(pred(state)){clearTimeout(timer);s.off('state',cb);resolve(state)}};const timer=setTimeout(()=>{s.off('state',cb);reject(Error('state timeout'))},7000);s.on('state',cb)});
try{await Promise.all([connect(a),connect(b)]);const host=await join(a,{create:true,classId:'mage'});await join(b,{code:host.code,classId:'knight'});let state=await wait(b,s=>s.players[host.id]?.gemMode);assert.equal(state.players[host.id].hotbar.length,20);
let ready=wait(b,s=>s.players[host.id].gemLevels['staff-4']===1);a.emit('action',{type:'engrave',id:'staff-4',tier:1});await ready;
ready=wait(b,s=>s.players[host.id].gemSupports['staff-4']?.includes('expanse'));a.emit('action',{type:'linksupport',gem:'staff-4',support:'expanse'});await ready;
ready=wait(b,s=>s.players[host.id].hotbar[19]==='gem:staff-4');a.emit('action',{type:'bindbar',slot:19,binding:'gem:staff-4'});await ready;
ready=wait(b,s=>s.zone===1);a.emit('action',{type:'travel',zone:1});await ready;
ready=wait(b,s=>s.players[host.id].gemCooldowns['staff-4']>s.time);a.emit('action',{type:'usebar',slot:19,x:960,y:900});state=await ready;assert.ok(state.fields.some(f=>f.owner===host.id&&f.radius>130));
ready=wait(b,s=>s.players[host.id].spiritReserved===30);a.emit('action',{type:'usebar',slot:4,x:960,y:900});await ready;
ready=wait(b,s=>s.players[host.id].gemError.includes('แกะสลัก'));a.emit('action',{type:'cast',slot:4,x:960,y:900});await ready;
console.log('PASS authoritative two-client gem engraving, support links, 20-slot binding, real supported field, Spirit reservation and retired-skill rejection');
}finally{a.disconnect();b.disconnect()}
