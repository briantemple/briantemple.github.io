const trigger = document.getElementById('drum-trigger');
const body = document.body;

// --- Drum Rain ---
const DRUM_COUNT = 20;
let drums = [];

function spawnDrumRain() {
    for (let i = 0; i < DRUM_COUNT; i++) {
        const drum = document.createElement('div');
        drum.textContent = '🥁';
        drum.classList.add('falling-drum');
        const size = 22 + Math.random() * 32;
        const left = Math.random() * 96;
        const duration = 2.5 + Math.random() * 4;
        const delay = Math.random() * 5;

        // Set individually - don't use cssText (overwrites class animation shorthand)
        drum.style.left = `${left}vw`;
        drum.style.fontSize = `${size}px`;
        drum.style.animationDuration = `${duration}s`;
        drum.style.animationDelay = `-${delay}s`;

        body.appendChild(drum);
        drums.push(drum);
    }
}

function clearDrumRain() {
    drums.forEach(el => el.remove());
    drums = [];
}

// --- Matrix / Starfield Background Canvas ---
let canvas, ctx, matrixInterval;
const CHARS = '🥁♪♫♬🎵🎶01アイウエオクケコ<>{}[]DRUMS';

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
        ctx.fillStyle = 'rgba(26, 0, 51, 0.12)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff1493';
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
    body.classList.toggle('drum-mode');
    if (body.classList.contains('drum-mode')) {
        spawnDrumRain();
        startMatrix();
    } else {
        clearDrumRain();
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

// --- Autoplay video on scroll ---
const video = document.getElementById('drums-video');
const muteToggle = document.getElementById('mute-toggle');

if (video) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {
                        // Autoplay blocked - not a problem since we have playsinline + muted
                    });
                } else {
                    video.pause();
                }
            });
        },
        { threshold: 0.5 }
    );
    observer.observe(video);
}

// --- Mute toggle ---
if (muteToggle && video) {
    muteToggle.addEventListener('click', () => {
        video.muted = !video.muted;
        if (video.muted) {
            muteToggle.classList.remove('unmuted');
            muteToggle.setAttribute('aria-label', 'Unmute video');
        } else {
            muteToggle.classList.add('unmuted');
            muteToggle.setAttribute('aria-label', 'Mute video');
        }
    });
}