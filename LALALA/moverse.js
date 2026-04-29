document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tablaMatriz");

  inicializarEventos();

  /*Hector*/
  function inicializarEventos() {
    document.querySelectorAll(".elemento-matriz").forEach((input) => {
      input.addEventListener("keydown", manejarTeclas);
      //input.addEventListener("input", limpiarMatriz);
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

    document
      .getElementById("clear-matrix")
      .addEventListener("click", limpiarMatrizCompleta);

    const btnReset = document.getElementById("reset-matrix");
    if (btnReset) btnReset.addEventListener("click", reiniciarMatriz);
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

  function manejarTeclas(e) {
    const input = e.target;
    const celda = input.parentElement;
    const fila = celda.parentElement;

    const i = fila.rowIndex;
    const j = celda.cellIndex;

    const filas = tabla.rows.length;
    const columnas = tabla.rows[0].cells.length;

    if (e.key === "ArrowLeft" && input.selectionStart > 0) {
      return;
    }
    if (e.key === "ArrowRight" && input.selectionStart < input.value.length) {
      return;
    }

    if (e.key === " " || e.key === "ArrowRight") {
      e.preventDefault();
      if (j === columnas - 1) {
        agregarColumna();
      }
      tabla.rows[i].cells[j + 1].querySelector("input").focus();
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (j > 0) {
        tabla.rows[i].cells[j - 1].querySelector("input").focus();
      }
    }

    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      if (i === filas - 1) {
        agregarFila();
      }
      tabla.rows[i + 1].cells[j].querySelector("input").focus();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (i > 0) {
        tabla.rows[i - 1].cells[j].querySelector("input").focus();
      }
    }

    acutalizarAumento();
  }

  function agregarColumna() {
    if (tabla.rows[0].cells.length >= 1000) {
      alert(
        "Límite alcanzado: Las matrices muy grandes exceden la memoria del navegador para cálculos con fracciones exactas.",
      );
      return;
    }

    for (let fila of tabla.rows) {
      const celda = fila.insertCell();
      const input = crearInput();
      celda.appendChild(input);
    }
    acutalizarAumento();
  }

  function agregarFila() {
    if (tabla.rows.length >= 1000) {
      alert(
        "Límite alcanzado: Por estabilidad del algoritmo, el máximo es 12x12.",
      );
      return;
    }

    const columnas = tabla.rows[0].cells.length;
    const nuevaFila = tabla.insertRow();

    for (let i = 0; i < columnas; i++) {
      const celda = nuevaFila.insertCell();
      const input = crearInput();
      celda.appendChild(input);
    }

    acutalizarAumento();
  }
  function crearInput() {
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("elemento-matriz");

    input.addEventListener("keydown", manejarTeclas);
    //input.addEventListener("input", limpiarMatriz);

    return input;
  }

  function limpiarMatriz() {
    eliminarFilasVacias();
    eliminarColumnasVacias();
  }
  function reiniciarMatriz() {
    const tabla = document.getElementById("tablaMatriz");

    if (!tabla) return;

    tabla.innerHTML = `
            <tr>
                <td><input type="text" class="elemento-matriz" placeholder="1"></td>
                <td><input type="text" class="elemento-matriz" placeholder="0"></td>
            </tr>
            <tr>
                <td><input type="text" class="elemento-matriz" placeholder="0"></td>
                <td><input type="text" class="elemento-matriz" placeholder="1"></td>
            </tr>
        `;

    document.querySelectorAll(".elemento-matriz").forEach((input) => {
      input.addEventListener("keydown", manejarTeclas);
      //input.addEventListener("input", limpiarMatriz);
    });

    acutalizarAumento();
  }

  function eliminarFilasVacias() {
    for (let i = tabla.rows.length - 1; i >= 1; i--) {
      let vacia = true;

      for (let j = 0; j < tabla.rows[i].cells.length; j++) {
        if (tabla.rows[i].cells[j].querySelector("input").value.trim() !== "") {
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
        if (tabla.rows[i].cells[j].querySelector("input").value.trim() !== "") {
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
/* Hector */

function esFraccion(valor) {
  return /^-?\d+\/-?\d+$/.test(valor);
}

function crearFraccionHTML(valor) {
  let [num, den] = valor.split("/");
  let contenedor = document.createElement("div");
  contenedor.className = "fraccion";
  contenedor.innerHTML = `
            <span class="arriba">${num}</span>
            <span class="abajo">${den}</span>
        `;
  return contenedor;
}

document.addEventListener(
  "blur",
  function (e) {
    if (e.target.classList.contains("elemento-matriz")) {
      let valor = e.target.value.trim();

      if (valor.includes(".") && !isNaN(Number(valor))) {
        const numDec = Number(valor);
        const decimales = valor.split(".")[1] || "";
        const multiplicador = Math.pow(10, decimales.length);

        let numerador = Math.round(numDec * multiplicador);
        let denominador = multiplicador;

        let a = Math.abs(numerador);
        let b = denominador;
        while (b !== 0) {
          let temp = b;
          b = a % b;
          a = temp;
        }
        numerador /= a;
        denominador /= a;

        if (denominador === 1) {
          valor = String(numerador);
        } else {
          valor = `${numerador}/${denominador}`;
        }

        e.target.value = valor;
      }

      if (esFraccion(valor)) {
        let td = e.target.parentNode;

        e.target.style.display = "none";

        let anterior = td.querySelector(".fraccion");
        if (anterior) anterior.remove();

        let fraccion = crearFraccionHTML(valor);

        fraccion.addEventListener("click", () => {
          fraccion.remove();
          e.target.style.display = "block";
          e.target.focus();
        });

        td.appendChild(fraccion);
      }
    }
  },
  true,
);
