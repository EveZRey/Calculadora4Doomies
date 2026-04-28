document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tablaMatriz");

  inicializarEventos();

  /*Hector*/
  function inicializarEventos() {
    document.querySelectorAll(".elemento-matriz").forEach((input) => {
      input.addEventListener("keydown", manejarTeclas);
      input.addEventListener("input", limpiarMatriz);
    });

    document.getElementById("add-row").addEventListener("click", agregarFila);
    document.getElementById("remove-row").addEventListener("click", () => {
      eliminarFila(tabla.rows.length - 1);
    });

    document
      .getElementById("add-col")
      .addEventListener("click", agregarColumna);
    document.getElementById("remove-col").addEventListener("click", () => {
      eliminarColumna(tabla.rows[0].cells.length - 1);
    });

    document
      .getElementById("clear-matrix")
      .addEventListener("click", limpiarMatrizCompleta);
  }

  function eliminarFila(index) {
    if (tabla.rows.length <= 2) return; // L 2x2
    tabla.deleteRow(index);
  }

  function eliminarColumna(index) {
    if (tabla.rows[0].cells.length <= 2) return; // L 2x2
    for (let i = 0; i < tabla.rows.length; i++) {
      tabla.rows[i].deleteCell(index);
    }
    acutalizarAumento();
  }

  function limpiarMatrizCompleta() {
    for (let i = 0; i < tabla.rows.length; i++) {
      for (let j = 0; j < tabla.rows[i].cells.length; j++) {
        const celdaInput = tabla.rows[i].cells[j].querySelector("input");
        if (celdaInput) {
          celdaInput.value = "";
        }
      }
    }
  }
  /*Hector*/

  document.querySelectorAll('input[name="operacion"]').forEach((radio) => {
    radio.addEventListener("change", acutalizarAumento);
  });

  function manejarTeclas(direccion) {
    const input = direccion.target;

    const celda = input.parentElement;
    const fila = celda.parentElement;

    const i = fila.rowIndex;
    const j = celda.cellIndex;

    const filas = tabla.rows.length;
    const columnas = tabla.rows[0].cells.length;

    if (direccion.key === " " || direccion.key === "ArrowRight") {
      direccion.preventDefault();

      if (j === columnas - 1) {
        agregarColumna();
      }

      tabla.rows[i].cells[j + 1].firstChild.focus();
    }

    if (direccion.key === "ArrowLeft") {
      direccion.preventDefault();

      if (j > 0) {
        tabla.rows[i].cells[j - 1].firstChild.focus();
      }
    }

    if (direccion.key === "Enter" || direccion.key === "ArrowDown") {
      direccion.preventDefault();

      if (i === filas - 1) {
        agregarFila();
      }

      tabla.rows[i + 1].cells[j].firstChild.focus();
    }

    if (direccion.key === "ArrowUp") {
      direccion.preventDefault();

      if (i > 0) {
        tabla.rows[i - 1].cells[j].firstChild.focus();
      }
    }
    acutalizarAumento();
  }

  function agregarColumna() {
    for (let fila of tabla.rows) {
      const celda = document.createElement("td");
      const input = crearInput();
      celda.appendChild(input);
      fila.appendChild(celda);
    }
  }

  function agregarFila() {
    const columnas = tabla.rows[0].cells.length;
    const nuevaFila = document.createElement("tr");

    for (let i = 0; i < columnas; i++) {
      const celda = document.createElement("td");
      const input = crearInput();
      celda.appendChild(input);
      nuevaFila.appendChild(celda);
    }

    tabla.appendChild(nuevaFila);
  }

  function crearInput() {
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("elemento-matriz");

    input.addEventListener("keydown", manejarTeclas);
    input.addEventListener("input", limpiarMatriz);

    return input;
  }

  function limpiarMatriz() {
    eliminarFilasVacias();
    eliminarColumnasVacias();
  }

  function eliminarFilasVacias() {
    for (let i = tabla.rows.length - 1; i >= 1; i--) {
      let vacia = true;

      for (let j = 0; j < tabla.rows[i].cells.length; j++) {
        if (tabla.rows[i].cells[j].firstChild.value.trim() !== "") {
          vacia = false;
          break;
        }
      }

      if (vacia) tabla.deleteRow(i);
      else break;
    }
  }

  function eliminarColumnasVacias() {
    let columnas = tabla.rows[0].cells.length;
    const esSEL =
      document.querySelector('input[name="operacion"]:checked').value == "sel";

    let limite = esSEL ? 2 : 1;

    for (let j = columnas - 1; j >= limite; j--) {
      let vacia = true;

      for (let i = 0; i < tabla.rows.length; i++) {
        if (tabla.rows[i].cells[j].firstChild.value.trim() !== "") {
          vacia = false;
          break;
        }
      }

      if (vacia) {
        for (let i = 0; i < tabla.rows.length; i++) {
          tabla.rows[i].deleteCell(j);
        }
      } else break;
    }

    acutalizarAumento();
  }

  function acutalizarAumento() {
    const esSEL =
      document.querySelector('input[name="operacion"]:checked').value === "sel";
    const filas = tabla.rows;

    for (let i = 0; i < filas.length; i++) {
      const celdas = filas[i].cells; // Debes obtener las celdas de LA fila actual (i)
      const numCols = celdas.length; // Cantidad de columnas en esta fila

      // 1. Limpiar la clase de TODAS las celdas de esta fila
      for (let j = 0; j < numCols; j++) {
        celdas[j].classList.remove("columna-aumentada");
      }

      // 2. Si es SEL, aplicarla solo a la penúltima
      if (esSEL && numCols >= 2) {
        celdas[numCols - 2].classList.add("columna-aumentada");
      }
    }
  }
});

/*Hector*/

window.navegar = function (operacion) {
  document
    .getElementById("vista-menu")
    .classList.replace("vista-activa", "vista-oculta");
  document
    .getElementById("vista-calculadora")
    .classList.replace("vista-oculta", "vista-activa");

  const radio = document.querySelector(`input[value="${operacion}"]`);
  if (radio) {
    radio.checked = true;

    radio.dispatchEvent(new Event("change"));
  }

  const titulos = {
    sel: "Sistema de Ecuaciones Lineales",
    det: "Cálculo de Determinante",
    inv: "Cálculo de Matriz Inversa",
  };
  const tituloEl = document.getElementById("titulo-operacion");
  if (tituloEl) tituloEl.innerText = titulos[operacion];
};

window.volverAlMenu = function () {
  document
    .getElementById("vista-calculadora")
    .classList.replace("vista-activa", "vista-oculta");
  document
    .getElementById("vista-menu")
    .classList.replace("vista-oculta", "vista-activa");

  const contenedorResultado = document.getElementById("resultado");
  if (contenedorResultado) contenedorResultado.innerHTML = "";

  const divInter = document.getElementById("interpretacion");
  if (divInter) divInter.innerHTML = "";
};
