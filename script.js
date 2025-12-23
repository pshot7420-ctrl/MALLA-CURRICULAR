/* =========================
   CONFIGURACIÓN
========================= */
const STORAGE_KEY = "malla_aprobados";
let aprobados = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);

/* =========================
   UTILIDAD
========================= */
const normalizar = t =>
  t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

/* =========================
   REQUISITOS (OFICIALES)
========================= */
const requisitos = {
  "ADMINISTRACIÓN INDUSTRIAL": ["INTRODUCCIÓN A LA INGENIERÍA INDUSTRIAL"],
  "MATEMÁTICA I": ["MATEMÁTICAS"],
  "FÍSICA I": ["MATEMÁTICAS"],
  "QUÍMICA INDUSTRIAL": ["QUÍMICA"],
  "INGLÉS II": ["INGLÉS I"],
  "FÍSICA II": ["FÍSICA I"],
  "MINERÍA DE DATOS": ["ALGORITMOS COMPUTACIONALES"],
  "FUNDAMENTOS DE ECONOMÍA": ["MATEMÁTICA II"],
  "ESTADÍSTICA Y PROBABILIDADES": ["MATEMÁTICA II"],
  "INGENIERÍA DE MÉTODOS I": ["ADMINISTRACIÓN INDUSTRIAL"],
  "INGENIERÍA DE PROCESOS INDUSTRIALES": ["ADMINISTRACIÓN INDUSTRIAL"],
  "INGENIERÍA DE COSTOS Y PRESUPUESTOS": ["FUNDAMENTOS DE ECONOMÍA"],
  "LENGUAJES DE PROGRAMACIÓN": ["MINERÍA DE DATOS"],
  "ESTADÍSTICA INFERENCIAL": ["ESTADÍSTICA Y PROBABILIDADES"],
  "INGENIERÍA FINANCIERA": ["INGENIERÍA DE COSTOS Y PRESUPUESTOS"],
  "INVESTIGACIÓN DE OPERACIONES": ["LENGUAJES DE PROGRAMACIÓN"]
};

/* =========================
   MALLA CURRICULAR
========================= */
const ciclos = [
  { nombre: "Ciclo 1", cursos: [
    "ACTIVIDADES ARTÍSTICAS Y DEPORTIVAS",
    "TALLER DE MÉTODOS DEL ESTUDIO UNIVERSITARIO",
    "TALLER DE ARGUMENTACIÓN ORAL Y ESCRITA",
    "INTRODUCCIÓN A LA INGENIERÍA INDUSTRIAL",
    "MATEMÁTICAS",
    "QUÍMICA",
    "INGLÉS I"
  ]},
  { nombre: "Ciclo 2", cursos: [
    "TALLER DE INTERPRETACIÓN Y REDACCIÓN DE TEXTOS",
    "FILOSOFÍA Y ÉTICA",
    "PSICOLOGÍA GENERAL",
    "FORMACIÓN HISTÓRICA DEL PERÚ",
    "MATEMÁTICA I",
    "FÍSICA I",
    "QUÍMICA INDUSTRIAL",
    "INGLÉS II"
  ]},
  { nombre: "Ciclo 3", cursos: [
    "RECURSOS NATURALES Y MEDIO AMBIENTE",
    "REALIDAD NACIONAL",
    "ALGORITMOS COMPUTACIONALES",
    "MATEMÁTICA II",
    "FÍSICA II",
    "ADMINISTRACIÓN INDUSTRIAL",
    "GLOBALIZACIÓN E INTEGRACIÓN"
  ]},
  { nombre: "Ciclo 4", cursos: [
    "FUNDAMENTOS DE ECONOMÍA",
    "MINERÍA DE DATOS",
    "INGENIERÍA DE PROCESOS INDUSTRIALES",
    "DIBUJO EN INGENIERÍA",
    "ESTADÍSTICA Y PROBABILIDADES",
    "INGENIERÍA MECÁNICA ELÉCTRICA"
  ]}
  // (Puedes seguir agregando ciclos 5–10 igual)
];

/* =========================
   FUNCIONES
========================= */
function estaDesbloqueado(curso) {
  const reqs = requisitos[curso];
  if (!reqs) return true;
  return reqs.every(r => aprobados.has(normalizar(r)));
}

/* =========================
   RENDER
========================= */
const grid = document.getElementById("grid");
const progress = document.getElementById("progress");

function render() {
  grid.innerHTML = "";
  let total = 0;
  let ok = 0;

  ciclos.forEach(ciclo => {
    const box = document.createElement("div");
    box.className = "cycle";

    box.innerHTML = `<h3>${ciclo.nombre}</h3>`;

    ciclo.cursos.forEach(nombre => {
      total++;
      const clave = normalizar(nombre);
      if (aprobados.has(clave)) ok++;

      const btn = document.createElement("button");
      btn.className = "course";
      btn.textContent = nombre;

      if (aprobados.has(clave)) {
        btn.classList.add("done");
      }

      if (!estaDesbloqueado(nombre)) {
        btn.classList.add("locked");
        btn.disabled = true;
      }

      btn.onclick = () => toggleCurso(clave);
      box.appendChild(btn);
    });

    grid.appendChild(box);
  });

  const pct = Math.round((ok / total) * 100);
  progress.textContent = `${ok} / ${total} cursos aprobados (${pct}%)`;
}

function toggleCurso(clave) {
  aprobados.has(clave) ? aprobados.delete(clave) : aprobados.add(clave);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...aprobados]));
  render();
}

/* =========================
   INICIO
========================= */
render();
