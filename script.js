// ============================================
// Mobile Landscape Lock & Scroll Prevention
// ============================================

// Prevent scrolling on mobile with smart vertical scroll detection
function preventScrolling() {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    let touchStartY = 0;
    let touchStartX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    // Prevent touch scrolling with vertical scroll detection
    document.addEventListener('touchmove', (e) => {
        // Allow touch events on interactive elements
        if (e.target.closest('.modal-overlay') ||
            e.target.closest('.modal-content') ||
            e.target.closest('.concept-tooltip')) {
            return;
        }

        // Allow vertical scroll within .slide
        const slideElement = e.target.closest('.slide');
        if (slideElement) {
            const touchMoveY = e.touches[0].clientY;
            const touchMoveX = e.touches[0].clientX;
            const deltaY = Math.abs(touchMoveY - touchStartY);
            const deltaX = Math.abs(touchMoveX - touchStartX);

            // If predominantly vertical movement, allow scroll
            if (deltaY > deltaX * 1.5) {
                return; // Allow vertical scroll
            }
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

    // Initial overflow check
    setTimeout(checkSlideOverflow, 500);

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
        checkSlideOverflow(); // Re-check overflow on resize
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
            slide.scrollTop = 0; // Reset scroll position
        }
    });
    updateProgress();

    // Check for overflow after slide becomes active
    setTimeout(checkSlideOverflow, 100);
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

// Touch Navigation (Swipe) - Enhanced for vertical scroll
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let touchStartTime = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    touchStartTime = Date.now();
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const swipeTime = Date.now() - touchStartTime;

    // Only trigger swipe if:
    // 1. Horizontal movement exceeds threshold
    // 2. Horizontal movement > vertical movement (predominantly horizontal)
    // 3. Swipe completed in < 500ms (quick gesture)
    if (absDeltaX < swipeThreshold || absDeltaY > absDeltaX || swipeTime > 500) {
        return; // Not a valid horizontal swipe
    }

    if (deltaX < -swipeThreshold) {
        nextSlide();
    } else if (deltaX > swipeThreshold) {
        prevSlide();
    }
}

// ============================================
// Scroll Indicator Management
// ============================================

