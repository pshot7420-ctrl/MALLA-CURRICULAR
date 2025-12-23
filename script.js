const STORAGE = "malla_v3";
const THEME = "theme";
let done = new Set(JSON.parse(localStorage.getItem(STORAGE)) || []);
let currentCycle = 1;

const cycles = [
  { title:"Ciclo 1", courses:[
    {n:"ACTIVIDADES ARTÍSTICAS Y DEPORTIVAS", h:[]},
    {n:"TALLER DE MÉTODOS DEL ESTUDIO UNIVERSITARIO", h:[]},
    {n:"TALLER DE ARGUMENTACIÓN ORAL Y ESCRITA", h:[]},
    {n:"INTRODUCCIÓN A LA INGENIERÍA INDUSTRIAL", h:["ADMINISTRACIÓN INDUSTRIAL"]},
    {n:"MATEMÁTICAS", h:["MATEMÁTICA I","FÍSICA I"]},
    {n:"QUÍMICA", h:["QUÍMICA INDUSTRIAL"]},
    {n:"INGLÉS I", h:["INGLÉS II"]}
  ]},
  /* 🔴 SIGUEN TODOS LOS CICLOS IGUAL QUE ANTES 🔴 */
];

const key = t => t.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();

const prereq = {};
cycles.forEach(c =>
  c.courses.forEach(r =>
    r.h.forEach(d => {
      prereq[key(d)] ??= new Set();
      prereq[key(d)].add(key(r.n));
    })
  )
);

const grid = document.getElementById("grid");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const alertText = document.getElementById("alertText");

function render() {
  grid.innerHTML = "";
  let total = 0, ok = 0, dragged = 0;

  cycles.forEach((c,i)=>{
    const sec = document.createElement("div");
    sec.className = "cycle";
    sec.innerHTML = `<h3>${c.title}</h3>`;

    c.courses.forEach(r=>{
      total++;
      const k = key(r.n);
      const approved = done.has(k);
      if (approved) ok++;

      if (!approved && i+1 < currentCycle) dragged++;

      const btn = document.createElement("button");
      btn.className = `course ${approved?"done":""}`;
      btn.innerHTML = r.n;
      btn.onclick = ()=>toggle(k);
      sec.appendChild(btn);
    });

    grid.appendChild(sec);
  });

  const pct = Math.round(ok/total*100);
  progressBar.style.width = pct+"%";
  progressText.textContent = `${ok}/${total} aprobados (${pct}%)`;

  alertText.textContent = dragged
    ? `⚠️ Tienes ${dragged} cursos arrastrados de ciclos anteriores`
    : "";
}

function toggle(k){
  done.has(k) ? done.delete(k) : done.add(k);
  localStorage.setItem(STORAGE, JSON.stringify([...done]));
  render();
}

/* Ciclo selector */
const sel = document.getElementById("currentCycle");
for(let i=1;i<=10;i++){
  sel.innerHTML += `<option>${i}</option>`;
}
sel.onchange = e => {
  currentCycle = +e.target.value;
  render();
};

/* Dark mode */
document.getElementById("toggleTheme").onclick = ()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem(THEME, document.body.classList.contains("dark"));
};
if(localStorage.getItem(THEME)==="true") document.body.classList.add("dark");

document.getElementById("reset").onclick = ()=>{
  if(confirm("¿Reiniciar progreso?")){
    done.clear();
    render();
  }
};

render();
  }
};

render();

