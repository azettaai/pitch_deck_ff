// ============================================
// Mobile Landscape Lock & Scroll Prevention
// ============================================

// Prevent scrolling on mobile
function preventScrolling() {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // Prevent touch scrolling
    document.addEventListener('touchmove', (e) => {
        // Allow touch events on interactive elements
        if (e.target.closest('.modal-overlay') || 
            e.target.closest('.modal-content') ||
            e.target.closest('.concept-tooltip')) {
            return;
        }
        e.preventDefault();
    }, { passive: false });
    
    // Prevent wheel scrolling
    document.addEventListener('wheel', (e) => {
        if (!e.target.closest('.modal-content') && 
            !e.target.closest('.tooltip-body')) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Lock orientation to landscape (if supported)
function lockOrientation() {
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch((err) => {
            console.log('Orientation lock not supported:', err);
        });
    } else if (screen.lockOrientation) {
        screen.lockOrientation('landscape');
    } else if (screen.mozLockOrientation) {
        screen.mozLockOrientation('landscape');
    } else if (screen.msLockOrientation) {
        screen.msLockOrientation('landscape');
    }
}

// Handle orientation changes
function handleOrientationChange() {
    const isPortrait = window.innerHeight > window.innerWidth;
    if (isPortrait && window.innerWidth < 768) {
        // Show message or force landscape
        let message = document.getElementById('orientation-message');
        if (!message) {
            message = document.createElement('div');
            message.id = 'orientation-message';
            const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#050505';
            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#4ff975';
            const primaryGlow = getComputedStyle(document.documentElement).getPropertyValue('--primary-glow').trim() || 'rgba(79, 249, 117, 0.4)';
            
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: ${bgColor};
                border: 2px solid ${primaryColor};
                padding: 40px;
                z-index: 99999;
                font-family: 'Press Start 2P', monospace;
                font-size: 0.7rem;
                color: ${primaryColor};
                text-align: center;
                box-shadow: 0 0 40px ${primaryGlow};
                max-width: 90vw;
            `;
            message.textContent = 'Please rotate your device to landscape mode';
            document.body.appendChild(message);
        }
    } else {
        const message = document.getElementById('orientation-message');
        if (message) {
            message.remove();
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    preventScrolling();
    lockOrientation();
    handleOrientationChange();
    
    // Re-check on orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            handleOrientationChange();
            lockOrientation();
        }, 100);
    });
    
    // Re-check on resize
    window.addEventListener('resize', () => {
        handleOrientationChange();
    });
});

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ============================================
// Slide Navigation
// ============================================

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

// Render LaTeX equations with KaTeX
function renderLatexEquations() {
    if (typeof katex !== 'undefined') {
        document.querySelectorAll('.latex-equation').forEach(el => {
            const latex = el.textContent.trim();
            // Remove the \( and \) delimiters if present
            const cleanedLatex = latex.replace(/^\\\(/, '').replace(/\\\)$/, '').trim();
            try {
                katex.render(cleanedLatex, el, {
                    displayMode: true,
                    throwOnError: false
                });
            } catch (e) {
                console.error('KaTeX rendering error:', e, 'for:', cleanedLatex);
            }
        });
    } else {
        // If KaTeX not loaded yet, try again in 100ms
        setTimeout(renderLatexEquations, 100);
    }
}

// Call rendering after DOM and KaTeX load
document.addEventListener('DOMContentLoaded', () => {
    renderLatexEquations();
});

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

// ============================================
// Revenue Path Visualization
// ============================================

function initRevenuePathVisualization() {
    const canvas = document.getElementById('revenuePathCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let time = 0;

    const stages = [
        { label: 'Design Partners', value: 0.15, color: '#4ff975' },
        { label: 'Enterprise', value: 0.5, color: '#4deeea' },
        { label: 'API Marketplace', value: 0.75, color: '#f9d71c' },
        { label: 'EBITDA+', value: 1.0, color: '#4ff975' }
    ];

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.01;

        const padding = 30;
        const width = canvas.width - padding * 2;
        const height = canvas.height - padding * 2;

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + width, y);
            ctx.stroke();
        }

        // Draw revenue path
        ctx.strokeStyle = '#4ff975';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        stages.forEach((stage, i) => {
            const x = padding + (width / 3) * i;
            const y = padding + height - stage.value * height;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw animated point
        const progress = (time * 0.3) % 1;
        const stageIndex = Math.floor(progress * 3);
        const stageProgress = (progress * 3) % 1;
        const currentStage = stages[stageIndex];
        const nextStage = stages[Math.min(stageIndex + 1, stages.length - 1)];
        
        const x = padding + (width / 3) * (stageIndex + stageProgress);
        const y = padding + height - (currentStage.value + (nextStage.value - currentStage.value) * stageProgress) * height;

        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 12);
        gradient.addColorStop(0, 'rgba(79, 249, 117, 0.6)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();

        // Point
        ctx.fillStyle = '#4ff975';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw stage markers
        stages.forEach((stage, i) => {
            const x = padding + (width / 3) * i;
            const y = padding + height - stage.value * height;
            
            ctx.fillStyle = stage.color;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        });

        // Labels
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        stages.forEach((stage, i) => {
            const x = padding + (width / 3) * i;
            ctx.fillText(stage.label.substring(0, 8), x, canvas.height - 8);
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// ============================================
// Scaling Impasse Visualizations (Slide 2)
// ============================================

function initScalingProblemVisualization() {
    const canvas = document.getElementById('scalingProblemCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let time = 0;

    const padding = { top: 30, right: 20, bottom: 40, left: 50 };
    const width = canvas.width - padding.left - padding.right;
    const height = canvas.height - padding.top - padding.bottom;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.02;

        // Draw axes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, padding.top + height);
        ctx.lineTo(padding.left + width, padding.top + height);
        ctx.stroke();

        // Draw exponential curve (O(N²) problem)
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let n = 0; n <= 100; n++) {
            const x = padding.left + (n / 100) * width;
            const y = padding.top + height - Math.pow(n / 100, 2) * height * 0.9;
            
            if (n === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        // Animated point
        const progress = (time * 20) % 100;
        const x = padding.left + (progress / 100) * width;
        const y = padding.top + height - Math.pow(progress / 100, 2) * height * 0.9;

        // Glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.6)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Point
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Labels
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        // ctx.fillText('O(N²)', padding.left + width - 30, padding.top + 15);
        ctx.font = '7px monospace';
        ctx.fillText('Compute', padding.left + width / 2, canvas.height - 8);
        ctx.save();
        ctx.translate(15, padding.top + height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Cost', 0, 0);
        ctx.restore();

        requestAnimationFrame(animate);
    }
    animate();
}

function initBlackBoxVisualization() {
    const canvas = document.getElementById('blackBoxCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let time = 0;

    const inputNodes = 5;
    const outputNodes = 3;
    const inputX = 40;
    const blackBoxX = canvas.width / 2;
    const blackBoxWidth = 80;
    const blackBoxHeight = canvas.height - 40;
    const blackBoxY = 20;
    const outputX = canvas.width - 40;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.03;

        // Draw input layer nodes
        const inputSpacing = (canvas.height - 60) / (inputNodes - 1);
        const inputNodeY = 30;
        const inputPositions = [];
        
        for (let i = 0; i < inputNodes; i++) {
            const y = inputNodeY + i * inputSpacing;
            inputPositions.push(y);
            
            // Input node (visible/interpretable)
            const pulse = 1 + Math.sin(time * 2 + i * 0.5) * 0.2;
            ctx.fillStyle = '#4deeea';
            ctx.beginPath();
            ctx.arc(inputX, y, 6 * pulse, 0, Math.PI * 2);
            ctx.fill();
            
            // Glow
            const gradient = ctx.createRadialGradient(inputX, y, 0, inputX, y, 12 * pulse);
            gradient.addColorStop(0, 'rgba(77, 238, 234, 0.6)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(inputX, y, 12 * pulse, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw black box (uninterpretable hidden layers)
        ctx.fillStyle = `rgba(0, 0, 0, ${0.85 + Math.sin(time * 1.5) * 0.1})`;
        ctx.fillRect(blackBoxX - blackBoxWidth / 2, blackBoxY, blackBoxWidth, blackBoxHeight);
        
        // Black box border (pulsing)
        ctx.strokeStyle = `rgba(100, 100, 100, ${0.6 + Math.sin(time * 2) * 0.3})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(blackBoxX - blackBoxWidth / 2, blackBoxY, blackBoxWidth, blackBoxHeight);
        
        // "?" symbol inside black box (uninterpretable)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('?', blackBoxX, canvas.height / 2 + 8);

        // Draw connections from input to black box (fading out)
        for (let i = 0; i < inputNodes; i++) {
            const y = inputPositions[i];
            const targetY = blackBoxY + blackBoxHeight / 2 + (i - inputNodes / 2) * 15;
            
            // Connection line that fades into black box
            ctx.strokeStyle = `rgba(77, 238, 234, ${0.4 + Math.sin(time * 2 + i) * 0.2})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(inputX + 6, y);
            
            // Line fades as it approaches black box
            const midX = (inputX + blackBoxX - blackBoxWidth / 2) / 2;
            ctx.lineTo(midX, y);
            
            // Curve into black box (fading)
            const controlX = (midX + blackBoxX - blackBoxWidth / 2) / 2;
            ctx.quadraticCurveTo(controlX, (y + targetY) / 2, blackBoxX - blackBoxWidth / 2, targetY);
            ctx.stroke();
            
            // Animated data packet flowing
            const progress = (time * 30 + i * 10) % 100;
            if (progress < 90) {
                const packetX = inputX + 6 + (blackBoxX - blackBoxWidth / 2 - inputX - 6) * (progress / 90);
                const packetY = y + (targetY - y) * (progress / 90);
                
                ctx.fillStyle = '#4deeea';
                ctx.beginPath();
                ctx.arc(packetX, packetY, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Draw output layer nodes
        const outputSpacing = (canvas.height - 60) / (outputNodes - 1);
        const outputNodeY = 30;
        const outputPositions = [];
        
        for (let i = 0; i < outputNodes; i++) {
            const y = outputNodeY + i * outputSpacing;
            outputPositions.push(y);
            
            // Output node (visible but disconnected from reasoning)
            const pulse = 1 + Math.sin(time * 2 + i * 0.7) * 0.2;
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(outputX, y, 6 * pulse, 0, Math.PI * 2);
            ctx.fill();
            
            // Glow
            const gradient = ctx.createRadialGradient(outputX, y, 0, outputX, y, 12 * pulse);
            gradient.addColorStop(0, 'rgba(245, 158, 11, 0.6)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(outputX, y, 12 * pulse, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw connections from black box to output (emerging from opacity)
        for (let i = 0; i < outputNodes; i++) {
            const y = outputPositions[i];
            const sourceY = blackBoxY + blackBoxHeight / 2 + (i - outputNodes / 2) * 15;
            
            // Connection line emerging from black box
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.4 + Math.sin(time * 2 + i) * 0.2})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(blackBoxX + blackBoxWidth / 2, sourceY);
            
            // Curve out of black box (fading in)
            const midX = (blackBoxX + blackBoxWidth / 2 + outputX) / 2;
            const controlX = (blackBoxX + blackBoxWidth / 2 + midX) / 2;
            ctx.quadraticCurveTo(controlX, (sourceY + y) / 2, midX, y);
            ctx.lineTo(outputX - 6, y);
            ctx.stroke();
            
            // Animated data packet emerging
            const progress = (time * 30 + i * 10 + 50) % 100;
            if (progress < 90) {
                const packetX = blackBoxX + blackBoxWidth / 2 + (outputX - 6 - blackBoxX - blackBoxWidth / 2) * (progress / 90);
                const packetY = sourceY + (y - sourceY) * (progress / 90);
                
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.arc(packetX, packetY, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Labels
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'left';
        ctx.fillText('INPUT', 10, 15);
        
        ctx.textAlign = 'center';
        ctx.fillText('BLACK BOX', blackBoxX, 12);
        
        ctx.textAlign = 'right';
        ctx.fillText('OUTPUT', canvas.width - 10, 15);

        requestAnimationFrame(animate);
    }
    animate();
}

function initNonDeterminismVisualization() {
    const canvas = document.getElementById('nonDeterminismCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const colors = ['#ef4444', '#f59e0b', '#94a3b8', '#6366f1'];

    // Initialize particles
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            radius: 3 + Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }

    function animate() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            // Random velocity changes (non-deterministic)
            p.vx += (Math.random() - 0.5) * 0.5;
            p.vy += (Math.random() - 0.5) * 0.5;
            
            // Damping
            p.vx *= 0.98;
            p.vy *= 0.98;

            p.x += p.vx;
            p.y += p.vy;

            // Bounce off walls
            if (p.x < p.radius || p.x > canvas.width - p.radius) {
                p.vx *= -1;
                p.x = Math.max(p.radius, Math.min(canvas.width - p.radius, p.x));
            }
            if (p.y < p.radius || p.y > canvas.height - p.radius) {
                p.vy *= -1;
                p.y = Math.max(p.radius, Math.min(canvas.height - p.radius, p.y));
            }

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// ============================================
// YAT Kernel Visualizations (Slide 4)
// ============================================

function initStandardDLVisualization() {
    const canvas = document.getElementById('standardDLCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let time = 0;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.02;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const angle = time * 0.5;
        const vectorLength = 35; // Reduced for smaller canvas

        // Vector 1 (weight)
        const v1x = Math.cos(angle) * vectorLength;
        const v1y = Math.sin(angle) * vectorLength;

        // Vector 2 (input)
        const v2x = Math.cos(angle + Math.PI / 3) * vectorLength;
        const v2y = Math.sin(angle + Math.PI / 3) * vectorLength;

        // Dot product result (projection)
        const dot = (v1x * v2x + v1y * v2y) / (vectorLength * vectorLength);
        const projectionX = v2x * dot;
        const projectionY = v2y * dot;

        // Draw vectors
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + v1x, centerY + v1y);
        ctx.stroke();

        ctx.strokeStyle = '#4deeea';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + v2x, centerY + v2y);
        ctx.stroke();

        // Draw dot product projection (with clipping)
        const clipped = Math.max(0, dot); // ReLU clipping
        const clippedX = v2x * clipped;
        const clippedY = v2y * clipped;

        ctx.strokeStyle = dot < 0 ? 'rgba(239, 68, 68, 0.5)' : '#22c55e';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + clippedX, centerY + clippedY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw arrowheads
        const drawArrow = (x1, y1, x2, y2, color) => {
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            const angle = Math.atan2(y2 - y1, x2 - x1);
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 6 * Math.cos(angle - Math.PI / 6), y2 - 6 * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(x2 - 6 * Math.cos(angle + Math.PI / 6), y2 - 6 * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fill();
        };

        drawArrow(centerX, centerY, centerX + v1x, centerY + v1y, '#0ea5e9');
        drawArrow(centerX, centerY, centerX + v2x, centerY + v2y, '#4deeea');

        // Center point
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.font = '6px monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText('Dot Product → ReLU', centerX, canvas.height - 5);
    }

    animate();
}

function initYATProductVisualization() {
    const canvas = document.getElementById('yatProductCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let time = 0;

    // Initialize vector positions (not from center, but as independent particles)
    let v1 = {
        x: canvas.width * 0.3,
        y: canvas.height * 0.3,
        vx: 0,
        vy: 0,
        mass: 1
    };

    let v2 = {
        x: canvas.width * 0.7,
        y: canvas.height * 0.7,
        vx: 0,
        vy: 0,
        mass: 1
    };

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.02;

        // Calculate distance and direction between vectors
        const dx = v2.x - v1.x;
        const dy = v2.y - v1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const distSq = dist * dist;

        // Calculate dot product (directional alignment)
        // Normalize vectors for dot product calculation
        const v1Len = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const v2Len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        const v1NormX = v1.x / (v1Len || 1);
        const v1NormY = v1.y / (v1Len || 1);
        const v2NormX = v2.x / (v2Len || 1);
        const v2NormY = v2.y / (v2Len || 1);
        const dot = (v1NormX * v2NormX + v1NormY * v2NormY);
        const dotSq = dot * dot;

        // YAT-Product gravitational force: (dot^2) / (dist^2 + epsilon)
        const epsilon = 10;
        const gravitationalStrength = dotSq / (distSq / 100 + epsilon);
        const force = gravitationalStrength * 0.15; // Scaling factor

        // Apply gravitational pull
        if (dist > 5) { // Prevent division by zero
            const forceX = (dx / dist) * force;
            const forceY = (dy / dist) * force;

            // Apply force to both vectors (mutual attraction)
            v1.vx += forceX / v1.mass;
            v1.vy += forceY / v1.mass;
            v2.vx -= forceX / v2.mass;
            v2.vy -= forceY / v2.mass;

            // Add orbital motion based on alignment (perpendicular force)
            const perpX = -dy / dist;
            const perpY = dx / dist;
            const orbitalStrength = dot * 0.05;
            v1.vx += perpX * orbitalStrength;
            v1.vy += perpY * orbitalStrength;
            v2.vx -= perpX * orbitalStrength;
            v2.vy -= perpY * orbitalStrength;
        }

        // Damping
        v1.vx *= 0.95;
        v1.vy *= 0.95;
        v2.vx *= 0.95;
        v2.vy *= 0.95;

        // Update positions
        v1.x += v1.vx;
        v1.y += v1.vy;
        v2.x += v2.vx;
        v2.y += v2.vy;

        // Boundary constraints
        const margin = 15;
        if (v1.x < margin || v1.x > canvas.width - margin) {
            v1.vx *= -0.5;
            v1.x = Math.max(margin, Math.min(canvas.width - margin, v1.x));
        }
        if (v1.y < margin || v1.y > canvas.height - margin) {
            v1.vy *= -0.5;
            v1.y = Math.max(margin, Math.min(canvas.height - margin, v1.y));
        }
        if (v2.x < margin || v2.x > canvas.width - margin) {
            v2.vx *= -0.5;
            v2.x = Math.max(margin, Math.min(canvas.width - margin, v2.x));
        }
        if (v2.y < margin || v2.y > canvas.height - margin) {
            v2.vy *= -0.5;
            v2.y = Math.max(margin, Math.min(canvas.height - margin, v2.y));
        }

        // Draw gravitational field (gradient showing attraction)
        if (dist < 150) {
            const gradient = ctx.createRadialGradient(
                (v1.x + v2.x) / 2, (v1.y + v2.y) / 2, 0,
                (v1.x + v2.x) / 2, (v1.y + v2.y) / 2, dist * 0.8
            );
            gradient.addColorStop(0, `rgba(79, 249, 117, ${gravitationalStrength * 0.3})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc((v1.x + v2.x) / 2, (v1.y + v2.y) / 2, dist * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw connection line showing distance (dotted)
        ctx.strokeStyle = 'rgba(79, 249, 117, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw force vector (gravitational pull)
        const forceVisualX = (dx / dist) * gravitationalStrength * 10;
        const forceVisualY = (dy / dist) * gravitationalStrength * 10;
        ctx.strokeStyle = 'rgba(79, 249, 117, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v1.x + forceVisualX, v1.y + forceVisualY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(v2.x, v2.y);
        ctx.lineTo(v2.x - forceVisualX, v2.y - forceVisualY);
        ctx.stroke();

        // Draw vectors as particles with glow
        const drawVector = (x, y, color) => {
            // Glow
            const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 12);
            glowGradient.addColorStop(0, color.replace(')', ', 0.6)').replace('rgb', 'rgba'));
            glowGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.fill();

            // Vector point
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        };

        drawVector(v1.x, v1.y, '#0ea5e9');
        drawVector(v2.x, v2.y, '#4deeea');

        // Label
        ctx.font = '6px monospace';
        ctx.fillStyle = 'rgba(79, 249, 117, 0.9)';
        ctx.textAlign = 'center';
        ctx.fillText('YAT-Product', canvas.width / 2, canvas.height - 5);
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
    initRevenuePathVisualization();
    initScalingProblemVisualization();
    initBlackBoxVisualization();
    initNonDeterminismVisualization();
    initStandardDLVisualization();
    initYATProductVisualization();
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
            } else if (mutation.target.id === 'complexitySlide' || mutation.target.id === 'competitiveBarriersSlide') {
                initComplexityVisualization();
            } else if (mutation.target.id === 'strategicValueSlide') {
                initRevenuePathVisualization();
            } else if (mutation.target.id === 'scalingImpasseSlide') {
                initScalingProblemVisualization();
                initBlackBoxVisualization();
                initNonDeterminismVisualization();
            } else if (mutation.target.id === 'yatKernelSlide') {
                initStandardDLVisualization();
                initYATProductVisualization();
            }
        }
    });
});

document.querySelectorAll('.slide').forEach(slide => {
    observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
});

// ============================================
// Modal System
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ESC key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// Click outside to close
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal(e.target.id);
    }
});
