
document.addEventListener("DOMContentLoaded", () => {

  const btnDescargar = document.getElementById("btnTXT");
  if (!btnDescargar) return;
  btnDescargar.addEventListener("click", exportarTXT);
});

// ======================================
// EXPORTAR TXT
// ======================================

function exportarTXT() {
  const opcion = document.querySelector(
    'input[name="operacion"]:checked'
  )?.value;

  if (!opcion) return;

  const tablaResultado = document.querySelector("#resultado table");

  if (!tablaResultado) {
    alert("Primero debes presionar 'Resolver' antes de exportar.");
    return;
  }

  const matrizTexto = obtenerTablaTXT(
    tablaResultado,
    opcion
  );
  if (!matrizTexto) {
    alert("No existen resultados para exportar.");
    return;
  }

  const contenido = `
========================================
      CALCULADORA DE MATRICES
========================================


RESULTADO
========================================

${matrizTexto}



`.trim();

  descargarArchivo(contenido, "resultado_matriz.txt");
}

function obtenerTablaTXT(tabla, opcion) {

  let resultado = "";

  const filas = Array.from(tabla.rows);

  // =========================================
  // CALCULAR ANCHO POR COLUMNA
  // =========================================

  const anchosColumnas = [];

  filas.forEach(fila => {

    Array.from(fila.cells).forEach((celda, col) => {

      const valor = celda.innerText.trim();

      const partes = valor.split("\n");

      let ancho = 0;

      partes.forEach(parte => {
        ancho = Math.max(ancho, parte.length);
      });

      ancho += 4;

      if (!anchosColumnas[col]) {
        anchosColumnas[col] = ancho;
      } else {
        anchosColumnas[col] = Math.max(
          anchosColumnas[col],
          ancho
        );
      }

    });

  });

  // =========================================
  // ANCHO TOTAL MATRIZ
  // =========================================

  const anchoTotal =
    anchosColumnas.reduce((a, b) => a + b, 0) + 2;

  resultado +=
    "┌" +
    "─".repeat(anchoTotal) +
    "┐\n";

  // =========================================
  // GENERAR FILAS
  // =========================================

  filas.forEach(fila => {

    const bloques = [];

    Array.from(fila.cells).forEach((celda, col) => {

      const valor = celda.innerText.trim();

      bloques.push(
        fraccionVerticalTexto(
          valor,
          anchosColumnas[col]
        )
      );

    });

    // Línea superior
    resultado += "│";

    bloques.forEach(bloque => {
      resultado += bloque[0];
    });

    resultado += "│\n";

    // Línea media
    resultado += "│";

    bloques.forEach(bloque => {
      resultado += bloque[1];
    });

    resultado += "│\n";

    // Línea inferior
    resultado += "│";

    bloques.forEach(bloque => {
      resultado += bloque[2];
    });

    resultado += "│\n";

    resultado += "│" +
      " ".repeat(anchoTotal) +
      "│\n";

  });

  resultado +=
    "└" +
    "─".repeat(anchoTotal) +
    "┘";

  return resultado;
}
// ======================================
// FRACCIONES VERTICALES
// ======================================
function fraccionVerticalTexto(valor, anchoCelda) {

  // =====================================
  // ENTEROS
  // =====================================

  if (!valor.includes("\n")) {

    const medio = valor
      .padStart(
        Math.floor((anchoCelda + valor.length) / 2),
        " "
      )
      .padEnd(anchoCelda, " ");

    return [
      " ".repeat(anchoCelda),
      medio,
      " ".repeat(anchoCelda)
    ];
  }

  // =====================================
  // FRACCIONES
  // =====================================

  const partes = valor.split("\n");

  const numerador = partes[0].trim();
  const denominador = partes[1].trim();

  const anchoFraccion = Math.max(
    numerador.length,
    denominador.length
  );

  const linea =
    "─".repeat(anchoFraccion);

  const arriba = numerador
    .padStart(
      Math.floor(
        (anchoFraccion + numerador.length) / 2
      ),
      " "
    );

  const abajo = denominador
    .padStart(
      Math.floor(
        (anchoFraccion + denominador.length) / 2
      ),
      " "
    );

  return [

    arriba
      .padStart(
        Math.floor(
          (anchoCelda + arriba.length) / 2
        ),
        " "
      )
      .padEnd(anchoCelda, " "),

    linea
      .padStart(
        Math.floor(
          (anchoCelda + linea.length) / 2
        ),
        " "
      )
      .padEnd(anchoCelda, " "),

    abajo
      .padStart(
        Math.floor(
          (anchoCelda + abajo.length) / 2
        ),
        " "
      )
      .padEnd(anchoCelda, " ")
  ];
}

// ======================================
// TEXTO INTERPRETACIÓN
// ======================================

function obtenerTextoInterpretacion() {
  const div = document.getElementById("interpretacion");

  if (!div) return "";

  return div.innerText.trim();
}

// ======================================
// NOMBRE OPERACIÓN
// ======================================

function obtenerOperacionActual() {
  const opcion = document.querySelector(
    'input[name="operacion"]:checked'
  )?.value;

  const nombres = {
    sel: "Sistema de Ecuaciones Lineales",
    det: "Cálculo de Determinante",
    inv: "Matriz Inversa",
    sev: "Espacios Vectoriales"
  };

  return nombres[opcion] || "Operación desconocida";
}

// ======================================
// DESCARGAR ARCHIVO
// ======================================

function descargarArchivo(contenido, nombreArchivo) {
  const blob = new Blob([contenido], {
    type: "text/plain;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const enlace = document.createElement("a");

  enlace.href = url;
  enlace.download = nombreArchivo;

  document.body.appendChild(enlace);

  enlace.click();

  document.body.removeChild(enlace);

  URL.revokeObjectURL(url);
}
