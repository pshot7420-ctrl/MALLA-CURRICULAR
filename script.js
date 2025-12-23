console.log("SCRIPT NUEVO CARGADO");

const grid = document.getElementById("grid");
const progress = document.getElementById("progress");

const cursos = [
  "MATEMÁTICAS",
  "FÍSICA I",
  "QUÍMICA",
  "INGLÉS I"
];

let aprobados = new Set();

function render() {
  grid.innerHTML = "";
  cursos.forEach(c => {
    const btn = document.createElement("button");
    btn.textContent = c;
    if (aprobados.has(c)) btn.classList.add("done");
    btn.onclick = () => toggle(c);
    grid.appendChild(btn);
  });

  progress.textContent = `${aprobados.size} / ${cursos.length} cursos aprobados`;
}

function toggle(curso) {
  aprobados.has(curso) ? aprobados.delete(curso) : aprobados.add(curso);
  render();
}

render();
