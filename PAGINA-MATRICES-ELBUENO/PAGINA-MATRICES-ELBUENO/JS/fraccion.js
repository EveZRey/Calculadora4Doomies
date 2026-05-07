export class Fraccion {
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

export function pasarAFraccion(valor) {
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