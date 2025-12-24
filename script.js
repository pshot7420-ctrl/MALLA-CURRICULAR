document.addEventListener("DOMContentLoaded", () => {
  const STORE_STATE = "estado_cursos_v13";
  const STORE_SHIFT = "shift_cursos_v13";
  const STORE_NAME  = "nombre_usuario_v1";

  const grid = document.getElementById("grid");
  const resetBtn = document.getElementById("resetBtn");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const saludo = document.getElementById("saludo");

  const welcomeScreen = document.getElementById("welcomeScreen");
  const app = document.getElementById("app");
  const startBtn = document.getElementById("startBtn");
  const nameInput = document.getElementById("nameInput");

  let estado = JSON.parse(localStorage.getItem(STORE_STATE) || "{}");
  let shift = JSON.parse(localStorage.getItem(STORE_SHIFT) || {});
  let nombre = localStorage.getItem(STORE_NAME);

  /* =========================
     MANEJO DE NOMBRE
  ========================= */
  function iniciarApp(nombreUsuario){
    nombre = nombreUsuario;
    localStorage.setItem(STORE_NAME, nombreUsuario);
    saludo.textContent = `Hola, ${nombreUsuario} 👋`;
    welcomeScreen.style.display = "none";
    app.style.display = "block";
    render();
  }

  if(nombre){
    iniciarApp(nombre);
  }

  startBtn.onclick = () => {
    const val = nameInput.value.trim();
    if(!val) return alert("Por favor, escribe tu nombre");
    iniciarApp(val);
  };

  /* =========================
     MALLA BASE (igual que antes)
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
    ["GERENCIA DE PROYECTOS DE INGENIERÍA","AUTOMATIZACIÓN INDUSTRIAL","MARKETING E INVESTIGACIÓN DE MERCADOS INDUSTRIALES","TALLER DE INVESTIGACIÓN I","SEGURIDAD Y SALUD EN EL TRABAJO","ELECTIVO_1"],
    ["ELECTIVO_2","ELECTIVO_3","GESTIÓN DEL TALENTO HUMANO Y REINGENIERÍA ORGANIZACIONAL","TALLER DE INVESTIGACIÓN II","GESTIÓN AMBIENTAL Y RESPONSABILIDAD SOCIAL","DEONTOLOGÍA PARA INGENIERÍA"]
  ];

  const baseCycle = {};
  cursosBase.forEach((lista, i) => lista.forEach(c => baseCycle[c] = i));

  function nombreBonito(id){
    if(id === "ELECTIVO_1") return "ELECTIVO 1";
    if(id === "ELECTIVO_2") return "ELECTIVO 2";
    if(id === "ELECTIVO_3") return "ELECTIVO 3";
    return id;
  }

  function render(){
    if(!nombre) return;

    grid.innerHTML = "";
    const ciclos = [];

    Object.keys(baseCycle).forEach(curso => {
      const base = baseCycle[curso];
      const s = shift[curso] || 0;
      const cf = base + s;
      if(!ciclos[cf]) ciclos[cf] = [];
      ciclos[cf].push(curso);
    });

    const maxCycle = Math.max(10, ciclos.length);

    for(let i=0;i<maxCycle;i++){
      const box = document.createElement("div");
      box.className = "cycle card";
      box.innerHTML = `<h2>Ciclo ${i+1}</h2>`;

      (ciclos[i]||[]).forEach(curso=>{
        const card = document.createElement("div");
        card.className = "course" + (estado[curso]==="ok" ? " done" : "");

        card.innerHTML = `
          <div class="name">${nombreBonito(curso)}</div>
          <div class="controls">
            <button class="ctrl ok">✓</button>
            <button class="ctrl no">✕</button>
          </div>
        `;

        card.querySelector(".ok").onclick = ()=>{
          estado[curso] = "ok";
          guardar();
        };
        card.querySelector(".no").onclick = ()=>{
          shift[curso] = (shift[curso]||0)+1;
          guardar();
        };

        box.appendChild(card);
      });

      grid.appendChild(box);
    }

    const total = Object.keys(baseCycle).length;
    const ok = Object.values(estado).filter(v=>v==="ok").length;
    const pct = Math.round(ok/total*100);
    progressBar.style.width = pct+"%";
    progressText.textContent = `${ok} / ${total} cursos aprobados (${pct}%)`;
  }

  function guardar(){
    localStorage.setItem(STORE_STATE, JSON.stringify(estado));
    localStorage.setItem(STORE_SHIFT, JSON.stringify(shift));
    render();
  }

  resetBtn.onclick = ()=>{
    if(!confirm("¿Reiniciar todo?")) return;
    estado = {};
    shift = {};
    nombre = null;
    localStorage.clear();
    location.reload();
  };
});
