let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const progressBar = document.getElementById('progressBar');
const slideCounter = document.getElementById('slideCounter');

function updateProgress() {
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    progressBar.style.width = progress + '%';
    slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
}

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
    updateProgress();
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        showSlide(currentSlide);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        showSlide(currentSlide);
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'f' || e.key === 'F') {
        toggleFullScreen();
    } else if (e.key === 'Home') {
        currentSlide = 0;
        showSlide(currentSlide);
    } else if (e.key === 'End') {
        currentSlide = totalSlides - 1;
        showSlide(currentSlide);
    }
});

// Touch Navigation (Swipe)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        nextSlide();
    } else if (touchEndX > touchStartX + swipeThreshold) {
        prevSlide();
    }
}

// Initialize
updateProgress();

// ============================================
// Physics-Inspired Visualizations for Cosma Platform Slide
// ============================================

// COEM Visualization: Particles converging into unified clusters
function initCOEMVisualization() {
    const canvas = document.getElementById('coemCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const colors = ['#0ea5e9', '#6366f1', '#22c55e', '#f59e0b', '#ef4444'];

    // Create particles representing different languages
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: 3 + Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            targetX: canvas.width / 2,
            targetY: canvas.height / 2
        });
    }

    function animate() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            // Gravitational attraction toward center (unified space)
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            p.vx += (dx / dist) * 0.02;
            p.vy += (dy / dist) * 0.02;

            // Add orbital motion
            p.vx += dy * 0.001;
            p.vy -= dx * 0.001;

            // Damping
            p.vx *= 0.99;
            p.vy *= 0.99;

            p.x += p.vx;
            p.y += p.vy;

            // Keep particles contained
            p.x = Math.max(10, Math.min(canvas.width - 10, p.x));
            p.y = Math.max(10, Math.min(canvas.height - 10, p.y));

            // Draw particle with glow
            ctx.beginPath();
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
            gradient.addColorStop(0, p.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// CVD Visualization: Disk platters with data traversal
function initCVDVisualization() {
    const canvas = document.getElementById('cvdCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let angle = 0;
    const dataPoints = [];

    for (let i = 0; i < 8; i++) {
        dataPoints.push({
            angle: (Math.PI * 2 / 8) * i,
            radius: 20 + Math.random() * 15,
            speed: 0.02 + Math.random() * 0.01
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Draw disk platters
        for (let r = 35; r > 10; r -= 8) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.2 + (35 - r) * 0.02})`;
            ctx.lineWidth = 2;
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Draw spinning read head
        angle += 0.03;
        const headX = cx + Math.cos(angle) * 30;
        const headY = cy + Math.sin(angle) * 30;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(headX, headY);
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(headX, headY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#6366f1';
        ctx.fill();

        // Draw data points on disk
        dataPoints.forEach(d => {
            d.angle += d.speed;
            const x = cx + Math.cos(d.angle) * d.radius;
            const y = cy + Math.sin(d.angle) * d.radius;

            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#22c55e';
            ctx.fill();
        });

        // Center hub
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#0ea5e9';
        ctx.fill();

        requestAnimationFrame(animate);
    }
    animate();
}

// CSL Visualization: API network with pulsing connections
function initCSLVisualization() {
    const canvas = document.getElementById('cslCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const nodes = [
        { x: canvas.width / 2, y: canvas.height / 2, radius: 8, pulse: 0 },
        { x: 40, y: 20, radius: 4 },
        { x: 160, y: 20, radius: 4 },
        { x: 30, y: 60, radius: 4 },
        { x: 170, y: 60, radius: 4 },
        { x: 60, y: 70, radius: 4 },
        { x: 140, y: 70, radius: 4 }
    ];

    const connections = [
        { from: 0, to: 1, progress: 0, speed: 0.02 },
        { from: 0, to: 2, progress: 0.3, speed: 0.025 },
        { from: 0, to: 3, progress: 0.6, speed: 0.018 },
        { from: 0, to: 4, progress: 0.1, speed: 0.022 },
        { from: 0, to: 5, progress: 0.5, speed: 0.02 },
        { from: 0, to: 6, progress: 0.8, speed: 0.023 }
    ];

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        connections.forEach(c => {
            const from = nodes[c.from];
            const to = nodes[c.to];

            // Static line
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.strokeStyle = 'rgba(14, 165, 233, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Animated pulse along line
            c.progress += c.speed;
            if (c.progress > 1) c.progress = 0;

            const pulseX = from.x + (to.x - from.x) * c.progress;
            const pulseY = from.y + (to.y - from.y) * c.progress;

            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#0ea5e9';
            ctx.fill();
        });

        // Draw nodes
        nodes.forEach((n, i) => {
            if (i === 0) {
                // Central API node with glow
                n.pulse += 0.05;
                const glowRadius = n.radius + Math.sin(n.pulse) * 3;

                ctx.beginPath();
                const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowRadius * 2);
                gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.arc(n.x, n.y, glowRadius * 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
            ctx.fillStyle = i === 0 ? '#6366f1' : '#0ea5e9';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// Initialize visualizations when page loads
document.addEventListener('DOMContentLoaded', () => {
    initCOEMVisualization();
    initCVDVisualization();
    initCSLVisualization();
    initCVDInnovationVisualizations();
    initCOEMInnovationVisualizations();
    initComplexityVisualization();
});

// ============================================
// CVD Innovation Slide Visualizations
// ============================================

function initCVDInnovationVisualizations() {
    // Structure-Free: Direct path vs graph hops
    const sfCanvas = document.getElementById('cvdStructureFreeCanvas');
    if (sfCanvas) {
        const ctx = sfCanvas.getContext('2d');
        let time = 0;

        function animate() {
            ctx.clearRect(0, 0, sfCanvas.width, sfCanvas.height);
            time += 0.02;

            // Draw chaotic graph nodes (what we removed)
            ctx.globalAlpha = 0.3;
            for (let i = 0; i < 6; i++) {
                const x = 30 + i * 25;
                const y = 40 + Math.sin(time + i) * 15;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#94a3b8';
                ctx.fill();
            }

            // Draw direct traversal path (our solution)
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.moveTo(20, 40);
            ctx.lineTo(180, 40);
            ctx.strokeStyle = '#0ea5e9';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Animated traversal point
            const px = 20 + ((time * 30) % 160);
            ctx.beginPath();
            ctx.arc(px, 40, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#6366f1';
            ctx.fill();

            // Glow
            const gradient = ctx.createRadialGradient(px, 40, 0, px, 40, 12);
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(px, 40, 12, 0, Math.PI * 2);
            ctx.fill();

            requestAnimationFrame(animate);
        }
        animate();
    }

    // Deterministic: Consistent waveform vs jitter
    const detCanvas = document.getElementById('cvdDeterministicCanvas');
    if (detCanvas) {
        const ctx = detCanvas.getContext('2d');
        let time = 0;

        function animate() {
            ctx.clearRect(0, 0, detCanvas.width, detCanvas.height);
            time += 0.03;

            // Draw jittery line (HNSW)
            ctx.beginPath();
            ctx.moveTo(10, 25);
            for (let x = 10; x < 190; x += 5) {
                const jitter = Math.random() * 12 - 6;
                ctx.lineTo(x, 25 + jitter);
            }
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Draw smooth deterministic line (CVD)
            ctx.beginPath();
            ctx.moveTo(10, 55);
            for (let x = 10; x < 190; x += 2) {
                const y = 55 + Math.sin((x + time * 20) * 0.05) * 5;
                ctx.lineTo(x, y);
            }
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Labels
            ctx.font = '9px Inter, sans-serif';
            ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
            ctx.fillText('HNSW', 165, 18);
            ctx.fillStyle = '#22c55e';
            ctx.fillText('CVD', 170, 72);

            requestAnimationFrame(animate);
        }
        animate();
    }

    // Zero Build: Instant data point appearance
    const zbCanvas = document.getElementById('cvdZeroBuildCanvas');
    if (zbCanvas) {
        const ctx = zbCanvas.getContext('2d');
        let time = 0;
        const dataPoints = [];

        function animate() {
            ctx.clearRect(0, 0, zbCanvas.width, zbCanvas.height);
            time += 1;

            // Add new data point every ~40 frames
            if (time % 40 === 0 && dataPoints.length < 12) {
                dataPoints.push({
                    x: 20 + Math.random() * 160,
                    y: 15 + Math.random() * 50,
                    age: 0,
                    color: ['#0ea5e9', '#6366f1', '#22c55e'][Math.floor(Math.random() * 3)]
                });
            }

            // Draw and age points
            dataPoints.forEach((p, i) => {
                p.age++;
                const alpha = Math.min(1, p.age / 10);

                // Pulse effect on new points
                const pulse = p.age < 15 ? 1 + (15 - p.age) * 0.1 : 1;

                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4 * pulse, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                // Glow for new points
                if (p.age < 20) {
                    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10 * pulse);
                    gradient.addColorStop(0, p.color.replace(')', ', 0.4)').replace('rgb', 'rgba'));
                    gradient.addColorStop(1, 'transparent');
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 10 * pulse, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            ctx.globalAlpha = 1;

            // Reset when full
            if (dataPoints.length >= 12 && dataPoints[0].age > 100) {
                dataPoints.shift();
            }

            requestAnimationFrame(animate);
        }
        animate();
    }
}

// ============================================
// COEM Innovation Slide Visualizations
// ============================================

function initCOEMInnovationVisualizations() {
    // Problem: Chaotic incompatible vectors
    const probCanvas = document.getElementById('coemProblemCanvas');
    if (probCanvas) {
        const ctx = probCanvas.getContext('2d');
        const particles = [];

        for (let i = 0; i < 15; i++) {
            particles.push({
                x: 40 + Math.random() * 200,
                y: 15 + Math.random() * 60,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                color: ['#ef4444', '#f59e0b', '#94a3b8'][Math.floor(Math.random() * 3)]
            });
        }

        function animate() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(0, 0, probCanvas.width, probCanvas.height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off walls (contained)
                if (p.x < 10 || p.x > probCanvas.width - 10) p.vx *= -1;
                if (p.y < 10 || p.y > probCanvas.height - 10) p.vy *= -1;

                // Clamp to bounds
                p.x = Math.max(10, Math.min(probCanvas.width - 10, p.x));
                p.y = Math.max(10, Math.min(probCanvas.height - 10, p.y));

                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });

            // Draw chaotic lines between random pairs
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                const a = particles[Math.floor(Math.random() * particles.length)];
                const b = particles[Math.floor(Math.random() * particles.length)];
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }

            requestAnimationFrame(animate);
        }
        animate();
    }

    // Solution: Smooth manifold with organized particles
    const solCanvas = document.getElementById('coemSolutionCanvas');
    if (solCanvas) {
        const ctx = solCanvas.getContext('2d');
        let time = 0;
        const particles = [];
        const cx = solCanvas.width / 2;
        const cy = solCanvas.height / 2;

        // Create organized orbital particles
        const colors = ['#0ea5e9', '#6366f1', '#22c55e'];
        for (let ring = 0; ring < 3; ring++) {
            const radius = 15 + ring * 12;
            const count = 4 + ring * 2;
            for (let i = 0; i < count; i++) {
                particles.push({
                    angle: (Math.PI * 2 / count) * i,
                    radius: radius,
                    speed: 0.01 + ring * 0.005,
                    color: colors[ring]
                });
            }
        }

        function animate() {
            ctx.clearRect(0, 0, solCanvas.width, solCanvas.height);
            time += 0.02;

            // Draw orbital rings
            for (let r = 15; r <= 39; r += 12) {
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(14, 165, 233, 0.2)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Draw particles
            particles.forEach(p => {
                p.angle += p.speed;
                const x = cx + Math.cos(p.angle) * p.radius;
                const y = cy + Math.sin(p.angle) * p.radius;

                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });

            // Central unified core
            const pulse = 6 + Math.sin(time * 2) * 1;
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulse * 2);
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.6)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(cx, cy, pulse * 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
            ctx.fillStyle = '#6366f1';
            ctx.fill();

            requestAnimationFrame(animate);
        }
        animate();
    }
}

// ============================================
// Complexity Visualization
// ============================================

let complexityAnimationId = null;

function initComplexityVisualization() {
    const canvas = document.getElementById('complexityCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const padding = { top: 40, right: 40, bottom: 60, left: 80 };
    const width = canvas.width - padding.left - padding.right;
    const height = canvas.height - padding.top - padding.bottom;

    let animatedN = 1;
    const maxN = 100;

    // Color palette matching CSS variables
    const colors = {
        o1: '#4ff975',      // primary (green)
        logn: '#4deeea',    // secondary (cyan)
        n: '#f9d71c',       // accent (yellow)
        nlogn: '#ff6b6b',   // red
        n2: '#cc5de8'       // purple
    };

    // Mathematically accurate complexity curves
    // Each function returns a value from 0 to 1 for visualization
    // The curves are scaled to spread across the graph while maintaining accurate shapes

    const maxLogN = Math.log2(maxN + 1);  // ~6.66 for n=100

    const complexities = {
        // O(1) - Constant time: always the same regardless of input size
        o1: (n) => 0.08,

        // O(log n) - Logarithmic: grows very slowly, ideal for search
        // At n=100, log2(100) ≈ 6.6, normalized to reach ~0.25
        logn: (n) => n === 0 ? 0 : (Math.log2(n + 1) / maxLogN) * 0.25,

        // O(n) - Linear: time grows proportionally with data
        // At n=100, reaches 0.5
        n: (n) => (n / maxN) * 0.5,

        // O(n log n) - Linearithmic: common for efficient sorting
        // At n=100, n*log(n) ≈ 660, normalized to reach ~0.75
        nlogn: (n) => n === 0 ? 0 : ((n * Math.log2(n + 1)) / (maxN * maxLogN)) * 0.75,

        // O(n²) - Quadratic: time grows with square of input - expensive!
        // At n=100, n² = 10000, normalized to reach 1.0
        n2: (n) => (n * n) / (maxN * maxN)
    };

    function drawGrid() {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        for (let i = 0; i <= 10; i++) {
            const x = padding.left + (width / 10) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, padding.top + height);
            ctx.stroke();
        }

        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + width, y);
            ctx.stroke();
        }
    }

    function drawAxes() {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, padding.top + height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top + height);
        ctx.lineTo(padding.left + width, padding.top + height);
        ctx.stroke();

        ctx.font = '12px "Share Tech Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';

        ctx.fillText('Data Size (n)', padding.left + width / 2, canvas.height - 15);

        ctx.save();
        ctx.translate(20, padding.top + height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Time', 0, 0);
        ctx.restore();

        ctx.textAlign = 'center';
        for (let i = 0; i <= 5; i++) {
            const n = (maxN / 5) * i;
            const x = padding.left + (width / 5) * i;
            ctx.fillText(n === 0 ? '0' : `${n}M`, x, padding.top + height + 25);
        }

        ctx.textAlign = 'right';
        const yLabels = ['0', 'Low', '', 'Med', '', 'High'];
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + height - (height / 5) * i;
            if (yLabels[i]) {
                ctx.fillText(yLabels[i], padding.left - 10, y + 4);
            }
        }
    }

    function drawCurve(fn, color, lineWidth = 2, glow = false) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;

        if (glow) {
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
        }

        for (let n = 0; n <= maxN; n++) {
            const x = padding.left + (n / maxN) * width;
            const y = padding.top + height - fn(n) * height;

            if (n === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    function drawAnimatedPoint() {
        const x = padding.left + (animatedN / maxN) * width;

        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, padding.top + height);
        ctx.stroke();
        ctx.setLineDash([]);

        Object.entries(complexities).forEach(([key, fn]) => {
            const y = padding.top + height - fn(animatedN) * height;
            const color = colors[key];

            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 12);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.font = 'bold 11px "Press Start 2P", monospace';
        ctx.fillStyle = '#4ff975';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(animatedN)}M vectors`, x, padding.top - 15);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawGrid();
        drawAxes();

        drawCurve(complexities.n2, colors.n2, 2);
        drawCurve(complexities.nlogn, colors.nlogn, 2);
        drawCurve(complexities.n, colors.n, 3);
        drawCurve(complexities.logn, colors.logn, 3);
        drawCurve(complexities.o1, colors.o1, 4, true);

        drawAnimatedPoint();

        animatedN += 0.3;
        if (animatedN > maxN) animatedN = 1;

        complexityAnimationId = requestAnimationFrame(animate);
    }

    // Cancel any existing animation
    if (complexityAnimationId) {
        cancelAnimationFrame(complexityAnimationId);
    }

    animate();
}

// Re-initialize when slide becomes active
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.classList && mutation.target.classList.contains('active')) {
            if (mutation.target.id === 'cosmaPlatformSlide') {
                initCOEMVisualization();
                initCVDVisualization();
                initCSLVisualization();
            } else if (mutation.target.id === 'cvdInnovationSlide') {
                initCVDInnovationVisualizations();
            } else if (mutation.target.id === 'coemInnovationSlide') {
                initCOEMInnovationVisualizations();
            } else if (mutation.target.id === 'complexitySlide') {
                initComplexityVisualization();
            }
        }
    });
});

document.querySelectorAll('.slide').forEach(slide => {
    observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
});
