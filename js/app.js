const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");

const registrosPorPagina = 20;
let totalPaginas;
let limitePaginas = 10;
let iterador;
let paginaActual = 1;

document.addEventListener("DOMContentLoaded", () => {
  formulario.addEventListener("submit", validarFormulario);
});

function validarFormulario(e) {
  e.preventDefault();
  const terminoBusqueda = document.querySelector("#termino").value;

  if (terminoBusqueda === "") {
    mostrarAlerta("Agregar termino de busqueda");
  } else {
    buscarImagenes();
  }
}

function mostrarAlerta(mensaje) {
  const existeAlerta = document.querySelector(".bg-red-100");

  if (existeAlerta) {
    existeAlerta.remove();
  }

  const alerta = document.createElement("P");
  alerta.classList.add(
    "bg-red-100",
    "border-red-400",
    "text-red-700",
    "px-4",
    "py-3",
    "rounded",
    "max-w-lg",
    "mx-auto",
    "mt-6",
    "text-center"
  );

  alerta.innerHTML = `
        <strong class="font-bold"> Error! </strong> <br>
        <span > ${mensaje} </span>
   `;

  formulario.appendChild(alerta);

  setTimeout(() => {
    alerta.remove();
  }, 1500);
}

function limpiarHTML(elemento) {
  while (elemento.firstChild) {
    while (elemento.firstChild) {
      elemento.removeChild(elemento.firstChild);
    }
  }
}

function buscarImagenes() {
  const termino = document.querySelector("#termino").value;

  const key = "42598196-c44297161123b1882bd0c1dbb";
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => {
      totalPaginas = calcularPaginas(resultado.totalHits);
      mostrarImagenes(resultado.hits);
    });
}

// Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {
  console.log(total);
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function calcularPaginas(total) {
  return parseInt(Math.ceil(total / registrosPorPagina));
}

function mostrarImagenes(imagenes) {
  //Eliminar
  console.log(imagenes);
  //
  if (imagenes == 0) {
    mostrarAlerta("No hay imagenes relacionadas con tu busqueda.");
  }

  limpiarHTML(resultado);

  // Iterar sobre el arreglo de imagenes y construir el html
  //Imagenes:
  imagenes.forEach((imagen) => {
    const { previewURL, likes, views, largeImageURL } = imagen;
    resultado.innerHTML += `
    <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
      <div class="bg-blue-900	 flex  items-center flex-col">
        <img class="bg-red-900 mt-10" src="${previewURL}">
          <div class="p-4">
          <p class="font-bold"> ${likes}<span class="font-light"> Me gusta </p> <span>
          <p class="font-bold"> ${views}<span class="font-light"> Vistas </p> <span>
        
          <a 
          class="block w-full 
          bg-blue-800 
          hover:bg-blue-500 
          text-white 
          uppercase 
          font-bold 
          text-center 
          rounded 
          mt-5 
          p-1"
          href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
          Ver Imagen
          </a>
          </div>
      </div>
    </div>
    `;
  });

  //limpiar paginador previo
  limpiarHTML(paginacionDiv);
  imprimirPaginador(limitePaginas);
}

function imprimirPaginador(paginas) {
  iterador = crearPaginador(paginas);

  while (true) {
    const { value, done } = iterador.next();

    if (done) {
      const boton2 = document.createElement("A");
      boton2.href = "#";
      boton2.dataset.pagina = value;
      boton2.textContent = "...";
      boton2.classList.add(
        "siguiente",
        "bg-yellow-400",
        "px-4",
        "py-1",
        "mr-2",
        "font-bold",
        "mb-4",
        "rounded"
      );

      paginacionDiv.appendChild(boton2);
      boton2.onclick = () => {
        if (limitePaginas >= totalPaginas) {
          alert("Final de paginas alcanzado");
        } else {
          limitePaginas = limitePaginas + 10;
          if (limitePaginas >= totalPaginas) {
            limitePaginas = totalPaginas;
          }
        }
        limpiarHTML(paginacionDiv);
        imprimirPaginador(limitePaginas);
      };

      return;
    }
    // Caso contrario genera un boton por cada elemento del generador
    const boton = document.createElement("A");
    boton.href = "#";
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add(
      "siguiente",
      "bg-yellow-400",
      "px-4",
      "py-1",
      "mr-2",
      "font-bold",
      "mb-4",
      "rounded"
    );

    boton.onclick = () => {
      paginaActual = value;
      buscarImagenes();
    };

    paginacionDiv.appendChild(boton);
  }
}
