/* ====== VARIABLES ====== */
const STORE_NAME = "nombre_usuario";
const STORE_STATE = "estado_cursos";

/* ====== DATOS ====== */
const cursos = [
  "MATEMÁTICAS",
  "QUÍMICA",
  "INGLÉS I",
  "ELECTIVO 1",
  "ELECTIVO 2",
  "ELECTIVO 3"
];

let estado = JSON.parse(localStorage.getItem(STORE_STATE) || "{}");

/* ====== INGRESAR ====== */
function ingresar(){
  const input = document.getElementById("nameInput");
  const nombre = input.value.trim();

  if(!nombre){
    alert("Escribe tu nombre");
    return;
  }

  localStorage.setItem(STORE_NAME, nombre);

  document.getElementById("welcomeScreen").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("saludo").textContent = `Hola, ${nombre} 👋`;

  render();
}

/* ====== RENDER ====== */
function render(){
  const grid = document.getElementById("grid");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  grid.innerHTML = "";

  cursos.forEach(curso=>{
    const div = document.createElement("div");
    div.className = "course" + (estado[curso]==="ok" ? " done" : "");
    div.innerHTML = `
      <strong>${curso}</strong><br>
      <button class="ctrl" onclick="aprobar('${curso}')">✓</button>
      <button class="ctrl" onclick="jalar('${curso}')">✕</button>
    `;
    grid.appendChild(div);
  });

  const ok = Object.values(estado).filter(v=>v==="ok").length;
  const pct = Math.round(ok / cursos.length * 100);
  progressBar.style.width = pct + "%";
  progressText.textContent = `${ok}/${cursos.length} aprobados`;
}

/* ====== ACCIONES ====== */
function aprobar(curso){
  estado[curso] = "ok";
  guardar();
}

function jalar(curso){
  estado[curso] = "no";
  guardar();
}

function guardar(){
  localStorage.setItem(STORE_STATE, JSON.stringify(estado));
  render();
}

/* ====== REINICIAR ====== */
function reiniciar(){
  localStorage.clear();
  location.reload();
}

/* ====== AUTO INICIO ====== */
const nombreGuardado = localStorage.getItem(STORE_NAME);
if(nombreGuardado){
  document.getElementById("welcomeScreen").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("saludo").textContent = `Hola, ${nombreGuardado} 👋`;
  render();
}
