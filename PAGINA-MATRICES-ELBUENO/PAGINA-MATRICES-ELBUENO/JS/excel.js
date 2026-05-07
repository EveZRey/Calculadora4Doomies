document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("excel");


    boton.addEventListener("click", () => {
        const opcion = document.querySelector(
            'input[name="operacion"]:checked',
        ).value;
        const tablaOriginal = document.querySelector("#resultado table");
        if (!tablaOriginal) return alert("No hay datos para exportar");

        const colorAzul = "#2c7be5";
        const colorTexto = "#ffffff";
        const colorBorde = "#d6eaff";

        const numColumnas = tablaOriginal.rows[0].cells.length;
        let filaEncabezado = `<tr>`;
        
        for (let i = 1; i <= numColumnas; i++) {
            let mensaje = ``;
            let condicion;

            if (opcion !== "sel" && opcion !== "sev") condicion = true;
            else condicion =  i < numColumnas;

            if (condicion) { 
                mensaje += `Vector_${i}`;
                console.log("columna " + i + ", condicion " + condicion);
            };

            filaEncabezado += `<th style="
                                  font-weight: bold; 
                                  text-align: center; 
                                  background-color: ${colorAzul}; 
                                  color: ${colorTexto}; 
                                  border: 1px solid ${colorBorde}; 
                                  padding: 10rem;">${mensaje}</th>`;
        }
        filaEncabezado += `</tr>`;

        let cuerpoTabla = "";

        Array.from(tablaOriginal.rows).forEach((fila) => {
            cuerpoTabla += "<tr>";
            Array.from(fila.cells).forEach((celda) => {
                let valor = celda.querySelector("input") ? celda.querySelector("input").value : celda.innerText;
                if (valor.includes("\n")) {
                    console.log(valor + " y tambien " + valor.includes("\n") + " y tambien " + valor.includes(" ") );
                    valor = valor.replace("\n", "/");
                };

                //FALTA QUE SEPA LO DE e, raiz y pi

                cuerpoTabla += `<td style="
                                  border: 1px solid ${colorBorde}; 
                                  padding: 8px; 
                                  color: ${colorAzul}; 
                                  border: 1px solid ${colorAzul}; 
                                  text-align: center;
                                  mso-number-format: '0 ???/???';">${valor}</td>`;
            });
            cuerpoTabla += "</tr>";
        });

        const uri = 'data:application/vnd.ms-excel;base64,';
        const template = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head><meta charset="UTF-8"></head>
            <body>
                <table border="1" style="border-collapse: collapse; font-family: Arial, sans-serif;">
                    <thead>${filaEncabezado}</thead>
                    <tbody>${cuerpoTabla}</tbody>
                </table>
            </body>
            </html>`;

        const link = document.createElement("a");
        link.href = uri + btoa(unescape(encodeURIComponent(template)));
        link.download = "Matriz_Resultado.xls";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

});