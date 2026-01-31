/* js/script.js */

const mensajes = ["Te amo ❤️", "Eres mi universo ✨", "Interlinked...", "Destino...", "Tú y yo"];

function iniciarCielo() {
    const contenedor = document.getElementById('cielo-interactivo');
    for (let i = 0; i < 40; i++) { crearEstrella(contenedor); }
    cicloCometas();
}

function crearEstrella(c) {
    const e = document.createElement('div'); e.className = 'estrella-interactiva';
    let s = Math.random()*3+2; e.style.width=s+'px'; e.style.height=s+'px';
    e.style.left=Math.random()*100+'%'; e.style.top=Math.random()*100+'%';
    e.style.opacity=Math.random()*0.5+0.3;
    e.onclick = (ev) => {
        mostrarMensaje(ev.clientX, ev.clientY);
        e.style.transform="scale(3)"; e.style.opacity=0;
        setTimeout(()=>{e.style.transform="scale(1)";e.style.opacity=0.5},1000);
    };
    c.appendChild(e);
}

function mostrarMensaje(x, y) {
    const c = document.getElementById('cielo-interactivo');
    const m = document.createElement('div'); m.className='mensaje-estrella';
    m.innerText = mensajes[Math.floor(Math.random()*mensajes.length)];
    m.style.left = x+'px'; m.style.top = y+'px'; c.appendChild(m);
    setTimeout(()=>m.remove(), 4000);
}

function cicloCometas() {
    crearCometa();
    setTimeout(cicloCometas, Math.random()*5000 + 4000);
}

function crearCometa() {
    const c = document.getElementById('cielo-interactivo');
    const com = document.createElement('div'); com.className='cometa-realista';
    com.style.top = Math.random()*70 + '%';
    let escala = Math.random() + 0.5; com.style.width = (200*escala)+'px';
    com.style.left = '-300px'; 
    let ang = 30 + Math.random()*10; com.style.transform = `rotate(${ang}deg)`;
    com.style.animationDuration = (Math.random()*2+3)+'s';
    c.appendChild(com);
    setTimeout(()=>com.remove(), 6000);
}

function reproducir(id) { const a=document.getElementById(id); if(a){a.currentTime=0;a.play().catch(()=>{});}}

// LÓGICA INTELIGENTE DE CLIC
function gestionarClic(elementoHoja) {
    // Si la hoja ya tiene la clase "pasada", significa que está a la izquierda.
    // Al darle clic, queremos que vuelva a la derecha (retroceder).
    if (elementoHoja.classList.contains('pasada')) {
        volverHoja(elementoHoja);
    } 
    // Si no la tiene, está a la derecha. Queremos pasarla (avanzar).
    else {
        pasarHoja(elementoHoja);
    }
}

function girarLibroEntero() {
    const libro = document.getElementById('libro');
    if(libro.classList.contains('abierto')) {
        cerrarLibroTotal();
        setTimeout(()=>{libro.classList.toggle('girado')}, 1200);
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
    }
}

function pasarHoja(elemento) {
    // Aceptamos tanto el botón como la hoja misma
    const h = elemento.closest('.hoja'); 
    h.classList.add('pasada');
    reproducir('snd-hoja');
    
    // Mover Z-index para que se apile bien en la izquierda
    const pasadas = document.querySelectorAll('.hoja.pasada').length;
    // Le damos un z-index alto temporalmente para que pase por encima
    h.style.zIndex = pasadas + 500; 
}

function volverHoja(elemento) {
    const h = elemento.closest('.hoja'); 
    h.classList.remove('pasada');
    reproducir('snd-hoja');
    
    // Restaurar Z-index original (esto es un truco, el CSS ya maneja el orden base)
    // Pero para asegurar que vuelva suave, le damos prioridad alta brevemente
    h.style.zIndex = 1000; 
    
    setTimeout(()=>{
        if(h.classList.contains('portada')) {
            document.getElementById('libro').classList.remove('abierto');
            document.getElementById('libro').classList.add('cerrado');
            reproducir('snd-cerrar');
        } else {
            // Restaurar el z-index original basado en el HTML (opcional pero bueno para orden)
            // En este diseño simple, dejar que caiga al z-index del CSS funciona bien
        }
    }, 500);
}

function cerrarLibroTotal() {
    const pasadas = Array.from(document.querySelectorAll('.hoja.pasada'));
    const todas = document.querySelectorAll('.hoja');
    pasadas.reverse().forEach((h, i) => {
        setTimeout(() => {
            h.classList.remove('pasada');
            // Restaurar orden visual
            h.style.zIndex = 100 - Array.from(todas).indexOf(h);
        }, i*200);
    });
    setTimeout(()=>{
        document.getElementById('libro').classList.remove('abierto');
        document.getElementById('libro').classList.add('cerrado');
        reproducir('snd-cerrar');
    }, pasadas.length*200 + 500);
}

document.addEventListener('DOMContentLoaded', () => {
    iniciarCielo();
});

