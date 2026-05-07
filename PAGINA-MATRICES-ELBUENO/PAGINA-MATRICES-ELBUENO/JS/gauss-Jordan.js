function moverPivote(matriz, j, inter) {
    const n = matriz.length;
    let j_max = j;

    const a_valor = (f) => {
    if (!f || typeof f.num === "undefined") return -1;
        return Math.abs(f.num / f.den);
    };

    for (let i = j; i < n; i++) {
        if (matriz[i] && matriz[i][j] && matriz[i][j].num !== 0) {
            if (a_valor(matriz[i][j]) > a_valor(matriz[j_max][j])) {
                j_max = i;
            }
        }
    }

    if (!matriz[j_max] || !matriz[j_max][j]) return false;

    if (j_max !== j) {
        [matriz[j], matriz[j_max]] = [matriz[j_max], matriz[j]];
        inter.intercambios++;
        console.log(`Intercambio: Fila ${j + 1} con Fila ${j_max + 1}`);
    }

    if (matriz[j][j].num === 0) {
        console.log("La columna es toda ceros, no hay pivote.");
        return false;
    }

    return true;
}

function hacerPivoteUno(matriz, i, j, factoresDeterminante) {
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

        // Solo operar si el factor no es 0
        if (factor && factor.num !== 0) {
            for (let nj = 0; nj < n_columnas; nj++) {
                const sustraendo = factor.multiplicar(matriz[pivoteFila][nj]);
                matriz[mi][nj] = matriz[mi][nj].restar(sustraendo);
            }
        }
    }
}

function hacerCerosArriba(matriz, i, j) {
    const n_columnas = matriz[0].length;
    const pivoteFila = i;

    for (let mi = 0; mi < pivoteFila; mi++) {
        const factor = matriz[mi][j];

        //Solo opera si el factor no es 0
        if (factor && factor.num !== 0) {
            for (let nj = 0; nj < n_columnas; nj++) {
                const sustraendo = factor.multiplicar(matriz[pivoteFila][nj]);
                matriz[mi][nj] = matriz[mi][nj].restar(sustraendo);
            }
        }
    }
}

export function GaussJordan(matriz, opcion, inter, factoresDeterminante) {
    const m = matriz.length;
    // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------
    const n = (opcion === "sel" || opcion === "sev") ? matriz[0].length - 1 : matriz[0].length;
    // ! ---------------------------------------------- LUIS TOVAR ESPACIOS VECTORIALES ----------------------------------------------

    const minimo = Math.min(m, n);

    for (let i = 0; i < minimo; i++) {
        let j = i;

        if (moverPivote(matriz, j, inter)) {
            hacerPivoteUno(matriz, i, j, factoresDeterminante);
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