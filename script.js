const STORAGE_KEY = "malla_aprobados";
let aprobados = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);

const normalizar = t =>
  t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

/* ===== REQUISITOS ===== */
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

/* ===== MALLA COMPLETA (10 CICLOS) ===== */
const ciclos = [
  { nombre:"Ciclo 1", cursos:[
    "ACTIVIDADES ARTÍSTICAS Y DEPORTIVAS",
    "TALLER DE MÉTODOS DEL ESTUDIO UNIVERSITARIO",
    "TALLER DE ARGUMENTACIÓN ORAL Y ESCRITA",
    "INTRODUCCIÓN A LA INGENIERÍA INDUSTRIAL",
    "MATEMÁTICAS",
    "QUÍMICA",
    "INGLÉS I"
  ]},
  { nombre:"Ciclo 2", cursos:[
    "TALLER DE INTERPRETACIÓN Y REDACCIÓN DE TEXTOS",
    "FILOSOFÍA Y ÉTICA",
    "PSICOLOGÍA GENERAL",
    "FORMACIÓN HISTÓRICA DEL PERÚ",
    "MATEMÁTICA I",
    "FÍSICA I",
    "QUÍMICA INDUSTRIAL",
    "INGLÉS II"
  ]},
  { nombre:"Ciclo 3", cursos:[
    "RECURSOS NATURALES Y MEDIO AMBIENTE",
    "REALIDAD NACIONAL",
    "ALGORITMOS COMPUTACIONALES",
    "MATEMÁTICA II",
    "FÍSICA II",
    "ADMINISTRACIÓN INDUSTRIAL",
    "GLOBALIZACIÓN E INTEGRACIÓN"
  ]},
  { nombre:"Ciclo 4", cursos:[
    "FUNDAMENTOS DE ECONOMÍA",
    "MINERÍA DE DATOS",
    "INGENIERÍA DE PROCESOS INDUSTRIALES",
    "DIBUJO EN INGENIERÍA",
    "ESTADÍSTICA Y PROBABILIDADES",
    "INGENIERÍA MECÁNICA ELÉCTRICA"
  ]},
  { nombre:"Ciclo 5", cursos:[
    "INGENIERÍA DE COSTOS Y PRESUPUESTOS",
    "LENGUAJES DE PROGRAMACIÓN",
    "INGENIERÍA DE MÉTODOS I",
    "ESTADÍSTICA INFERENCIAL",
    "INGENIERÍA DE MATERIALES",
    "DISEÑO ASISTIDO POR COMPUTADORA"
  ]},
  { nombre:"Ciclo 6", cursos:[
    "INGENIERÍA FINANCIERA",
    "INVESTIGACIÓN DE OPERACIONES",
    "INGENIERÍA DE MÉTODOS II",
    "DISEÑO DE EXPERIMENTOS",
    "TECNOLOGÍA BÁSICA DE FABRICACIÓN"
  ]},
  { nombre:"Ciclo 7", cursos:[
    "INGENIERÍA ECONÓMICA",
    "MODELAMIENTO Y SIMULACIÓN DE PROCESOS",
    "LOGÍSTICA Y CADENA DE SUMINISTRO",
    "CONTROL ESTADÍSTICO DE LA CALIDAD",
    "INGENIERÍA DE PLANTA Y MANTENIMIENTO"
  ]},
  { nombre:"Ciclo 8", cursos:[
    "DISEÑO Y EVALUACIÓN DE PROYECTOS DE INVERSIÓN",
    "PLANEAMIENTO Y CONTROL DE OPERACIONES",
    "TEORÍA Y METODOLOGÍA DE LA INVESTIGACIÓN",
    "INGENIERÍA DE PROCESOS EMPRESARIALES",
    "SISTEMA DE GESTIÓN DE CALIDAD",
    "MANUFACTURA ASISTIDA POR COMPUTADORA"
  ]},
  { nombre:"Ciclo 9", cursos:[
    "GERENCIA DE PROYECTOS DE INGENIERÍA",
    "ELECTIVO",
    "AUTOMATIZACIÓN INDUSTRIAL",
    "MARKETING E INVESTIGACIÓN DE MERCADOS INDUSTRIALES",
    "TALLER DE INVESTIGACIÓN I",
    "SEGURIDAD Y SALUD EN EL TRABAJO"
  ]},
  { nombre:"Ciclo 10", cursos:[
    "ELECTIVO",
    "ELECTIVO",
    "GESTIÓN DEL TALENTO HUMANO Y REINGENIERÍA ORGANIZACIONAL",
    "TALLER DE INVESTIGACIÓN II",
    "GESTIÓN AMBIENTAL Y RESPONSABILIDAD SOCIAL",
    "ELECTIVO",
    "DEONTOLOGÍA PARA INGENIERÍA"
  ]}
];

function estaDesbloqueado(curso) {
  const reqs = requisitos[curso];
  if (!reqs) return true;
  return reqs.every(r => aprobados.has(normalizar(r)));
}

/* ===== RENDER ===== */
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

      if (aprobados.has(clave)) btn.classList.add("done");

      if (!estaDesbloqueado(nombre)) {
        btn.classList.add("locked");
        btn.disabled = true;
      }

      btn.onclick = () => {
        aprobados.has(clave) ? aprobados.delete(clave) : aprobados.add(clave);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...aprobados]));
        render();
      };

      box.appendChild(btn);
    });

    grid.appendChild(box);
  });

  const pct = Math.round((ok / total) * 100);
  progress.textContent = `${ok} / ${total} cursos aprobados (${pct}%)`;
}

render();
