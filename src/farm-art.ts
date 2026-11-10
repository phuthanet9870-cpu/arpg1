import Phaser from 'phaser';
/** Hand-built pixel silhouettes, one for each of the twenty farm species. */
export function makeFarmMonsters(scene:Phaser.Scene){
 const colors=['#74b8d0','#e1c363','#b09982','#d8a58d','#b9d4dc','#9baacb','#9bd5e0','#c2acd8','#a38972','#da9a68','#777998','#b3a18a','#8baaa0','#9bbc79','#ac9ada','#93ae79','#c5a8d4','#b8c7df','#9aa7d7','#e0c17b'];
 for(let i=0;i<20;i++){const key='farm-monster-'+i;if(scene.textures.exists(key))continue;const cv=document.createElement('canvas');cv.width=64;cv.height=64;const c=cv.getContext('2d')!;const box=(x:number,y:number,w:number,h:number,col=colors[i])=>{c.fillStyle=col;c.fillRect(x,y,w,h)};const eye=(x:number,y:number)=>{box(x,y,5,6,'#fff4d4');box(x+2,y+2,3,4,'#283847')};
 // Distinct silhouettes: jelly, bee, mole, crab, deer, wolf, beetle, harpy,
 // ash hound, salamander, rock golem, automaton, root crab, frog, mushroom,
 // treant, scorpion, sky bird, astral robot, solar guardian.
 if(i===0){box(15,26,34,25);box(20,18,24,10);box(10,38,44,14);box(23,21,7,7,'#c6f4ec')}
 if(i===1){box(11,15,17,19,'#d5e9e5');box(36,15,17,19,'#d5e9e5');box(20,28,26,22);box(28,28,6,22,'#60504b');box(39,32,6,16,'#60504b');box(14,29,10,14);box(46,33,9,5,'#f3d5a3')}
 if(i===2){box(16,28,34,25);box(23,16,25,20);box(10,44,13,10,'#cebd9c');box(43,44,13,10,'#cebd9c');box(40,34,15,8,'#e0bb9b')}
 if(i===3||i===12){box(16,29,32,20);for(const x of [7,48]){box(x,17,9,16);box(x-3,12,15,9);box(x-2,46,10,7)}box(22,21,5,11);box(38,21,5,11);if(i===12){box(18,15,4,12,'#699466');box(39,11,5,17,'#699466')}}
 if(i===4){box(18,29,31,18);box(38,20,14,19);for(const x of [19,39])box(x,45,6,12);for(const x of [39,49]){box(x,6,3,17,'#e8e3bf');box(x-5,9,6,3,'#e8e3bf')}box(11,26,10,6)}
 if(i===5||i===8){box(15,30,35,18);box(39,22,17,18);box(39,14,6,12);box(50,16,5,10);box(12,23,8,16);for(const x of [17,39])box(x,45,7,12);if(i===8){for(const x of [20,27,34])box(x,20-(x%3)*3,5,16,'#e9bc7b')}}
 if(i===6){box(19,19,27,31);box(25,15,15,11,'#d1f3f3');for(let y=25;y<50;y+=9){box(10,y,11,4);box(44,y,11,4)}box(29,24,3,26,'#597993')}
 if(i===7||i===17){box(25,26,16,25);box(25,16,18,17);box(13,25,14,8);box(4,19,15,9);box(39,24,15,8);box(49,16,11,10);box(35,28,13,5,'#e5bf7b');box(27,50,5,9,'#dcbb85');box(36,49,5,10,'#dcbb85')}
 if(i===9){box(17,29,34,15);box(41,22,17,18);box(7,33,13,7);box(3,28,8,9);for(const x of [20,40]){box(x,41,7,10);box(x-3,48,12,4)}for(let x=20;x<44;x+=8)box(x,24,4,8,'#edcf83')}
 if(i===10||i===11||i===18||i===19){box(20,24,26,25);box(25,12,17,16);box(10,28,11,24);box(46,28,10,24);box(21,47,10,12);box(36,47,10,12);box(28,30,11,12,i===19?'#fff1a6':'#9de8e2');if(i===10){box(6,24,18,17);box(43,24,17,17)}if(i===19){box(17,7,34,4,'#e5c16b');box(17,2,4,7,'#e5c16b');box(46,2,4,7,'#e5c16b')}if(i===18){box(6,14,4,14,'#beeaf9');box(53,14,4,14,'#beeaf9')}}
 if(i===13){box(16,29,35,23);box(11,42,13,13);box(44,42,13,13);box(19,18,11,15);box(37,18,11,15);eye(21,20);eye(39,20);box(25,45,17,3,'#526c5b')}
 if(i===14){box(25,33,15,23,'#e1d6ae');box(14,20,37,19);box(20,14,25,9);box(8,32,49,9);box(20,24,6,6,'#bff2d0');box(38,21,7,7,'#bff2d0')}
 if(i===15){box(23,24,20,32);box(17,16,33,18);box(10,27,12,20);box(45,23,12,20);box(6,14,19,16);box(40,8,18,17);box(21,7,26,17);box(17,52,11,7,'#6f865e');box(39,52,11,7,'#6f865e')}
 if(i===16){box(20,29,27,20);box(8,23,13,13);box(44,20,13,13);box(4,14,10,13);box(50,12,10,12);box(36,45,6,11);box(41,51,13,5);box(51,42,5,12);box(47,36,9,8);for(const x of [16,47])for(let y=36;y<52;y+=8)box(x,y,7,3)}
 if(i!==13){eye(i===4||i===5||i===9?40:24, i===14?42:i===0?35:31);if(![4,5,9].includes(i))eye(36,i===14?42:i===0?35:31)}
 scene.textures.addCanvas(key,cv);
 const boss=document.createElement('canvas');boss.width=96;boss.height=96;const bc=boss.getContext('2d')!;bc.imageSmoothingEnabled=false;bc.fillStyle=['#f0d99c','#d1eef2','#f0c190','#b3dfb3','#d7caf0'][Math.floor(i/4)];
 const rect=(x:number,y:number,w:number,h:number)=>bc.fillRect(x,y,w,h);
 // Crown, extended silhouette and island ornaments keep elites readable.
 for(let j=0;j<5;j++){rect(19+j*12,8+(j%2)*5,8,10);rect(18+j*12,16,10,4)}
 bc.strokeStyle=bc.fillStyle;bc.lineWidth=2;bc.beginPath();bc.ellipse(48,75,41,13,0,0,Math.PI*2);bc.stroke();
 if(i<4){rect(5,33,12,18);rect(79,33,12,18);}else if(i<8){for(let j=0;j<3;j++){rect(8+j*7,20+j*4,4,25);rect(84-j*7,20+j*4,4,25)}}else if(i<12){rect(5,45,16,23);rect(75,45,16,23);}else if(i<16){for(let j=0;j<4;j++){rect(7+j*4,24+j*5,5,18);rect(84-j*4,24+j*5,5,18)}}else{rect(4,38,12,4);rect(9,33,3,14);rect(80,38,12,4);rect(85,33,3,14)}
 bc.drawImage(cv,8,10,80,80);bc.fillStyle='#fff0b6';rect(42,4,12,5);bc.fillStyle=colors[i];rect(46,5,4,4);scene.textures.addCanvas('farm-boss-'+i,boss);
 }
}
