console.log("SCRIPT MALLA CARGADO");

/* =========================
   CONFIGURACIÓN
========================= */
const STORAGE_KEY = "malla_aprobados";
let aprobados = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);

/* =========================
   UTILIDAD
========================= */
const normalizar = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

/* =========================
   MALLA CURRICULAR (10 CICLOS)
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
  ]},
  { nombre: "Ciclo 5", cursos: [
    "INGENIERÍA DE COSTOS Y PRESUPUESTOS",
    "LENGUAJES DE PROGRAMACIÓN",
    "INGENIERÍA DE MÉTODOS I",
    "ESTADÍSTICA INFERENCIAL",
    "INGENIERÍA DE MATERIALES",
    "DISEÑO ASISTIDO POR COMPUTADORA"
  ]},
  { nombre: "Ciclo 6", cursos: [
    "INGENIERÍA FINANCIERA",
    "INVESTIGACIÓN DE OPERACIONES",
    "INGENIERÍA DE MÉTODOS II",
    "DISEÑO DE EXPERIMENTOS",
    "TECNOLOGÍA BÁSICA DE FABRICACIÓN"
  ]},
  { nombre: "Ciclo 7", cursos: [
    "INGENIERÍA ECONÓMICA",
    "MODELAMIENTO Y SIMULACIÓN DE PROCESOS",
    "LOGÍSTICA Y CADENA DE SUMINISTRO",
    "CONTROL ESTADÍSTICO DE LA CALIDAD",
    "INGENIERÍA DE PLANTA Y MANTENIMIENTO"
  ]},
  { nombre: "Ciclo 8", cursos: [
    "DISEÑO Y EVALUACIÓN DE PROYECTOS DE INVERSIÓN",
    "PLANEAMIENTO Y CONTROL DE OPERACIONES",
    "TEORÍA Y METODOLOGÍA DE LA INVESTIGACIÓN",
    "INGENIERÍA DE PROCESOS EMPRESARIALES",
    "SISTEMA DE GESTIÓN DE CALIDAD",
    "MANUFACTURA ASISTIDA POR COMPUTADORA"
  ]},
  { nombre: "Ciclo 9", cursos: [
    "GERENCIA DE PROYECTOS DE INGENIERÍA",
    "ELECTIVO",
    "AUTOMATIZACIÓN INDUSTRIAL",
    "MARKETING E INVESTIGACIÓN DE MERCADOS INDUSTRIALES",
    "TALLER DE INVESTIGACIÓN I",
    "SEGURIDAD Y SALUD EN EL TRABAJO"
  ]},
  { nombre: "Ciclo 10", cursos: [
    "ELECTIVO",
    "ELECTIVO",
    "GESTIÓN DEL TALENTO HUMANO Y REINGENIERÍA ORGANIZACIONAL",
    "TALLER DE INVESTIGACIÓN II",
    "GESTIÓN AMBIENTAL Y RESPONSABILIDAD SOCIAL",
    "ELECTIVO",
    "DEONTOLOGÍA PARA INGENIERÍA"
  ]}
];

/* =========================
   ELEMENTOS HTML
========================= */
const grid = document.getElementById("grid");
const progress = document.getElementById("progress");

/* =========================
   RENDER
========================= */
function render() {
  grid.innerHTML = "";
  let total = 0;
  let aprobadosCount = 0;

  ciclos.forEach(ciclo => {
    const columna = document.createElement("div");
    columna.className = "cycle";

    const titulo = document.createElement("h3");
    titulo.textContent = ciclo.nombre;
    columna.appendChild(titulo);

    ciclo.cursos.forEach(nombreCurso => {
      total++;
      const clave = normalizar(nombreCurso);

      if (aprobados.has(clave)) aprobadosCount++;

      const boton = document.createElement("button");
      boton.className = "course";
      boton.textContent = nombreCurso;

      if (aprobados.has(clave)) {
        boton.classList.add("done");
      }

      boton.addEventListener("click", () => toggleCurso(clave));
      columna.appendChild(boton);
    });

    grid.appendChild(columna);
  });

  const porcentaje = Math.round((aprobadosCount / total) * 100);
  progress.textContent = `${aprobadosCount} / ${total} cursos aprobados (${porcentaje}%)`;
}

/* =========================
   TOGGLE CURSO
========================= */
function toggleCurso(clave) {
  if (aprobados.has(clave)) {
    aprobados.delete(clave);
  } else {
    aprobados.add(clave);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...aprobados]));
  render();
}

/* =========================
   INICIO
========================= */
render();
