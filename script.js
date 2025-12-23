const STORAGE = "malla_estado_vfinal";
let estado = JSON.parse(localStorage.getItem(STORAGE)) || {};

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

function render() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  let total = 0, approved = 0;

  ciclosBase.forEach((cursos, i) => {
    const box = document.createElement("div");
    box.className = "cycle";
    box.innerHTML = `<h3>Ciclo ${i + 1}</h3>`;

    cursos.forEach(nombre => {
      total++;
      if (estado[nombre] === "ok") approved++;

      const course = document.createElement("div");
      course.className = "course" + (estado[nombre] === "ok" ? " approved" : "");

      course.innerHTML = `
        <div class="course-title">${nombre}</div>
        <div class="course-actions">
          <button class="btn-ok">Aprobado</button>
          <button class="btn-no">No aprobado</button>
        </div>
      `;

      course.querySelector(".btn-ok").onclick = () => {
        estado[nombre] = "ok";
        save();
      };

      course.querySelector(".btn-no").onclick = () => {
        estado[nombre] = "no";
        save();
      };

      box.appendChild(course);
    });

    grid.appendChild(box);
  });

  const pct = Math.round((approved / total) * 100);
  document.getElementById("progressBar").style.width = pct + "%";
  document.getElementById("progressText").textContent =
    `${approved} de ${total} cursos aprobados (${pct}%)`;
}

function save() {
  localStorage.setItem(STORAGE, JSON.stringify(estado));
  render();
}

render();
