const STORAGE_KEY = "malla_ii_v2_done";

const keyOf = (name) =>
  name
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/* ===== DATOS DE LA MALLA ===== */
const cycles = [ /* ← AQUÍ VA EXACTAMENTE EL MISMO ARRAY
                    DE CICLOS QUE YA TIENES
                    (NO CAMBIA) */ ];

/* ===== CONSTRUIR MAPA DE REQUISITOS ===== */
function buildPrereqMap() {
  const prereq = new Map();

  for (const cyc of cycles) {
    for (const c of cyc.courses) {
      for (const next of c.opens || []) {
        const nextKey = keyOf(next);
        if (!prereq.has(nextKey)) prereq.set(nextKey, new Set());
        prereq.get(nextKey).add(keyOf(c.name));
      }
    }
  }
  return prereq;
}

const prereqMap = buildPrereqMap();
let done = loadDone();

/* ===== LÓGICA ===== */
function isUnlocked(courseKey) {
  const reqs = prereqMap.get(courseKey);
  if (!reqs) return true;
  for (const r of reqs) if (!done.has(r)) return false;
  return true;
}

/* ===== RENDER ===== */
const gridEl = document.getElementById("grid");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

function render() {
  gridEl.innerHTML = "";

  let total = 0;
  let approved = 0;

  for (const cyc of cycles) {
    const section = document.createElement("section");
    section.className = "cycle card";

    section.innerHTML = `<h2>${cyc.title}</h2>
      <div class="sub">Selecciona los cursos aprobados</div>`;

    for (const c of cyc.courses) {
      const k = keyOf(c.name);
      total++;
      if (done.has(k)) approved++;

      const unlocked = isUnlocked(k);

      const btn = document.createElement("button");
      btn.className = `course ${done.has(k) ? "done" : unlocked ? "available" : "locked"}`;
      btn.type = "button";

      btn.innerHTML = `
        <div class="name">${c.name}</div>
        ${
          c.opens.length
            ? `<div class="meta"><span class="badge">Habilita</span>${c.opens.join(", ")}</div>`
            : ""
        }
      `;

      btn.addEventListener("click", () => toggleCourse(k));
      section.appendChild(btn);
    }

    gridEl.appendChild(section);
  }

  const pct = Math.round((approved / total) * 100);
  progressBar.style.width = `${pct}%`;
  progressText.textContent = `${approved} / ${total} cursos aprobados (${pct}%)`;
}

function toggleCourse(k) {
  if (done.has(k)) {
    done.delete(k);
  } else {
    done.add(k);
  }
  saveDone();
  render();
}

/* ===== STORAGE ===== */
function loadDone() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
  } catch {
    return new Set();
  }
}

function saveDone() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...done]));
}

render();
