from PIL import Image,ImageDraw,ImageFilter
from pathlib import Path
import json,shutil,hashlib
raw=Path('assets-source/ui-icons.png')
if not raw.exists():
 raw.parent.mkdir(exist_ok=True);shutil.copyfile('/workspace/generated_images/exec-e76a2c73-fc42-49ef-b94d-27633badfab3.png',raw)
im=Image.open(raw).convert('RGBA');a=im.getchannel('A');binary=a.point(lambda v:255 if v>=48 else 0);pix=binary.load();seen=set();groups=[[] for _ in range(25)]
for y in range(im.height):
 for x in range(im.width):
  if not pix[x,y] or (x,y) in seen:continue
  stack=[(x,y)];seen.add((x,y));component=[]
  while stack:
   u,v=stack.pop();component.append((u,v))
   for q,t in [(u-1,v),(u+1,v),(u,v-1),(u,v+1)]:
    if 0<=q<im.width and 0<=t<im.height and pix[q,t] and (q,t) not in seen:seen.add((q,t));stack.append((q,t))
  if len(component)<100:continue
  cx=sum(p[0] for p in component)/len(component);cy=sum(p[1] for p in component)/len(component);col=min(4,int(cx/im.width*5));row=min(4,int(cy/im.height*5));groups[row*5+col].append(component)
names=['hero','bag','gem','passives','forge','card','quests','dungeon','world','friends','guild','party','settings','triggers','gm','account','stash','hotbar','weapon','potion','material','junk','ring','charm','armor'];rows=[];review=Image.new('RGB',(800,850),'#fff9eb');draw=ImageDraw.Draw(review)
for i,name in enumerate(names):
 assert groups[i],name
 largest=max(len(c) for c in groups[i]);mask=Image.new('L',im.size,0);kp=mask.load()
 for component in groups[i]:
  if len(component)<max(100,largest*.1):continue
  for u,v in component:kp[u,v]=255
 mask=mask.filter(ImageFilter.MaxFilter(3));outsource=im.copy();outsource.putalpha(Image.composite(a,Image.new('L',im.size,0),mask));bbox=outsource.getbbox();assert bbox,name
 cropped=outsource.crop(bbox);cropped.thumbnail((108,108),Image.Resampling.LANCZOS);out=Image.new('RGBA',(128,128));out.alpha_composite(cropped,((128-cropped.width)//2,(128-cropped.height)//2));ob=out.getbbox();assert min(ob[0],ob[1],128-ob[2],128-ob[3])>=8
 col,row=i%5,i//5;bounds=(round(col*im.width/5),round(row*im.height/5),round((col+1)*im.width/5),round((row+1)*im.height/5));crossed=bbox[0]<bounds[0] or bbox[1]<bounds[1] or bbox[2]>bounds[2] or bbox[3]>bounds[3]
 path=Path('public/assets/ui-painted-'+name+'.png');out.save(path,optimize=True);rows.append({'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'name':name,'source_bbox':bbox,'bounds':ob,'recovered_cross_cell':crossed});review.paste(out,(col*160+16,row*170+6),out);draw.text((col*160+8,row*170+143),name,fill='#765323')
review.save('.artifacts/UI-ICON-CHECK.png');Path('.artifacts/ui-icon-audit.json').write_text(json.dumps(rows,indent=2));Path('assets-source/ui-icon-audit.json').write_text(json.dumps(rows,indent=2));print(json.dumps({'icons':25,'normalized_clipped':0,'recovered_cross_cell':[r['name'] for r in rows if r['recovered_cross_cell']]}))
