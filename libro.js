const libro = document.getElementById("libro");
const portada = document.getElementById("portada");
const contraportada = document.getElementById("contraportada");

const hojas = Array.from(
    document.querySelectorAll(".hoja")
).reverse();

let pagina = 0;


// ========================================
// ORDEN DE LAS HOJAS
// ========================================

hojas.forEach((hoja, indice) => {
    hoja.style.zIndex = hojas.length - indice + 2;
});

portada.style.zIndex = hojas.length + 3;
contraportada.style.zIndex = 1;


// ========================================
// TOQUE EN CELULAR
// ========================================

let inicioX = 0;
let inicioY = 0;
let moviendo = false;

libro.addEventListener("touchstart", function(e) {

    const toque = e.touches[0];

    inicioX = toque.clientX;
    inicioY = toque.clientY;

    moviendo = true;

}, { passive: true });


libro.addEventListener("touchend", function(e) {

    if (!moviendo) return;

    const toque = e.changedTouches[0];

    const finalX = toque.clientX;
    const finalY = toque.clientY;

    const diferenciaX = finalX - inicioX;
    const diferenciaY = finalY - inicioY;

    moviendo = false;

    if (Math.abs(diferenciaX) < Math.abs(diferenciaY)) {
        return;
    }

    if (Math.abs(diferenciaX) < 35) {
        return;
    }

    if (diferenciaX < 0) {
        siguientePagina();
    } else {
        paginaAnterior();
    }

}, { passive: true });


// ========================================
// SIGUIENTE PÁGINA
// ========================================

function siguientePagina() {

    // PORTADA
    if (pagina === 0) {

        portada.style.transform = "rotateY(-180deg)";

        pagina++;

        return;
    }


    // HOJAS INTERIORES
    const indice = pagina - 1;

    if (indice < hojas.length) {

        hojas[indice].classList.add("volteada");

        pagina++;

        return;
    }


    // CONTRAPORTADA
    if (pagina === hojas.length + 1) {

        contraportada.classList.add("mostrada");

        pagina++;

        return;
    }

}


// ========================================
// PÁGINA ANTERIOR
// ========================================

function paginaAnterior() {

    if (pagina <= 0) {
        return;
    }


    // CONTRAPORTADA
    if (pagina === hojas.length + 2) {

        contraportada.classList.remove("mostrada");

        pagina--;

        return;
    }


    // HOJAS INTERIORES
    if (pagina > 1) {

        const indice = pagina - 2;

        if (indice >= 0 && indice < hojas.length) {

            hojas[indice].classList.remove("volteada");

            pagina--;

            return;
        }
    }


    // PORTADA
    if (pagina === 1) {

        portada.style.transform = "rotateY(0deg)";

        pagina--;

        return;
    }

}


// ========================================
// EFECTO DE MOVIMIENTO CON EL DEDO
// ========================================

libro.addEventListener("touchmove", function(e) {

    if (!moviendo) return;

    const toque = e.touches[0];

    const desplazamiento =
        toque.clientX - inicioX;

    let inclinacion =
        desplazamiento / 25;

    inclinacion =
        Math.max(-8, Math.min(8, inclinacion));

    libro.style.transform =
        `rotateX(2deg) rotateY(${-2 + inclinacion}deg)`;

}, { passive: true });


libro.addEventListener("touchend", function() {

    libro.style.transform =
        "rotateX(2deg) rotateY(-2deg)";

});


// ========================================
// MOUSE EN COMPUTADORA
// ========================================

let mouseInicio = 0;
let mouseActivo = false;


libro.addEventListener("mousedown", function(e) {

    mouseInicio = e.clientX;

    mouseActivo = true;

});


document.addEventListener("mouseup", function(e) {

    if (!mouseActivo) return;

    const diferencia =
        e.clientX - mouseInicio;

    mouseActivo = false;

    if (Math.abs(diferencia) < 40) {
        return;
    }

    if (diferencia < 0) {

        siguientePagina();

    } else {

        paginaAnterior();

    }

});