function checkSlideOverflow() {
    const activeSlide = document.querySelector('.slide.active');
    if (!activeSlide) return;

    const contentHeight = activeSlide.scrollHeight;
    const viewportHeight = activeSlide.clientHeight;

    if (contentHeight > viewportHeight + 30) {
        activeSlide.classList.add('has-overflow');
    } else {
        activeSlide.classList.remove('has-overflow');
    }

    // Hide indicator when scrolled to bottom
    let hideTimeout;
    activeSlide.addEventListener('scroll', () => {
        clearTimeout(hideTimeout);
        const scrollTop = activeSlide.scrollTop;
        const scrollHeight = activeSlide.scrollHeight;
        const clientHeight = activeSlide.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 15) {
            hideTimeout = setTimeout(() => {
                activeSlide.classList.remove('has-overflow');
            }, 1000);
        } else if (contentHeight > viewportHeight + 30) {
            activeSlide.classList.add('has-overflow');
        }
    });
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

    // Calculate point on quadratic Bezier curve at parameter t (0 to 1)
    function getQuadraticBezierPoint(t, p0, p1, p2) {
        const oneMinusT = 1 - t;
        return {
            x: oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x,
            y: oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * p1.y + t * t * p2.y
        };
    }

    // Pre-calculate waypoints along Bezier curve + optional straight segment
    function calculatePathWaypoints(p0, p1, p2, straightEndPoint = null, numPoints = 100) {
        const waypoints = [];

        // Sample points along the Bezier curve
        const curvePoints = Math.floor(numPoints * 0.7); // 70% of points for curve
        for (let i = 0; i <= curvePoints; i++) {
            const t = i / curvePoints;
            waypoints.push(getQuadraticBezierPoint(t, p0, p1, p2));
        }

        // If there's a straight segment, add those points
        if (straightEndPoint) {
            const straightPoints = numPoints - curvePoints;
            for (let i = 1; i <= straightPoints; i++) {
                const t = i / straightPoints;
                waypoints.push({
                    x: p2.x + (straightEndPoint.x - p2.x) * t,
                    y: p2.y + (straightEndPoint.y - p2.y) * t
                });
            }
        }

        return waypoints;
    }

    const inputNodes = 5;
    const outputNodes = 3;
    const inputX = 40;
    const blackBoxX = canvas.width / 2;
    const blackBoxWidth = 80;
    const blackBoxHeight = canvas.height - 40;
    const blackBoxY = 20;
    const outputX = canvas.width - 40;

    // Calculate positions
    const inputSpacing = (canvas.height - 60) / (inputNodes - 1);
    const inputNodeY = 30;
    const outputSpacing = (canvas.height - 60) / (outputNodes - 1);
    const outputNodeY = 30;

    // Pre-calculate waypoints for input paths
    const inputWaypoints = [];
    for (let i = 0; i < inputNodes; i++) {
        const y = inputNodeY + i * inputSpacing;
        const targetY = blackBoxY + blackBoxHeight / 2 + (i - inputNodes / 2) * 10;

        const startPoint = { x: inputX + 6, y: y };
        const midX = (inputX + 6 + blackBoxX - blackBoxWidth / 2) / 2;
        const controlPoint = { x: (midX + blackBoxX - blackBoxWidth / 2) / 2, y: (y + targetY) / 2 };
        const endPoint = { x: blackBoxX - blackBoxWidth / 2, y: targetY };

        inputWaypoints[i] = calculatePathWaypoints(startPoint, controlPoint, endPoint);
    }

    // Pre-calculate waypoints for output paths
    const outputWaypoints = [];
    for (let i = 0; i < outputNodes; i++) {
        const y = outputNodeY + i * outputSpacing;
        const sourceY = blackBoxY + blackBoxHeight / 2 + (i - outputNodes / 2) * 15;

        const startPoint = { x: blackBoxX + blackBoxWidth / 2, y: sourceY };
        const midX = (blackBoxX + blackBoxWidth / 2 + outputX) / 2;
        const controlPoint = { x: (blackBoxX + blackBoxWidth / 2 + midX) / 2, y: (sourceY + y) / 2 };
        const curveEndPoint = { x: midX, y: y };
        const finalPoint = { x: outputX - 6, y: y };

        outputWaypoints[i] = calculatePathWaypoints(startPoint, controlPoint, curveEndPoint, finalPoint);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.03;

        // Draw input layer nodes
        for (let i = 0; i < inputNodes; i++) {
            const y = inputNodeY + i * inputSpacing;
            
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
            const y = inputNodeY + i * inputSpacing;
            const targetY = blackBoxY + blackBoxHeight / 2 + (i - inputNodes / 2) * 10;
            
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
                const waypointIndex = Math.floor((progress / 90) * (inputWaypoints[i].length - 1));
                const packet = inputWaypoints[i][waypointIndex];

                // Fade out as approaching black box
                const opacity = 1 - (progress / 90) * 0.5;
                ctx.fillStyle = `rgba(77, 238, 234, ${opacity})`;
                ctx.beginPath();
                ctx.arc(packet.x, packet.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Draw output layer nodes
        for (let i = 0; i < outputNodes; i++) {
            const y = outputNodeY + i * outputSpacing;
            
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
            const y = outputNodeY + i * outputSpacing;
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
                const waypointIndex = Math.floor((progress / 90) * (outputWaypoints[i].length - 1));
                const packet = outputWaypoints[i][waypointIndex];

                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.arc(packet.x, packet.y, 3, 0, Math.PI * 2);
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
        const vectorLength = 40;

        // Vector 1 (weight) - rotating
        const v1x = Math.cos(angle) * vectorLength;
        const v1y = Math.sin(angle) * vectorLength;

        // Vector 2 (input) - fixed at 60 degrees offset
        const v2Angle = angle + Math.PI / 3;
        const v2x = Math.cos(v2Angle) * vectorLength;
        const v2y = Math.sin(v2Angle) * vectorLength;

        // Calculate dot product (directional alignment only)
        const dot = (v1x * v2x + v1y * v2y) / (vectorLength * vectorLength);
        const isNegative = dot < 0;
        const clipped = Math.max(0, dot); // ReLU clipping

        // Show clipping effect with visual fade
        const clippedX = v2x * clipped;
        const clippedY = v2y * clipped;

        // Background glow for alignment visualization
        const alignmentColor = isNegative ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)';
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, vectorLength * 1.5);
        gradient.addColorStop(0, alignmentColor);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw projection line (dot product visualization)
        ctx.strokeStyle = isNegative ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + v2x * dot, centerY + v2y * dot);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw clipped result (ReLU activation)
        if (clipped > 0) {
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#22c55e';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + clippedX, centerY + clippedY);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        // Draw vectors
        const drawVector = (x, y, color, label) => {
            // Vector line
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + x, centerY + y);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Arrowhead
            const angle = Math.atan2(y, x);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(centerX + x, centerY + y);
            ctx.lineTo(centerX + x - 8 * Math.cos(angle - Math.PI / 6), centerY + y - 8 * Math.sin(angle - Math.PI / 6));
            ctx.lineTo(centerX + x - 8 * Math.cos(angle + Math.PI / 6), centerY + y - 8 * Math.sin(angle + Math.PI / 6));
            ctx.closePath();
            ctx.fill();

            // Label
            ctx.font = '7px monospace';
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.fillText(label, centerX + x * 1.3, centerY + y * 1.3);
        };

        drawVector(v1x, v1y, '#0ea5e9', 'w');
        drawVector(v2x, v2y, '#4deeea', 'x');

        // Center point
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Show dot product value and clipping indicator
        ctx.font = '7px monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.textAlign = 'center';
        ctx.fillText(`dot: ${dot.toFixed(2)}`, centerX, 15);

        if (isNegative) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
            ctx.fillText('CLIPPED!', centerX, canvas.height - 8);
        } else {
            ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
            ctx.fillText('ReLU: ' + clipped.toFixed(2), centerX, canvas.height - 8);
        }

        requestAnimationFrame(animate);
    }

    animate();
}

