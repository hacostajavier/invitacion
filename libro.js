const libro = document.getElementById("libro");
const portada = document.getElementById("portada");
const sonidoHoja = document.getElementById("sonidoHoja");


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
// ORDEN VISUAL
// ========================================

hojas.forEach((hoja, indice) => {

    hoja.style.zIndex =
        hojas.length - indice + 1;

});


// La portada siempre arriba

portada.style.zIndex =
    hojas.length + 10;


// ========================================
// SONIDO
// ========================================

function reproducirSonido() {

    if (!sonidoHoja) return;

    sonidoHoja.currentTime = 0;

    const promesa = sonidoHoja.play();

    if (promesa !== undefined) {

        promesa.catch(() => {
            // El navegador puede bloquear
            // el sonido hasta que exista
            // una interacción del usuario.
        });

    }
}


// ========================================
// SIGUIENTE PÁGINA
// ========================================

function siguientePagina() {

    // ----------------------------
    // PORTADA
    // ----------------------------

    if (pagina === 0) {

        portada.style.transform =
            "rotateY(-180deg)";

        pagina = 1;

        reproducirSonido();

        return;
    }


    // ----------------------------
    // HOJAS
    // ----------------------------

    const indice = pagina - 1;


    if (indice >= 0 &&
        indice < hojas.length) {

        hojas[indice].classList.add(
            "volteada"
        );

        pagina++;

        reproducirSonido();

        return;
    }


    // Ya llegó a la última página

    return;
}


// ========================================
// PÁGINA ANTERIOR
// ========================================

function paginaAnterior() {

    if (pagina <= 0) {
        return;
    }


    // ----------------------------
    // VOLVER A PORTADA
    // ----------------------------

    if (pagina === 1) {

        portada.style.transform =
            "rotateY(0deg)";

        pagina = 0;

        reproducirSonido();

        return;
    }


    // ----------------------------
    // VOLVER UNA HOJA
    // ----------------------------

    const indice = pagina - 2;


    if (indice >= 0 &&
        indice < hojas.length) {

        hojas[indice].classList.remove(
            "volteada"
        );

        pagina--;

        reproducirSonido();

        return;
    }
}


// ========================================
// TOUCH
// ========================================

let inicioX = 0;
let inicioY = 0;
let moviendo = false;


libro.addEventListener(
    "touchstart",
    function(e) {

        const toque = e.touches[0];

        inicioX = toque.clientX;
        inicioY = toque.clientY;

        moviendo = true;

    },
    { passive: true }
);


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


        // Ignorar movimiento vertical

        if (
            Math.abs(diferenciaX) <
            Math.abs(diferenciaY)
        ) {
            return;
        }


        // Movimiento demasiado pequeño

        if (
            Math.abs(diferenciaX) < 35
        ) {
            return;
        }


        // Deslizar hacia izquierda

        if (diferenciaX < 0) {

            siguientePagina();

        }

        // Deslizar hacia derecha

        else {

            paginaAnterior();

        }

    },
    { passive: true }
);


// ========================================
// EFECTO DE MOVIMIENTO DEL LIBRO
// ========================================

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
                Math.min(8, inclinacion)
            );

        libro.style.transform =
            `rotateX(2deg) rotateY(${-2 + inclinacion}deg)`;

    },
    { passive: true }
);


libro.addEventListener(
    "touchend",
    function() {

        libro.style.transform =
            "rotateX(2deg) rotateY(-2deg)";

    }
);


// ========================================
// MOUSE
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
