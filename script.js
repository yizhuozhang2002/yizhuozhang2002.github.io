// ============================================
// Yizhuo Zhang Portfolio - Interactive Scripts
// Bright & Vibrant Theme
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initCosmosOpening();
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initCounters();
    initTiltEffect();
});

// ============================================
// COSMOS OPENING SCREEN - Colorful Particle Universe
// ============================================
function initCosmosOpening() {
    const canvas = document.getElementById('cosmosCanvas');
    const screen = document.getElementById('openingScreen');
    const btn = document.getElementById('discoverBtn');
    const mainSite = document.getElementById('mainSite');
    if (!canvas || !screen || !btn) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles = [], stars = [], nebulaClouds = [];
    let mouse = { x: null, y: null };
    let isExploding = false;
    let explosionProgress = 0;
    let animId;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Star class - tiny background stars with warm colors
    class Star {
        constructor() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.size = Math.random() * 1.8 + 0.3;
            this.twinkleSpeed = Math.random() * 0.02 + 0.005;
            this.twinkleOffset = Math.random() * Math.PI * 2;
            this.baseOpacity = Math.random() * 0.7 + 0.3;
            // Colorful stars: white, gold, pink, cyan
            const colors = [
                '255, 255, 255',
                '251, 191, 36',
                '244, 114, 182',
                '167, 139, 250',
                '52, 211, 153',
                '96, 165, 250'
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        draw(t) {
            const opacity = this.baseOpacity + Math.sin(t * this.twinkleSpeed + this.twinkleOffset) * 0.3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${Math.max(0, opacity)})`;
            ctx.fill();
        }
    }

    // Cosmos Particle - vibrant, colorful, interactive
    class CosmosParticle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.size = Math.random() * 3.5 + 1;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.8 + 0.2;
            // Vibrant hues: purple, pink, gold, cyan, green
            const hueChoices = [260, 280, 320, 340, 40, 160, 190];
            this.hue = hueChoices[Math.floor(Math.random() * hueChoices.length)] + Math.random() * 30;
            this.saturation = 70 + Math.random() * 30;
            this.lightness = 60 + Math.random() * 20;
            this.orbitSpeed = (Math.random() - 0.5) * 0.001;
            this.orbitAngle = Math.random() * Math.PI * 2;
            this.explodeVX = 0;
            this.explodeVY = 0;
        }
        update(t) {
            if (isExploding) {
                this.x += this.explodeVX;
                this.y += this.explodeVY;
                this.opacity *= 0.97;
                return;
            }
            this.orbitAngle += this.orbitSpeed;
            this.x += this.speedX + Math.cos(this.orbitAngle) * 0.2;
            this.y += this.speedY + Math.sin(this.orbitAngle) * 0.2;
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    const force = (200 - dist) / 200 * 0.3;
                    this.x += dx * force * 0.01;
                    this.y += dy * force * 0.01;
                }
            }
            if (this.x < -20) this.x = W + 20;
            if (this.x > W + 20) this.x = -20;
            if (this.y < -20) this.y = H + 20;
            if (this.y > H + 20) this.y = -20;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
            ctx.fill();
            if (this.size > 2) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity * 0.12})`;
                ctx.fill();
            }
        }
    }

    // Nebula cloud - colorful
    class NebulaCloud {
        constructor() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.radius = Math.random() * 250 + 100;
            const hues = [260, 300, 340, 30, 180];
            this.hue = hues[Math.floor(Math.random() * hues.length)];
            this.opacity = Math.random() * 0.06 + 0.02;
            this.drift = (Math.random() - 0.5) * 0.1;
        }
        draw() {
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            grad.addColorStop(0, `hsla(${this.hue}, 70%, 60%, ${this.opacity})`);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.fillRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
            this.x += this.drift;
        }
    }

    const starCount = Math.min(Math.floor(W * H / 2500), 500);
    for (let i = 0; i < starCount; i++) stars.push(new Star());

    const particleCount = Math.min(Math.floor(W * H / 5000), 220);
    for (let i = 0; i < particleCount; i++) particles.push(new CosmosParticle());

    for (let i = 0; i < 10; i++) nebulaClouds.push(new NebulaCloud());

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    const opacity = (1 - dist / 110) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(167, 139, 250, ${opacity})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    let t = 0;
    function animate() {
        t++;
        ctx.clearRect(0, 0, W, H);
        nebulaClouds.forEach(n => n.draw());
        stars.forEach(s => s.draw(t));
        particles.forEach(p => { p.update(t); p.draw(); });
        if (!isExploding) drawConnections();

        // Central warm glow
        if (!isExploding) {
            const cg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 350);
            cg.addColorStop(0, 'rgba(167, 139, 250, 0.08)');
            cg.addColorStop(0.4, 'rgba(244, 114, 182, 0.04)');
            cg.addColorStop(0.7, 'rgba(251, 191, 36, 0.02)');
            cg.addColorStop(1, 'transparent');
            ctx.fillStyle = cg;
            ctx.fillRect(0, 0, W, H);
        }

        if (isExploding) {
            explosionProgress++;
            if (explosionProgress > 80) {
                cancelAnimationFrame(animId);
                screen.classList.add('dismissed');
                mainSite.classList.add('visible');
                setTimeout(() => {
                    initHeroParticles();
                    initTypingEffect();
                }, 300);
                return;
            }
        }
        animId = requestAnimationFrame(animate);
    }
    animate();

    btn.addEventListener('click', () => {
        if (isExploding) return;
        isExploding = true;
        screen.classList.add('exploding');
        const cx = W / 2, cy = H / 2;
        particles.forEach(p => {
            const dx = p.x - cx, dy = p.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const speed = Math.random() * 15 + 10;
            p.explodeVX = (dx / dist) * speed;
            p.explodeVY = (dy / dist) * speed;
        });
    });
}