function initYATProductVisualization() {
    const canvas = document.getElementById('yatProductCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let time = 0;

    // Initialize vector positions as independent particles with trails
    let v1 = {
        x: canvas.width * 0.25,
        y: canvas.height * 0.4,
        vx: 0.3,
        vy: 0.2,
        mass: 1,
        trail: []
    };

    let v2 = {
        x: canvas.width * 0.75,
        y: canvas.height * 0.6,
        vx: -0.2,
        vy: -0.3,
        mass: 1,
        trail: []
    };

    function animate() {
        // Fade previous frame for trail effect
        ctx.fillStyle = 'rgba(5, 5, 5, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        time += 0.02;

        // Calculate distance and direction between vectors
        const dx = v2.x - v1.x;
        const dy = v2.y - v1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const distSq = dist * dist;

        // Calculate directional alignment (dot product)
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const v1DirX = v1.x - centerX;
        const v1DirY = v1.y - centerY;
        const v2DirX = v2.x - centerX;
        const v2DirY = v2.y - centerY;
        const v1Len = Math.sqrt(v1DirX * v1DirX + v1DirY * v1DirY);
        const v2Len = Math.sqrt(v2DirX * v2DirX + v2DirY * v2DirY);
        const dot = (v1DirX * v2DirX + v1DirY * v2DirY) / (v1Len * v2Len || 1);
        const dotSq = dot * dot;

        // YAT-Product gravitational force: (dot²) / (dist² / scale + ε)
        const epsilon = 5;
        const gravitationalStrength = dotSq / (distSq / 150 + epsilon);
        const force = gravitationalStrength * 0.2;

        // Apply gravitational attraction
        if (dist > 5) {
            const forceX = (dx / dist) * force;
            const forceY = (dy / dist) * force;

            // Mutual attraction (Newton's 3rd law)
            v1.vx += forceX;
            v1.vy += forceY;
            v2.vx -= forceX;
            v2.vy -= forceY;

            // Add orbital component for visual interest
            const perpX = -dy / dist;
            const perpY = dx / dist;
            const orbitalStrength = dotSq * 0.08;
            v1.vx += perpX * orbitalStrength;
            v1.vy += perpY * orbitalStrength;
            v2.vx -= perpX * orbitalStrength;
            v2.vy -= perpY * orbitalStrength;
        }

        // Velocity damping
        v1.vx *= 0.96;
        v1.vy *= 0.96;
        v2.vx *= 0.96;
        v2.vy *= 0.96;

        // Update positions
        v1.x += v1.vx;
        v1.y += v1.vy;
        v2.x += v2.vx;
        v2.y += v2.vy;

        // Boundary constraints with soft bounce
        const margin = 20;
        if (v1.x < margin || v1.x > canvas.width - margin) {
            v1.vx *= -0.7;
            v1.x = Math.max(margin, Math.min(canvas.width - margin, v1.x));
        }
        if (v1.y < margin || v1.y > canvas.height - margin) {
            v1.vy *= -0.7;
            v1.y = Math.max(margin, Math.min(canvas.height - margin, v1.y));
        }
        if (v2.x < margin || v2.x > canvas.width - margin) {
            v2.vx *= -0.7;
            v2.x = Math.max(margin, Math.min(canvas.width - margin, v2.x));
        }
        if (v2.y < margin || v2.y > canvas.height - margin) {
            v2.vy *= -0.7;
            v2.y = Math.max(margin, Math.min(canvas.height - margin, v2.y));
        }

        // Update trails
        v1.trail.push({ x: v1.x, y: v1.y });
        v2.trail.push({ x: v2.x, y: v2.y });
        if (v1.trail.length > 20) v1.trail.shift();
        if (v2.trail.length > 20) v2.trail.shift();

        // Draw gravitational field (intensity based on force strength)
        const midX = (v1.x + v2.x) / 2;
        const midY = (v1.y + v2.y) / 2;
        const fieldRadius = dist * 0.7;
        const gradient = ctx.createRadialGradient(midX, midY, 0, midX, midY, fieldRadius);
        gradient.addColorStop(0, `rgba(79, 249, 117, ${Math.min(gravitationalStrength * 0.4, 0.3)})`);
        gradient.addColorStop(0.5, `rgba(79, 249, 117, ${Math.min(gravitationalStrength * 0.2, 0.15)})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(midX, midY, fieldRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw distance relationship line
        ctx.strokeStyle = 'rgba(79, 249, 117, 0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw force vectors showing gravitational pull
        const forceScale = gravitationalStrength * 15;
        const f1x = (dx / dist) * forceScale;
        const f1y = (dy / dist) * forceScale;
        ctx.strokeStyle = 'rgba(79, 249, 117, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v1.x + f1x, v1.y + f1y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(v2.x, v2.y);
        ctx.lineTo(v2.x - f1x, v2.y - f1y);
        ctx.stroke();

        // Draw motion trails
        const drawTrail = (trail, color) => {
            for (let i = 1; i < trail.length; i++) {
                const alpha = i / trail.length * 0.3;
                ctx.strokeStyle = color.replace('1)', `${alpha})`);
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
                ctx.lineTo(trail[i].x, trail[i].y);
                ctx.stroke();
            }
        };
        drawTrail(v1.trail, 'rgba(14, 165, 233, 1)');
        drawTrail(v2.trail, 'rgba(77, 238, 234, 1)');

        // Draw particles with glow
        const drawParticle = (x, y, color, label) => {
            const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
            glowGradient.addColorStop(0, color);
            glowGradient.addColorStop(0.3, color.replace('1)', '0.4)'));
            glowGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.font = '8px monospace';
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.fillText(label, x, y - 12);
        };

        drawParticle(v1.x, v1.y, 'rgba(14, 165, 233, 1)', 'w');
        drawParticle(v2.x, v2.y, 'rgba(77, 238, 234, 1)', 'x');

        // Display force equation
        ctx.font = '7px monospace';
        ctx.fillStyle = 'rgba(79, 249, 117, 0.9)';
        ctx.textAlign = 'center';
        ctx.fillText(`F ∝ dot²/dist²`, canvas.width / 2, 12);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(`dist: ${dist.toFixed(0)}px`, canvas.width / 2, canvas.height - 8);

        requestAnimationFrame(animate);
    }

    animate();
}

// ============================================
// Funding Slide Visualizations (Slide 10)
// ============================================

function initSalaryVisualization() {
    const canvas = document.getElementById('salaryVisualizationCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let time = 0;

    // Two engineers represented as avatars
    const engineers = [
        { x: 50, y: 60, phase: 0, name: 'Taha' },
        { x: 150, y: 60, phase: Math.PI, name: 'Douglas' }
    ];

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.05;

        engineers.forEach(eng => {
            const bounce = Math.sin(time + eng.phase) * 3;
            const y = eng.y + bounce;

            // Avatar circle with glow
            const gradient = ctx.createRadialGradient(eng.x, y, 0, eng.x, y, 20);
            gradient.addColorStop(0, 'rgba(79, 249, 117, 0.4)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(eng.x, y, 20, 0, Math.PI * 2);
            ctx.fill();

            // Avatar head
            ctx.fillStyle = '#4ff975';
            ctx.beginPath();
            ctx.arc(eng.x, y - 5, 12, 0, Math.PI * 2);
            ctx.fill();

            // Avatar body
            ctx.beginPath();
            ctx.arc(eng.x, y + 8, 8, 0, Math.PI, true);
            ctx.lineTo(eng.x - 8, y + 20);
            ctx.lineTo(eng.x + 8, y + 20);
            ctx.closePath();
            ctx.fill();

            // Code brackets animation
            const codeOpacity = (Math.sin(time * 2 + eng.phase) + 1) / 2;
            ctx.font = '16px monospace';
            ctx.fillStyle = `rgba(79, 249, 117, ${codeOpacity * 0.6})`;
            ctx.fillText('</', eng.x - 15, y - 25);
            ctx.fillText('>', eng.x + 5, y - 25);
        });

        // Timeline bar showing 12 months
        const barWidth = 160;
        const barX = 20;
        const barY = 100;
        const progress = (Math.sin(time * 0.5) + 1) / 2;

        // Bar background
        ctx.strokeStyle = 'rgba(79, 249, 117, 0.2)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(barX, barY);
        ctx.lineTo(barX + barWidth, barY);
        ctx.stroke();

        // Progress fill
        ctx.strokeStyle = '#4ff975';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(barX, barY);
        ctx.lineTo(barX + barWidth * progress, barY);
        ctx.stroke();

        // Month markers
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '7px monospace';
        ctx.fillText('0mo', barX - 5, barY + 12);
        ctx.fillText('12mo', barX + barWidth - 15, barY + 12);

        requestAnimationFrame(animate);
    }
    animate();
}

function initGPUComputeVisualization() {
    const canvas = document.getElementById('gpuComputeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let time = 0;

    // GPU compute nodes
    const gpuNodes = [];
    for (let i = 0; i < 8; i++) {
        gpuNodes.push({
            x: 30 + (i % 4) * 35,
            y: 30 + Math.floor(i / 4) * 35,
            phase: (i * Math.PI) / 4,
            intensity: Math.random()
        });
    }

    // Data particles flowing through
    const particles = [];
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2 + 1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.05;

        // Draw connections between nodes
        ctx.strokeStyle = 'rgba(79, 249, 117, 0.1)';
        ctx.lineWidth = 1;
        gpuNodes.forEach((node1, i) => {
            gpuNodes.forEach((node2, j) => {
                if (i < j) {
                    const dist = Math.hypot(node2.x - node1.x, node2.y - node1.y);
                    if (dist < 60) {
                        ctx.beginPath();
                        ctx.moveTo(node1.x, node1.y);
                        ctx.lineTo(node2.x, node2.y);
                        ctx.stroke();
                    }
                }
            });
        });

        // Draw GPU nodes with pulsing effect
        gpuNodes.forEach(node => {
            const pulse = (Math.sin(time * 2 + node.phase) + 1) / 2;
            const size = 6 + pulse * 3;

            // Glow
            const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 2);
            gradient.addColorStop(0, `rgba(79, 249, 117, ${0.4 * pulse})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, size * 2, 0, Math.PI * 2);
            ctx.fill();

            // Node
            ctx.fillStyle = '#4ff975';
            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Animate data particles
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.fillStyle = 'rgba(77, 238, 234, 0.6)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // Label
        ctx.font = '7px monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText('Training...', canvas.width - 45, canvas.height - 5);

        requestAnimationFrame(animate);
    }
    animate();
}

