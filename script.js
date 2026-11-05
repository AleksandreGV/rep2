// ---------- SETTINGS: change these ----------
const MUSIC_FILE = "music.mp3";    // your song, same folder as index.html
const SIGNATURE  = "Bubi";    // <-- put your name here
const DEAR = "Dear Eti,";
const PS = "P.S. I hope this made you smile. ❤️";
const LETTER = [
  "I wanted to tell you something properly, so I built you a whole website. Slightly dramatic, I know.",
  "I like you. A lot. More than I know how to say out loud without turning red.",
  "You are one of the kindest people I have ever met. You are gentle with people, you make them feel noticed, and somehow you do it without even trying.",
  "And you are beautiful, Eti. Truly. You have the kind of eyes a person could get lost in and not mind at all. Every time you look at me, I forget what I was about to say.",
  "The way you laugh, the way you show up, the little things you do that you probably don’t even notice, all of it stays with me long after you leave.",
  "I can’t wait to see you. Honestly, I’m counting the hours and trying to act normal about it. It is not working.",
  "Until then, keep smiling. The world looks better when you do."
];

const EMOJIS = ["🌹", "💌", "✨", "🦋", "🌙", "🍓"];
// --------------------------------------------

const $ = id => document.getElementById(id);
const show = name => ["intro", "game", "win", "letter"].forEach(s => $(s).classList.toggle("on", s === name));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- music ---- */
const audio = new Audio(MUSIC_FILE);
audio.loop = true;
audio.addEventListener("error", () => {
  const m = $("musicError"); m.hidden = false;
  m.textContent = 'Music file "' + MUSIC_FILE + '" was not found. Put it in the same folder as index.html and check its name and ending.';
});
function playMusic(){ audio.play().then(() => { $("mute").hidden = false; }).catch(() => {}); }
$("mute").addEventListener("click", () => {
  const off = !audio.paused;
  if (off) audio.pause(); else audio.play();
  $("mute").classList.toggle("off", off);
  $("mute").setAttribute("aria-label", off ? "Play music" : "Pause music");
});

/* ---- petals ---- */
let petalTimer;
function petal(){
  const p = document.createElement("i");
  p.className = "petal";
  p.style.left = Math.random() * 100 + "vw";
  p.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
  p.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
  p.style.animationDuration = 6 + Math.random() * 6 + "s";
  p.style.background = ["#d9647e", "#f2a1b3", "#b8284a"][Math.floor(Math.random() * 3)];
  $("petals").appendChild(p);
  setTimeout(() => p.remove(), 12500);
}
function startPetals(){ if (!reduce) petalTimer = setInterval(petal, 450); }
function burst(){ if (!reduce) for (let i = 0; i < 40; i++) setTimeout(petal, i * 40); }

/* ---- memory game ---- */
let first = null, lock = false, moves = 0, matched = 0;
function shuffle(a){ for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function newGame(){
  moves = 0; matched = 0; first = null; lock = false;
  $("moves").textContent = "Moves: 0";
  const board = $("board"); board.innerHTML = "";
  shuffle([...EMOJIS, ...EMOJIS]).forEach(e => {
    const c = document.createElement("button");
    c.className = "card"; c.type = "button"; c.dataset.e = e; c.setAttribute("aria-label", "Card");
    c.innerHTML = '<span class="face back">E</span><span class="face front">' + e + "</span>";
    c.addEventListener("click", () => flip(c));
    board.appendChild(c);
  });
  show("game");
}
function flip(c){
  if (lock || c.classList.contains("open")) return;
  c.classList.add("open");
  if (!first){ first = c; return; }
  moves++; $("moves").textContent = "Moves: " + moves;
  if (first.dataset.e === c.dataset.e){
    first.classList.add("done"); c.classList.add("done"); first = null;
    if (++matched === EMOJIS.length) setTimeout(() => show("win"), 900);
  } else {
    lock = true; const a = first; first = null;
    setTimeout(() => { a.classList.remove("open"); c.classList.remove("open"); lock = false; }, 800);
  }
}

/* ---- the letter ---- */
function readLetter(){
  $("dear").textContent = DEAR; $("sign").textContent = "Yours, " + SIGNATURE; $("ps").textContent = PS;
  const box = $("lines"); box.innerHTML = "";
  const els = LETTER.map(t => { const p = document.createElement("p"); p.className = "line"; p.textContent = t; box.appendChild(p); return p; });
  show("letter"); startPetals();
  const gap = reduce ? 0 : 2600;
  els.forEach((p, i) => setTimeout(() => { p.classList.add("show"); p.scrollIntoView({behavior: reduce ? "auto" : "smooth", block: "center"}); }, 900 + i * gap));
  setTimeout(() => {
    $("ps").classList.add("show"); $("meToo").hidden = false;
    $("meToo").scrollIntoView({behavior: reduce ? "auto" : "smooth", block: "center"});
  }, 900 + els.length * gap + 600);
}

$("start").addEventListener("click", () => { $("start").closest(".envelope").classList.add("open"); playMusic(); setTimeout(newGame, 700); });
$("open").addEventListener("click", () => { $("env").classList.add("open"); setTimeout(readLetter, 1100); });
$("meToo").addEventListener("click", () => { $("meToo").hidden = true; $("end").hidden = false; burst(); });