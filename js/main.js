document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       1. LOADER
    ========================================================== */
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('loader')?.classList.add('hidden');
        }, 1400);
    });

    /* ==========================================================
       2. MODO OSCURO
    ========================================================== */
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('melanny-theme');

    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.setAttribute('data-theme', 'dark');
    }

    themeToggle?.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('melanny-theme', next);
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#0B0718' : '#7C3AED');
    });

    /* ==========================================================
       3. NAVEGACIÓN ENTRE SECCIONES
    ========================================================== */
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.getElementById('menuToggle');

    function switchSection(targetId) {
        navButtons.forEach(b => b.classList.remove('active'));
        sections.forEach(sec => sec.classList.remove('active'));

        const activeBtn = [...navButtons].find(b => b.getAttribute('data-target') === targetId);
        activeBtn?.classList.add('active');

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            requestAnimationFrame(() => {
                targetSection.querySelectorAll('.reveal').forEach(el => el.classList.remove('visible'));
                initReveal();
                initLangBars();
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchSection(btn.getAttribute('data-target'));
            navLinks.classList.remove('open');
            menuToggle.classList.remove('active');
        });
    });

    // Logo y botones CTA
    document.querySelectorAll('[data-target].btn-primary, [data-target].btn-ghost, .logo[data-target]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection(el.getAttribute('data-target'));
        });
    });

    // Enlaces del footer
    document.querySelectorAll('.footer-links a[data-target]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection(link.getAttribute('data-target'));
        });
    });

    /* ==========================================================
       4. MENÚ HAMBURGUESA
    ========================================================== */
    menuToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    /* ==========================================================
       5. REVEAL ON SCROLL
    ========================================================== */
    let revealObserver;

    function initReveal() {
        if (revealObserver) revealObserver.disconnect();

        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        document.querySelectorAll('.content-section.active .reveal:not(.visible)').forEach(el => {
            revealObserver.observe(el);
        });
    }

    initReveal();

    /* ==========================================================
   6. BARRAS DE IDIOMAS (barra + contador numérico)
========================================================== */
let langObserver;
const langTimers = new WeakMap();

function animateLangItem(item) {
    const target = parseInt(item.getAttribute('data-progress'), 10) || 0;
    const bar = item.querySelector('.bar-fill');
    const percentText = item.querySelector('.lang-percent');

    // Reset
    if (bar) bar.style.width = '0%';
    if (percentText) percentText.textContent = '0%';

    // Limpiar interval previo
    const prev = langTimers.get(item);
    if (prev) clearInterval(prev);

    // Animar barra
    setTimeout(() => { if (bar) bar.style.width = target + '%'; }, 100);

    // Contador numérico
    if (!percentText) return;
    let current = 0;
    const duration = 1200;
    const stepTime = Math.max(1, Math.floor(duration / Math.max(target, 1)));
    const timer = setInterval(() => {
        current++;
        percentText.textContent = current + '%';
        if (current >= target) {
            clearInterval(timer);
            langTimers.delete(item);
        }
    }, stepTime);
    langTimers.set(item, timer);
}

function initLangBars() {
    if (langObserver) langObserver.disconnect();
    const items = document.querySelectorAll('.lang-item');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
        items.forEach(animateLangItem);
        return;
    }

    langObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateLangItem(entry.target);
                langObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    items.forEach(el => langObserver.observe(el));
}

initLangBars();
    /* ==========================================================
       7. SCROLL PROGRESS + BACK TO TOP + PARALLAX
    ========================================================== */
    const progress = document.getElementById('scrollProgress');
    const backTop = document.getElementById('backToTop');
    const heroBanner = document.getElementById('heroBanner');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const pct = height > 0 ? (scrollTop / height) * 100 : 0;

        if (progress) progress.style.width = pct + '%';
        if (backTop) backTop.classList.toggle('visible', scrollTop > 400);

        if (heroBanner && scrollTop < 600) {
            heroBanner.style.backgroundPositionY = `calc(50% + ${scrollTop * 0.25}px)`;
        }
    }, { passive: true });

    backTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ==========================================================
       8. CURSOR GLOW
    ========================================================== */
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, [data-lightbox], .nav-btn, .fact').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorGlow.style.width = '55px';
                cursorGlow.style.height = '55px';
            });
            el.addEventListener('mouseleave', () => {
                cursorGlow.style.width = '30px';
                cursorGlow.style.height = '30px';
            });
        });
    }

    /* ==========================================================
       9. LIGHTBOX
    ========================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    document.querySelectorAll('[data-lightbox]').forEach(el => {
        el.addEventListener('click', () => {
            const src = el.getAttribute('data-lightbox');
            if (src && lightbox && lightboxImg) {
                lightboxImg.src = src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        lightbox?.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

    /* ==========================================================
       10. FORMULARIO DE CONTACTO (validación + feedback)
    ========================================================== */
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = form.nombre.value.trim();
        const email = form.email.value.trim();
        const mensaje = form.mensaje.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        form.querySelectorAll('input, textarea').forEach(i => i.classList.remove('error'));

        let valid = true;

        if (!nombre) { form.nombre.classList.add('error'); valid = false; }
        if (!email || !emailRegex.test(email)) { form.email.classList.add('error'); valid = false; }
        if (!mensaje || mensaje.length < 5) { form.mensaje.classList.add('error'); valid = false; }

        if (!valid) {
            formStatus.textContent = '⚠️ Por favor completa los campos correctamente.';
            formStatus.className = 'form-status error';
            return;
        }

        formStatus.textContent = '⏳ Enviando...';
        formStatus.className = 'form-status';

        setTimeout(() => {
            formStatus.textContent = '✅ ¡Gracias ' + nombre + '! Tu mensaje fue enviado (demo).';
            formStatus.className = 'form-status success';
            form.reset();
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        }, 1200);
    });

    /* ==========================================================
       11. EFECTO TILT EN TARJETAS
    ========================================================== */
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

});