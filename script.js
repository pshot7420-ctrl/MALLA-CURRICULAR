const STORE_STATE = "estado_cursos_final";
const STORE_DELAY = "delay_cursos_final";

/*
estado:
- "ok" aprobado
- "no" jalado
delay:
- número de ciclos que se desplaza
*/

let estado = JSON.parse(localStorage.getItem(STORE_STATE)) || {};
let delay = JSON.parse(localStorage.getItem(STORE_DELAY)) || {};

/* =========================
   MALLA BASE (CICLO ORIGINAL)
========================= */
const cursosBase = [
  // Ciclo 1
  ["ACTIVIDADES ARTÍSTICAS Y DEPORTIVAS","TALLER DE MÉTODOS DEL ESTUDIO UNIVERSITARIO","TALLER DE ARGUMENTACIÓN ORAL Y ESCRITA","INTRODUCCIÓN A LA INGENIERÍA INDUSTRIAL","MATEMÁTICAS","QUÍMICA","INGLÉS I"],
  // Ciclo 2
  ["TALLER DE INTERPRETACIÓN Y REDACCIÓN DE TEXTOS","FILOSOFÍA Y ÉTICA","PSICOLOGÍA GENERAL","FORMACIÓN HISTÓRICA DEL PERÚ","MATEMÁTICA I","FÍSICA I","QUÍMICA INDUSTRIAL","INGLÉS II"],
  // Ciclo 3
  ["RECURSOS NATURALES Y MEDIO AMBIENTE","REALIDAD NACIONAL","ALGORITMOS COMPUTACIONALES","MATEMÁTICA II","FÍSICA II","ADMINISTRACIÓN INDUSTRIAL","GLOBALIZACIÓN E INTEGRACIÓN"],
  // Ciclo 4
  ["FUNDAMENTOS DE ECONOMÍA","MINERÍA DE DATOS","INGENIERÍA DE PROCESOS INDUSTRIALES","DIBUJO EN INGENIERÍA","ESTADÍSTICA Y PROBABILIDADES","INGENIERÍA MECÁNICA ELÉCTRICA"],
  // Ciclo 5
  ["INGENIERÍA DE COSTOS Y PRESUPUESTOS","LENGUAJES DE PROGRAMACIÓN","INGENIERÍA DE MÉTODOS I","ESTADÍSTICA INFERENCIAL","INGENIERÍA DE MATERIALES","DISEÑO ASISTIDO POR COMPUTADORA"],
  // Ciclo 6
  ["INGENIERÍA FINANCIERA","INVESTIGACIÓN DE OPERACIONES","INGENIERÍA DE MÉTODOS II","DISEÑO DE EXPERIMENTOS","TECNOLOGÍA BÁSICA DE FABRICACIÓN"],
  // Ciclo 7
  ["INGENIERÍA ECONÓMICA","MODELAMIENTO Y SIMULACIÓN DE PROCESOS","LOGÍSTICA Y CADENA DE SUMINISTRO","CONTROL ESTADÍSTICO DE LA CALIDAD","INGENIERÍA DE PLANTA Y MANTENIMIENTO"],
  // Ciclo 8
  ["DISEÑO Y EVALUACIÓN DE PROYECTOS DE INVERSIÓN","PLANEAMIENTO Y CONTROL DE OPERACIONES","TEORÍA Y METODOLOGÍA DE LA INVESTIGACIÓN","INGENIERÍA DE PROCESOS EMPRESARIALES","SISTEMA DE GESTIÓN DE CALIDAD","MANUFACTURA ASISTIDA POR COMPUTADORA"],
  // Ciclo 9
  ["GERENCIA DE PROYECTOS DE INGENIERÍA","ELECTIVO","AUTOMATIZACIÓN INDUSTRIAL","MARKETING E INVESTIGACIÓN DE MERCADOS INDUSTRIALES","TALLER DE INVESTIGACIÓN I","SEGURIDAD Y SALUD EN EL TRABAJO"],
  // Ciclo 10
  ["ELECTIVO","ELECTIVO","GESTIÓN DEL TALENTO HUMANO Y REINGENIERÍA ORGANIZACIONAL","TALLER DE INVESTIGACIÓN II","GESTIÓN AMBIENTAL Y RESPONSABILIDAD SOCIAL","DEONTOLOGÍA PARA INGENIERÍA"]
];

