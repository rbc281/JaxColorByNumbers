const CATS=[
{id:"dino",name:"Dinosaurs",emoji:"🦖",desc:"Big, tiny & stompy!",color:"#dff7d9"},
{id:"space",name:"Space",emoji:"🚀",desc:"Rockets, planets & stars!",color:"#e4e5ff"},
{id:"bear",name:"Polar Bears",emoji:"🐻‍❄️",desc:"Snowy bear adventures!",color:"#e2f6ff"},
{id:"shapes",name:"Special Shapes",emoji:"⭐",desc:"Hearts, stars & surprises!",color:"#fff0c9"},
{id:"rainbow",name:"Rainbows",emoji:"🌈",desc:"Bright & happy colors!",color:"#ffe1ef"}];
const COLORS=["#ff6b6b","#ffd45b","#62ce78","#55aef5","#a979e8","#ff91c8","#ff9855","#73d7d1"];
const SHAPES={
dino:["🦖","🦕","🥚","🦖","🦕","🌋","🦖","🥚","🦕","🦖"],
space:["🚀","🪐","🌎","🌙","⭐","👨‍🚀","🛸","☄️","🚀","🪐"],
bear:["🐻‍❄️","❄️","🐻‍❄️","🧊","🐾","🐻‍❄️","⛄","🐻‍❄️","❄️","🐾"],
shapes:["⭐","❤️","💎","🌸","☀️","🦋","🍀","⚡","🎈","👑"],
rainbow:["🌈","☁️","🌈","☀️","🌈","💧","🌈","⭐","🌈","🦄"]};
const NAMES={
dino:["T-Rex","Brontosaurus","Dino Egg","Stegosaurus","Long Neck","Volcano Dino","Triceratops","Hatching Egg","Baby Dino","Dino Friend"],
space:["Rocket Ship","Saturn","Planet Earth","Moon","Big Star","Astronaut","Flying Saucer","Comet","Moon Rocket","Ringed Planet"],
bear:["Polar Bear","Snowflake","Bear Cub","Iceberg","Bear Paw","Happy Bear","Snow Friend","Swimming Bear","Arctic Snow","Polar Tracks"],
shapes:["Super Star","Big Heart","Diamond","Flower","Sunshine","Butterfly","Lucky Clover","Lightning","Balloon","Crown"],
rainbow:["Happy Rainbow","Cloud Rainbow","Double Rainbow","Sunny Rainbow","Little Rainbow","Rainy Rainbow","Big Rainbow","Star Rainbow","Magic Rainbow","Unicorn Rainbow"]};
function makePattern(seed){
 const w=12,h=12,g=Array.from({length:h},()=>Array(w).fill(0));
 const type=seed%5;
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
   let on=false;
   if(type===0) on=((x-5.5)**2+(y-5.5)**2<22)&&!(y<3&&Math.abs(x-5.5)>2);
   if(type===1) on=(Math.abs(x-5.5)+Math.abs(y-5.5)<7)||(y>6&&x>2&&x<9);
   if(type===2) on=(y>1&&y<9&&x>1&&x<10&&((x+y+seed)%3!==0))||(y>=8&&Math.abs(x-5.5)<2);
   if(type===3) on=(Math.abs(x-5.5)<(y<6?y:11-y)*.8+1);
   if(type===4) on=((x-5.5)**2+(y-5.5)**2<18)||(x>7&&y>6);
   if(on) g[y][x]=1+((x*3+y*5+seed)%Math.min(6,3+(seed%4)));
 }
 return g;
}
const LEVELS=CATS.flatMap((c,ci)=>Array.from({length:10},(_,i)=>({id:c.id+"-"+(i+1),cat:c.id,title:NAMES[c.id][i],emoji:SHAPES[c.id][i],grid:makePattern(ci*17+i),colors:COLORS.slice(0,3+(i%4))})));
const store=JSON.parse(localStorage.getItem("jax-colors")||"{}");
store.done=store.done||{};store.settings=Object.assign({sound:true,auto:true},store.settings||{});
let currentCat=null,current=null,selected=1,filled={},zoom=1,drawing=false,gateAnswer=11;
const $=s=>document.querySelector(s);
function save(){localStorage.setItem("jax-colors",JSON.stringify(store))}
function screen(id){document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active");scrollTo(0,0)}
function renderHome(){
 $("#home-progress").textContent=Object.keys(store.done).length;
 $("#category-grid").innerHTML=CATS.map(c=>{let done=LEVELS.filter(l=>l.cat===c.id&&store.done[l.id]).length;return `<button class="category-card" data-cat="${c.id}" style="background:${c.color}"><span class="category-count">${done}/10 ⭐</span><span class="category-emoji">${c.emoji}</span><h3>${c.name}</h3><p>${c.desc}</p></button>`}).join("");
 document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>openCat(b.dataset.cat));
}
function openCat(id){currentCat=id;let c=CATS.find(x=>x.id===id);$("#category-title").textContent=c.emoji+" "+c.name;$("#category-subtitle").textContent="Pick a picture!";$("#level-grid").innerHTML=LEVELS.filter(l=>l.cat===id).map((l,i)=>`<button class="level-card" data-level="${l.id}" style="background:${c.color}">${store.done[l.id]?'<span class="done-badge">✓</span>':''}<div class="level-preview">${l.emoji}</div><h3>${l.title}</h3><p>Picture ${i+1}</p></button>`).join("");document.querySelectorAll("[data-level]").forEach(b=>b.onclick=()=>openLevel(b.dataset.level));screen("levels-screen")}
function openLevel(id){current=LEVELS.find(x=>x.id===id);filled={};selected=1;zoom=1;$("#zoom-reset").textContent="100%";$("#level-title").textContent=current.emoji+" "+current.title;renderGame();screen("game-screen")}
function renderGame(){
 const g=current.grid,w=g[0].length;$("#color-canvas").style.gridTemplateColumns=`repeat(${w},auto)`;
 $("#color-canvas").innerHTML=g.flatMap((row,y)=>row.map((n,x)=>n? `<div class="pixel ${filled[y+"-"+x]?"filled":""}" data-x="${x}" data-y="${y}" data-n="${n}" style="${filled[y+"-"+x]?"background:"+current.colors[n-1]:""}">${filled[y+"-"+x]?"":n}</div>`:'<div class="pixel blank"></div>')).join("");
 let used=[...new Set(g.flat().filter(Boolean))];
 $("#palette").innerHTML=used.map(n=>`<button class="color-button ${n===selected?"selected":""} ${colorDone(n)?"complete":""}" data-color="${n}" style="background:${current.colors[n-1]}">${colorDone(n)?"✓":n}</button>`).join("");
 document.querySelectorAll("[data-color]").forEach(b=>b.onclick=()=>{selected=+b.dataset.color;renderGame()});
 document.querySelectorAll(".pixel[data-n]").forEach(p=>{p.onpointerdown=e=>{drawing=true;paint(p,e)};p.onpointerenter=e=>{if(drawing)paint(p,e)}});document.onpointerup=()=>drawing=false;
 updateProgress();
}
function paint(p,e){let n=+p.dataset.n;if(n!==selected||p.classList.contains("filled"))return;let key=p.dataset.y+"-"+p.dataset.x;filled[key]=true;p.classList.add("filled");p.textContent="";p.style.background=current.colors[n-1];spark(p);if(colorDone(n)&&store.settings.auto){let nums=[...new Set(current.grid.flat().filter(Boolean))];selected=nums.find(v=>!colorDone(v))||selected}renderGame();if(isComplete())finish()}
function colorDone(n){return current&&current.grid.every((row,y)=>row.every((v,x)=>v!==n||filled[y+"-"+x]))}
function isComplete(){return current.grid.every((row,y)=>row.every((v,x)=>!v||filled[y+"-"+x]))}
function updateProgress(){let total=current.grid.flat().filter(Boolean).length,done=Object.keys(filled).length;$("#level-progress-bar").style.width=(done/total*100)+"%"}
function spark(p){let s=document.createElement("span");s.className="sparkle";s.textContent="✨";let r=p.getBoundingClientRect();s.style.left=(r.left+r.width/2)+"px";s.style.top=r.top+"px";document.body.appendChild(s);setTimeout(()=>s.remove(),550)}
function finish(){store.done[current.id]=true;save();renderHome();$("#celebration").classList.remove("hidden");let layer=$("#confetti-layer");layer.innerHTML="";for(let i=0;i<28;i++){let s=document.createElement("span");s.className="confetti";s.textContent=["⭐","🎉","✨","🌈"][i%4];s.style.left=Math.random()*100+"%";s.style.animationDelay=Math.random()*.7+"s";layer.appendChild(s)}if(store.settings.sound)beep()}
function beep(){try{let a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=660;g.gain.setValueAtTime(.08,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.35);o.start();o.stop(a.currentTime+.35)}catch(e){}}
function nextLevel(){let list=LEVELS.filter(l=>l.cat===current.cat),i=list.findIndex(l=>l.id===current.id);$("#celebration").classList.add("hidden");openLevel(list[(i+1)%list.length].id)}
document.addEventListener("click",e=>{let b=e.target.closest("[data-back]");if(!b)return;if(b.dataset.back==="home"){renderHome();screen("home-screen")}else openCat(currentCat)});
$("#replay-button").onclick=()=>{$("#celebration").classList.add("hidden");openLevel(current.id)};$("#next-button").onclick=nextLevel;
$("#hint-button").onclick=()=>{let p=[...document.querySelectorAll('.pixel[data-n="'+selected+'"]')].find(x=>!x.classList.contains("filled"));if(p){p.classList.add("hint");p.scrollIntoView({behavior:"smooth",block:"center",inline:"center"});setTimeout(()=>p.classList.remove("hint"),1400)}};
function setZoom(z){zoom=Math.max(.75,Math.min(1.75,z));$("#color-canvas").style.transform=`scale(${zoom})`;$("#color-canvas").style.marginBottom=((zoom-1)*$("#color-canvas").offsetHeight)+"px";$("#color-canvas").style.marginRight=((zoom-1)*$("#color-canvas").offsetWidth)+"px";$("#zoom-reset").textContent=Math.round(zoom*100)+"%"}
$("#zoom-in").onclick=()=>setZoom(zoom+.25);$("#zoom-out").onclick=()=>setZoom(zoom-.25);$("#zoom-reset").onclick=()=>setZoom(1);
function newGate(){let a=4+Math.floor(Math.random()*6),b=3+Math.floor(Math.random()*7);gateAnswer=a+b;$("#gate-question").textContent=`What is ${a} + ${b}?`;$("#gate-answer").value=""}
$("#parent-button").onclick=()=>{newGate();$("#parent-gate").classList.remove("hidden");$("#parent-settings").classList.add("hidden");$("#parent-modal").classList.remove("hidden")};$("#close-parent").onclick=()=>$("#parent-modal").classList.add("hidden");
$("#gate-submit").onclick=()=>{if(+$("#gate-answer").value===gateAnswer){$("#parent-gate").classList.add("hidden");$("#parent-settings").classList.remove("hidden");$("#sound-toggle").checked=store.settings.sound;$("#auto-toggle").checked=store.settings.auto}else{$("#gate-answer").value="";$("#gate-answer").placeholder="Try again"}};
$("#sound-toggle").onchange=e=>{store.settings.sound=e.target.checked;save()};$("#auto-toggle").onchange=e=>{store.settings.auto=e.target.checked;save()};
$("#reset-progress").onclick=()=>{if(confirm("Reset all finished pictures?")){store.done={};save();renderHome();$("#parent-modal").classList.add("hidden")}};
renderHome();if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js"));