console.log("SCRIPT MALLA CARGADO OK");

/* =====================
   CONFIGURACIÓN
===================== */
const STORAGE = "malla_ii_aprobados";
let aprobados = new Set(JSON.parse(localStorage.getItem(STORAGE)) || []);

/* =====================
   UTILIDAD
===================== */
const key = t =>
  t.normalize("NFD")
   .replace(/[\u0300-\u036f]/g, "")
   .toUpperCase();

/* =====================
   MALLA (10 CICLOS)
===================== */
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

/* =====================
   RENDER
===================== */
const grid = document.getElementById("grid");
const progress = document.getElementById("progress");

function render(){
  grid.innerHTML = "";
  let total = 0, ok = 0;

  ciclos.forEach(c=>{
    const box = document.createElement("div");
    box.className = "cycle";
    box.innerHTML = `<h3>${c.nombre}</h3>`;

    c.cursos.forEach(nombre=>{
      total++;
      const k = key(nombre);
      if(aprobados.has(k)) ok++;

      const btn = document.createElement("button");
      btn.className = "course" + (aprobados.has(k) ? " done" : "");
      btn.textContent = nombre;
      btn.onclick = ()=>toggle(k);

      box.appendChild(btn);
    });

    grid.appendChild(box);
  });

  const pct = Math.round(ok / total * 100);
  progress.textContent = `${ok} / ${total} cursos aprobados (${pct}%)`;
}

function toggle(k){
  aprobados.has(k) ? aprobados.delete(k) : aprobados.add(k);
  localStorage.setItem(STORAGE, JSON.stringify([...aprobados]));
  render();
}

render();
