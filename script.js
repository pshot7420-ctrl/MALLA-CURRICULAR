document.addEventListener("DOMContentLoaded", () => {
  const STORE_NAME  = "malla_nombre_v1";
  const STORE_STATE = "malla_estado_v1"; // { [id]: { approved: boolean, fails: number } }

  const welcomeScreen = document.getElementById("welcomeScreen");
  const app = document.getElementById("app");
  const startBtn = document.getElementById("startBtn");
  const nameInput = document.getElementById("nameInput");
  const saludo = document.getElementById("saludo");
  const resetBtn = document.getElementById("resetBtn");

  const grid = document.getElementById("grid");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  // =========================
  // DATOS: CURSOS + CICLO
  // =========================
  // Usamos IDs únicos (importante para Electivos)
  const courses = [
    // Ciclo 1
    { id:"ACTIVIDADES_ARTISTICAS_Y_DEPORTIVAS", name:"ACTIVIDADES ARTÍSTICAS Y DEPORTIVAS", cycle:1, prereq:[] },
    { id:"TALLER_METODOS_ESTUDIO", name:"TALLER DE MÉTODOS DEL ESTUDIO UNIVERSITARIO", cycle:1, prereq:[] },
    { id:"TALLER_ARGUMENTACION", name:"TALLER DE ARGUMENTACIÓN ORAL Y ESCRITA", cycle:1, prereq:[] },
    { id:"INTRO_ING_INDUSTRIAL", name:"INTRODUCCIÓN A LA INGENIERÍA INDUSTRIAL", cycle:1, prereq:[] },
    { id:"MATEMATICAS", name:"MATEMÁTICAS", cycle:1, prereq:[] },
    { id:"QUIMICA", name:"QUÍMICA", cycle:1, prereq:[] },
    { id:"INGLES_I", name:"INGLÉS I", cycle:1, prereq:[] },

    // Ciclo 2
    { id:"TALLER_INTERPRETACION_REDACCION", name:"TALLER DE INTERPRETACIÓN Y REDACCIÓN DE TEXTOS", cycle:2, prereq:[] },
    { id:"FILOSOFIA_Y_ETICA", name:"FILOSOFÍA Y ÉTICA", cycle:2, prereq:[] },
    { id:"PSICOLOGIA_GENERAL", name:"PSICOLOGÍA GENERAL", cycle:2, prereq:[] },
    { id:"FORMACION_HISTORICA_PERU", name:"FORMACIÓN HISTÓRICA DEL PERÚ", cycle:2, prereq:[] },
    { id:"MATEMATICA_I", name:"MATEMÁTICA I", cycle:2, prereq:["MATEMATICAS"] },
    { id:"FISICA_I", name:"FÍSICA I", cycle:2, prereq:["MATEMATICAS"] },
    { id:"QUIMICA_INDUSTRIAL", name:"QUÍMICA INDUSTRIAL", cycle:2, prereq:["QUIMICA"] },
    { id:"INGLES_II", name:"INGLÉS II", cycle:2, prereq:["INGLES_I"] },

    // Ciclo 3
    { id:"RECURSOS_NATURALES_MEDIO_AMBIENTE", name:"RECURSOS NATURALES Y MEDIO AMBIENTE", cycle:3, prereq:[] },
    { id:"REALIDAD_NACIONAL", name:"REALIDAD NACIONAL", cycle:3, prereq:[] },
    { id:"ALGORITMOS_COMPUTACIONALES", name:"ALGORITMOS COMPUTACIONALES", cycle:3, prereq:[] },
    { id:"MATEMATICA_II", name:"MATEMÁTICA II", cycle:3, prereq:["MATEMATICA_I"] },
    { id:"FISICA_II", name:"FÍSICA II", cycle:3, prereq:["FISICA_I"] },
    { id:"ADMINISTRACION_INDUSTRIAL", name:"ADMINISTRACIÓN INDUSTRIAL", cycle:3, prereq:["INTRO_ING_INDUSTRIAL"] },
    { id:"GLOBALIZACION_E_INTEGRACION", name:"GLOBALIZACIÓN E INTEGRACIÓN", cycle:3, prereq:[] },

    // Ciclo 4
    { id:"FUNDAMENTOS_DE_ECONOMIA", name:"FUNDAMENTOS DE ECONOMÍA", cycle:4, prereq:["MATEMATICA_II"] },
    { id:"MINERIA_DE_DATOS", name:"MINERÍA DE DATOS", cycle:4, prereq:["ALGORITMOS_COMPUTACIONALES"] },
    { id:"INGENIERIA_DE_PROCESOS_INDUSTRIALES", name:"INGENIERÍA DE PROCESOS INDUSTRIALES", cycle:4, prereq:["ADMINISTRACION_INDUSTRIAL"] },
    { id:"DIBUJO_EN_INGENIERIA", name:"DIBUJO EN INGENIERÍA", cycle:4, prereq:[] },
    { id:"ESTADISTICA_Y_PROBABILIDADES", name:"ESTADÍSTICA Y PROBABILIDADES", cycle:4, prereq:["MATEMATICA_II"] },
    { id:"INGENIERIA_MECANICA_ELECTRICA", name:"INGENIERÍA MECÁNICA ELÉCTRICA", cycle:4, prereq:["FISICA_II"] },

    // Ciclo 5
    { id:"INGENIERIA_COSTOS_Y_PRESUPUESTOS", name:"INGENIERÍA DE COSTOS Y PRESUPUESTOS", cycle:5, prereq:["FUNDAMENTOS_DE_ECONOMIA"] },
    { id:"LENGUAJES_DE_PROGRAMACION", name:"LENGUAJES DE PROGRAMACIÓN", cycle:5, prereq:["MINERIA_DE_DATOS"] },
    { id:"INGENIERIA_DE_METODOS_I", name:"INGENIERÍA DE MÉTODOS I", cycle:5, prereq:["ADMINISTRACION_INDUSTRIAL"] },
    { id:"ESTADISTICA_INFERENCIAL", name:"ESTADÍSTICA INFERENCIAL", cycle:5, prereq:["ESTADISTICA_Y_PROBABILIDADES"] },
    { id:"INGENIERIA_DE_MATERIALES", name:"INGENIERÍA DE MATERIALES", cycle:5, prereq:["INGENIERIA_MECANICA_ELECTRICA"] },
    { id:"DISENO_ASISTIDO_POR_COMPUTADORA", name:"DISEÑO ASISTIDO POR COMPUTADORA", cycle:5, prereq:["DIBUJO_EN_INGENIERIA"] },

    // Ciclo 6
    { id:"INGENIERIA_FINANCIERA", name:"INGENIERÍA FINANCIERA", cycle:6, prereq:["INGENIERIA_COSTOS_Y_PRESUPUESTOS"] },
    { id:"INVESTIGACION_DE_OPERACIONES", name:"INVESTIGACIÓN DE OPERACIONES", cycle:6, prereq:["LENGUAJES_DE_PROGRAMACION"] },
    { id:"INGENIERIA_DE_METODOS_II", name:"INGENIERÍA DE MÉTODOS II", cycle:6, prereq:["INGENIERIA_DE_METODOS_I"] },
    { id:"DISENO_DE_EXPERIMENTOS", name:"DISEÑO DE EXPERIMENTOS", cycle:6, prereq:["ESTADISTICA_INFERENCIAL"] },
    { id:"TECNOLOGIA_BASICA_DE_FABRICACION", name:"TECNOLOGÍA BÁSICA DE FABRICACIÓN", cycle:6, prereq:["DISENO_ASISTIDO_POR_COMPUTADORA"] },

    // Ciclo 7
    { id:"INGENIERIA_ECONOMICA", name:"INGENIERÍA ECONÓMICA", cycle:7, prereq:["INGENIERIA_FINANCIERA"] },
    { id:"MODELAMIENTO_Y_SIMULACION_DE_PROCESOS", name:"MODELAMIENTO Y SIMULACIÓN DE PROCESOS", cycle:7, prereq:["INVESTIGACION_DE_OPERACIONES"] },
    { id:"LOGISTICA_Y_CADENA_DE_SUMINISTRO", name:"LOGÍSTICA Y CADENA DE SUMINISTRO", cycle:7, prereq:["INGENIERIA_DE_METODOS_II"] },
    { id:"CONTROL_ESTADISTICO_DE_LA_CALIDAD", name:"CONTROL ESTADÍSTICO DE LA CALIDAD", cycle:7, prereq:["DISENO_DE_EXPERIMENTOS"] },
    { id:"INGENIERIA_DE_PLANTA_Y_MANTENIMIENTO", name:"INGENIERÍA DE PLANTA Y MANTENIMIENTO", cycle:7, prereq:["TECNOLOGIA_BASICA_DE_FABRICACION"] },

    // Ciclo 8
    { id:"DISENO_Y_EVALUACION_DE_PROYECTOS_DE_INVERSION", name:"DISEÑO Y EVALUACIÓN DE PROYECTOS DE INVERSIÓN", cycle:8, prereq:["INGENIERIA_ECONOMICA"] },
    { id:"PLANEAMIENTO_Y_CONTROL_DE_OPERACIONES", name:"PLANEAMIENTO Y CONTROL DE OPERACIONES", cycle:8, prereq:["LOGISTICA_Y_CADENA_DE_SUMINISTRO"] },
    { id:"TEORIA_Y_METODOLOGIA_DE_LA_INVESTIGACION", name:"TEORÍA Y METODOLOGÍA DE LA INVESTIGACIÓN", cycle:8, prereq:["CONTROL_ESTADISTICO_DE_LA_CALIDAD"] },
    { id:"INGENIERIA_DE_PROCESOS_EMPRESARIALES", name:"INGENIERÍA DE PROCESOS EMPRESARIALES", cycle:8, prereq:["MODELAMIENTO_Y_SIMULACION_DE_PROCESOS"] },
    { id:"SISTEMA_DE_GESTION_DE_CALIDAD", name:"SISTEMA DE GESTIÓN DE CALIDAD", cycle:8, prereq:["CONTROL_ESTADISTICO_DE_LA_CALIDAD"] },
    { id:"MANUFACTURA_ASISTIDA_POR_COMPUTADORA", name:"MANUFACTURA ASISTIDA POR COMPUTADORA", cycle:8, prereq:["INGENIERIA_DE_PLANTA_Y_MANTENIMIENTO"] },

    // Ciclo 9
    { id:"GERENCIA_DE_PROYECTOS_DE_INGENIERIA", name:"GERENCIA DE PROYECTOS DE INGENIERÍA", cycle:9, prereq:["DISENO_Y_EVALUACION_DE_PROYECTOS_DE_INVERSION"] },
    { id:"ELECTIVO_1", name:"ELECTIVO 1", cycle:9, prereq:[] },
    { id:"AUTOMATIZACION_INDUSTRIAL", name:"AUTOMATIZACIÓN INDUSTRIAL", cycle:9, prereq:["DISENO_Y_EVALUACION_DE_PROYECTOS_DE_INVERSION","PLANEAMIENTO_Y_CONTROL_DE_OPERACIONES"] },
    { id:"MARKETING_E_INVESTIGACION_DE_MERCADOS_INDUSTRIALES", name:"MARKETING E INVESTIGACIÓN DE MERCADOS INDUSTRIALES", cycle:9, prereq:["PLANEAMIENTO_Y_CONTROL_DE_OPERACIONES"] },
    { id:"TALLER_DE_INVESTIGACION_I", name:"TALLER DE INVESTIGACIÓN I", cycle:9, prereq:["TEORIA_Y_METODOLOGIA_DE_LA_INVESTIGACION"] },
    { id:"SEGURIDAD_Y_SALUD_EN_EL_TRABAJO", name:"SEGURIDAD Y SALUD EN EL TRABAJO", cycle:9, prereq:["SISTEMA_DE_GESTION_DE_CALIDAD"] },

    // Ciclo 10
    { id:"ELECTIVO_2", name:"ELECTIVO 2", cycle:10, prereq:[] },
    { id:"ELECTIVO_3", name:"ELECTIVO 3", cycle:10, prereq:[] },
    { id:"GESTION_DEL_TALENTO_HUMANO_Y_REINGENIERIA_ORGANIZACIONAL", name:"GESTIÓN DEL TALENTO HUMANO Y REINGENIERÍA ORGANIZACIONAL", cycle:10, prereq:["MARKETING_E_INVESTIGACION_DE_MERCADOS_INDUSTRIALES"] },
    { id:"TALLER_DE_INVESTIGACION_II", name:"TALLER DE INVESTIGACIÓN II", cycle:10, prereq:["TALLER_DE_INVESTIGACION_I"] },
    { id:"GESTION_AMBIENTAL_Y_RESPONSABILIDAD_SOCIAL", name:"GESTIÓN AMBIENTAL Y RESPONSABILIDAD SOCIAL", cycle:10, prereq:["SEGURIDAD_Y_SALUD_EN_EL_TRABAJO"] },
    { id:"DEONTOLOGIA_PARA_INGENIERIA", name:"DEONTOLOGÍA PARA INGENIERÍA", cycle:10, prereq:[] }, // requisito de créditos: no lo forzamos para no bloquear
  ];

  const byId = Object.fromEntries(courses.map(c => [c.id, c]));

  // =========================
  // ESTADO (aprobado + fallas)
  // =========================
  function loadState(){
    const raw = localStorage.getItem(STORE_STATE);
    if (!raw) return {};
    try { return JSON.parse(raw) || {}; } catch { return {}; }
  }
  function saveState(state){
    localStorage.setItem(STORE_STATE, JSON.stringify(state));
  }

  let state = loadState(); // { [id]: { approved:boolean, fails:number } }

  function ensureCourseState(id){
    if (!state[id]) state[id] = { approved:false, fails:0 };
    if (typeof state[id].approved !== "boolean") state[id].approved = false;
    if (typeof state[id].fails !== "number") state[id].fails = 0;
  }
  courses.forEach(c => ensureCourseState(c.id));

  // =========================
  // LOGIN
  // =========================
  function showApp(name){
    localStorage.setItem(STORE_NAME, name);
    saludo.textContent = `Hola, ${name} 👋`;
    welcomeScreen.style.display = "none";
    app.style.display = "block";
    render();
  }

  const storedName = localStorage.getItem(STORE_NAME);
  if (storedName && storedName.trim()) {
    showApp(storedName.trim());
  } else {
    welcomeScreen.style.display = "flex";
    app.style.display = "none";
  }

  startBtn.addEventListener("click", () => {
    const val = (nameInput.value || "").trim();
    if (!val) return alert("Escribe tu nombre y apellido 🙂");
    showApp(val);
  });

  resetBtn.addEventListener("click", () => {
    if (!confirm("¿Reiniciar todo? Se borrará tu avance y tu nombre.")) return;
    localStorage.removeItem(STORE_NAME);
    localStorage.removeItem(STORE_STATE);
    location.reload();
  });

  // =========================
  // PLANIFICACIÓN (LÓGICA CLAVE)
  // =========================
  // Regla:
  // - BaseCycle = ciclo original
  // - Si ✕ => fails++, entonces curso se empuja al menos 1 ciclo (por cada fail)
  // - Si prereq NO está aprobado => curso no puede ir antes de (plan(prereq)+1)
  // - Si prereq sí está aprobado => solo se respeta max con plan(prereq)
  // Resultado: se mueven SOLO los cursos afectados y sus dependientes, el resto queda en su ciclo.
  function computePlannedCycles(){
    const memo = new Map();
    const visiting = new Set();

    function plan(id){
      if (memo.has(id)) return memo.get(id);
      if (visiting.has(id)) return byId[id].cycle; // fallback anti-loop
      visiting.add(id);

      ensureCourseState(id);
      const c = byId[id];
      let p = c.cycle + (state[id].fails || 0);

      for (const pre of c.prereq){
        if (!byId[pre]) continue;
        ensureCourseState(pre);

        const prePlan = plan(pre);
        const extra = state[pre].approved ? 0 : 1;  // si NO aprobó prereq => al menos ciclo siguiente
        p = Math.max(p, prePlan + extra);
      }

      visiting.delete(id);
      memo.set(id, p);
      return p;
    }

    const planned = {};
    for (const c of courses){
      planned[c.id] = plan(c.id);
    }
    return planned;
  }

  // =========================
  // UI + RENDER
  // =========================
  function render(){
    const planned = computePlannedCycles();

    // determinar máximo ciclo (para crear ciclo 11+ si hace falta)
    let maxCycle = 10;
    for (const id of Object.keys(planned)){
      maxCycle = Math.max(maxCycle, planned[id]);
    }

    // agrupar cursos por ciclo planificado
    const buckets = Array.from({length: maxCycle}, () => []);
    for (const c of courses){
      const cyc = planned[c.id];
      buckets[cyc - 1].push(c.id);
    }

    // ordenar dentro de cada ciclo: por ciclo original y luego por nombre
    for (const list of buckets){
      list.sort((a,b) => {
        const A = byId[a], B = byId[b];
        if (A.cycle !== B.cycle) return A.cycle - B.cycle;
        return A.name.localeCompare(B.name, 'es');
      });
    }

    // progreso
    const total = courses.length;
    const approvedCount = courses.filter(c => state[c.id]?.approved).length;
    const pct = Math.round((approvedCount / total) * 100);

    progressBar.style.width = `${pct}%`;
    progressText.textContent = `${approvedCount} / ${total} cursos aprobados (${pct}%)`;

    // pintar ciclos SIEMPRE (1..10) y los extras (11+)
    grid.innerHTML = "";
    for (let i = 1; i <= maxCycle; i++){
      const cycleCard = document.createElement("div");
      cycleCard.className = "cycle card";

      const title = document.createElement("h2");
      title.textContent = `Ciclo ${i}`;
      cycleCard.appendChild(title);

      const list = buckets[i-1] || [];
      if (list.length === 0){
        const sub = document.createElement("div");
        sub.className = "sub";
        sub.textContent = "Sin cursos programados";
        cycleCard.appendChild(sub);
      } else {
        for (const id of list){
          ensureCourseState(id);

          const c = byId[id];
          const cs = state[id];
          const isDone = !!cs.approved;
          const isMoved = (planned[id] !== c.cycle);

          const card = document.createElement("div");
          card.className = "course" + (isDone ? " done" : "");

          const name = document.createElement("div");
          name.className = "name";
          name.textContent = c.name;

          const meta = document.createElement("div");
          meta.className = "meta";

          const parts = [];
          if (isMoved){
            parts.push(`Reprogramado desde Ciclo ${c.cycle}`);
          }
          if (c.prereq.length){
            const preNames = c.prereq.map(pid => byId[pid]?.name).filter(Boolean);
            parts.push(`Prerequisito: ${preNames.join(", ")}`);
          }
          meta.textContent = parts.join(" • ");

          const controls = document.createElement("div");
          controls.className = "controls";

          const ok = document.createElement("button");
          ok.className = "ctrl ok";
          ok.type = "button";
          ok.textContent = "✓";
          ok.title = "Aprobado";
          ok.addEventListener("click", () => {
            cs.approved = true;
            saveState(state);
            render();
          });

          const no = document.createElement("button");
          no.className = "ctrl no";
          no.type = "button";
          no.textContent = "✕";
          no.title = "Jalado / No llevado";
          no.addEventListener("click", () => {
            // al jalar/no llevar: se vuelve NO aprobado y se reprograma (fails++)
            cs.approved = false;
            cs.fails = (cs.fails || 0) + 1;
            saveState(state);
            render();
          });

          controls.append(ok, no);
          card.append(name, controls);

          if (meta.textContent.trim()){
            card.appendChild(meta);
          }

          cycleCard.appendChild(card);
        }
      }

      grid.appendChild(cycleCard);
    }
  }

  // Render inicial (si ya hay nombre guardado)
  if (storedName && storedName.trim()){
    render();
  }
});