// ============================================
// Hero Particles (light, colorful version)
// ============================================
function initHeroParticles() {
    const canvas = document.getElementById('heroParticles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', (e) => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    class P {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.sx = (Math.random() - 0.5) * 0.4;
            this.sy = (Math.random() - 0.5) * 0.4;
            this.o = Math.random() * 0.3 + 0.08;
            const colors = ['99,102,241', '139,92,246', '236,72,153', '251,191,36', '34,211,153'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.sx; this.y += this.sy;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
            if (mouse.x !== null) {
                const dx = mouse.x - this.x, dy = mouse.y - this.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 150) {
                    this.x -= dx * 0.02;
                    this.y -= dy * 0.02;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color},${this.o})`;
            ctx.fill();
        }
    }

    const count = Math.min(Math.floor(canvas.width * canvas.height / 10000), 100);
    for (let i = 0; i < count; i++) particles.push(new P());

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 110) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99,102,241,${(1 - d / 110) * 0.08})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

// ============================================
// Typing Effect
// ============================================
function initTypingEffect() {
    const el = document.getElementById('typingText');
    if (!el) return;
    const phrases = [
        'deep learning models',
        'data-driven insights',
        'intelligent AI systems',
        'high-performance pipelines',
        'full-stack applications'
    ];
    let pi = 0, ci = 0, deleting = false, speed = 80;

    function type() {
        const cur = phrases[pi];
        if (deleting) {
            el.textContent = cur.substring(0, ci - 1);
            ci--;
            speed = 40;
        } else {
            el.textContent = cur.substring(0, ci + 1);
            ci++;
            speed = 80;
        }
        if (!deleting && ci === cur.length) { speed = 2000; deleting = true; }
        else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; speed = 500; }
        setTimeout(type, speed);
    }
    setTimeout(type, 800);
}

// ============================================
// Navigation
// ============================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        navbar && navbar.classList.toggle('scrolled', window.scrollY > 50);
        let cur = '';
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
        links.forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('href') === '#' + cur) l.classList.add('active');
        });
    });

    toggle && toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('open');
    });

    links.forEach(l => {
        l.addEventListener('click', (e) => {
            e.preventDefault();
            toggle && toggle.classList.remove('active');
            menu && menu.classList.remove('open');
            const t = document.querySelector(l.getAttribute('href'));
            if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
        });
    });

    document.querySelectorAll('.hero-buttons a[href^="#"]').forEach(b => {
        b.addEventListener('click', (e) => {
            e.preventDefault();
            const t = document.querySelector(b.getAttribute('href'));
            if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
        });
    });
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    const els = document.querySelectorAll('.anim');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 60);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
}

// ============================================
// Skill Bars
// ============================================
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.width = e.target.dataset.width + '%';
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    bars.forEach(b => obs.observe(b));
}

// ============================================
// Counters
// ============================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const target = parseInt(e.target.dataset.count);
                animateCount(e.target, 0, target, 1500);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
}

function animateCount(el, start, end, dur) {
    const st = performance.now();
    function upd(now) {
        const p = Math.min((now - st) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(start + (end - start) * eased);
        if (p < 1) requestAnimationFrame(upd);
    }
    requestAnimationFrame(upd);
}

// ============================================
// 3D Tilt
// ============================================
function initTiltEffect() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            const rx = (y - r.height / 2) / r.height * -6;
            const ry = (x - r.width / 2) / r.width * 6;
            card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
            card.style.transition = 'transform .5s ease';
        });
        card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
    });
}