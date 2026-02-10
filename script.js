/* =========================================
           1. LOADER
           ========================================= */
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    }, 1500);
});

const text = document.getElementById("juliana");
const letters = text.innerText.split("");
text.innerHTML = "";

letters.forEach((l,i)=>{
   setTimeout(()=>{
      text.innerHTML += l;
   }, i * 150);
});

function createHeart(x, y) {
    const heart = document.createElement("div");
    heart.className = "cursor-heart";
    heart.style.left = x + "px";
    heart.style.top = y + "px";
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1000);
}

document.addEventListener("mousemove", e => {
    createHeart(e.clientX, e.clientY);
});

document.addEventListener("touchmove", e => {
    const touch = e.touches[0];
    createHeart(touch.clientX, touch.clientY);
}, { passive: true });

/* =========================================
   2. ANIMACIÓN DE FONDO (Corazones)
   ========================================= */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class HeartParticle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * -1.5 - 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = `rgba(255, ${Math.floor(Math.random() * 50 + 77)}, ${Math.floor(Math.random() * 50 + 109)}, ${this.opacity})`;
    }

    update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.01) * 0.5;

        if (this.y < -50) {
            this.y = height + 50;
            this.x = Math.random() * width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;

        ctx.beginPath();
        const s = this.size / 10;
        ctx.scale(s, s);

        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-10, -10, -15, 5, 0, 15);
        ctx.bezierCurveTo(15, 5, 10, -10, 0, 0);

        ctx.fill();
        ctx.restore();
    }
}

function initParticles() {
    particles = [];
    const numParticles = window.innerWidth < 768 ? 25 : 50;
    for (let i = 0; i < numParticles; i++) {
        particles.push(new HeartParticle());
    }
}

function animateBg() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateBg);
}

window.addEventListener('resize', () => {
    resize();
    initParticles();
});

resize();
initParticles();
animateBg();

/* =========================================
   3. INTERSECTION OBSERVER
   ========================================= */
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

observer.observe(document.querySelector('.proposal-area'));

/* =========================================
   4. LÓGICA DE BOTONES (NUEVA: GROWING YES)
   ========================================= */
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const modal = document.getElementById('success-modal');

let noClickCount = 0;

// Frases para intentar convencerla
const phrases = [
    "No",
    "¿Estás segura?",
    "¿De verdad?",
    "¡Piénsalo bien!",
    "Mira el otro botón...",
    "¡Es muy bonito!",
    "¡Por favor!",
    "¡Di que sí!",
    "¡No te arrepentirás!",
    "¡Anda, sí!",
    "¡Última oportunidad!"
];

function growYesButton() {
    noClickCount++;

    // 1. Aumentar tamaño del botón SÍ
    // Multiplicador de crecimiento
    const growthFactor = 1 + (noClickCount * 0.5);
    btnYes.style.transform = `scale(${growthFactor})`;

    // 2. Cambiar texto del botón NO
    // Usar el módulo para ciclar frases si se acaban
    btnNo.innerText = phrases[Math.min(noClickCount, phrases.length - 1)];

    // Opcional: Hacer el botón NO un poquito más pequeño o transparente para enfatizar
    // btnNo.style.opacity = Math.max(0.5, 1 - (noClickCount * 0.1));
}

// Evento Click para el NO (funciona igual en Desktop y Móvil)
btnNo.addEventListener('click', growYesButton);

function spawnHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerText = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '2000';
    
    // Calculamos dirección aleatoria
    const tx = (Math.random() * 200 - 100); // Movimiento lateral
    const ty = -(Math.random() * 200 + 100); // Movimiento hacia arriba
    heart.style.setProperty('--tx', `${tx}px`);
    heart.style.setProperty('--ty', `${ty}px`);
    
    heart.style.animation = 'heart-fly 2s ease forwards';
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 2000);
}

btnYes.addEventListener('click', (e) => {
    // Efecto de corazones voladores
    const rect = btnYes.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);

    for (let i = 0; i < 15; i++) {
        spawnHeart(x, y);
    }

    modal.classList.add('active');
    fireConfetti();
    modal.scrollIntoView({ behavior: "smooth", block: "center" });
});

function closeModal() {
    modal.classList.remove('active');
}

/* =========================================
   5. SISTEMA DE CONFETI
   ========================================= */
const cCanvas = document.getElementById('confetti-canvas');
const cCtx = cCanvas.getContext('2d');
let cWidth, cHeight;
let confetti = [];

function resizeConfetti() {
    cWidth = cCanvas.width = window.innerWidth;
    cHeight = cCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

function fireConfetti() {
    confetti = [];
    const colors = ['#ff4d6d', '#ff8fa3', '#c9184a', '#ffd700', '#ffffff'];

    for (let i = 0; i < 150; i++) {
        confetti.push({
            x: cWidth / 2,
            y: cHeight / 2,
            w: Math.random() * 10 + 5,
            h: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: Math.random() * 10 - 5,
            speedY: Math.random() * -10 - 5,
            gravity: 0.2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }
    requestAnimationFrame(renderConfetti);
}

function renderConfetti() {
    cCtx.clearRect(0, 0, cWidth, cHeight);

    let activeCount = 0;

    confetti.forEach((c) => {
        c.x += c.speedX;
        c.y += c.speedY;
        c.speedY += c.gravity;
        c.rotation += c.rotationSpeed;
        c.speedX *= 0.99;

        if (c.y < cHeight) {
            activeCount++;
            cCtx.save();
            cCtx.translate(c.x, c.y);
            cCtx.rotate(c.rotation * Math.PI / 180);
            cCtx.fillStyle = c.color;
            cCtx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
            cCtx.restore();
        }
    });

    if (activeCount > 0) {
        requestAnimationFrame(renderConfetti);
    } else {
        cCtx.clearRect(0, 0, cWidth, cHeight);
    }
}