function initBerkeleyOfficeVisualization() {
    const canvas = document.getElementById('berkeleyOfficeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let time = 0;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.03;

        // Building outline (simple office representation)
        const buildingX = 60;
        const buildingY = 30;
        const buildingWidth = 80;
        const buildingHeight = 70;

        // Building base
        ctx.strokeStyle = 'rgba(79, 249, 117, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(buildingX, buildingY, buildingWidth, buildingHeight);

        // Windows grid (4x3)
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
                const wx = buildingX + 15 + col * 18;
                const wy = buildingY + 15 + row * 20;
                const windowSize = 12;

                // Window light effect
                const isLit = (row === 1 && col === 1) || (row === 1 && col === 2);
                const lightIntensity = isLit ? (Math.sin(time) + 1) / 2 : 0.2;

                ctx.fillStyle = `rgba(79, 249, 117, ${lightIntensity * 0.5})`;
                ctx.fillRect(wx, wy, windowSize, windowSize);

                ctx.strokeStyle = 'rgba(79, 249, 117, 0.6)';
                ctx.lineWidth = 1;
                ctx.strokeRect(wx, wy, windowSize, windowSize);
            }
        }

        // Berkeley banner/text
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#4ff975';
        ctx.fillText('BERKELEY', buildingX + 10, buildingY - 5);

        // Location pin animated
        const pinX = 30;
        const pinY = 60;
        const pinBounce = Math.sin(time * 2) * 2;

        // Pin glow
        const gradient = ctx.createRadialGradient(pinX, pinY + pinBounce, 0, pinX, pinY + pinBounce, 15);
        gradient.addColorStop(0, 'rgba(79, 249, 117, 0.4)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pinX, pinY + pinBounce, 15, 0, Math.PI * 2);
        ctx.fill();

        // Pin shape
        ctx.fillStyle = '#4ff975';
        ctx.beginPath();
        ctx.arc(pinX, pinY + pinBounce - 5, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(pinX, pinY + pinBounce + 3);
        ctx.lineTo(pinX - 5, pinY + pinBounce + 10);
        ctx.lineTo(pinX + 5, pinY + pinBounce + 10);
        ctx.closePath();
        ctx.fill();

        // Research connections (signal waves)
        const waveOpacity = (Math.sin(time * 3) + 1) / 2;
        ctx.strokeStyle = `rgba(77, 238, 234, ${waveOpacity * 0.5})`;
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            const radius = 15 + i * 10 + (time * 10) % 30;
            ctx.beginPath();
            ctx.arc(buildingX + buildingWidth / 2, buildingY - 10, radius, 0, Math.PI * 2);
            ctx.stroke();
        }

        requestAnimationFrame(animate);
    }
    animate();
}

