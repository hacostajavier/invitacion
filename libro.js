javascript
const libro =
    document.getElementById("libro");

const portada =
    document.getElementById("portada");

const hojas =
    Array.from(
        document.querySelectorAll(
            ".hoja:not(.portada):not(.contraportada)"
        )
    );

let pagina = 0;


/* =========================================
   ORDEN DE LAS HOJAS
========================================= */

hojas.forEach(
    (hoja, indice) => {

        hoja.style.zIndex =
            hojas.length - indice + 1;

    }
);


/* =========================================
   VARIABLES TÁCTILES
========================================= */

let inicioX = 0;
let inicioY = 0;

let moviendo = false;


/* =========================================
   INICIO DEL DEDO
========================================= */

libro.addEventListener(
    "touchstart",
    function(evento) {

        const toque =
            evento.touches[0];

        inicioX =
            toque.clientX;

        inicioY =
            toque.clientY;

        moviendo = true;

    },
    {
        passive: true
    }
);


/* =========================================
   MOVIMIENTO DEL DEDO
========================================= */

libro.addEventListener(
    "touchmove",
    function(evento) {

        if (!moviendo) {
            return;
        }

        const toque =
            evento.touches[0];

        const desplazamiento =
            toque.clientX - inicioX;


        /*
           Pequeña inclinación del libro
           mientras arrastras.
        */

        let inclinacion =
            desplazamiento / 30;


        inclinacion =
            Math.max(
                -7,
                Math.min(
                    7,
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


/* =========================================
   FINAL DEL DEDO
========================================= */

libro.addEventListener(
    "touchend",
    function(evento) {

        if (!moviendo) {
            return;
        }

        const toque =
            evento.changedTouches[0];

        const finalX =
            toque.clientX;

        const finalY =
            toque.clientY;


        const diferenciaX =
            finalX - inicioX;

        const diferenciaY =
            finalY - inicioY;


        moviendo = false;


        /*
           Volver el libro a su posición.
        */

        libro.style.transform =
            "rotateX(2deg) rotateY(-2deg)";


        /*
           Ignorar movimientos verticales.
        */

        if (
            Math.abs(diferenciaX) <
            Math.abs(diferenciaY)
        ) {
            return;
        }


        /*
           Movimiento mínimo.
        */

        if (
            Math.abs(diferenciaX) < 40
        ) {
            return;
        }


        /*
           DESLIZAR A LA IZQUIERDA
        */

        if (
            diferenciaX < 0
        ) {

            siguientePagina();

        }


        /*
           DESLIZAR A LA DERECHA
        */

        else {

            paginaAnterior();

        }

    },
    {
        passive: true
    }
);


/* =========================================
   SIGUIENTE PÁGINA
========================================= */

function siguientePagina() {


    /*
       Primero abrimos la portada.
    */

    if (pagina === 0) {

        portada.classList.add(
            "volteada"
        );

        pagina++;

        return;
    }


    /*
       Luego pasamos las páginas.
    */

    const indice =
        pagina - 1;


    if (
        indice >= hojas.length
    ) {
        return;
    }


    hojas[indice]
        .classList
        .add("volteada");


    pagina++;

}


/* =========================================
   PÁGINA ANTERIOR
========================================= */

function paginaAnterior() {

    if (pagina <= 0) {
        return;
    }


    /*
       Si estamos viendo la primera
       página, cerramos la portada.
    */

    if (pagina === 1) {

        portada.classList.remove(
            "volteada"
        );

        pagina--;

        return;
    }


    /*
       Regresar una página.
    */

    const indice =
        pagina - 2;


    if (
        indice < 0
    ) {
        return;
    }


    hojas[indice]
        .classList
        .remove("volteada");


    pagina--;

}


/* =========================================
   MOUSE PARA COMPUTADORA
========================================= */

let mouseInicioX = 0;

let mouseActivo = false;


libro.addEventListener(
    "mousedown",
    function(evento) {

        mouseInicioX =
            evento.clientX;

        mouseActivo = true;

    }
);


document.addEventListener(
    "mouseup",
    function(evento) {

        if (!mouseActivo) {
            return;
        }

        const diferencia =
            evento.clientX -
            mouseInicioX;

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


/* =========================================
   TECLADO
========================================= */

document.addEventListener(
    "keydown",
    function(evento) {

        if (
            evento.key ===
            "ArrowRight"
        ) {

            siguientePagina();

        }


        if (
            evento.key ===
            "ArrowLeft"
        ) {

            paginaAnterior();

        }

    }
);