/* =========================
   DEPENDENCIAS (OFICIALES)
========================= */
const dependencias = {
  "MATEMÁTICAS": ["MATEMÁTICA I","FÍSICA I"],
  "QUÍMICA": ["QUÍMICA INDUSTRIAL"],
  "INGLÉS I": ["INGLÉS II"],

  "MATEMÁTICA I": ["MATEMÁTICA II"],
  "FÍSICA I": ["FÍSICA II"],
  "INTRODUCCIÓN A LA INGENIERÍA INDUSTRIAL": ["ADMINISTRACIÓN INDUSTRIAL"],

  "MATEMÁTICA II": ["FUNDAMENTOS DE ECONOMÍA","ESTADÍSTICA Y PROBABILIDADES"],
  "ALGORITMOS COMPUTACIONALES": ["MINERÍA DE DATOS"],
  "ADMINISTRACIÓN INDUSTRIAL": ["INGENIERÍA DE PROCESOS INDUSTRIALES","INGENIERÍA DE MÉTODOS I"],

  "FUNDAMENTOS DE ECONOMÍA": ["INGENIERÍA DE COSTOS Y PRESUPUESTOS"],
  "MINERÍA DE DATOS": ["LENGUAJES DE PROGRAMACIÓN"],
  "ESTADÍSTICA Y PROBABILIDADES": ["ESTADÍSTICA INFERENCIAL"],
  "INGENIERÍA MECÁNICA ELÉCTRICA": ["INGENIERÍA DE MATERIALES"],
  "DIBUJO EN INGENIERÍA": ["DISEÑO ASISTIDO POR COMPUTADORA"],

  "INGENIERÍA DE COSTOS Y PRESUPUESTOS": ["INGENIERÍA FINANCIERA"],
  "LENGUAJES DE PROGRAMACIÓN": ["INVESTIGACIÓN DE OPERACIONES"],
  "INGENIERÍA DE MÉTODOS I": ["INGENIERÍA DE MÉTODOS II"],
  "ESTADÍSTICA INFERENCIAL": ["DISEÑO DE EXPERIMENTOS"],
  "DISEÑO ASISTIDO POR COMPUTADORA": ["TECNOLOGÍA BÁSICA DE FABRICACIÓN"],

  "INGENIERÍA FINANCIERA": ["INGENIERÍA ECONÓMICA"],
  "INVESTIGACIÓN DE OPERACIONES": ["MODELAMIENTO Y SIMULACIÓN DE PROCESOS"],
  "INGENIERÍA DE MÉTODOS II": ["LOGÍSTICA Y CADENA DE SUMINISTRO"],
  "DISEÑO DE EXPERIMENTOS": ["CONTROL ESTADÍSTICO DE LA CALIDAD"],
  "TECNOLOGÍA BÁSICA DE FABRICACIÓN": ["INGENIERÍA DE PLANTA Y MANTENIMIENTO"],

  "INGENIERÍA ECONÓMICA": ["DISEÑO Y EVALUACIÓN DE PROYECTOS DE INVERSIÓN"],
  "LOGÍSTICA Y CADENA DE SUMINISTRO": ["PLANEAMIENTO Y CONTROL DE OPERACIONES"],
  "CONTROL ESTADÍSTICO DE LA CALIDAD": ["SISTEMA DE GESTIÓN DE CALIDAD","TEORÍA Y METODOLOGÍA DE LA INVESTIGACIÓN"],
  "MODELAMIENTO Y SIMULACIÓN DE PROCESOS": ["INGENIERÍA DE PROCESOS EMPRESARIALES"],
  "INGENIERÍA DE PLANTA Y MANTENIMIENTO": ["MANUFACTURA ASISTIDA POR COMPUTADORA"],

  "DISEÑO Y EVALUACIÓN DE PROYECTOS DE INVERSIÓN": ["GERENCIA DE PROYECTOS DE INGENIERÍA","AUTOMATIZACIÓN INDUSTRIAL"],
  "PLANEAMIENTO Y CONTROL DE OPERACIONES": ["MARKETING E INVESTIGACIÓN DE MERCADOS INDUSTRIALES"],
  "TEORÍA Y METODOLOGÍA DE LA INVESTIGACIÓN": ["TALLER DE INVESTIGACIÓN I"],
  "SISTEMA DE GESTIÓN DE CALIDAD": ["SEGURIDAD Y SALUD EN EL TRABAJO"],

  "MARKETING E INVESTIGACIÓN DE MERCADOS INDUSTRIALES": ["GESTIÓN DEL TALENTO HUMANO Y REINGENIERÍA ORGANIZACIONAL"],
  "TALLER DE INVESTIGACIÓN I": ["TALLER DE INVESTIGACIÓN II"],
  "SEGURIDAD Y SALUD EN EL TRABAJO": ["GESTIÓN AMBIENTAL Y RESPONSABILIDAD SOCIAL"]
};

