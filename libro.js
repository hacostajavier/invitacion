const libro = document.getElementById("libro");
const portada = document.getElementById("portada");

const hojas = Array.from(
    document.querySelectorAll(".hoja")
);

/* =================================
   ORDEN REAL DE LAS HOJAS
================================= */

/*
   La última .hoja será la CONTRAPORTADA.

   Ejemplo:

   HTML:
   .hoja 0 = Hoja 1
   .hoja 1 = Hoja 2
   .hoja 2 = Hoja 3
   .hoja 3 = Contraportada

   Al pasar:
   Portada → Hoja 1 → Hoja 2 → Hoja 3 → Contraportada
*/

const hojasInteriores = hojas.slice(0, -1);

const contraportada =
    hojas.length > 0
        ? hojas[hojas.length - 1]
        : null;


/* =================================
   PONER NOMBRE A LA CONTRAPORTADA
================================= */

if (contraportada) {
    contraportada.dataset.tipo = "contraportada";
}


/* =================================
   ORDEN DE PROFUNDIDAD
================================= */

/*
   La hoja que está adelante
   debe tener mayor z-index.
*/

hojas.forEach((hoja, indice) => {

    hoja.style.zIndex =
        hojas.length - indice + 1;

});


/* =================================
   VARIABLES
================================= */

let pagina = 0;

let inicioX = 0;
let inicioY = 0;

let moviendo = false;


/* =================================
   INICIO DEL TOQUE
================================= */

libro.addEventListener(
    "touchstart",
    function(e) {

        const toque = e.touches[0];

        inicioX = toque.clientX;
        inicioY = toque.clientY;

        moviendo = true;

    },
    {
        passive: true
    }
);


/* =================================
   MOVIMIENTO DEL DEDO
================================= */

libro.addEventListener(
    "touchmove",
    function(e) {

        if (!moviendo) return;

        const toque = e.touches[0];

        const desplazamiento =
            toque.clientX - inicioX;

        let inclinacion =
            desplazamiento / 25;

        inclinacion =
            Math.max(
                -8,
                Math.min(
                    8,
                    inclinacion
                )
            );

        libro.style.transform =
            `rotateX(2deg)
             rotateY(${-2 + inclinacion}deg)`;

    },
    {
        passive: true
    }
);


/* =================================
   FINAL DEL TOQUE
================================= */

libro.addEventListener(
    "touchend",
    function(e) {

        if (!moviendo) return;

        const toque =
            e.changedTouches[0];

        const finalX =
            toque.clientX;

        const finalY =
            toque.clientY;

        const diferenciaX =
            finalX - inicioX;

        const diferenciaY =
            finalY - inicioY;

        moviendo = false;


        /* Volver a posición normal */

        libro.style.transform =
            "rotateX(2deg) rotateY(-2deg)";


        /* No pasar si es movimiento vertical */

        if (
            Math.abs(diferenciaX) <
            Math.abs(diferenciaY)
        ) {
            return;
        }


        /* Distancia mínima */

        if (
            Math.abs(diferenciaX) < 35
        ) {
            return;
        }


        /* IZQUIERDA = SIGUIENTE */

        if (diferenciaX < 0) {

            siguientePagina();

        }

        /* DERECHA = ANTERIOR */

        else {

            paginaAnterior();

        }

    },
    {
        passive: true
    }
);


/* =================================
   SIGUIENTE PÁGINA
================================= */

function siguientePagina() {

    /*
       0 = portada cerrada/visible
    */

    if (pagina === 0) {

        portada.style.transform =
            "rotateY(-180deg)";

        pagina = 1;

        actualizarOrden();

        return;
    }


    /*
       Pasamos las hojas interiores
       una por una.
    */

    const indice =
        pagina - 1;


    if (
        indice < hojasInteriores.length
    ) {

        hojasInteriores[indice]
            .classList
            .add("volteada");

        pagina++;

        actualizarOrden();

        return;
    }


    /*
       Cuando ya no quedan hojas interiores,
       se muestra la contraportada.

       La contraportada NO se voltea.
       Simplemente pasa a ser la última cara.
    */

    if (
        pagina ===
        hojasInteriores.length + 1
    ) {

        if (contraportada) {

            contraportada.classList
                .add("mostrada");

        }

        pagina++;

        actualizarOrden();

        return;
    }

}


/* =================================
   PÁGINA ANTERIOR
================================= */

function paginaAnterior() {

    if (pagina <= 0) {
        return;
    }


    /*
       Si estamos viendo la contraportada,
       primero volvemos a la última hoja.
    */

    if (
        pagina ===
        hojasInteriores.length + 2
    ) {

        if (contraportada) {

            contraportada.classList
                .remove("mostrada");

        }

        pagina--;

        actualizarOrden();

        return;
    }


    /*
       Retroceder una hoja interior.
    */

    if (
        pagina >
        1
    ) {

        const indice =
            pagina - 2;

        if (
            hojasInteriores[indice]
        ) {

            hojasInteriores[indice]
                .classList
                .remove("volteada");

        }

        pagina--;

        actualizarOrden();

        return;
    }


    /*
       Finalmente volvemos a la portada.
    */

    if (pagina === 1) {

        portada.style.transform =
            "rotateY(0deg)";

        pagina = 0;

        actualizarOrden();

        return;
    }

}


/* =================================
   ACTUALIZAR ORDEN DE LAS HOJAS
================================= */

function actualizarOrden() {

    /*
       Las hojas ya volteadas deben quedar
       detrás de las que todavía no se han
       volteado.
    */

    hojas.forEach(
        (hoja, indice) => {

            hoja.style.zIndex =
                hojas.length - indice + 1;

        }
    );


    /*
       La contraportada siempre queda
       al final del libro.
    */

    if (contraportada) {

        contraportada.style.zIndex = 1;

    }
}


/* =================================
   MOUSE PARA COMPUTADORA
================================= */

let mouseInicio = 0;
let mouseActivo = false;


libro.addEventListener(
    "mousedown",
    function(e) {

        mouseInicio =
            e.clientX;

        mouseActivo = true;

    }
);


document.addEventListener(
    "mouseup",
    function(e) {

        if (!mouseActivo) return;

        const diferencia =
            e.clientX - mouseInicio;

        mouseActivo = false;


        if (
            Math.abs(diferencia) < 40
        ) {
            return;
        }


        if (diferencia < 0) {

            siguientePagina();

        } else {

            paginaAnterior();

        }

    }
);


/* =================================
   POSICIÓN INICIAL
================================= */

actualizarOrden();
