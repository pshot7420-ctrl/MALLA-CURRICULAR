document.addEventListener("DOMContentLoaded", () => {
  const STORE_STATE = "estado_cursos_v9";
  const STORE_SHIFT = "shift_cursos_v9";

  const grid = document.getElementById("grid");
  const resetBtn = document.getElementById("resetBtn");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  let estado = JSON.parse(localStorage.getItem(STORE_STATE) || "{}");
  let shift = JSON.parse(localStorage.getItem(STORE_SHIFT) || "{}");

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

  // requisito -> dependientes (cadena)
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
    "DIBUJO EN INGENIERÍA":["DISEÑO ASISTIDO POR COMPUTADORA"],

    "INGENIERÍA DE COSTOS Y PRESUPUESTOS":["INGENIERÍA FINANCIERA"],
    "LENGUAJES DE PROGRAMACIÓN":["INVESTIGACIÓN DE OPERACIONES"],
    "INGENIERÍA DE MÉTODOS I":["INGENIERÍA DE MÉTODOS II"],
    "ESTADÍSTICA INFERENCIAL":["DISEÑO DE EXPERIMENTOS"],
    "DISEÑO ASISTIDO POR COMPUTADORA":["TECNOLOGÍA BÁSICA DE FABRICACIÓN"],

    "INGENIERÍA FINANCIERA":["INGENIERÍA ECONÓMICA"],
    "INVESTIGACIÓN DE OPERACIONES":["MODELAMIENTO Y SIMULACIÓN DE PROCESOS"],
    "INGENIERÍA DE MÉTODOS II":["LOGÍSTICA Y CADENA DE SUMINISTRO"],
    "DISEÑO DE EXPERIMENTOS":["CONTROL ESTADÍSTICO DE LA CALIDAD"],
    "TECNOLOGÍA BÁSICA DE FABRICACIÓN":["INGENIERÍA DE PLANTA Y MANTENIMIENTO"],

    "INGENIERÍA ECONÓMICA":["DISEÑO Y EVALUACIÓN DE PROYECTOS DE INVERSIÓN"],
    "LOGÍSTICA Y CADENA DE SUMINISTRO":["PLANEAMIENTO Y CONTROL DE OPERACIONES"],
    "CONTROL ESTADÍSTICO DE LA CALIDAD":["SISTEMA DE GESTIÓN DE CALIDAD","TEORÍA Y METODOLOGÍA DE LA INVESTIGACIÓN"],
    "MODELAMIENTO Y SIMULACIÓN DE PROCESOS":["INGENIERÍA DE PROCESOS EMPRESARIALES"],
    "INGENIERÍA DE PLANTA Y MANTENIMIENTO":["MANUFACTURA ASISTIDA POR COMPUTADORA"],

    "DISEÑO Y EVALUACIÓN DE PROYECTOS DE INVERSIÓN":["GERENCIA DE PROYECTOS DE INGENIERÍA","AUTOMATIZACIÓN INDUSTRIAL"],
    "PLANEAMIENTO Y CONTROL DE OPERACIONES":["MARKETING E INVESTIGACIÓN DE MERCADOS INDUSTRIALES"],
    "TEORÍA Y METODOLOGÍA DE LA INVESTIGACIÓN":["TALLER DE INVESTIGACIÓN I"],
    "SISTEMA DE GESTIÓN DE CALIDAD":["SEGURIDAD Y SALUD EN EL TRABAJO"],

    "MARKETING E INVESTIGACIÓN DE MERCADOS INDUSTRIALES":["GESTIÓN DEL TALENTO HUMANO Y REINGENIERÍA ORGANIZACIONAL"],
    "TALLER DE INVESTIGACIÓN I":["TALLER DE INVESTIGACIÓN II"],
    "SEGURIDAD Y SALUD EN EL TRABAJO":["GESTIÓN AMBIENTAL Y RESPONSABILIDAD SOCIAL"]
  };

  const baseCycle = {};
  cursosBase.forEach((lista, i) => lista.forEach(c => baseCycle[c] = i));

  function empujar(curso){
    shift[curso] = (shift[curso] || 0) + 1;
    (dependencias[curso] || []).forEach(dep => empujar(dep));
  }

  function guardar(){
    localStorage.setItem(STORE_STATE, JSON.stringify(estado));
    localStorage.setItem(STORE_SHIFT, JSON.stringify(shift));
    render();
  }

  function render(){
    grid.innerHTML = "";

    const ciclos = [];
    Object.keys(baseCycle).forEach(curso => {
      const base = baseCycle[curso];
      const s = shift[curso] || 0;
      const cf = base + s;
      if (!ciclos[cf]) ciclos[cf] = [];
      ciclos[cf].push(curso);
    });

    const maxCycle = Math.max(10, ciclos.length);

    for (let i = 0; i < maxCycle; i++){
      const box = document.createElement("div");
      box.className = "cycle card";
      box.innerHTML = `<h2>Ciclo ${i+1}</h2>`;

      (ciclos[i] || []).forEach(curso => {
        const card = document.createElement("div");
        card.className = "course" + (estado[curso] === "ok" ? " done" : "");

        const name = document.createElement("div");
        name.className = "name";
        name.textContent = curso;

        const controls = document.createElement("div");
        controls.className = "controls";

        const okBtn = document.createElement("button");
        okBtn.type = "button";
        okBtn.className = "ctrl ok";
        okBtn.textContent = "✓";
        okBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          estado[curso] = "ok";
          guardar();
        });

        const noBtn = document.createElement("button");
        noBtn.type = "button";
        noBtn.className = "ctrl no";
        noBtn.textContent = "✕";
        noBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          empujar(curso);
          guardar();
        });

        controls.append(okBtn, noBtn);
        card.append(name, controls);
        box.appendChild(card);
      });

      grid.appendChild(box);
    }

    // progreso
    let total = Object.keys(baseCycle).length;
    let ok = Object.values(estado).filter(v => v === "ok").length;
    const pct = total ? Math.round((ok / total) * 100) : 0;
    progressBar.style.width = pct + "%";
    progressText.textContent = `${ok} / ${total} cursos aprobados (${pct}%)`;
  }

  resetBtn.addEventListener("click", () => {
    if (!confirm("¿Reiniciar la malla? Se borrará todo el progreso.")) return;
    estado = {};
    shift = {};
    localStorage.removeItem(STORE_STATE);
    localStorage.removeItem(STORE_SHIFT);
    render();
  });

  render();
});
