const STORE_STATE = "estado_cursos";
const STORE_MOVED = "cursos_movidos";

let estado = JSON.parse(localStorage.getItem(STORE_STATE)) || {};
let movidos = JSON.parse(localStorage.getItem(STORE_MOVED)) || {};

/* =====================
   MALLA BASE
===================== */
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

/* =====================
   DEPENDENCIAS
===================== */
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
  "MINERÍA DE DATOS":["LENGUAJES DE PROGRAMACIÓN"],
  "ESTADÍSTICA Y PROBABILIDADES":["ESTADÍSTICA INFERENCIAL"],
  "INGENIERÍA MECÁNICA ELÉCTRICA":["INGENIERÍA DE MATERIALES"],
  "DIBUJO EN INGENIERÍA":["DISEÑO ASISTIDO POR COMPUTADORA"]
};

/* =====================
   UTILIDADES
===================== */
function moverEnCadena(curso, ciclo){
  movidos[curso] = ciclo;
  (dependencias[curso] || []).forEach(dep => moverEnCadena(dep, ciclo + 1));
}

function render(){
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  const ciclos = Array.from({length:10}, () => []);
  let total = 0, aprobados = 0;

  cursosBase.forEach((lista, cicloBase) => {
    lista.forEach(curso => {
      total++;

      if(estado[curso] === "ok"){
        aprobados++;
        return;
      }

      const cicloFinal = movidos[curso] ?? cicloBase;
      ciclos[cicloFinal].push(curso);
    });
  });

  ciclos.forEach((lista,i)=>{
    const box = document.createElement("div");
    box.className = "cycle";
    box.innerHTML = `<h2>Ciclo ${i+1}</h2>`;

    lista.forEach(nombre=>{
      const c = document.createElement("div");
      c.className = "course";
      c.innerHTML = `
        <div class="name">${nombre}</div>
        <div class="controls">
          <div class="ctrl ok">✓</div>
          <div class="ctrl no">✕</div>
        </div>
      `;

      c.querySelector(".ok").onclick = ()=>{
        estado[nombre] = "ok";
        delete movidos[nombre];
        save();
      };

      c.querySelector(".no").onclick = ()=>{
        estado[nombre] = "no";
        moverEnCadena(nombre, i+1);
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
  localStorage.setItem(STORE_MOVED, JSON.stringify(movidos));
  render();
}

document.getElementById("resetBtn").onclick = ()=>{
  if(confirm("¿Reiniciar la malla?")){
    estado = {};
    movidos = {};
    localStorage.clear();
    render();
  }
};

render();
