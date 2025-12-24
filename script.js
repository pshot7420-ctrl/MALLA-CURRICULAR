const STORE_STATE = "estado_cursos";
const STORE_DRAG = "cursos_arrastrados";

let estado = JSON.parse(localStorage.getItem(STORE_STATE)) || {};
let arrastrados = JSON.parse(localStorage.getItem(STORE_DRAG)) || {};

/* ===== MALLA BASE ===== */
const ciclosBase = [
  ["ACTIVIDADES ARTÍSTICAS Y DEPORTIVAS","TALLER DE MÉTODOS DEL ESTUDIO UNIVERSITARIO","TALLER DE ARGUMENTACIÓN ORAL Y ESCRITA","INTRODUCCIÓN A LA INGENIERÍA INDUSTRIAL","MATEMÁTICAS","QUÍMICA","INGLÉS I"],
  ["TALLER DE INTERPRETACIÓN Y REDACCIÓN DE TEXTOS","FILOSOFÍA Y ÉTICA","PSICOLOGÍA GENERAL","FORMACIÓN HISTÓRICA DEL PERÚ","MATEMÁTICA I","FÍSICA I","QUÍMICA INDUSTRIAL","INGLÉS II"],
  ["RECURSOS NATURALES Y MEDIO AMBIENTE","REALIDAD NACIONAL","ALGORITMOS COMPUTACIONALES","MATEMÁTICA II","FÍSICA II","ADMINISTRACIÓN INDUSTRIAL","GLOBALIZACIÓN E INTEGRACIÓN"],
  ["FUNDAMENTOS DE ECONOMÍA","MINERÍA DE DATOS","INGENIERÍA DE PROCESOS INDUSTRIALES","DIBUJO EN INGENIERÍA","ESTADÍSTICA Y PROBABILIDADES","INGENIERÍA MECÁNICA ELÉCTRICA"],
  ["INGENIERÍA DE COSTOS Y PRESUPUESTOS","LENGUAJES DE PROGRAMACIÓN","INGENIERÍA DE MÉTODOS I","ESTADÍSTICA INFERENCIAL","INGENIERÍA DE MATERIALES","DISEÑO ASISTIDO POR COMPUTADORA"],
  ["INGENIERÍA FINANCIERA","INVESTIGACIÓN DE OPERACIONES","INGENIERÍA DE MÉTODOS II","DISEÑO DE EXPERIMENTOS","TECNOLOGÍA BÁSICA DE FABRICACIÓN"],
  ["INGENIERÍA ECONÓMICA","MODELAMIENTO Y SIMULACIÓN DE PROCESOS","LOGÍSTICA Y CADENA DE SUMINISTRO","CONTROL ESTADÍSTICO DE LA CALIDAD","INGENIERÍA DE PLANTA Y MANTENIMIENTO"],
  ["DISEÑO Y EVALUACIÓN DE PROYECTOS DE INVERSIÓN","PLANEAMIENTO Y CONTROL DE OPERACIONES","TEORÍA Y METODOLOGÍA DE LA INVESTIGACIÓN","INGENIERÍA DE PROCESOS EMPRESARIALES","SISTEMA DE GESTIÓN DE CALIDAD","MANUFACTURA ASISTIDA POR COMPUTADORA"],
  ["GERENCIA DE PROYECTOS DE INGENIERÍA","AUTOMATIZACIÓN INDUSTRIAL","MARKETING E INVESTIGACIÓN DE MERCADOS INDUSTRIALES","TALLER DE INVESTIGACIÓN I","SEGURIDAD Y SALUD EN EL TRABAJO"],
  ["TALLER DE INVESTIGACIÓN II","GESTIÓN DEL TALENTO HUMANO Y REINGENIERÍA ORGANIZACIONAL","GESTIÓN AMBIENTAL Y RESPONSABILIDAD SOCIAL","DEONTOLOGÍA PARA INGENIERÍA"]
];

/* ===== DEPENDENCIAS ===== */
const dependencias = {
  "MATEMÁTICAS":["MATEMÁTICA I","FÍSICA I"],
  "MATEMÁTICA I":["MATEMÁTICA II"],
  "FÍSICA I":["FÍSICA II"],
  "INTRODUCCIÓN A LA INGENIERÍA INDUSTRIAL":["ADMINISTRACIÓN INDUSTRIAL"],
  "ADMINISTRACIÓN INDUSTRIAL":["INGENIERÍA DE PROCESOS INDUSTRIALES","INGENIERÍA DE MÉTODOS I"]
};

/* ===== RENDER ===== */
function render(){
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  let total = 0, aprobados = 0;

  // 1️⃣ Copiar ciclos base
  const ciclos = ciclosBase.map(c => [...c]);

  // 2️⃣ Eliminar cursos arrastrados de su ciclo original
  Object.keys(arrastrados).forEach(curso => {
    ciclos.forEach(ciclo => {
      const idx = ciclo.indexOf(curso);
      if (idx !== -1) ciclo.splice(idx, 1);
    });
  });

  // 3️⃣ Insertarlos SOLO en el ciclo nuevo
  Object.entries(arrastrados).forEach(([curso, ciclo]) => {
    if (ciclos[ciclo]) ciclos[ciclo].push(curso);
  });

  // 4️⃣ Render final
  ciclos.forEach((lista, i) => {
    const box = document.createElement("div");
    box.className = "cycle";
    box.innerHTML = `<h2>Ciclo ${i+1}</h2>`;

    lista.forEach(nombre => {
      total++;
      if (estado[nombre] === "ok") aprobados++;

      const c = document.createElement("div");
      c.className = "course";
      if (estado[nombre] === "ok") c.classList.add("done");
      if (arrastrados[nombre] === i) c.classList.add("available");

      c.innerHTML = `
        <div class="name">${nombre}</div>
        <div class="controls">
          <div class="ctrl ok">✓</div>
          <div class="ctrl no">✕</div>
        </div>
      `;

      c.querySelector(".ok").onclick = () => {
        estado[nombre] = "ok";
        delete arrastrados[nombre];
        save();
      };

      c.querySelector(".no").onclick = () => {
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

/* ===== ARRASTRE EN CADENA ===== */
function moverEnCadena(curso, ciclo){
  arrastrados[curso] = ciclo;
  (dependencias[curso] || []).forEach(dep => {
    arrastrados[dep] = ciclo;
  });
}

function save(){
  localStorage.setItem(STORE_STATE, JSON.stringify(estado));
  localStorage.setItem(STORE_DRAG, JSON.stringify(arrastrados));
  render();
}

render();
