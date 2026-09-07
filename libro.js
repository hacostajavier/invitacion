javascript
const libro = document.getElementById("libro");

const paginas = Array.from(
    document.querySelectorAll(".hoja")
);

let paginaActual = 0;

const totalPaginas = paginas.length;


/* =========================================
   ORDEN CORRECTO DE LAS HOJAS
========================================= */

paginas.forEach((pagina, indice) => {

    /*
       La portada queda arriba.
       Las siguientes hojas quedan debajo.
    */

    pagina.style.zIndex =
        totalPaginas - indice;

});


/* =========================================
   VARIABLES TÁCTILES
========================================= */

let inicioX = 0;
let inicioY = 0;

let tocando = false;


/* =========================================
   INICIO DEL DEDO
========================================= */

libro.addEventListener(
    "touchstart",
    function(evento) {

        const toque = evento.touches[0];

        inicioX = toque.clientX;
        inicioY = toque.clientY;

        tocando = true;

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

        if (!tocando) {
            return;
        }

        const toque =
            evento.changedTouches[0];

        const finalX =
            toque.clientX;

        const finalY =
            toque.clientY;

        const movimientoX =
            finalX - inicioX;

        const movimientoY =
            finalY - inicioY;

        tocando = false;


        /*
           Ignorar movimiento vertical.
        */

        if (
            Math.abs(movimientoY) >
            Math.abs(movimientoX)
        ) {
            return;
        }


        /*
           Movimiento mínimo.
        */

        if (
            Math.abs(movimientoX) < 40
        ) {
            return;
        }


        /*
           Deslizar hacia la izquierda:
           siguiente hoja.
        */

        if (movimientoX < 0) {

            siguientePagina();

        }


        /*
           Deslizar hacia la derecha:
           hoja anterior.
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
   SIGUIENTE HOJA
========================================= */

function siguientePagina() {

    if (
        paginaActual >=
        totalPaginas - 1
    ) {
        return;
    }


    const hoja =
        paginas[paginaActual];


    hoja.classList.add(
        "volteada"
    );


    /*
       Después de girar, bajamos
       su capa para que la siguiente
       hoja quede disponible.
    */

    setTimeout(() => {

        hoja.style.zIndex = paginaActual + 1;

    }, 450);


    paginaActual++;

}


/* =========================================
   HOJA ANTERIOR
========================================= */

function paginaAnterior() {

    if (
        paginaActual <= 0
    ) {
        return;
    }


    paginaActual--;


    const hoja =
        paginas[paginaActual];


    /*
       Volvemos a subir la hoja
       antes de devolverla.
    */

    hoja.style.zIndex =
        totalPaginas + 10;


    hoja.classList.remove(
        "volteada"
    );

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

        const movimiento =
            evento.clientX -
            mouseInicioX;

        mouseActivo = false;


        if (
            Math.abs(movimiento) < 40
        ) {
            return;
        }


        if (movimiento < 0) {

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