/* =========================
   MAPA CURSO → CICLO BASE
========================= */
const baseCycle = {};
cursosBase.forEach((lista, i) => {
  lista.forEach(curso => baseCycle[curso] = i);
});

/* =========================
   APLICAR DELAY EN CADENA
========================= */
function aplicarDelay(curso, nuevoDelay){
  delay[curso] = Math.max(delay[curso] || 0, nuevoDelay);
  (dependencias[curso] || []).forEach(dep => {
    aplicarDelay(dep, delay[curso] + 1);
  });
}

/* =========================
   RENDER
========================= */
function render(){
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  const ciclos = Array.from({length: cursosBase.length}, () => []);
  let total = 0, aprobados = 0;

  Object.keys(baseCycle).forEach(curso => {
    total++;
    if (estado[curso] === "ok") aprobados++;

    const cicloFinal = baseCycle[curso] + (delay[curso] || 0);
    if (ciclos[cicloFinal]) ciclos[cicloFinal].push(curso);
  });

  ciclos.forEach((lista, i) => {
    const box = document.createElement("div");
    box.className = "cycle";
    box.innerHTML = `<h2>Ciclo ${i+1}</h2>`;

    lista.forEach(nombre => {
      const c = document.createElement("div");
      c.className = "course";
      if (estado[nombre] === "ok") c.classList.add("done");
      if ((delay[nombre] || 0) > 0) c.classList.add("available");

      c.innerHTML = `
        <div class="name">${nombre}</div>
        <div class="controls">
          <div class="ctrl ok">✓</div>
          <div class="ctrl no">✕</div>
        </div>
      `;

      c.querySelector(".ok").onclick = () => {
        estado[nombre] = "ok";
        delay[nombre] = 0;
        save();
      };

      c.querySelector(".no").onclick = () => {
        estado[nombre] = "no";
        aplicarDelay(nombre, 1);
        save();
      };

      box.appendChild(c);
    });

    grid.appendChild(box);
  });

  const pct = Math.round((aprobados / total) * 100);
  document.getElementById("progressBar").style.width = pct + "%";
  document.getElementById("progressText").textContent =
    `${aprobados} / ${total} cursos aprobados (${pct}%)`;
}

function save(){
  localStorage.setItem(STORE_STATE, JSON.stringify(estado));
  localStorage.setItem(STORE_DELAY, JSON.stringify(delay));
  render();
}

render();
