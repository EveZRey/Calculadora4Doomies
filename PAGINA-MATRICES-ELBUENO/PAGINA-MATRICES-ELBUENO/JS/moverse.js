document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tablaMatriz");

  let ultimaAccion = 0;

  function puedeEjecutar() {
    const ahora = Date.now();
    if (ahora - ultimaAccion < 50) return false;
    ultimaAccion = ahora;
    return true;
  }

  inicializarEventos();

  /*Hector*/
  function inicializarEventos() {
    tabla.addEventListener("keydown", (e) => {
      if (e.target.classList.contains("elemento-matriz")) {
        manejarTeclas(e);
      }
    });

    document.querySelectorAll(".tarjeta-opcion").forEach((tarjeta) => {
      tarjeta.addEventListener("click", () => {
        const operacion = tarjeta.dataset.op;
        navegar(operacion);
      });
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

    const btnReset = document.getElementById("reset-matrix");
    if (btnReset) btnReset.addEventListener("click", reiniciarMatriz);

    document.querySelectorAll(".elemento-matriz").forEach((input) => {
      input.addEventListener("keydown", manejarTeclas);
      input.addEventListener("input", validarEntrada);
      input.addEventListener("focus", (e) => {
        inputActivo = e.target;
      });
    });
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
    actualizarAumento();
  }

  function limpiarMatrizCompleta() {
    for (let i = 0; i < tabla.rows.length; i++) {
      for (let j = 0; j < tabla.rows[i].cells.length; j++) {
        const input = tabla.rows[i].cells[j].querySelector("input");
        if (input) {
          input.value = "";
          input.style.display = "block";
        }
        const fraccion = tabla.rows[i].cells[j].querySelector(".fraccion");
        if (fraccion) fraccion.remove();
      }
    }
  }

  /*Hector*/

  document.querySelectorAll('input[name="operacion"]').forEach((radio) => {
    radio.addEventListener("change", actualizarAumento);
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

    actualizarAumento();
  }

  function agregarColumna() {
    if (!puedeEjecutar()) return;

    if (tabla.rows[0].cells.length >= 100) {
      const continuar = confirm(
        "Estás superando 100 columnas. Esto puede afectar el rendimiento. ¿Deseas continuar?",
      );
      if (!continuar) return;
    }

    for (let fila of tabla.rows) {
      const celda = fila.insertCell();
      const input = crearInput();
      celda.appendChild(input);
    }

    actualizarAumento();
  }

  function agregarFila() {
    if (!puedeEjecutar()) return;

    if (tabla.rows.length >= 100) {
      const continuar = confirm(
        "Estás superando 100 filas. Esto puede afectar el rendimiento. ¿Deseas continuar?",
      );
      if (!continuar) return;
    }

    const columnas = tabla.rows[0].cells.length;
    const nuevaFila = tabla.insertRow();

    for (let i = 0; i < columnas; i++) {
      const celda = nuevaFila.insertCell();
      const input = crearInput();
      celda.appendChild(input);
    }

    actualizarAumento();
  }

  function crearInput() {
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("elemento-matriz");

    input.setAttribute("inputmode", "decimal");
    input.setAttribute("autocorrect", "off");
    input.setAttribute("autocapitalize", "none");
    input.setAttribute("spellcheck", "false");

    input.addEventListener("keydown", manejarTeclas);
    input.addEventListener("input", validarEntrada);
    input.addEventListener("focus", (e) => {
      inputActivo = e.target;
    });

    return input;
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
      input.addEventListener("focus", (e) => {
        inputActivo = e.target;
      });
      input.addEventListener("input", validarEntrada);
    });

    acutalizarAumento();
  }

  function actualizarAumento() {
    const radio = document.querySelector('input[name="operacion"]:checked');
    if (!radio) return;

    const esSEL = radio.value === "sel";

    for (let fila of tabla.rows) {
      for (let celda of fila.cells) {
        celda.classList.remove("columna-aumentada");
      }
      if (esSEL && fila.cells.length >= 2) {
        fila.cells[fila.cells.length - 2].classList.add("columna-aumentada");
      }
    }
    const m = tabla.rows.length;
    const n = tabla.rows[0].cells.length;
    const badge = document.getElementById("dimensiones-matriz");
    const contFilas = document.getElementById("contador-filas");
    const contCols = document.getElementById("contador-columnas");
    if (badge) badge.innerText = `${m} × ${n}`;
    if (contFilas) contFilas.innerText = m;
    if (contCols) contCols.innerText = n;
  }
});

