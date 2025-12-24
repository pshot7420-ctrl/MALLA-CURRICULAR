window.onload = function () {

  const STORE_NAME = "nombre_usuario";
  const STORE_STATE = "estado_cursos";
  const STORE_SHIFT = "shift_cursos";

  const grid = document.getElementById("grid");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const welcomeScreen = document.getElementById("welcomeScreen");
  const app = document.getElementById("app");
  const saludo = document.getElementById("saludo");

  let estado = JSON.parse(localStorage.getItem(STORE_STATE) || "{}");
  let shift = JSON.parse(localStorage.getItem(STORE_SHIFT) || {});

  /* ====== DATOS BASE ====== */
  const cursosBase = [
    ["MATEMÁTICAS", "QUÍMICA", "INGLÉS I"],
    ["MATEMÁTICA I", "FÍSICA I", "INGLÉS II"],
    ["MATEMÁTICA II"],
    ["ESTADÍSTICA"],
    ["ELECTIVO_1"],
    ["ELECTIVO_2", "ELECTIVO_3"]
  ];

  const baseCycle = {};
  cursosBase.forEach((c, i) => c.forEach(x => baseCycle[x] = i));

  function nombreBonito(id) {
    if (id === "ELECTIVO_1") return "ELECTIVO 1";
    if (id === "ELECTIVO_2") return "ELECTIVO 2";
    if (id === "ELECTIVO_3") return "ELECTIVO 3";
    return id;
  }

  /* ====== INGRESAR ====== */
  window.ingresar = function () {
    const input = document.getElementById("nameInput");
    const nombre = input.value.trim();

    if (!nombre) {
      alert("Escribe tu nombre");
      return;
    }

    localStorage.setItem(STORE_NAME, nombre);
    saludo.textContent = `Hola, ${nombre} 👋`;

    welcomeScreen.style.display = "none";
    app.style.display = "block";

    render();
  };

  /* ====== RENDER ====== */
  function render() {
    grid.innerHTML = "";

    const ciclos = [];

    Object.keys(baseCycle).forEach(curso => {
      const cicloFinal = baseCycle[curso] + (shift[curso] || 0);
      if (!ciclos[cicloFinal]) ciclos[cicloFinal] = [];
      ciclos[cicloFinal].push(curso);
    });

    ciclos.forEach((lista, i) => {
      const box = document.createElement("div");
      box.className = "cycle card";
      box.innerHTML = `<h2>Ciclo ${i + 1}</h2>`;

      lista.forEach(curso => {
        const d = document.createElement("div");
        d.className = "course" + (estado[curso] === "ok" ? " done" : "");
        d.innerHTML = `
          <div class="name">${nombreBonito(curso)}</div>
          <div class="controls">
            <button class="ctrl ok">✓</button>
            <button class="ctrl no">✕</button>
          </div>
        `;

        d.querySelector(".ok").onclick = () => {
          estado[curso] = "ok";
          guardar();
        };

        d.querySelector(".no").onclick = () => {
          shift[curso] = (shift[curso] || 0) + 1;
          guardar();
        };

        box.appendChild(d);
      });

      grid.appendChild(box);
    });

    const total = Object.keys(baseCycle).length;
    const aprobados = Object.values(estado).filter(v => v === "ok").length;
    const pct = Math.round((aprobados / total) * 100);

    progressBar.style.width = pct + "%";
    progressText.textContent = `${aprobados}/${total} aprobados (${pct}%)`;
  }

  function guardar() {
    localStorage.setItem(STORE_STATE, JSON.stringify(estado));
    localStorage.setItem(STORE_SHIFT, JSON.stringify(shift));
    render();
  }

  window.reiniciar = function () {
    if (!confirm("¿Reiniciar todo?")) return;
    localStorage.clear();
    location.reload();
  };

  /* ====== AUTO INICIO ====== */
  const nombreGuardado = localStorage.getItem(STORE_NAME);
  if (nombreGuardado) {
    saludo.textContent = `Hola, ${nombreGuardado} 👋`;
    welcomeScreen.style.display = "none";
    app.style.display = "block";
    render();
  }

};
