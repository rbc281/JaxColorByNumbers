const CATS=[
{id:"dino",name:"Dinosaurs",emoji:"🦖",desc:"Big, tiny & stompy!"},
{id:"space",name:"Space",emoji:"🚀",desc:"Rockets, planets & stars!"},
{id:"bear",name:"Polar Bears",emoji:"🐻‍❄️",desc:"Snowy bear adventures!"},
{id:"shapes",name:"Special Shapes",emoji:"⭐",desc:"Stars, hearts & surprises!"},
{id:"rainbow",name:"Rainbows",emoji:"🌈",desc:"Bright & happy colors!"}];
const PALETTES={
dino:["#ef3f37","#58d84f","#ffd44a","#2ca8ef","#7b4b2b","#f4d29b","#202532","#a76be8","#ff8b2b"],
space:["#2aaef2","#6e35e8","#ffd33d","#f5f8ff","#ef4b43","#26334c","#55d5ce","#ff8a2c","#9d6be8"],
bear:["#f7fbff","#a8dcf4","#42aee9","#26344d","#b7e9ff","#6fd5e8","#ffd14a","#8a6bd6","#ef7b85"],
shapes:["#ffd43f","#ef4d54","#55cf68","#39aef0","#9b62e6","#ff86bf","#ff932f","#4fd5ca","#f8f8f8"],
rainbow:["#ef4141","#ff932f","#ffd43f","#55cc5d","#39aef0","#6d55df","#c45ee8","#f8f8f8","#ff83bd"]};
const NAMES={
dino:["Baby Long Neck","T-Rex","Dino Egg","Stegosaurus","Triceratops","Pterodactyl","Volcano Dino","Hatching Dino","Dino Skull","Raptor"],
space:["Rocket Ship","Happy Moon","Saturn","Planet Earth","Big Star","Astronaut","Flying Saucer","Comet","Moon Landing","Solar System"],
bear:["Polar Bear","Bear Cub","Snowflake","Bear Face","Iceberg Bear","Bear & Moon","Snowy Family","Arctic Swim","Northern Lights","Polar Adventure"],
shapes:["Super Star","Big Heart","Diamond","Flower","Sunshine","Butterfly","Lucky Clover","Lightning","Crown","Shape Party"],
rainbow:["Little Rainbow","Rainbow Cloud","Sunny Rainbow","Rainbow Heart","Double Rainbow","Rainbow Star","Rainbow Rain","Magic Rainbow","Rainbow Sky","Unicorn Rainbow"]};
const KIND={
dino:["long","trex","egg","stego","face","wing","volcano","egg","skull","trex"],
space:["rocket","moon","saturn","earth","star","person","saucer","comet","rocket","saturn"],
bear:["bear","bear","flake","face","bear","moon","bear","bear","aurora","bear"],
shapes:["star","heart","diamond","flower","sun","butterfly","clover","bolt","crown","party"],
rainbow:["rainbow","rainbow","rainbow","heart","rainbow","star","rainbow","rainbow","rainbow","unicorn"]};
function blank(n){return Array.from({length:n},()=>Array(n).fill(0))}
function set(g,x,y,v){if(g[y]&&x>=0&&x<g.length)g[y][x]=v}
function ellipse(g,cx,cy,rx,ry,v){for(let y=0;y<g.length;y++)for(let x=0;x<g.length;x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)set(g,x,y,v)}
function rect(g,x0,y0,x1,y1,v){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)set(g,x,y,v)}
function line(g,x0,y0,x1,y1,v,t=1){
 x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
 let dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1,e=dx+dy;
 for(;;){for(let yy=-t+1;yy<t;yy++)for(let xx=-t+1;xx<t;xx++)set(g,x0+xx,y0+yy,v);if(x0===x1&&y0===y1)break;let e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}
}
function makeArt(cat,i){
 let d=i<3?0:i<7?1:2,n=[14,18,22][d],g=blank(n),k=KIND[cat][i],m=Math.floor(n/2),c=d===0?3:d===1?6:9;
 const V=z=>1+((z-1)%c);
 if(k==="heart"){for(let y=2;y<n-2;y++)for(let x=1;x<n-1;x++){let X=(x-m)/(n*.38),Y=(y-n*.43)/(n*.34);if((X*X+Y*Y-1)**3-X*X*Y**3<=0)set(g,x,y,V(1+Math.floor(y/3)))}}
 else if(k==="star"){for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++){let dx=Math.abs(x-m),dy=Math.abs(y-m);if((dy<n*.14&&dx<n*.42)||(dx<n*.14&&dy<n*.42)||(dx+dy<n*.48))set(g,x,y,V(1+Math.floor((x+y)/5)))}}
 else if(k==="diamond"){for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++)if(Math.abs(x-m)+Math.abs(y-m)<n*.43)set(g,x,y,V(1+Math.floor(y/4)))}
 else if(k==="sun"){ellipse(g,m,m,n*.34,n*.34,V(3));ellipse(g,m,m,n*.22,n*.22,V(1));for(let a=0;a<8;a++){let q=a*Math.PI/4;line(g,Math.round(m+Math.cos(q)*n*.38),Math.round(m+Math.sin(q)*n*.38),Math.round(m+Math.cos(q)*n*.48),Math.round(m+Math.sin(q)*n*.48),V(2))}}
 else if(k==="flower"){ellipse(g,m,m,n*.12,n*.12,V(3));for(let a=0;a<8;a++){let q=a*Math.PI/4;ellipse(g,m+Math.cos(q)*n*.25,m+Math.sin(q)*n*.25,n*.13,n*.13,V(1+a%Math.max(2,c)))}line(g,m,m+2,m,n-2,V(3),1)}
 else if(k==="butterfly"){ellipse(g,m-n*.2,m,n*.22,n*.32,V(5));ellipse(g,m+n*.2,m,n*.22,n*.32,V(6));rect(g,m-1,4,m+1,n-4,V(4));ellipse(g,m-n*.23,m,n*.08,n*.12,V(2));ellipse(g,m+n*.23,m,n*.08,n*.12,V(2))}
 else if(k==="clover"){ellipse(g,m-n*.14,m-n*.13,n*.18,n*.18,V(3));ellipse(g,m+n*.14,m-n*.13,n*.18,n*.18,V(3));ellipse(g,m,m+n*.13,n*.18,n*.18,V(3));line(g,m,m+2,m+2,n-2,V(2),1)}
 else if(k==="bolt"){for(let y=1;y<n-1;y++){let x=Math.round(m+(y<n*.52?-(y/n)*n*.16:(1-y/n)*n*.25));rect(g,x-2,y,x+2,y,V(3+y%3))}}
 else if(k==="crown"){rect(g,3,Math.floor(n*.42),n-4,Math.floor(n*.72),V(3));for(let x=3;x<n-3;x++)if(x%4<2)line(g,x,Math.floor(n*.42),x+1,Math.floor(n*.23),V(1+x%Math.max(2,c)));rect(g,3,Math.floor(n*.7),n-4,Math.floor(n*.78),V(2))}
 else if(k==="party"){ellipse(g,m,m,n*.38,n*.38,V(4));for(let y=3;y<n-3;y++)for(let x=3;x<n-3;x++)if(g[y][x]&&(x+y)%5===0)set(g,x,y,V(1+x+y))}
 else if(k==="rainbow"){for(let r=0;r<Math.min(c,7);r++)for(let y=2;y<n-2;y++)for(let x=1;x<n-1;x++){let dist=Math.hypot(x-m,y-(n*.72));if(y<n*.72&&dist<n*.48-r&&dist>n*.42-r)set(g,x,y,V(r+1))}ellipse(g,3,n*.7,3,2,V(8));ellipse(g,n-4,n*.7,3,2,V(8))}
 else if(k==="moon"){for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++){let a=(x-m)**2+(y-m)**2<n*n*.15,b=(x-(m+n*.13))**2+(y-(m-n*.04))**2<n*n*.13;if(a&&!b)set(g,x,y,V(3))}}
 else if(k==="rocket"){ellipse(g,m,n*.42,n*.16,n*.3,V(4));line(g,m,2,m,n*.7,V(4),2);rect(g,m-2,Math.floor(n*.35),m+2,Math.floor(n*.55),V(1));line(g,m-3,Math.floor(n*.62),m-6,Math.floor(n*.78),V(5),2);line(g,m+3,Math.floor(n*.62),m+6,Math.floor(n*.78),V(5),2);line(g,m,n*.72,m,n-2,V(3),2)}
 else if(k==="saturn"){ellipse(g,m,m,n*.25,n*.25,V(3));line(g,2,m+3,n-3,m-3,V(5),2);ellipse(g,m,m,n*.17,n*.17,V(2))}
 else if(k==="earth"){ellipse(g,m,m,n*.36,n*.36,V(1));ellipse(g,m-n*.1,m-n*.08,n*.14,n*.18,V(3));ellipse(g,m+n*.13,m+n*.13,n*.13,n*.1,V(3))}
 else if(k==="saucer"){ellipse(g,m,m,n*.38,n*.13,V(4));ellipse(g,m,m-n*.08,n*.18,n*.15,V(7));rect(g,m-2,m+2,m+2,m+4,V(3))}
 else if(k==="comet"){ellipse(g,n*.66,n*.36,n*.16,n*.16,V(3));for(let q=0;q<4;q++)line(g,n*.55,n*.45-q,n*.12,n*.8-q*2,V(2+q),1)}
 else if(k==="person"){ellipse(g,m,n*.3,n*.15,n*.15,V(4));rect(g,m-3,Math.floor(n*.43),m+3,Math.floor(n*.7),V(4));rect(g,m-2,Math.floor(n*.31),m+2,Math.floor(n*.39),V(1));line(g,m-2,n*.68,m-4,n-2,V(5),2);line(g,m+2,n*.68,m+4,n-2,V(5),2)}
 else if(k==="flake"){for(let a=0;a<6;a++){let q=a*Math.PI/3;line(g,m,m,Math.round(m+Math.cos(q)*n*.4),Math.round(m+Math.sin(q)*n*.4),V(2+a%3),1)}}
 else if(k==="aurora"){for(let x=1;x<n-1;x++){let y=Math.round(n*.28+Math.sin(x*.7)*2);line(g,x,y,x,Math.min(n-2,y+4),V(3+x%Math.max(2,c)),1)}rect(g,1,Math.floor(n*.72),n-2,n-2,V(1));}
 else if(k==="bear"||k==="face"){ellipse(g,m,m,n*.3,n*.32,V(1));ellipse(g,m-n*.24,m-n*.25,n*.1,n*.1,V(2));ellipse(g,m+n*.24,m-n*.25,n*.1,n*.1,V(2));ellipse(g,m,m+n*.08,n*.13,n*.1,V(5));set(g,m-2,m-2,V(4));set(g,m+2,m-2,V(4));if(k==="bear"){ellipse(g,m,n*.68,n*.32,n*.22,V(1));line(g,m-n*.18,n*.73,m-n*.24,n-2,V(3),2);line(g,m+n*.18,n*.73,m+n*.24,n-2,V(3),2)}}
 else if(k==="egg"){ellipse(g,m,m,n*.27,n*.39,V(6));for(let y=3;y<n-3;y++)for(let x=3;x<n-3;x++)if(g[y][x]&&(x+y)%6===0)set(g,x,y,V(2+x%Math.max(2,c)))}
 else if(k==="volcano"){for(let y=Math.floor(n*.3);y<n-2;y++){let half=Math.floor((y-n*.3)*.45)+2;rect(g,m-half,y,m+half,y,V(5+y%3))}line(g,m,n*.3,m-3,1,V(1),2);line(g,m,n*.3,m+3,1,V(1),2)}
 else if(k==="wing"){ellipse(g,m,m,n*.34,n*.12,V(1));line(g,2,m+3,n-3,m-4,V(3),2);ellipse(g,m,m,n*.08,n*.09,V(5))}
 else if(k==="skull"){ellipse(g,m,n*.4,n*.3,n*.27,V(6));rect(g,m-4,Math.floor(n*.52),m+4,Math.floor(n*.72),V(6));ellipse(g,m-n*.12,n*.38,n*.07,n*.08,V(7));ellipse(g,m+n*.12,n*.38,n*.07,n*.08,V(7));for(let x=m-3;x<=m+3;x+=2)rect(g,x,Math.floor(n*.64),x,Math.floor(n*.73),V(7))}
 else { // dinosaurs
   ellipse(g,m-1,Math.floor(n*.58),n*.3,n*.17,V(1));ellipse(g,Math.floor(n*.7),Math.floor(n*.4),n*.18,n*.15,V(1));line(g,Math.floor(n*.28),Math.floor(n*.58),2,Math.floor(n*.45),V(1),2);line(g,m-3,Math.floor(n*.68),m-4,n-2,V(5),2);line(g,m+3,Math.floor(n*.68),m+4,n-2,V(5),2);
   if(k==="long")line(g,Math.floor(n*.63),Math.floor(n*.5),Math.floor(n*.72),2,V(2),2);
   if(k==="stego")for(let x=4;x<n-5;x+=3)line(g,x,Math.floor(n*.45),x+1,Math.floor(n*.3),V(3),2);
 }
 if(d>0){for(let x=1;x<n-1;x++)if(!g[n-2][x])set(g,x,n-2,V(3));}
 if(d===2){for(let y=1;y<n-3;y++)for(let x=1;x<n-1;x++)if(!g[y][x]&&(x*7+y*11+i)%29===0)set(g,x,y,V(4+(x+y)%5));}
 return {grid:g,colors:PALETTES[cat].slice(0,c),difficulty:["Easy","Medium","Hard"][d]};
}
const LEVELS=CATS.flatMap(c=>Array.from({length:10},(_,i)=>{let a=makeArt(c.id,i);return{id:c.id+"-"+(i+1),cat:c.id,title:NAMES[c.id][i],emoji:c.emoji,...a}}));
const store=JSON.parse(localStorage.getItem("jax-colors")||"{}");store.done=store.done||{};store.settings=Object.assign({sound:true,auto:true},store.settings||{});
let currentCat=null,current=null,selected=1,filled={},zoom=1,drawing=false,gateAnswer=11;const $=s=>document.querySelector(s);
function save(){localStorage.setItem("jax-colors",JSON.stringify(store))}function screen(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active");scrollTo(0,0)}
function preview(l){let s=2,g=l.grid;return '<div class="mini-art" style="grid-template-columns:repeat('+g.length+','+s+'px)">'+g.flat().map(n=>'<i style="width:'+s+'px;height:'+s+'px;background:'+(n?l.colors[n-1]:'#12274b')+'"></i>').join("")+"</div>"}
function renderHome(){$("#home-progress").textContent=Object.keys(store.done).length;$("#category-grid").innerHTML=CATS.map(c=>{let done=LEVELS.filter(l=>l.cat===c.id&&store.done[l.id]).length,l=LEVELS.find(x=>x.cat===c.id);return '<button class="category-card" data-cat="'+c.id+'"><span class="category-count">'+done+'/10 ⭐</span>'+preview(l)+'<span class="category-emoji">'+c.emoji+'</span><h3>'+c.name+'</h3><p>'+c.desc+'</p></button>'}).join("");document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>openCat(b.dataset.cat))}
function openCat(id){currentCat=id;let c=CATS.find(x=>x.id===id);$("#category-title").textContent=c.emoji+" "+c.name;$("#category-subtitle").textContent="Easy → Medium → Hard";$("#level-grid").innerHTML=LEVELS.filter(l=>l.cat===id).map((l,i)=>'<button class="level-card" data-level="'+l.id+'">'+(store.done[l.id]?'<span class="done-badge">✓</span>':'')+preview(l)+'<h3>'+l.title+'</h3><p>'+l.difficulty+' · '+l.colors.length+' colors</p></button>').join("");document.querySelectorAll("[data-level]").forEach(b=>b.onclick=()=>openLevel(b.dataset.level));screen("levels-screen")}
function openLevel(id){current=LEVELS.find(x=>x.id===id);filled={};selected=1;zoom=1;$("#zoom-reset").textContent="100%";$("#level-title").textContent=current.title+" · "+current.difficulty;renderGame();screen("game-screen")}
function renderGame(){const g=current.grid,w=g[0].length;$("#color-canvas").style.gridTemplateColumns="repeat("+w+",auto)";$("#color-canvas").innerHTML=g.flatMap((row,y)=>row.map((n,x)=>n?'<div class="pixel '+(filled[y+"-"+x]?"filled":"")+'" data-x="'+x+'" data-y="'+y+'" data-n="'+n+'" style="'+(filled[y+"-"+x]?"background:"+current.colors[n-1]:"")+'">'+(filled[y+"-"+x]?"":n)+'</div>':'<div class="pixel blank"></div>')).join("");let used=[...new Set(g.flat().filter(Boolean))];$("#palette").innerHTML=used.map(n=>'<button class="color-button '+(n===selected?"selected ":"")+(colorDone(n)?"complete":"")+'" data-color="'+n+'" style="background:'+current.colors[n-1]+'">'+(colorDone(n)?"✓":n)+"</button>").join("");document.querySelectorAll("[data-color]").forEach(b=>b.onclick=()=>{selected=+b.dataset.color;renderGame()});document.querySelectorAll(".pixel[data-n]").forEach(p=>{p.onpointerdown=e=>{drawing=true;paint(p,e)};p.onpointerenter=e=>{if(drawing)paint(p,e)}});document.onpointerup=()=>drawing=false;updateProgress()}
function paint(p,e){let n=+p.dataset.n;if(n!==selected||p.classList.contains("filled"))return;filled[p.dataset.y+"-"+p.dataset.x]=true;if(colorDone(n)&&store.settings.auto){let nums=[...new Set(current.grid.flat().filter(Boolean))];selected=nums.find(v=>!colorDone(v))||selected}renderGame();if(isComplete())finish()}
function colorDone(n){return current&&current.grid.every((row,y)=>row.every((v,x)=>v!==n||filled[y+"-"+x]))}function isComplete(){return current.grid.every((row,y)=>row.every((v,x)=>!v||filled[y+"-"+x]))}function updateProgress(){let total=current.grid.flat().filter(Boolean).length,done=Object.keys(filled).length;$("#level-progress-bar").style.width=(done/total*100)+"%"}
function finish(){const praise=["Doing great!","Keep going!","Awesome job!","You did it!","Nice work!","Way to go!","Great coloring!"];$("#praise-message").textContent=praise[Math.floor(Math.random()*praise.length)];store.done[current.id]=true;save();renderHome();$("#celebration").classList.remove("hidden");let layer=$("#confetti-layer");layer.innerHTML="";for(let i=0;i<28;i++){let s=document.createElement("span");s.className="confetti";s.textContent=["⭐","🎉","✨","🌈"][i%4];s.style.left=Math.random()*100+"%";s.style.animationDelay=Math.random()*.7+"s";layer.appendChild(s)}if(store.settings.sound)beep()}
function beep(){try{let a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=660;g.gain.setValueAtTime(.08,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.35);o.start();o.stop(a.currentTime+.35)}catch(e){}}
function nextLevel(){let list=LEVELS.filter(l=>l.cat===current.cat),i=list.findIndex(l=>l.id===current.id);$("#celebration").classList.add("hidden");openLevel(list[(i+1)%list.length].id)}
document.addEventListener("click",e=>{let b=e.target.closest("[data-back]");if(!b)return;if(b.dataset.back==="home"){renderHome();screen("home-screen")}else openCat(currentCat)});
$("#replay-button").onclick=()=>{$("#celebration").classList.add("hidden");openLevel(current.id)};$("#reset-level").onclick=()=>{if(Object.keys(filled).length&&confirm("Start this picture over?")){filled={};selected=1;renderGame()}};$("#next-button").onclick=nextLevel;
$("#hint-button").onclick=()=>{let p=[...document.querySelectorAll('.pixel[data-n="'+selected+'"]')].find(x=>!x.classList.contains("filled"));if(p){p.classList.add("hint");p.scrollIntoView({behavior:"smooth",block:"center",inline:"center"});setTimeout(()=>p.classList.remove("hint"),1400)}};
function setZoom(z){zoom=Math.max(.65,Math.min(1.75,z));$("#color-canvas").style.transform="scale("+zoom+")";$("#zoom-reset").textContent=Math.round(zoom*100)+"%"}$("#zoom-in").onclick=()=>setZoom(zoom+.25);$("#zoom-out").onclick=()=>setZoom(zoom-.25);$("#zoom-reset").onclick=()=>setZoom(1);
function newGate(){let a=4+Math.floor(Math.random()*6),b=3+Math.floor(Math.random()*7);gateAnswer=a+b;$("#gate-question").textContent="What is "+a+" + "+b+"?";$("#gate-answer").value=""}
$("#parent-button").onclick=()=>{newGate();$("#parent-gate").classList.remove("hidden");$("#parent-settings").classList.add("hidden");$("#parent-modal").classList.remove("hidden")};$("#close-parent").onclick=()=>$("#parent-modal").classList.add("hidden");$("#gate-submit").onclick=()=>{if(+$("#gate-answer").value===gateAnswer){$("#parent-gate").classList.add("hidden");$("#parent-settings").classList.remove("hidden");$("#sound-toggle").checked=store.settings.sound;$("#auto-toggle").checked=store.settings.auto}else $("#gate-answer").value=""};$("#sound-toggle").onchange=e=>{store.settings.sound=e.target.checked;save()};$("#auto-toggle").onchange=e=>{store.settings.auto=e.target.checked;save()};$("#reset-progress").onclick=()=>{if(confirm("Reset all finished pictures?")){store.done={};save();renderHome();$("#parent-modal").classList.add("hidden")}};
renderHome();if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js"));
