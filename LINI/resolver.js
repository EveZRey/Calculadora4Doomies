class Fraccion {
  constructor(numerador, denominador = 1) {
    if (denominador === 0) throw new Error("División por cero");
    const signo = denominador < 0 ? -1 : 1;
    this.num = numerador * signo;
    this.den = Math.abs(denominador);
    this.simplificar();
  }

  sacarMCD(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));

    if (isNaN(a) || isNaN(b)) return 1;

    while (b !== 0) {
      let temporal = b;
      b = a % b;
      a = temporal;
    }
    return a;
  }

  simplificar() {
    const mcd = this.sacarMCD(this.num, this.den);
    if (mcd !== 0) {
      this.num /= mcd;
      this.den /= mcd;
    }
    return this;
  }

  sumar(otra) {
    return new Fraccion(
      this.num * otra.den + otra.num * this.den,
      this.den * otra.den,
    );
  }

  restar(otra) {
    return new Fraccion(
      this.num * otra.den - otra.num * this.den,
      this.den * otra.den,
    );
  }

  multiplicar(otra) {
    return new Fraccion(this.num * otra.num, this.den * otra.den);
  }

  dividir(otra) {
    if (otra.num === 0) throw new Error("División por cero");
    return new Fraccion(this.num * otra.den, this.den * otra.num);
  }

  pasarString() {
    if (this.num === 0) return "0";
    if (this.den === 1) return `${this.num}`;
    return `${this.num}/${this.den}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const botonR = document.getElementById("botonResolver");
  const tabla = document.getElementById("tablaMatriz");
  let factoresDeterminante = [];
  let intercambios = 0;

  botonR.addEventListener("click", () => {
    factoresDeterminante = [];
    intercambios = 0;
    const opcion = document.querySelector(
      'input[name="operacion"]:checked',
    ).value;

    const codigoError = matrizError();

    switch (codigoError) {
      case 3:
        return alert("Existe elementos no numericos");
      case 2:
        return alert("La matriz esta incompleta");
      case 1:
        return alert("La matriz debe ser cuadrada");
      case -1:
        return alert("No hay matriz que resolver");
      default:
        break;
    }

    const matriz = cargarMatriz();
    console.log("ESTA ES LA MATRIZ A RESOLVER");
    console.log(matriz.map((fila) => fila.map((f) => f.pasarString())));

    const matrizResuelta = GaussJordan(matriz, opcion);
    console.log(matrizResuelta);
    console.log("MATRIZ RESUELTA:");
    console.table(
      matrizResuelta.map((fila) => fila.map((f) => f.pasarString())),
    );

    mostrarResultado(matrizResuelta, opcion);
    interpretacion(matrizResuelta, opcion);

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

      if (opcion !== "sel" && filas !== columnas) return 1;

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

      if (opcion == "inv") {
        const n = matriz.length;
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            matriz[i].push(new Fraccion(i === j ? 1 : 0, 1));
          }
        }
      }

      return matriz;
    }

    function pasarAFraccion(valor) {
      if (valor === "") return new Fraccion(NaN, NaN);

      if (valor.includes("/")) {
        const partes = valor.split("/");
        if (partes.length !== 2) return new Fraccion(NaN, NaN);

        const numerador = Number(partes[0]);
        const denominador = Number(partes[1]);

        if (isNaN(numerador) || isNaN(denominador) || denominador === 0)
          return new Fraccion(NaN, NaN);
        return new Fraccion(numerador, denominador);
      }

      const num = Number(valor);
      if (isNaN(num)) return new Fraccion(NaN, NaN);

      if (valor.includes(".")) {
        const decimales = valor.split(".")[1];
        const cantidadDecimales = decimales ? decimales.length : 0;

        if (cantidadDecimales > 0) {
          const multiplicador = Math.pow(10, cantidadDecimales);
          return new Fraccion(Math.round(num * multiplicador), multiplicador);
        }
      }

      return new Fraccion(num, 1);
    }

    function interpretacion(matrizResuelta, opcion) {
      const y = matrizResuelta.length;
      const x = matrizResuelta[0].length;

      const divInter = document.getElementById("interpretacion");
      divInter.innerHTML = "";

      const contenedorEstilizado = document.createElement("div");
      contenedorEstilizado.classList.add("resultado-det");

      let mensaje = "";
      if (opcion === "sel") {
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

        if (contradiccion) {
          mensaje = "> El SEL <strong>no tiene solución</strong>";
        } else if (filaDeCeros || y < x - 1) {
          mensaje = "> El SEL es <strong>L.D.</strong> (Infinitas soluciones).";
        } else {
          mensaje = "> El SEL es <strong>L.I.</strong> (Solución única).";
        }
      } else if (opcion === "inv") {
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
  });

  function moverPivote(matriz, j) {
    const n = matriz.length;
    let j_max = j;

    const a_valor = (f) => {
        if (!f || typeof f.num === 'undefined') return -1;
        return Math.abs(f.num / f.den);
    };

    for (let i = j; i < n; i++) {
      if (matriz[i] && matriz[i][j]) {
        if (a_valor(matriz[i][j]) > a_valor(matriz[j_max][j])) {
          j_max = i;
        }
      }
    }

    if (!matriz[j_max] || !matriz[j_max][j]) return false;

    if (j_max !== j) {
      [matriz[j], matriz[j_max]] = [matriz[j_max], matriz[j]];
      intercambios++;
      console.log(`Intercambio: Fila ${j + 1} con Fila ${j_max + 1}`);
    }

    if (matriz[j][j].num === 0) {
      console.log("La columna es toda ceros, no hay pivote.");
      return false;
    }

    return true;
  }

  function hacerPivoteUno(matriz, i, j) {
    const n_columnas = matriz[0].length;
    const pivote = matriz[i][j];

    if (pivote.num !== 0) {
      factoresDeterminante.push(pivote.pasarString());

      for (let k = 0; k < n_columnas; k++) {
        matriz[i][k] = matriz[i][k].dividir(pivote);
      }
      return true;
    } else {
      console.log("No hay pivote en esta fila.");
      return false;
    }
  }

  function hacerCerosAbajo(matriz, i, j) {
    const n_filas = matriz.length;
    const n_columnas = matriz[0].length;
    const pivoteFila = i;

    for (let mi = pivoteFila + 1; mi < n_filas; mi++) {
      const factor = matriz[mi][j];

      for (let nj = 0; nj < n_columnas; nj++) {
        const sustraendo = factor.multiplicar(matriz[pivoteFila][nj]);
        matriz[mi][nj] = matriz[mi][nj].restar(sustraendo);
      }
    }
  }

  function hacerCerosArriba(matriz, i, j) {
    const n_columnas = matriz[0].length;
    const pivoteFila = i;

    for (let mi = 0; mi < pivoteFila; mi++) {
      const factor = matriz[mi][j];

      for (let nj = 0; nj < n_columnas; nj++) {
        const sustraendo = factor.multiplicar(matriz[pivoteFila][nj]);
        matriz[mi][nj] = matriz[mi][nj].restar(sustraendo);
      }
    }
  }

  function GaussJordan(matriz, opcion) {
    const m = matriz.length;
    const n = opcion === "sel" ? matriz[0].length - 1 : matriz[0].length;

    const minimo = Math.min(m, n);

    for (let i = 0; i < minimo; i++) {
      let j = i;

      if (moverPivote(matriz, j)) {
        hacerPivoteUno(matriz, i, j);
        hacerCerosAbajo(matriz, i, j);
      }
    }

    for (let i = minimo - 1; i >= 0; i--) {
      let j = i;
      if (matriz[i][j] && matriz[i][j].num !== 0) {
        hacerCerosArriba(matriz, i, j);
      }
    }

    return matriz;
  }

  function mostrarResultado(matriz, opcion) {
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

          if (opcion === "sel" && j === columnas - 2) {
            celdaTD.classList.add("columna-aumentada");
          }

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
});