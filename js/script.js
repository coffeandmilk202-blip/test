/* js/script.js - VERSIÓN FINAL CON CAMBIO DE MÚSICA */

const mensajes = [
    "Sos mi lugar favorito ✨", "Te pienso y sonrío ❤️", "Sos mi elección diaria 💍",
    "Te llevo conmigo", "Te elijo sin miedo", "Sos mi siempre de ahora",
    "Mi corazón te elige", "Me derrito en vos", "Obeso 🐻", "mi bebito 🍼", "osito 🧸"
];

function iniciarCielo() {
    const contenedor = document.getElementById('cielo-interactivo');
    if(contenedor) {
        for (let i = 0; i < 50; i++) { crearEstrella(contenedor); }
        cicloCometas();
    }
}

function crearEstrella(c) {
    const e = document.createElement('div'); e.className = 'estrella-interactiva';
    let s = Math.random() * 3 + 2; e.style.width = s + 'px'; e.style.height = s + 'px';
    e.style.left = Math.random() * 100 + '%'; e.style.top = Math.random() * 100 + '%';
    e.style.opacity = Math.random() * 0.5 + 0.3;
    e.onclick = (ev) => {
        mostrarMensaje(ev.clientX, ev.clientY);
        e.style.transform = "scale(4)"; e.style.opacity = "1"; e.style.boxShadow = "0 0 20px #fff";
        setTimeout(() => { e.style.transform = "scale(1)"; e.style.opacity = "0.5"; e.style.boxShadow = "none"; }, 1000);
    };
    c.appendChild(e);
}

function mostrarMensaje(x, y) {
    const c = document.getElementById('cielo-interactivo');
    const m = document.createElement('div'); m.className = 'mensaje-estrella';
    m.innerText = mensajes[Math.floor(Math.random() * mensajes.length)];
    m.style.left = x + 'px'; m.style.top = y + 'px'; c.appendChild(m);
    setTimeout(() => m.remove(), 4000);
}

function cicloCometas() {
    crearCometa();
    setTimeout(cicloCometas, Math.random() * 5000 + 4000);
}

function crearCometa() {
    const c = document.getElementById('cielo-interactivo');
    if(!c) return;
    const com = document.createElement('div'); com.className = 'cometa-realista';
    com.style.top = Math.random() * 70 + '%';
    let escala = Math.random() + 0.5; com.style.width = (200 * escala) + 'px';
    com.style.left = '-300px'; 
    let ang = 30 + Math.random() * 10; com.style.transform = `rotate(${ang}deg)`;
    com.style.animationDuration = (Math.random() * 2 + 3) + 's';
    c.appendChild(com);
    setTimeout(() => com.remove(), 6000);
}

function reproducir(id) { const a = document.getElementById(id); if(a) { a.currentTime = 0; a.play().catch(() => {}); } }

function gestionarClic(elementoHoja) {
    if (elementoHoja.classList.contains('pasada')) {
        volverHoja(elementoHoja);
    } else {
        pasarHoja(elementoHoja);
    }
}

function girarLibroEntero() {
    const libro = document.getElementById('libro');
    if(libro.classList.contains('abierto')) {
        cerrarLibroTotal();
        setTimeout(() => { libro.classList.toggle('girado'); }, 1200);
    } else {
        libro.classList.toggle('girado');
    }
}

function abrirLibro() {
    const l = document.getElementById('libro');
    if(!l.classList.contains('girado')) {
        l.classList.remove('cerrado'); l.classList.add('abierto');
        document.querySelector('.portada').classList.add('pasada');
        reproducir('snd-abrir');
        
        // Iniciar música Capítulo 1
        const musica = document.getElementById('musica-cap1');
        if(musica) { 
            musica.volume = 0.3; // Volumen suave
            musica.play().catch(e => {}); 
        }
    }
}

/* --- FUNCIÓN MODIFICADA PARA DETECTAR CAPÍTULO 2 --- */
function pasarHoja(elemento) {
    const h = elemento.closest('.hoja'); 
    h.classList.add('pasada');
    reproducir('snd-hoja');
    
    const pasadas = document.querySelectorAll('.hoja.pasada').length;
    // Z-Index alto para que no desaparezca
    h.style.zIndex = 2000 + pasadas; 

    // DETECCIÓN DE CAMBIO DE MÚSICA
    // Buscamos si la página actual tiene el número 17 (Inicio Cap 2)
    const numPag = h.querySelector('.num-pag');
    if (numPag && numPag.innerText === "17") {
        cambiarMusica('musica-cap1', 'musica-cap2');
    }
}

/* --- NUEVA FUNCIÓN PARA TRANSICIÓN SUAVE DE MÚSICA --- */
function cambiarMusica(idSalida, idEntrada) {
    const audioOut = document.getElementById(idSalida);
    const audioIn = document.getElementById(idEntrada);

    if(audioOut && audioIn) {
        // Bajar volumen de la actual (Fade Out)
        let vol = audioOut.volume;
        const fadeOut = setInterval(() => {
            if(vol > 0.05) {
                vol -= 0.05;
                audioOut.volume = vol;
            } else {
                audioOut.pause();
                audioOut.currentTime = 0;
                clearInterval(fadeOut);
            }
        }, 200); // Cada 200ms baja un poco

        // Iniciar la nueva (Fade In)
        audioIn.volume = 0;
        audioIn.play().catch(e => console.log("Error play", e));
        let volIn = 0;
        const fadeIn = setInterval(() => {
            if(volIn < 0.3) { // Tope de volumen 0.3
                volIn += 0.05;
                audioIn.volume = volIn;
            } else {
                clearInterval(fadeIn);
            }
        }, 200);
    }
}

function volverHoja(elemento) {
    const h = elemento.closest('.hoja'); 
    h.classList.remove('pasada');
    reproducir('snd-hoja');
    
    const zOriginal = h.style.getPropertyValue('--z-original');
    if (zOriginal) { h.style.zIndex = zOriginal; } else { h.style.zIndex = 1000; }
    
    // Si volvemos a la página anterior a la 17, podríamos revertir música, 
    // pero por simplicidad lo dejamos así o se reinicia al cerrar.
    
    setTimeout(() => {
        if(h.classList.contains('portada')) {
            document.getElementById('libro').classList.remove('abierto');
            document.getElementById('libro').classList.add('cerrado');
            reproducir('snd-cerrar');
            silenciarTodo(); // Usamos la función de silenciar
        }
    }, 500);
}

function cerrarLibroTotal() {
    const pasadas = Array.from(document.querySelectorAll('.hoja.pasada'));
    pasadas.reverse().forEach((h, i) => {
        setTimeout(() => {
            h.classList.remove('pasada');
            const zOriginal = h.style.getPropertyValue('--z-original');
            if(zOriginal) { h.style.zIndex = zOriginal; } else { h.style.zIndex = 50; }
        }, i * 200);
    });
    setTimeout(() => {
        document.getElementById('libro').classList.remove('abierto');
        document.getElementById('libro').classList.add('cerrado');
        reproducir('snd-cerrar');
        silenciarTodo();
    }, pasadas.length * 200 + 500);
}

/* Función auxiliar para apagar toda la música al cerrar */
function silenciarTodo() {
    const m1 = document.getElementById('musica-cap1');
    const m2 = document.getElementById('musica-cap2');
    if(m1) { m1.pause(); m1.currentTime = 0; }
    if(m2) { m2.pause(); m2.currentTime = 0; }
}

document.addEventListener('DOMContentLoaded', () => {
    iniciarCielo();
});