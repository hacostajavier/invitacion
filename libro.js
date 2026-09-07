const libro = document.getElementById("libro");

const portada = document.getElementById("portada");

const sonidoHoja =
    document.getElementById("sonidoHoja");


// ========================================
// OBTENER HOJAS
// ========================================

const hojas = Array.from(
    document.querySelectorAll(".hoja")
).reverse();


// ========================================
// PÁGINA ACTUAL
// ========================================

let pagina = 0;


// ========================================
// ORDEN DE LAS HOJAS
// ========================================

hojas.forEach((hoja, indice) => {

    hoja.style.zIndex =
        hojas.length - indice + 1;

});


// La portada queda por encima

portada.style.zIndex =
    hojas.length + 10;


// ========================================
// SONIDO
// ========================================

function reproducirSonido() {

    if (!sonidoHoja) {
        return;
    }

    sonidoHoja.currentTime = 0;

    const reproduccion =
        sonidoHoja.play();

    if (reproduccion !== undefined) {

        reproduccion.catch(() => {
            // El navegador puede bloquear
            // el audio hasta una interacción.
        });

    }
}


// ========================================
// SIGUIENTE PÁGINA
// ========================================

function siguientePagina() {

    // --------------------------------
    // PORTADA
    // --------------------------------

    if (pagina === 0) {

        portada.style.transform =
            "rotateY(-180deg)";

        pagina = 1;

        reproducirSonido();

        return;
    }


    // --------------------------------
    // PÁGINAS
    // --------------------------------

    const indice = pagina - 1;

    if (
        indice >= 0 &&
        indice < hojas.length
    ) {

        hojas[indice].classList.add(
            "volteada"
        );

        pagina++;

        reproducirSonido();

        return;
    }


    // Ya está en la última página

    return;
}


// ========================================
// PÁGINA ANTERIOR
// ========================================

function paginaAnterior() {

    if (pagina <= 0) {
        return;
    }


    // --------------------------------
    // VOLVER A PORTADA
    // --------------------------------

    if (pagina === 1) {

        portada.style.transform =
            "rotateY(0deg)";

        pagina = 0;

        reproducirSonido();

        return;
    }


    // --------------------------------
    // VOLVER UNA HOJA
    // --------------------------------

    const indice = pagina - 2;

    if (
        indice >= 0 &&
        indice < hojas.length
    ) {

        hojas[indice].classList.remove(
            "volteada"
        );

        pagina--;

        reproducirSonido();

        return;
    }
}


// ========================================
// DESLIZAMIENTO EN CELULAR
// ========================================

let inicioX = 0;

let inicioY = 0;

let moviendo = false;


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


libro.addEventListener(
    "touchend",
    function(e) {

        if (!moviendo) {
            return;
        }

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


        // Evitar interpretar
        // desplazamientos verticales

        if (
            Math.abs(diferenciaX) <
            Math.abs(diferenciaY)
        ) {
            return;
        }


        // Movimiento muy pequeño

        if (
            Math.abs(diferenciaX) < 35
        ) {
            return;
        }


        // Deslizar hacia la izquierda

        if (diferenciaX < 0) {

            siguientePagina();

        }

        // Deslizar hacia la derecha

        else {

            paginaAnterior();

        }

    },
    {
        passive: true
    }
);


// ========================================
// MOVIMIENTO DEL LIBRO
// ========================================

libro.addEventListener(
    "touchmove",
    function(e) {

        if (!moviendo) {
            return;
        }

        const toque =
            e.touches[0];

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
            `rotateX(2deg) rotateY(${-2 + inclinacion}deg)`;

    },
    {
        passive: true
    }
);


libro.addEventListener(
    "touchend",
    function() {

        libro.style.transform =
            "rotateX(2deg) rotateY(-2deg)";

    }
);


// ========================================
// MOUSE EN COMPUTADORA
// ========================================

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

        if (!mouseActivo) {
            return;
        }

        const diferencia =
            e.clientX - mouseInicio;

        mouseActivo = false;


        // Ignorar movimiento pequeño

        if (
            Math.abs(diferencia) < 40
        ) {
            return;
        }


        // Arrastrar hacia izquierda

        if (diferencia < 0) {

            siguientePagina();

        }

        // Arrastrar hacia derecha

        else {

            paginaAnterior();

        }

    }
);
