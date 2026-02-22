const trigger = document.getElementById('lobster-trigger');
const body = document.body;

// --- Lobster Rain ---
const LOBSTER_COUNT = 20;
let lobsters = [];

function spawnLobsterRain() {
    for (let i = 0; i < LOBSTER_COUNT; i++) {
        const lob = document.createElement('div');
        lob.textContent = '🦞';
        lob.classList.add('falling-lobster');
        const size = 22 + Math.random() * 32;
        const left = Math.random() * 96;
        const duration = 2.5 + Math.random() * 4;
        const delay = Math.random() * 5;
        
        // Set individually - don't use cssText (overwrites class animation shorthand)
        lob.style.left = `${left}vw`;
        lob.style.fontSize = `${size}px`;
        lob.style.animationDuration = `${duration}s`;
        lob.style.animationDelay = `-${delay}s`;
        
        body.appendChild(lob);
        lobsters.push(lob);
    }
}

function clearLobsterRain() {
    lobsters.forEach(el => el.remove());
    lobsters = [];
}

// --- Matrix / Starfield Background Canvas ---
let canvas, ctx, matrixInterval;
const CHARS = '🦞01アイウエオクケコ<>{}[]LOBSTER';

function startMatrix() {
    canvas = document.createElement('canvas');
    canvas.id = 'matrix-bg';
    canvas.style.cssText = `
        position: fixed; inset: 0; width: 100vw; height: 100vh;
        z-index: 0; pointer-events: none; opacity: 0.18;
    `;
    body.insertBefore(canvas, body.firstChild);

    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cols = Math.floor(canvas.width / 20);
    const drops = Array(cols).fill(1);

    matrixInterval = setInterval(() => {
        ctx.fillStyle = 'rgba(139, 0, 0, 0.12)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff6b35';
        ctx.font = '16px monospace';
        for (let i = 0; i < drops.length; i++) {
            const char = CHARS[Math.floor(Math.random() * CHARS.length)];
            ctx.fillText(char, i * 20, drops[i] * 20);
            if (drops[i] * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }, 60);
}

function stopMatrix() {
    if (matrixInterval) clearInterval(matrixInterval);
    const c = document.getElementById('matrix-bg');
    if (c) c.remove();
}

// --- Toggle ---
trigger.addEventListener('click', () => {
    body.classList.toggle('geocities');
    if (body.classList.contains('geocities')) {
        spawnLobsterRain();
        startMatrix();
    } else {
        clearLobsterRain();
        stopMatrix();
    }
});

// Resize canvas with window
window.addEventListener('resize', () => {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});