// Initialize visualizations when page loads
// ============================================
// Canvas Lazy Loading System
// ============================================

const canvasInitializers = {
    'coemCanvas': initCOEMVisualization,
    'cvdCanvas': initCVDVisualization,
    'cslCanvas': initCSLVisualization,
    'complexityCanvas': initComplexityVisualization,
    'complexityCanvasModal': initComplexityCanvasModalVisualization,
    'revenuePathCanvas': initRevenuePathVisualization,
    'scalingProblemCanvas': initScalingProblemVisualization,
    'blackBoxCanvas': initBlackBoxVisualization,
    'nonDeterminismCanvas': initNonDeterminismVisualization,
    'standardDLCanvas': initStandardDLVisualization,
    'yatProductCanvas': initYATProductVisualization,
    'cvdStructureFreeCanvas': () => initCVDInnovationVisualizations(),
    'cvdDeterministicCanvas': () => initCVDInnovationVisualizations(),
    'cvdZeroBuildCanvas': () => initCVDInnovationVisualizations(),
    'coemProblemCanvas': () => initCOEMInnovationVisualizations(),
    'coemSolutionCanvas': () => initCOEMInnovationVisualizations(),
    'salaryVisualizationCanvas': initSalaryVisualization,
    'gpuComputeCanvas': initGPUComputeVisualization,
    'berkeleyOfficeCanvas': initBerkeleyOfficeVisualization
};

