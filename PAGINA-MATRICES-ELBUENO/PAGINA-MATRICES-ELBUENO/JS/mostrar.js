import { Fraccion, pasarAFraccion } from './fraccion.js';

export function mostrarResultado(matriz, opcion) {
    if (opcion === "det") return;

    const contenedor = document.getElementById("resultado");
    contenedor.innerHTML = "";

    contenedor.classList.remove("matriz-corchetes", "matriz-parentesis");

    const tablaSolucion = document.createElement("table");
    tablaSolucion.classList.add("tabla-resultado");

    if (opcion === "inv") {
        tablaSolucion.classList.add("matriz-corchetes");
    } else {
        tablaSolucion.classList.add("matriz-parentesis");
    }

    const filas = matriz.length;
    let columnas = matriz[0].length;

    let inicioJ = 0;
    if (opcion === "inv") {
        inicioJ = filas;

        let noInversa = false;

        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < filas; j++) {
                const valor = matriz[i][j].pasarString();

                if (i === j && valor !== "1") noInversa = true;
                if (i !== j && valor !== "0") noInversa = true;
            }
        }

        if (noInversa) {
            return;
        }
    }
    // ------------------------------

    for (let i = 0; i < filas; i++) {
        const filaTR = document.createElement("tr");

        for (let j = inicioJ; j < columnas; j++) {
            const celdaTD = document.createElement("td");
            const divContenido = document.createElement("div");
            divContenido.classList.add("celda-resultado");

            // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------
            if ((opcion === "sel" || opcion === "sev" ) && j === columnas - 2) {
              celdaTD.classList.add("columna-aumentada");
            }
            // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------

            const textoResultado = matriz[i][j].pasarString();

            if (textoResultado.includes("/")) {
                const partes = textoResultado.split("/");
                divContenido.innerHTML = `
                          <div class="fraccion">
                              <span class="arriba">${partes[0]}</span>
                              <span class="abajo">${partes[1]}</span>
                          </div>
                      `;
            } else {
                divContenido.textContent = textoResultado;
            }
            celdaTD.appendChild(divContenido);
            filaTR.appendChild(celdaTD);
        }
        tablaSolucion.appendChild(filaTR);
    }

    contenedor.appendChild(tablaSolucion);
}

export function interpretacion(matrizResuelta, opcion, intercambios, factoresDeterminante) {
    const y = matrizResuelta.length;
    const x = matrizResuelta[0].length;
    const divInter = document.getElementById("interpretacion");
    divInter.innerHTML = "";
    const contenedorEstilizado = document.createElement("div");
    contenedorEstilizado.classList.add("resultado-det");
    let mensaje = "";
    // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------
    if (opcion === "sel" || opcion === "sev") {
        let filaDeCeros = false;
        let contradiccion = false;
        for (let i = 0; i < y; i++) {
            let coeficientesCero = true;
            for (let j = 0; j < x - 1; j++) {
                if (matrizResuelta[i][j].num !== 0) {
                    coeficientesCero = false;
                    break;
                }
            }
            if (coeficientesCero) {
                if (matrizResuelta[i][x - 1].num !== 0) {
                    contradiccion = true;
                    break;
                }
                filaDeCeros = true;
            }
        }
        console.log("AQUI SE MUESTRA CONTRADICCIÓN : " + contradiccion)
    
        if (contradiccion) {
            mensaje = "> El SEL <strong>no tiene solución</strong>";
        } else if (filaDeCeros || y < x - 1) {
            mensaje = "> El SEL es <strong>L.D.</strong> (Infinitas soluciones).";
        } else {
            mensaje = "> El SEL es <strong>L.I.</strong> (Solución única).";
        } 
    } 
    // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------
  
    else if (opcion === "inv") {
        let tieneIdentidad = true;
        for (let i = 0; i < y; i++) {
            for (let j = 0; j < y; j++) {
                const valor = matrizResuelta[i][j];
                const esCero = valor.num === 0;
                const esUno = valor.num === 1 && valor.den === 1;
                if ((i === j && !esUno) || (i !== j && !esCero)) {
                    tieneIdentidad = false;
                    break;
                }
            }
            if (!tieneIdentidad) break;
        }
        mensaje = tieneIdentidad
        ? "> Matriz <strong>Inversa</strong>."
        : "> La matriz <strong>no tiene inversa</strong>.";
    } else if (opcion === "det") {
        let tieneFilaCeros = false;
        for (let i = 0; i < y; i++) {
            if (matrizResuelta[i][i].num === 0) {
                tieneFilaCeros = true;
                break;
            }
        }
        let htmlProceso = "";
        if (tieneFilaCeros) {
            htmlProceso += " = <strong>0</strong>";
        } else {
            console.log("Determinante diferente de 0");
            let total = new Fraccion(intercambios % 2 === 0 ? 1 : -1, 1);
            factoresDeterminante.forEach((f) => {
                total = total.multiplicar(pasarAFraccion(String(f)));
            });
            const textoDet = total.pasarString();
            if (textoDet.includes("/")) {
                const partes = textoDet.split("/");
                htmlProceso += `= <span style="display: inline-flex; flex-direction: column; vertical-align: middle; text-align: center; font-weight: bold; color: #2c7be5; margin-left: 5px;">
                            <span style="border-bottom: 2px solid #2c7be5; padding: 0 4px;">${partes[0]}</span>
                            <span style="padding: 0 4px;">${partes[1]}</span>
                         </span>`;
            } else {
                htmlProceso += `= <strong>${textoDet}</strong>`;
            }
        }
        mensaje = `> Determinante: ${htmlProceso}`;
    }
    contenedorEstilizado.innerHTML = mensaje;
    divInter.appendChild(contenedorEstilizado);
}