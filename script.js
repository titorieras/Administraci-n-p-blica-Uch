// Ejemplo mínimo con tus datos (reducido para test)
const ramos = [
  { id: "matematica1", nombre: "Matemática para la Gestión I", semestre: "1", requisitos: [] },
  { id: "gestion_publica", nombre: "Introducción a la Gestión Pública", semestre: "1", requisitos: [] },
  { id: "curso_libre1", nombre: "Curso Libre", semestre: "1", requisitos: [] },
  { id: "matematica2", nombre: "Matemática para la Gestión II", semestre: "2", requisitos: ["matematica1"] },
  { id: "cfg1", nombre: "CFG", semestre: "2", requisitos: [] },
];

// Estado guardado o vacío
let aprobados = new Set(JSON.parse(localStorage.getItem('aprobados')) || []);

const mallaDiv = document.getElementById('malla');

function esCFGoCursoLibre(ramo) {
  const nombre = ramo.nombre.toLowerCase();
  return nombre.includes('cfg') || nombre.includes('curso libre');
}

function semestreAnterior(sem) {
  return sem > 1 ? (sem - 1).toString() : null;
}

function todosAprobadosEnSemestre(semestre) {
  return ramos
    .filter(r => r.semestre === semestre.toString())
    .filter(r => !esCFGoCursoLibre(r))
    .every(r => aprobados.has(r.id));
}

function puedeDesbloquear(ramo) {
  if (aprobados.has(ramo.id)) return true;
  if (esCFGoCursoLibre(ramo)) return true;

  const semAnt = semestreAnterior(parseInt(ramo.semestre));
  if (!semAnt) return true;

  return todosAprobadosEnSemestre(semAnt);
}

function renderMalla() {
  mallaDiv.innerHTML = '';

  // Obtener y ordenar semestres
  const semestres = [...new Set(ramos.map(r => r.semestre))].sort((a,b) => a-b);

  semestres.forEach(sem => {
    const divSemestre = document.createElement('div');
    divSemestre.className = 'semestre';

    const h2 = document.createElement('h2');
    h2.textContent = `Semestre ${sem}`;
    divSemestre.appendChild(h2);

    const listaRamos = document.createElement('div');
    listaRamos.className = 'ramos-lista';

    ramos.filter(r => r.semestre === sem)
      .forEach(ramo => {
        const btn = document.createElement('button');
        btn.className = 'ramo';
        btn.textContent = ramo.nombre;
        btn.id = ramo.id;

        if (aprobados.has(ramo.id)) {
          btn.classList.add('aprobado');
          btn.disabled = true;
        } else if (!puedeDesbloquear(ramo)) {
          btn.classList.add('bloqueado');
          btn.disabled = true;
        }

        btn.addEventListener('click', () => {
          if (!btn.classList.contains('aprobado') && !btn.classList.contains('bloqueado')) {
            aprobados.add(ramo.id);
            localStorage.setItem('aprobados', JSON.stringify([...aprobados]));
            renderMalla();
          }
        });

        listaRamos.appendChild(btn);
      });

    divSemestre.appendChild(listaRamos);
    mallaDiv.appendChild(divSemestre);
  });
}

renderMalla();
