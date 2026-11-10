"""Extract complete row components, including weapons crossing nominal grid cells.
Produces fixed 160px frames, an audit JSON, and an annotated review board.
"""
from PIL import Image,ImageDraw
from pathlib import Path
import json,statistics,hashlib
SOURCES={'knight':'exec-47dd279c-3cae-436b-8eee-f23fa46a8bce.png','mage':'exec-3a463b88-3db6-4c7c-8ae0-b7bf648816d9.png','ranger':'exec-a6d8699f-4cd1-4ee2-b507-577c7f2e2344.png','priest':'exec-724620bc-3c13-4248-8598-ef0e295aeba4.png','summoner':'exec-9db32987-be0f-482f-b411-da3a96bada13.png','monk':'exec-d1682add-ce13-40cc-ad17-dc420a4458bf.png'}
FRAME=160;ANCHOR=(80,150);report={};boards=[]
for name,filename in SOURCES.items():
 im=Image.open(Path(__file__).resolve().parents[1]/'assets-source'/'characters'/(name+'.png')).convert('RGBA');w,h=im.size;poses=[];crossings=[]
 for row in range(4):
  img=im.crop((0,round(row*h/4),w,round((row+1)*h/4)));mask=img.getchannel('A').point(lambda a:255 if a>=110 else 0);px=mask.load();seen=set();components=[]
  for y in range(mask.height):
   for x in range(w):
    if (x,y) in seen or not px[x,y]:continue
    stack=[(x,y)];seen.add((x,y));co=[]
    while stack:
     a,b=stack.pop();co.append((a,b))
     for nx,ny in [(a+1,b),(a-1,b),(a,b+1),(a,b-1)]:
      if 0<=nx<w and 0<=ny<mask.height and (nx,ny) not in seen and px[nx,ny]:seen.add((nx,ny));stack.append((nx,ny))
    if len(co)>80:components.append(co)
  main=sorted(sorted(components,key=len,reverse=True)[:4],key=lambda co:sum(x for x,y in co)/len(co))
  assert len(main)==4,(name,row,len(main))
  for col,co in enumerate(main):
   own=Image.new('L',img.size);op=own.load()
   for x,y in co:op[x,y]=255
   box=own.getbbox();crossed=box[0]<round(col*w/4) or box[2]>round((col+1)*w/4)
   rgba=img.copy();rgba.putalpha(own);cropped=rgba.crop(box);poses.append((cropped,box,row,col));
   if crossed:crossings.append(row*4+col)
 scale=76/statistics.median(p[0].height for p in poses[::4]);atlas=Image.new('RGBA',(FRAME*4,FRAME*4));entries=[]
 for cropped,box,row,col in poses:
  band=cropped.getchannel('A').crop((0,0,cropped.width,max(1,round(cropped.height*.32))));den=[sum(band.crop((x,0,x+1,band.height)).getdata())/255 for x in range(band.width)];window=max(12,round(cropped.height*.22));scores=[sum(den[max(0,x-window//2):min(len(den),x+window//2)]) for x in range(cropped.width)];peak=max(scores);heads=[x for x,v in enumerate(scores) if v>peak*.94];head=sum(heads)/len(heads)
  sized=cropped.resize((round(cropped.width*scale),round(cropped.height*scale)),Image.Resampling.NEAREST);x=round(ANCHOR[0]-head*scale);y=ANCHOR[1]-sized.height;assert x>=2 and x+sized.width<=FRAME-2 and y>=2,(name,row,col,x,y,sized.size)
  atlas.alpha_composite(sized,(col*FRAME+x,row*FRAME+y));entries.append({'frame':row*4+col,'source_box':box,'bounds':[x,y,x+sized.width,y+sized.height],'clipped':False,'column_crossing_recovered':row*4+col in crossings})
 atlas.save('public/assets/'+name+'-motion.png')
 # Use the audited complete idle silhouette for menus, removing sheet-neighbour debris.
 portrait=poses[0][0].copy();portrait.thumbnail((160,220),Image.Resampling.NEAREST);out=Image.new('RGBA',(176,232));out.alpha_composite(portrait,((176-portrait.width)//2,228-portrait.height));out.save('public/assets/'+name+'.png')
 board=Image.new('RGBA',(640,680),'#172e38');board.alpha_composite(atlas,(0,32));draw=ImageDraw.Draw(board);draw.text((10,9),name.upper()+' | 16 FRAMES | EDGES OK | recovered '+str(crossings),fill='#ebd2a0')
 for i in range(16):
  xx=(i%4)*160;yy=32+(i//4)*160;draw.rectangle((xx,yy,xx+159,yy+159),outline='#546f6d');draw.line((xx+72,yy+150,xx+88,yy+150),fill='#78d6c8');draw.text((xx+4,yy+4),['S','E','N','W'][i//4]+' '+['IDLE','WALK-A','WALK-B','ATTACK'][i%4],fill='#a7c6b2')
 boards.append(board);report[name]={'frames':entries,'recovered':crossings,'frame_size':160,'anchor':ANCHOR,'shared_scale':scale,'source_sha256':hashlib.sha256((Path('assets-source/characters')/(name+'.png')).read_bytes()).hexdigest(),'atlas_sha256':hashlib.sha256(Path('public/assets/'+name+'-motion.png').read_bytes()).hexdigest()}
Path('.artifacts').mkdir(exist_ok=True);review=Image.new('RGB',(1920,1360),'#122a35')
for i,b in enumerate(boards):review.paste(b,((i%3)*640,(i//3)*680))
review.save('.artifacts/SPRITE-CHECK.png');Path('.artifacts/sprite-audit.json').write_text(json.dumps(report,indent=2));Path('assets-source/sprite-audit.json').write_text(json.dumps(report,indent=2));print(json.dumps({n:{'frames':16,'recovered':r['recovered'],'clipped':0} for n,r in report.items()}))
