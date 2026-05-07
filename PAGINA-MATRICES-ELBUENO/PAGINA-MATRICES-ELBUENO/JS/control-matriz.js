import { interpretacion, mostrarResultado } from "./mostrar.js";
import { Fraccion, pasarAFraccion } from "./fraccion.js";
import { GaussJordan } from "./gauss-Jordan.js";

document.addEventListener("DOMContentLoaded", () => {
  const botonR = document.getElementById("botonResolver");
  const tabla = document.getElementById("tablaMatriz");
  let inputActivo = null;
  let factoresDeterminante = [];
  let intercambios = 0;

  botonR.addEventListener("click", () => {
    const inter = { intercambios: 0 };
    factoresDeterminante = [];
    intercambios = 0;
    const opcion = document.querySelector(
      'input[name="operacion"]:checked',
    ).value;

    const codigoError = matrizError();

    //_ ---------------------------------------------- ANGEL RIVERA - MEJORA DE ERRORES ---------------------------------------------- -->
    if (codigoError !== 0) {
      mostrarModalError(codigoError);
      return;
    }

    /* switch (codigoError) {
      case 3:
        return alert("Existe elementos erroneos");
      case 2:
        return alert("La matriz esta incompleta");
      case 1:
        return alert("La matriz debe ser cuadrada");
      case -1:
        return alert("No hay matriz que resolver");
      default:
        break;
    } */

    //_ ---------------------------------------------- ANGEL RIVERA - MEJORA DE ERRORES ---------------------------------------------- -->

    const matriz = cargarMatriz();
    console.log("ESTA ES LA MATRIZ A RESOLVER");
    console.log(matriz.map((fila) => fila.map((f) => f.pasarString())));

    const matrizResuelta = GaussJordan(
      matriz,
      opcion,
      inter,
      factoresDeterminante,
    );
    console.log(matrizResuelta);
    console.log("MATRIZ RESUELTA:");
    console.table(
      matrizResuelta.map((fila) => fila.map((f) => f.pasarString())),
    );

    mostrarResultado(matrizResuelta, opcion);
    interpretacion(
      matrizResuelta,
      opcion,
      inter.intercambios,
      factoresDeterminante,
    );

    //_ ---------------------------------------------- ANGEL RIVERA - MEJORA DE ERRORES ---------------------------------------------- -->
    function mostrarModalError(codigo) {
      let mensaje = "";

      switch (codigo) {
        case 3:
          mensaje =
            "Hay valores inválidos.\n\nUsa números o fracciones válidas (ej: 3/4).";
          break;
        case 2:
          mensaje =
            "La matriz está incompleta.\n\nLlena todos los campos antes de continuar.";
          break;
        case 1:
          mensaje =
            "La matriz debe ser cuadrada.\n\nEsta operación requiere el mismo número de filas y columnas.";
          break;
        case -1:
          mensaje =
            "No hay datos en la matriz.\n\nIngresa valores antes de resolver.";
          break;
        default:
          mensaje = "Error desconocido.";
      }

      // Crear overlay (fondo oscuro)
      const overlay = document.createElement("div");
      overlay.classList.add("modal-overlay");

      // Crear modal
      const modal = document.createElement("div");
      modal.classList.add("modal-error");

      modal.innerHTML = `
        <h2>⚠️ Error</h2>
        <p>${mensaje.replace(/\n/g, "<br>")}</p>
        <button id="btnAceptarError">Aceptar</button>
      `;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      // Bloquea interacción (como alert)
      document.body.style.overflow = "hidden";

      // Evento botón
      document
        .getElementById("btnAceptarError")
        .addEventListener("click", () => {
          document.body.removeChild(overlay);
          document.body.style.overflow = "auto";
        });
    }

    //_ ---------------------------------------------- ANGEL RIVERA - MEJORA DE ERRORES ---------------------------------------------- -->

    function matrizError() {
      const filas = tabla.rows.length;
      const columnas = tabla.rows[0].cells.length;
      let tieneDatos = false;
      let tieneVacios = false;
      let tieneBasura = false;

      for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
          const valor = tabla.rows[i].cells[j]
            .querySelector("input")
            .value.trim();
          if (valor === "") {
            tieneVacios = true;
            break;
          } else {
            tieneDatos = true;
            const fraccion = pasarAFraccion(valor);
            if (Number.isNaN(fraccion.num) || Number.isNaN(fraccion.den)) {
              console.log("EXISTEN VALORES NO NUMERICOOOOOOS");
              tieneBasura = true;
              break;
            }
          }
        }
      }

      if (!tieneDatos) return -1;
      if (tieneBasura) return 3;
      if (tieneVacios) return 2;

      // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------
      if (opcion !== "sel" && opcion !== "sev" && filas !== columnas) return 1;
      // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------

      return 0;
    }

    function cargarMatriz() {
      const matriz = [];

      for (let i = 0; i < tabla.rows.length; i++) {
        const fila = [];
        const celdas = tabla.rows[i].cells;

        for (let j = 0; j < celdas.length; j++) {
          const valor = celdas[j].querySelector("input").value.trim();
          fila.push(pasarAFraccion(valor));
        }
        matriz.push(fila);
      }

      if (opcion === "inv") {
        const n = matriz.length;
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            matriz[i].push(new Fraccion(i === j ? 1 : 0, 1));
          }
        }
      }

      // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------
      if (opcion === "sev") {
        const y = matriz.length;
        const x = matriz[0].length;
        let matrizGirada = [];

        for (let i = 0; i < x; i++) {
          matrizGirada[i] = [];
          for (let j = 0; j < y; j++) {
            matrizGirada[i][j] = matriz[j][i];
          }
        }

        for (let i = 0; i < x; i++) {
          matrizGirada[i].push(new Fraccion(0, 1));
        }

        return matrizGirada;
      }
      // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------

      return matriz;
    }
  });
});
