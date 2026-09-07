const libro = document.getElementById("libro");

const portada = document.getElementById("portada");

const hojas = Array.from(
    document.querySelectorAll(".hoja")
);

let pagina = 0;


/* =================================
   ORDEN DE LAS HOJAS
================================= */

hojas.forEach((hoja, indice) => {

    hoja.style.zIndex =
        hojas.length - indice + 1;

});


/* =================================
   VARIABLES DEL MOVIMIENTO
================================= */

let inicioX = 0;
let inicioY = 0;

let moviendo = false;

let ultimaDireccion = 0;


/* =================================
   INICIO DEL TOQUE
================================= */

libro.addEventListener(
    "touchstart",
    function(e) {

        const toque =
            e.touches[0];

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


        /*
          Si el movimiento es principalmente
          vertical, no pasamos página.
        */

        if (
            Math.abs(diferenciaX) <
            Math.abs(diferenciaY)
        ) {
            return;
        }


        /*
          Distancia mínima.
        */

        if (
            Math.abs(diferenciaX) < 35
        ) {
            return;
        }


        /*
          IZQUIERDA:
          abrir / siguiente página
        */

        if (diferenciaX < 0) {

            siguientePagina();

        }


        /*
          DERECHA:
          regresar
        */

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
       Primero se abre la portada.
    */

    if (pagina === 0) {

        portada.style.transform =
            "rotateY(-180deg)";

        pagina++;

        return;
    }


    /*
       Después se pasan las hojas.
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


/* =================================
   PÁGINA ANTERIOR
================================= */

function paginaAnterior() {

    if (pagina <= 0) {
        return;
    }


    /*
       Si estamos en la primera página,
       volvemos a cerrar la portada.
    */

    if (pagina === 1) {

        portada.style.transform =
            "rotateY(0deg)";

        pagina--;

        return;
    }


    /*
       Regresar una hoja.
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


/* =================================
   ARRASTRAR EL LIBRO
================================= */

let tocando = false;

libro.addEventListener(
    "touchmove",
    function(e) {

        if (!moviendo) return;

        const toque =
            e.touches[0];

        const desplazamiento =
            toque.clientX - inicioX;


        /*
           Pequeña inclinación del libro
           mientras se mueve el dedo.
        */

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
   VOLVER A POSICIÓN NORMAL
================================= */

libro.addEventListener(
    "touchend",
    function() {

        libro.style.transform =
            "rotateX(2deg) rotateY(-2deg)";

    }
);


/* =================================
   TAMBIÉN FUNCIONA CON MOUSE
   PARA PROBAR EN COMPUTADORA
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