const initializedCanvases = new Set();

function lazyInitCanvas(canvasId) {
    if (initializedCanvases.has(canvasId)) return;

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Responsive canvas sizing for mobile
    if (window.matchMedia('(max-height: 600px) and (orientation: landscape)').matches) {
        const parentWidth = canvas.parentElement.clientWidth;
        canvas.width = Math.min(parentWidth - 20, canvas.width);
        canvas.height = Math.round(canvas.width * 0.6);
    }

    const initFn = canvasInitializers[canvasId];
    if (initFn) {
        try {
            initFn();
            initializedCanvases.add(canvasId);
            console.log(`✓ Lazy initialized: ${canvasId}`);
        } catch (error) {
            console.error(`✗ Failed to init ${canvasId}:`, error);
        }
    }
}

// Intersection Observer for slide visibility
const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const slide = entry.target;
            const canvases = slide.querySelectorAll('canvas');
            canvases.forEach(canvas => {
                lazyInitCanvas(canvas.id);
            });
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
    // Initialize only first slide canvases immediately
    const firstSlide = document.querySelector('.slide.active');
    if (firstSlide) {
        const canvases = firstSlide.querySelectorAll('canvas');
        canvases.forEach(canvas => lazyInitCanvas(canvas.id));
    }

    // Observe all slides for lazy loading
    document.querySelectorAll('.slide').forEach(slide => {
        slideObserver.observe(slide);
    });
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
// Trade Secrets & Research Advancement Visualization (Slide 8)
// ============================================

let complexityAnimationId = null;

