const API_KEY = "PON_TU_API_KEY_AQUI";

let playlists = JSON.parse(localStorage.getItem("playlists")) || {};

// YOUTUBE
function buscar() {
  const q = document.getElementById("search").value;
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${q}&key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const cont = document.getElementById("resultados");
      cont.innerHTML = "";
      data.items.forEach(v => {
        const div = document.createElement("div");
        div.className = "song";
        div.innerHTML = `
          <strong>${v.snippet.title}</strong><br>
          <button onclick="reproducir('${v.id.videoId}')">▶ Reproducir</button>
          <button onclick="agregar('${v.id.videoId}','${v.snippet.title}')">➕ Playlist</button>
        `;
        cont.appendChild(div);
      });
    });
}

function reproducir(id) {
  document.getElementById("player").innerHTML = `
    <iframe width="100%" height="200"
      src="https://www.youtube.com/embed/${id}?autoplay=1"
      allow="autoplay"></iframe>
  `;
}

// PLAYLISTS
function crearPlaylist() {
  const name = document.getElementById("playlistName").value;
  if (!name) return;
  playlists[name] = [];
  guardar();
  mostrarPlaylists();
}

function agregar(id, title) {
  const name = Object.keys(playlists)[0];
  if (!name) return alert("Crea una playlist primero");
  playlists[name].push({id, title});
  guardar();
}

function guardar() {
  localStorage.setItem("playlists", JSON.stringify(playlists));
}

function mostrarPlaylists() {
  const div = document.getElementById("listaPlaylists");
  div.innerHTML = "";
  Object.keys(playlists).forEach(p => {
    const el = document.createElement("div");
    el.textContent = `⭐ ${p} (${playlists[p].length})`;
    div.appendChild(el);
  });
}
mostrarPlaylists();

// STARFIELD ANIMATION
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let w, h, stars = [];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

for (let i = 0; i < 120; i++) {
  stars.push({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.5,
    v: Math.random() * 0.3 + 0.1
  });
}

function animateStars() {
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = "#4fc3ff";
  stars.forEach(s => {
    s.y += s.v;
    if (s.y > h) s.y = 0;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(animateStars);
}
animateStars();
