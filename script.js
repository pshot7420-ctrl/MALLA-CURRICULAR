document.addEventListener("DOMContentLoaded", () => {
  const STORE_STATE = "estado_cursos_v10";
  const STORE_SHIFT = "shift_cursos_v10";

  const grid = document.getElementById("grid");
  const resetBtn = document.getElementById("resetBtn");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  let estado = JSON.parse(localStorage.getItem(STORE_STATE) || "{}");
  let shift = JSON.parse(localStorage.getItem(STORE_SHIFT) || "{}");

  /* =========================
     MALLA BASE (CORREGIDA)
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

    // Ciclo 9  ✅ + ELECTIVO
    ["GERENCIA DE PROYECTOS DE INGENIERÍA","AUTOMATIZACIÓN INDUSTRIAL","MARKETING E INVESTIGACIÓN DE MERCADOS INDUSTRIALES","TALLER DE INVESTIGACIÓN I","SEGURIDAD Y SALUD EN EL TRABAJO","ELECTIVO"],

    // Ciclo 10 ✅ + 2 ELECTIVOS
    ["ELECTIVO","ELECTIVO","GESTIÓN DEL TALENTO HUMANO Y REINGENIERÍA ORGANIZACIONAL","TALLER DE INVESTIGACIÓN II","GESTIÓN AMBIENTAL Y RESPONSABILIDAD SOCIAL","DEONTOLOGÍA PARA INGENIERÍA"]
  ];

  /* =========================
     DEPENDENCIAS
  ========================= */
  const dependencias = {
    "MATEMÁTICAS":["MATEMÁTICA I","FÍSICA I"],
    "MATEMÁTICA I":["MATEMÁTICA II"],
    "MATEMÁTICA II":["FUNDAMENTOS DE ECONOMÍA","ESTADÍSTICA Y PROBABILIDADES"],
    "FUNDAMENTOS DE ECONOMÍA":["INGENIERÍA DE COSTOS Y PRESUPUESTOS"],
    "ESTADÍSTICA Y PROBABILIDADES":["ESTADÍSTICA INFERENCIAL"]
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
        okBtn.onclick = () => {
          estado[curso] = "ok";
          guardar();
        };

        const noBtn = document.createElement("button");
        noBtn.type = "button";
        noBtn.className = "ctrl no";
        noBtn.textContent = "✕";
        noBtn.onclick = () => {
          empujar(curso);
          guardar();
        };

        controls.append(okBtn, noBtn);
        card.append(name, controls);
        box.appendChild(card);
      });

      grid.appendChild(box);
    }

    const total = Object.keys(baseCycle).length;
    const ok = Object.values(estado).filter(v => v === "ok").length;
    const pct = Math.round((ok / total) * 100);
    progressBar.style.width = pct + "%";
    progressText.textContent = `${ok} / ${total} cursos aprobados (${pct}%)`;
  }

  resetBtn.onclick = () => {
    if (!confirm("¿Reiniciar la malla?")) return;
    estado = {};
    shift = {};
    localStorage.clear();
    render();
  };

  render();
});