function initComplexityVisualization() {
    const canvas = document.getElementById('complexityCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const padding = { top: 60, right: 50, bottom: 80, left: 100 };
    const width = canvas.width - padding.left - padding.right;
    const height = canvas.height - padding.top - padding.bottom;

    let time = 0;

    // Timeline years
    const startYear = 2022;
    const currentYear = 2026;
    const futureYear = 2030;
    const totalYears = futureYear - startYear;

    function drawBackground() {
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(5, 5, 5, 1)');
        gradient.addColorStop(1, 'rgba(10, 10, 15, 1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid lines for years
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= totalYears; i++) {
            const x = padding.left + (i / totalYears) * width;
            ctx.beginPath();
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, padding.top + height);
            ctx.stroke();
        }
    }

    function drawAxes() {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;

        // Timeline axis
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top + height);
        ctx.lineTo(padding.left + width, padding.top + height);
        ctx.stroke();

        // Year labels
        ctx.font = '10px "Share Tech Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.textAlign = 'center';
        for (let i = 0; i <= totalYears; i += 2) {
            const year = startYear + i;
            const x = padding.left + (i / totalYears) * width;
            ctx.fillText(year.toString(), x, padding.top + height + 20);
        }

        // Y-axis label
        ctx.save();
        ctx.translate(30, padding.top + height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.font = '12px "Share Tech Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText('Research Advancement', 0, 0);
        ctx.restore();
    }

    function drawOpenSourceLine() {
        // Open source research line (slower advancement, public)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);

        ctx.beginPath();
        for (let i = 0; i <= totalYears; i++) {
            const year = startYear + i;
            const x = padding.left + (i / totalYears) * width;
            // Open source grows linearly but slower
            const progress = i / totalYears;
            const y = padding.top + height - (progress * 0.35) * height;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Label
        ctx.font = '9px "Share Tech Mono", monospace';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.textAlign = 'left';
        const labelY = padding.top + height - (0.35) * height;
        ctx.fillText('Public Open Source', padding.left + width * 0.1, labelY - 8);
    }

    function drawPrivateResearchLine() {
        // Azetta private research line (years ahead)
        const privateAdvantage = 2.5; // years ahead
        
        ctx.strokeStyle = '#4ff975';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#4ff975';
        ctx.shadowBlur = 15;

        ctx.beginPath();
        for (let i = 0; i <= totalYears; i++) {
            const year = startYear + i;
            const x = padding.left + (i / totalYears) * width;
            // Private research is ahead - uses future progress
            const effectiveProgress = Math.min(1, (i + privateAdvantage) / totalYears);
            const y = padding.top + height - (effectiveProgress * 0.85) * height;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Animated glow effect
        time += 0.02;
        const currentX = padding.left + ((currentYear - startYear) / totalYears) * width;
        const currentY = padding.top + height - (((currentYear - startYear + privateAdvantage) / totalYears) * 0.85) * height;
        
        const glowGradient = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 40);
        glowGradient.addColorStop(0, `rgba(79, 249, 117, ${0.3 + Math.sin(time * 2) * 0.2})`);
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 40, 0, Math.PI * 2);
        ctx.fill();

        // Current position marker
        ctx.fillStyle = '#4ff975';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.font = 'bold 10px "Share Tech Mono", monospace';
        ctx.fillStyle = '#4ff975';
        ctx.textAlign = 'right';
        const labelY = padding.top + height - (((currentYear - startYear + privateAdvantage) / totalYears) * 0.85) * height;
        ctx.fillText('Azetta Private Research', padding.left + width - 20, labelY - 8);
    }

    function drawGapIndicator() {
        // Visual gap showing years ahead
        const gapYears = 2.5;
        const currentYearX = padding.left + ((currentYear - startYear) / totalYears) * width;
        const openSourceY = padding.top + height - (((currentYear - startYear) / totalYears) * 0.35) * height;
        const privateY = padding.top + height - (((currentYear - startYear + gapYears) / totalYears) * 0.85) * height;

        // Arrow showing gap
        ctx.strokeStyle = 'rgba(79, 249, 117, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(currentYearX + 30, openSourceY);
        ctx.lineTo(currentYearX + 30, privateY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow head
        ctx.fillStyle = 'rgba(79, 249, 117, 0.7)';
        ctx.beginPath();
        ctx.moveTo(currentYearX + 30, privateY);
        ctx.lineTo(currentYearX + 25, privateY - 5);
        ctx.lineTo(currentYearX + 35, privateY - 5);
        ctx.closePath();
        ctx.fill();

        // Gap label
        ctx.font = '9px "Share Tech Mono", monospace';
        ctx.fillStyle = '#4ff975';
        ctx.textAlign = 'center';
        ctx.fillText(`${gapYears} Years Ahead`, currentYearX + 30, (openSourceY + privateY) / 2);
    }

    function drawTradeSecrets() {
        // Lock icons and "TRADE SECRETS" text
        ctx.font = 'bold 14px "Press Start 2P", monospace';
        ctx.fillStyle = '#4ff975';
        ctx.textAlign = 'center';
        ctx.fillText('TRADE SECRETS', canvas.width / 2, padding.top - 25);

        // Lock icons floating
        time += 0.015;
        for (let i = 0; i < 3; i++) {
            const x = padding.left + (width / 4) * (i + 1);
            const y = padding.top + 10 + Math.sin(time + i * 2) * 8;
            
            ctx.font = '16px monospace';
            ctx.fillStyle = `rgba(79, 249, 117, ${0.6 + Math.sin(time * 2 + i) * 0.3})`;
            ctx.fillText('🔒', x, y);
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBackground();
        drawAxes();
        drawOpenSourceLine();
        drawPrivateResearchLine();
        drawGapIndicator();
        drawTradeSecrets();

        complexityAnimationId = requestAnimationFrame(animate);
    }

    // Cancel any existing animation
    if (complexityAnimationId) {
        cancelAnimationFrame(complexityAnimationId);
    }

    animate();
}

// ============================================
// Technical Replication Challenges Visualization (Modal)
// ============================================

let complexityModalAnimationId = null;

function initComplexityCanvasModalVisualization() {
    const canvas = document.getElementById('complexityCanvasModal');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let time = 0;

    // Components that need to be replicated
    const components = [
        { name: 'YAT-Product Kernel', angle: 0, distance: 120, color: '#4ff975', locked: true },
        { name: 'Training Pipeline', angle: Math.PI / 3, distance: 140, color: '#4deeea', locked: true },
        { name: 'Cosma DB Algorithm', angle: (Math.PI * 2) / 3, distance: 130, color: '#0ea5e9', locked: true },
        { name: 'Omnilingual Manifold', angle: Math.PI, distance: 125, color: '#6366f1', locked: true },
        { name: 'Integration Layer', angle: (Math.PI * 4) / 3, distance: 135, color: '#f59e0b', locked: true },
        { name: 'Production Scaling', angle: (Math.PI * 5) / 3, distance: 145, color: '#ef4444', locked: true }
    ];

    function drawBackground() {
        // Dark gradient background
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(canvas.width, canvas.height));
        gradient.addColorStop(0, 'rgba(10, 10, 15, 1)');
        gradient.addColorStop(1, 'rgba(5, 5, 5, 1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawCenter() {
        // Central "Azetta" core - protected
        const pulse = 15 + Math.sin(time * 3) * 3;
        
        // Outer glow
        const outerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulse * 3);
        outerGradient.addColorStop(0, 'rgba(79, 249, 117, 0.2)');
        outerGradient.addColorStop(0.5, 'rgba(79, 249, 117, 0.1)');
        outerGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulse * 3, 0, Math.PI * 2);
        ctx.fill();

        // Inner core
        const innerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulse);
        innerGradient.addColorStop(0, '#4ff975');
        innerGradient.addColorStop(0.7, 'rgba(79, 249, 117, 0.6)');
        innerGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulse, 0, Math.PI * 2);
        ctx.fill();

        // Lock symbol
        ctx.font = '24px monospace';
        ctx.fillStyle = '#4ff975';
        ctx.textAlign = 'center';
        ctx.fillText('🔒', centerX, centerY + 8);

        // Label
        ctx.font = 'bold 11px "Press Start 2P", monospace';
        ctx.fillStyle = '#4ff975';
        ctx.fillText('AZETTA IP', centerX, centerY + 35);
    }

    function drawComponents() {
        components.forEach((comp, i) => {
            time += 0.01;
            const x = centerX + Math.cos(comp.angle + time * 0.2) * comp.distance;
            const y = centerY + Math.sin(comp.angle + time * 0.2) * comp.distance;

            // Component connection line (fading)
            ctx.strokeStyle = `rgba(79, 249, 117, ${0.15 + Math.sin(time * 2 + i) * 0.1})`;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.setLineDash([]);

            // Component circle with lock
            if (comp.locked) {
                // Locked component - pulsing red
                const lockPulse = 1 + Math.sin(time * 4 + i) * 0.2;
                const lockGradient = ctx.createRadialGradient(x, y, 0, x, y, 25 * lockPulse);
                lockGradient.addColorStop(0, `rgba(239, 68, 68, ${0.6 + Math.sin(time * 4) * 0.3})`);
                lockGradient.addColorStop(1, 'transparent');
                ctx.fillStyle = lockGradient;
                ctx.beginPath();
                ctx.arc(x, y, 25 * lockPulse, 0, Math.PI * 2);
                ctx.fill();

                // Lock icon
                ctx.font = '18px monospace';
                ctx.fillStyle = '#ef4444';
                ctx.textAlign = 'center';
                ctx.fillText('🔒', x, y + 6);
            }

            // Component border
            ctx.strokeStyle = comp.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.stroke();

            // Component label
            ctx.font = '8px "Share Tech Mono", monospace';
            ctx.fillStyle = comp.color;
            ctx.textAlign = 'center';
            ctx.fillText(comp.name, x, y + 45);
        });
    }

    function drawReplicationBarriers(padding) {
        // Barrier lines preventing replication
        const barrierCount = 8;
        for (let i = 0; i < barrierCount; i++) {
            const angle = (Math.PI * 2 / barrierCount) * i + time * 0.1;
            const innerRadius = 180;
            const outerRadius = 250;
            
            const x1 = centerX + Math.cos(angle) * innerRadius;
            const y1 = centerY + Math.sin(angle) * innerRadius;
            const x2 = centerX + Math.cos(angle) * outerRadius;
            const y2 = centerY + Math.sin(angle) * outerRadius;

            // Barrier line with warning effect
            const alpha = 0.2 + Math.sin(time * 3 + i) * 0.15;
            ctx.strokeStyle = `rgba(255, 107, 107, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Warning symbol at end
            const warningAlpha = 0.4 + Math.sin(time * 4 + i) * 0.3;
            ctx.fillStyle = `rgba(255, 107, 107, ${warningAlpha})`;
            ctx.font = '14px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('⚠', x2, y2);
        }

        // Barrier label
        ctx.font = '10px "Share Tech Mono", monospace';
        ctx.fillStyle = 'rgba(255, 107, 107, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText('Replication Barriers', centerX, padding);
    }

    function drawChallengeText() {
        // Animated challenge indicators
        const challenges = [
            'Specialized Expertise Required',
            'Integrated Architecture Complexity',
            'Production-Scale Validation Needed',
            'Trade Secret Protection'
        ];

        ctx.font = '9px "Share Tech Mono", monospace';
        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.textAlign = 'center';
        
        challenges.forEach((challenge, i) => {
            const y = canvas.height - 60 + i * 12;
            const alpha = 0.4 + Math.sin(time * 2 + i * 0.5) * 0.3;
            ctx.fillStyle = `rgba(148, 163, 184, ${alpha})`;
            ctx.fillText(challenge, centerX, y);
        });
    }

    const padding = 40;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBackground();
        drawReplicationBarriers(padding);
        drawComponents();
        drawCenter();
        drawChallengeText();

        complexityModalAnimationId = requestAnimationFrame(animate);
    }

    // Cancel any existing animation
    if (complexityModalAnimationId) {
        cancelAnimationFrame(complexityModalAnimationId);
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
        
        // Initialize modal canvas when modal is opened
        if (modalId === 'competitiveBarriersModal') {
            setTimeout(() => {
                const modalCanvas = document.getElementById('complexityCanvasModal');
                if (modalCanvas && !initializedCanvases.has('complexityCanvasModal')) {
                    lazyInitCanvas('complexityCanvasModal');
                }
            }, 100);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Initialize modal canvas when modal is opened
    if (modalId === 'competitiveBarriersModal') {
        setTimeout(() => {
            const modalCanvas = document.getElementById('complexityCanvasModal');
            if (modalCanvas && !initializedCanvases.has('complexityCanvasModal')) {
                lazyInitCanvas('complexityCanvasModal');
            }
        }, 100);
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
