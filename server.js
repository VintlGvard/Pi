const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = "01π";
const charArray = chars.split("");
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#0f0";
    ctx.font = fontSize + "px monospace";
    
    for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

function* generatePi() {
    let q = 1n, r = 0n, t = 1n, k = 1n, n = 3n, l = 3n;
    while (true) {
        if (q * 4n + r - t < n * t) {
            yield Number(n);
            let nr = 10n * (r - n * t);
            n = (10n * (3n * q + r)) / t - 10n * n;
            q = 10n * q;
            r = nr;
        } else {
            let nr = (2n * q + r) * l;
            let nn = (q * (7n * k) + 2n + r * l) / (t * l);
            q = q * k;
            t = t * l;
            l = l + 2n;
            k = k + 1n;
            n = nn;
            r = nr;
        }
    }
}

const piDisplay = document.getElementById('pi-display');
const digitCount = document.getElementById('digit-count');
const pauseBtn = document.getElementById('pause-btn');

let piGenerator = generatePi();
let speed = 200;
let isPaused = false;
let timer;
let generatedDigits = 0;

piGenerator.next(); 

function generateNextDigit() {
    if (isPaused) return;
    
    const { value: digit } = piGenerator.next();
    
    const digitSpan = document.createElement('span');
    digitSpan.className = 'digit new-digit';
    digitSpan.textContent = digit;
    
    piDisplay.appendChild(digitSpan);
    
    setTimeout(() => {
        digitSpan.classList.remove('new-digit');
    }, 600);
    
    generatedDigits++;
    digitCount.textContent = generatedDigits;
    
    piDisplay.scrollTo({
        top: piDisplay.scrollHeight,
        behavior: 'smooth'
    });
    
    timer = setTimeout(generateNextDigit, speed);
}

function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Continue' : 'Pause';
    
    if (!isPaused) {
        generateNextDigit();
    } else {
        clearTimeout(timer);
    }
}

function changeSpeed(delta) {
    speed += delta;
    if (speed < 50) speed = 50;
    if (speed > 2000) speed = 2000;
}

pauseBtn.addEventListener('click', togglePause);

document.getElementById('speed-up').addEventListener('click', () => changeSpeed(-50));

document.getElementById('speed-down').addEventListener('click', () => changeSpeed(50));

document.getElementById('reset-btn').addEventListener('click', function() {
    clearTimeout(timer);
    piDisplay.innerHTML = '';
    generatedDigits = 0;
    digitCount.textContent = '0';
    piGenerator = generatePi();
    piGenerator.next();
    if (!isPaused) {
        timer = setTimeout(generateNextDigit, speed);
    }
});

generateNextDigit();
