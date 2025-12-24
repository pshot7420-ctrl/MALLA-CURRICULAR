document.addEventListener("DOMContentLoaded", () => {

  const STORE_NAME = "nombre_usuario";
  const STORE_STATE = "estado_cursos";
  const STORE_SHIFT = "shift_cursos";

  const welcomeScreen = document.getElementById("welcomeScreen");
  const app = document.getElementById("app");
  const startBtn = document.getElementById("startBtn");
  const nameInput = document.getElementById("nameInput");
  const saludo = document.getElementById("saludo");
  const resetBtn = document.getElementById("resetBtn");
  const grid = document.getElementById("grid");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  let nombre = localStorage.getItem(STORE_NAME);
  let estado = JSON.parse(localStorage.getItem(STORE_STATE) || "{}");
  let shift = JSON.parse(localStorage.getItem(STORE_SHIFT) || {});

  function iniciar(nombreUsuario){
    nombre = nombreUsuario;
    localStorage.setItem(STORE_NAME, nombreUsuario);
    saludo.textContent = `Hola, ${nombreUsuario} 👋`;
    welcomeScreen.style.display = "none";
    app.style.display = "block";
    render();
  }

  if(nombre){
    iniciar(nombre);
  }

  startBtn.addEventListener("click", () => {
    const val = nameInput.value.trim();
    if(!val) return alert("Escribe tu nombre");
    iniciar(val);
  });

  const cursosBase = [
    ["MATEMÁTICAS","QUÍMICA","INGLÉS I"],
    ["MATEMÁTICA I","FÍSICA I","INGLÉS II"],
    ["MATEMÁTICA II"],
    ["ESTADÍSTICA"],
    ["ELECTIVO_1"],
    ["ELECTIVO_2","ELECTIVO_3"]
  ];

  const baseCycle = {};
  cursosBase.forEach((c,i)=>c.forEach(x=>baseCycle[x]=i));

  function nombreBonito(id){
    if(id==="ELECTIVO_1") return "ELECTIVO 1";
    if(id==="ELECTIVO_2") return "ELECTIVO 2";
    if(id==="ELECTIVO_3") return "ELECTIVO 3";
    return id;
  }

  function render(){
    grid.innerHTML="";
    const ciclos=[];
    Object.keys(baseCycle).forEach(c=>{
      const cf=baseCycle[c]+(shift[c]||0);
      if(!ciclos[cf]) ciclos[cf]=[];
      ciclos[cf].push(c);
    });

    ciclos.forEach((lista,i)=>{
      const box=document.createElement("div");
      box.className="cycle card";
      box.innerHTML=`<h2>Ciclo ${i+1}</h2>`;
      lista.forEach(curso=>{
        const d=document.createElement("div");
        d.className="course"+(estado[curso]==="ok"?" done":"");
        d.innerHTML=`
          <div class="name">${nombreBonito(curso)}</div>
          <div class="controls">
            <button class="ctrl ok">✓</button>
            <button class="ctrl no">✕</button>
          </div>`;
        d.querySelector(".ok").onclick=()=>{estado[curso]="ok";guardar();};
        d.querySelector(".no").onclick=()=>{shift[curso]=(shift[curso]||0)+1;guardar();};
        box.appendChild(d);
      });
      grid.appendChild(box);
    });

    const total=Object.keys(baseCycle).length;
    const ok=Object.values(estado).filter(v=>v==="ok").length;
    const pct=Math.round(ok/total*100);
    progressBar.style.width=pct+"%";
    progressText.textContent=`${ok}/${total} aprobados (${pct}%)`;
  }

  function guardar(){
    localStorage.setItem(STORE_STATE,JSON.stringify(estado));
    localStorage.setItem(STORE_SHIFT,JSON.stringify(shift));
    render();
  }

  resetBtn.onclick=()=>{
    if(!confirm("¿Reiniciar todo?")) return;
    localStorage.clear();
    location.reload();
  };

});