/*Hector*/

window.navegar = function (operacion) {
  // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------
  const btnFichero = document.querySelector(".boton-fichero");
  if (btnFichero && operacion !== "det") {
    btnFichero.classList.remove("vista-oculta");
    btnFichero.classList.add("vista-activa");
  }
  // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------

  document
    .getElementById("vista-menu")
    .classList.replace("vista-activa", "vista-oculta");
  document
    .getElementById("vista-calculadora")
    .classList.replace("vista-oculta", "vista-activa");

  if (operacion === "sev") {
    document
      .getElementById("etiqueta-espacio")
      .classList.replace("vista-oculta", "vista-activa");
  }

  const radio = document.querySelector(`input[value="${operacion}"]`);
  if (radio) {
    radio.checked = true;

    radio.dispatchEvent(new Event("change"));
  }

  const titulos = {
    sel: "Sistema de Ecuaciones Lineales",
    det: "Cálculo de Determinante",
    inv: "Cálculo de Matriz Inversa",
    // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------
    sev: "Espacios Vectoriales",
    // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------
  };
  const tituloEl = document.getElementById("titulo-operacion");
  if (tituloEl) tituloEl.innerText = titulos[operacion];

  // ! ---------------------------------------------- ANTONIO NAVARRO ESTILO A S ----------------------------------------------
  const simbolo = document.getElementById("simbolo-matriz");
  if (simbolo) {
    simbolo.classList.remove(
      "matriz-corchetes",
      "matriz-parentesis",
      "matriz-determinante",
      "matriz-llaves",
    );
    // ! ---------------------------------------------- ANTONIO NAVARRO ESTILO A S ----------------------------------------------

    if (operacion === "det") {
      simbolo.classList.add("matriz-determinante");
    } else if (operacion === "inv") {
      simbolo.classList.add("matriz-corchetes");
    } else if (operacion === "sel") {
      simbolo.classList.add("matriz-parentesis");
    }
    // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------
    else {
      simbolo.classList.add("matriz-llaves");
    }
    // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------
  }
};

window.volverAlMenu = function () {
  // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------
  const btnFichero = document.querySelector(".boton-fichero");
  if (btnFichero) {
    btnFichero.classList.remove("vista-activa");
    btnFichero.classList.add("vista-oculta");
  }
  // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------

  document
    .getElementById("vista-calculadora")
    .classList.replace("vista-activa", "vista-oculta");
  document
    .getElementById("vista-menu")
    .classList.replace("vista-oculta", "vista-activa");
  document
    .getElementById("etiqueta-espacio")
    .classList.replace("vista-activa", "vista-oculta");

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

window.validarEntrada = function (e) {
  const input = e.target;
  const valor = input.value.trim();

  const regexValido = /^-?\d*\.?\d*(?:\/-?\d*)?$/;
  const regexEspeciales = /[πe√]/i;

  if (valor === "") {
    input.classList.remove("error-input");
    return;
  }

  if (regexValido.test(valor) || regexEspeciales.test(valor)) {
    if (
      valor === "-" ||
      valor === "." ||
      valor === "/" ||
      valor.endsWith("/") ||
      valor.endsWith("-") ||
      valor.startsWith("/") ||
      valor.startsWith("-/")
    ) {
      input.classList.add("error-input");
    } else {
      input.classList.remove("error-input");
    }
  } else {
    input.classList.add("error-input");
  }
};

window.insertarSimbolo = function (simbolo) {
  if (inputActivo) {
    inputActivo.value += simbolo;
    inputActivo.dispatchEvent(new Event("input"));
  }
};
