const works = [
  ["zara-larsson.gif","Zara Larsson"],
  ["bigbang.jpg","BIGBANG"],
  ["2026-rapbeat.jpg","2026 Rapbeat"],
  ["2023-bruno-mars.png","2023 Bruno Mars"],
  ["2022-brb.jpg","2022 BRB"],
  ["sam-smith.jpg","Sam Smith"],
  ["82major.avif","82MAJOR"],
  ["epikhigh.gif","Epik High"],
  ["2024-rapbeat.jpg","2024 Rapbeat"],
  ["slsl.png","SLSL"],
  ["2023-honne.jpg","2023 HONNE"],
  ["nbhd.jpg","NBHD"],
  ["kendrick-lamar.jpg","Kendrick Lamar"]
];

const gallery = document.getElementById("gallery");
const current = document.getElementById("current");
const title = document.getElementById("title");
const metaIndex = document.getElementById("metaIndex");
const progress = document.getElementById("progress");
const nextBtn = document.getElementById("nextBtn");
const stage = document.getElementById("stage");
const menuBtn = document.getElementById("menuBtn");
const menuPanel = document.getElementById("menuPanel");
const closeBtn = document.getElementById("closeBtn");

let active = 0;
let target = 0;
let pointerDown = false;
let startX = 0;
let startTarget = 0;
let autoTimer;

works.forEach(([file, name], i) => {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.index = i;
  card.innerHTML = `<img src="assets/${file}" alt="${name}" loading="${i < 3 ? "eager" : "lazy"}">`;
  card.addEventListener("click", () => {
    if (Math.abs(target - active) < .15) setActive(i);
  });
  gallery.appendChild(card);
});

const cards = [...document.querySelectorAll(".card")];

function mod(n,m){ return ((n % m) + m) % m; }

function render(){
  const n = cards.length;
  cards.forEach((card,i)=>{
    let d = i - target;
    while(d > n/2) d -= n;
    while(d < -n/2) d += n;

    const abs = Math.abs(d);
    const x = d * Math.min(window.innerWidth * .31, 430) * .92;
    const z = -abs * 120;
    const y = Math.min(abs,2) * 34;
    const scale = Math.max(.58, 1 - abs*.13);
    const rotate = d * -5;
    const opacity = abs > 3.2 ? 0 : Math.max(.18, 1 - abs*.25);

    card.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateY(${rotate}deg) scale(${scale})`;
    card.style.opacity = opacity;
    card.style.zIndex = String(100 - Math.round(abs*10));
    card.classList.toggle("active", abs < .15);
  });

  const nearest = mod(Math.round(target), n);
  current.textContent = String(nearest+1).padStart(2,"0");
  metaIndex.textContent = String(nearest+1).padStart(2,"0");
  title.textContent = works[nearest][1];
  progress.style.width = `${((nearest+1)/n)*100}%`;
}

function setActive(i){
  active = i;
  target = i;
  render();
  restartAuto();
}

function move(dir){
  target += dir;
  active = mod(Math.round(target), works.length);
  render();
  restartAuto();
}

stage.addEventListener("wheel", e=>{
  e.preventDefault();
  move(e.deltaY > 0 || e.deltaX > 0 ? 1 : -1);
},{passive:false});

stage.addEventListener("pointerdown", e=>{
  pointerDown = true;
  startX = e.clientX;
  startTarget = target;
  cards.forEach(c=>c.classList.add("dragging"));
  stage.setPointerCapture?.(e.pointerId);
  clearInterval(autoTimer);
});

stage.addEventListener("pointermove", e=>{
  if(!pointerDown) return;
  const dx = e.clientX - startX;
  target = startTarget - dx / Math.max(160, window.innerWidth*.22);
  render();
});

function endDrag(){
  if(!pointerDown) return;
  pointerDown = false;
  cards.forEach(c=>c.classList.remove("dragging"));
  target = Math.round(target);
  active = mod(target, works.length);
  render();
  restartAuto();
}
stage.addEventListener("pointerup", endDrag);
stage.addEventListener("pointercancel", endDrag);
stage.addEventListener("pointerleave", endDrag);

nextBtn.addEventListener("click", ()=>move(1));

menuBtn.addEventListener("click", ()=>menuPanel.classList.add("open"));
closeBtn.addEventListener("click", ()=>menuPanel.classList.remove("open"));
menuPanel.addEventListener("click", e=>{
  if(e.target === menuPanel) menuPanel.classList.remove("open");
});

function restartAuto(){
  clearInterval(autoTimer);
  autoTimer = setInterval(()=>move(1), 4200);
}

window.addEventListener("resize", render);
render();
restartAuto();
