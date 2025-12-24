const STORE_STATE = "estado_cursos_v7";
const STORE_SHIFT = "shift_cursos_v7";

let estado = JSON.parse(localStorage.getItem(STORE_STATE)) || {};
let shift = JSON.parse(localStorage.getItem(STORE_SHIFT)) || {};

/* =========================
   MALLA BASE
========================= */
const cursosBase = [
  ["ACTIVIDADES ARTÍSTICAS Y DEPORTIVAS","TALLER DE MÉTODOS DEL ESTUDIO UNIVERSITARIO","TALLER DE ARGUMENTACIÓN ORAL Y ESCRITA","INTRODUCCIÓN A LA INGENIERÍA INDUSTRIAL","MATEMÁTICAS","QUÍMICA","INGLÉS I"],
  ["TALLER DE INTERPRETACIÓN Y REDACCIÓN DE TEXTOS","FILOSOFÍA Y ÉTICA","PSICOLOGÍA GENERAL","FORMACIÓN HISTÓRICA DEL PERÚ","MATEMÁTICA I","FÍSICA I","QUÍMICA INDUSTRIAL","INGLÉS II"],
  ["RECURSOS NATURALES Y MEDIO AMBIENTE","REALIDAD NACIONAL","ALGORITMOS COMPUTACIONALES","MATEMÁTICA II","FÍSICA II","ADMINISTRACIÓN INDUSTRIAL","GLOBALIZACIÓN E INTEGRACIÓN"],
  ["FUNDAMENTOS DE ECONOMÍA","MINERÍA DE DATOS","INGENIERÍA DE PROCESOS INDUSTRIALES","DIBUJO EN INGENIERÍA","ESTADÍSTICA Y PROBABILIDADES","INGENIERÍA MECÁNICA ELÉCTRICA"],
  ["INGENIERÍA DE COSTOS Y PRESUPUESTOS","LENGUAJES DE PROGRAMACIÓN","INGENIERÍA DE MÉTODOS I","ESTADÍSTICA INFERENCIAL","INGENIERÍA DE MATERIALES","DISEÑO ASISTIDO POR COMPUTADORA"],
  ["INGENIERÍA FINANCIERA","INVESTIGACIÓN DE OPERACIONES","INGENIERÍA DE MÉTODOS II","DISEÑO DE EXPERIMENTOS","TECNOLOGÍA BÁSICA DE FABRICACIÓN"],
  ["INGENIERÍA ECONÓMICA","MODELAMIENTO Y SIMULACIÓN DE PROCESOS","LOGÍSTICA Y CADENA DE SUMINISTRO","CONTROL ESTADÍSTICO DE LA CALIDAD","INGENIERÍA DE PLANTA Y MANTENIMIENTO"],
  ["DISEÑO Y EVALUACIÓN DE PROYECTOS DE INVERSIÓN","PLANEAMIENTO Y CONTROL DE OPERACIONES","TEORÍA Y METODOLOGÍA DE LA INVESTIGACIÓN","INGENIERÍA DE PROCESOS EMPRESARIALES","SISTEMA DE GESTIÓN DE CALIDAD","MANUFACTURA ASISTIDA POR COMPUTADORA"],
  ["GERENCIA DE PROYECTOS DE INGENIERÍA","AUTOMATIZACIÓN INDUSTRIAL","MARKETING E INVESTIGACIÓN DE MERCADOS INDUSTRIALES","TALLER DE INVESTIGACIÓN I","SEGURIDAD Y SALUD EN EL TRABAJO"],
  ["ELECTIVO","ELECTIVO","GESTIÓN DEL TALENTO HUMANO Y REINGENIERÍA ORGANIZACIONAL","TALLER DE INVESTIGACIÓN II","GESTIÓN AMBIENTAL Y RESPONSABILIDAD SOCIAL","DEONTOLOGÍA PARA INGENIERÍA"]
];

/* =========================
   DEPENDENCIAS
========================= */
const dependencias = {
  "MATEMÁTICAS":["MATEMÁTICA I","FÍSICA I"],
  "QUÍMICA":["QUÍMICA INDUSTRIAL"],
  "INGLÉS I":["INGLÉS II"],
  "MATEMÁTICA I":["MATEMÁTICA II"],
  "FÍSICA I":["FÍSICA II"],
  "INTRODUCCIÓN A LA INGENIERÍA INDUSTRIAL":["ADMINISTRACIÓN INDUSTRIAL"],
  "MATEMÁTICA II":["FUNDAMENTOS DE ECONOMÍA","ESTADÍSTICA Y PROBABILIDADES"],
  "ALGORITMOS COMPUTACIONALES":["MINERÍA DE DATOS"],
  "ADMINISTRACIÓN INDUSTRIAL":["INGENIERÍA DE PROCESOS INDUSTRIALES","INGENIERÍA DE MÉTODOS I"],
  "FUNDAMENTOS DE ECONOMÍA":["INGENIERÍA DE COSTOS Y PRESUPUESTOS"],
  "ESTADÍSTICA Y PROBABILIDADES":["ESTADÍSTICA INFERENCIAL"],
  "INGENIERÍA DE COSTOS Y PRESUPUESTOS":["INGENIERÍA FINANCIERA"],
  "ESTADÍSTICA INFERENCIAL":["DISEÑO DE EXPERIMENTOS"]
};

/* =========================
   MAPA BASE
========================= */
const baseCycle = {};
cursosBase.forEach((lista, i) =>
  lista.forEach(curso => baseCycle[curso] = i)
);

/* =========================
   EMPUJE EN CADENA (✕)
========================= */
function empujar(curso){
  shift[curso] = (shift[curso] || 0) + 1;
  (dependencias[curso] || []).forEach(dep => empujar(dep));
}

/* =========================
   RENDER
========================= */
function render(){
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  const ciclos = [];

  Object.keys(baseCycle).forEach(curso => {
    const base = baseCycle[curso];
    const desplazamiento = shift[curso] || 0;
    const cicloFinal = base + desplazamiento;

    if (!ciclos[cicloFinal]) ciclos[cicloFinal] = [];
    ciclos[cicloFinal].push(curso);
  });

  const maxCycle = Math.max(ciclos.length, 10);

  for (let i = 0; i < maxCycle; i++){
    const box = document.createElement("div");
    box.className = "cycle";
    box.innerHTML = `<h2>Ciclo ${i+1}</h2>`;

    (ciclos[i] || []).forEach(curso => {
      const c = document.createElement("div");

      // 🔑 ESTA ES LA LÍNEA CLAVE
      c.className = "course" + (estado[curso] === "ok" ? " done" : "");

      c.innerHTML = `
        <div class="name">${curso}</div>
        <div class="controls">
          <div class="ctrl ok">✓</div>
          <div class="ctrl no">✕</div>
        </div>
      `;

      c.querySelector(".ok").onclick = () => {
        estado[curso] = "ok";
        guardar();
      };

      c.querySelector(".no").onclick = () => {
        empujar(curso);
        guardar();
      };

      box.appendChild(c);
    });

    grid.appendChild(box);
  }
}

/* =========================
   GUARDAR Y REDIBUJAR
========================= */
function guardar(){
  localStorage.setItem(STORE_STATE, JSON.stringify(estado));
  localStorage.setItem(STORE_SHIFT, JSON.stringify(shift));
  render();
}

render();
