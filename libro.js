/* =========================================
   LIBRO DIGITAL - INVITACIÓN
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const libro = document.getElementById("libro");

    const portada = document.getElementById("portada");

    const paginas = Array.from(
        document.querySelectorAll(".pagina")
    );

    const contraportada =
        document.querySelector(".contraportada");


    /*
       ORDEN REAL DEL LIBRO:

       0 = PORTADA
       1 = PÁGINA 1
       2 = PÁGINA 2
       3 = PÁGINA 3
       4 = CONTRAPORTADA
    */

    const hojas = [
        portada,
        ...paginas,
        contraportada
    ];


    let paginaActual = 0;

    const totalHojas = hojas.length;


    /* =========================================
       Z-INDEX INICIAL
    ========================================= */

    function organizarCapas() {

        hojas.forEach((hoja, indice) => {

            hoja.style.zIndex =
                totalHojas - indice;

        });

    }

    organizarCapas();


    /* =========================================
       PASAR A LA SIGUIENTE HOJA
    ========================================= */

    function siguientePagina() {

        if (paginaActual >= totalHojas - 1) {
            return;
        }

        const hoja = hojas[paginaActual];

        hoja.classList.add("volteada");

        /*
           Esperamos un poco antes de bajar
           la hoja para que la animación
           termine correctamente.
        */

        setTimeout(() => {

            hoja.style.zIndex =
                paginaActual + 1;

        }, 500);


        paginaActual++;

    }


    /* =========================================
       VOLVER A LA HOJA ANTERIOR
    ========================================= */

    function paginaAnterior() {

        if (paginaActual <= 0) {
            return;
        }

        paginaActual--;

        const hoja = hojas[paginaActual];

        /*
           La ponemos arriba antes de
           quitar la rotación.
        */

        hoja.style.zIndex = 50 + paginaActual;

        hoja.classList.remove("volteada");

    }


    /* =========================================
       CONTROL DE TOUCH
    ========================================= */

    let inicioX = 0;
    let inicioY = 0;

    let moviendo = false;


    document.addEventListener(
        "touchstart",
        (evento) => {

            if (!evento.touches.length) {
                return;
            }

            inicioX =
                evento.touches[0].clientX;

            inicioY =
                evento.touches[0].clientY;

            moviendo = true;

        },
        { passive: true }
    );


    document.addEventListener(
        "touchmove",
        (evento) => {

            if (!moviendo) {
                return;
            }

            if (!evento.touches.length) {
                return;
            }

            const actualX =
                evento.touches[0].clientX;

            const actualY =
                evento.touches[0].clientY;

            const diferenciaX =
                actualX - inicioX;

            const diferenciaY =
                actualY - inicioY;


            /*
               Solo consideramos el gesto
               si es principalmente horizontal.
            */

            if (
                Math.abs(diferenciaX) >
                Math.abs(diferenciaY)
            ) {

                evento.preventDefault();

            }

        },
        { passive: false }
    );


    document.addEventListener(
        "touchend",
        (evento) => {

            if (!moviendo) {
                return;
            }

            moviendo = false;

            const finalX =
                evento.changedTouches[0].clientX;

            const finalY =
                evento.changedTouches[0].clientY;

            const diferenciaX =
                finalX - inicioX;

            const diferenciaY =
                finalY - inicioY;


            /*
               Distancia mínima necesaria
               para reconocer el deslizamiento.
            */

            const distanciaMinima = 45;


            /*
               Evitamos que un movimiento
               vertical cambie de página.
            */

            if (
                Math.abs(diferenciaX) <
                Math.abs(diferenciaY)
            ) {
                return;
            }


            if (
                Math.abs(diferenciaX) <
                distanciaMinima
            ) {
                return;
            }


            /*
               DESLIZAR HACIA LA IZQUIERDA
               = SIGUIENTE
            */

            if (diferenciaX < 0) {

                siguientePagina();

            }


            /*
               DESLIZAR HACIA LA DERECHA
               = ANTERIOR
            */

            else {

                paginaAnterior();

            }

        },
        { passive: true }
    );


    /* =========================================
       CONTROL CON MOUSE
    ========================================= */

    let mouseInicioX = 0;
    let mousePresionado = false;


    libro.addEventListener(
        "mousedown",
        (evento) => {

            mousePresionado = true;

            mouseInicioX = evento.clientX;

        }
    );


    document.addEventListener(
        "mouseup",
        (evento) => {

            if (!mousePresionado) {
                return;
            }

            mousePresionado = false;

            const diferencia =
                evento.clientX - mouseInicioX;


            if (Math.abs(diferencia) < 45) {
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
        (evento) => {

            if (
                evento.key === "ArrowLeft" ||
                evento.key === " "
            ) {

                siguientePagina();

            }


            if (
                evento.key === "ArrowRight"
            ) {

                paginaAnterior();

            }

        }
    );


    /* =========================================
       EVITAR MENÚ CONTEXTUAL
    ========================================= */

    libro.addEventListener(
        "contextmenu",
        (evento) => {

            evento.preventDefault();

        }
    );


    /* =========================================
       EVITAR ARRASTRAR IMÁGENES
    ========================================= */

    const imagenes =
        document.querySelectorAll("img");

    imagenes.forEach((imagen) => {

        imagen.addEventListener(
            "dragstart",
            (evento) => {

                evento.preventDefault();

            }
        );

    });


});
