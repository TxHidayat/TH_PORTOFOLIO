/* =========================================
   1. SETUP SMOOTH SCROLL (LENIS)
========================================= */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    direction: 'vertical',
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);


/* =========================================
   2. CUSTOM CURSOR (FIXED & SAFE)
========================================= */
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;

        cursorDot.style.left = `${clientX}px`;
        cursorDot.style.top = `${clientY}px`;

        cursorOutline.animate(
            { left: `${clientX}px`, top: `${clientY}px` },
            { duration: 400, fill: 'forwards' }
        );
    });

    document.querySelectorAll(
        'a, button, .hover-trigger, .editorial-item, .id-card-body, .tool-item, .brands-grid img'
    ).forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });
}


/* =========================================
   3. HERO TEXT REVEAL
========================================= */
gsap.from('.reveal-text', {
    y: 100,
    opacity: 0,
    duration: 1.5,
    stagger: 0.2,
    ease: 'power4.out',
    delay: 0.5
});

/* =========================================
   4. HANGING ID CARD PHYSICS (MOUSE & TOUCH)
========================================= */
const card = document.getElementById('swing-card');

if (card) {
    let isDragging = false;
    let startX = 0;

    // Animasi ayunan lambat saat diam
    const idleSway = gsap.to(card, {
        rotation: 2,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
    });

    // 1. FUNGSI MULAI TARIK (Merespon Mouse & Jari)
    const startDrag = (e) => {
        isDragging = true;
        // Ambil kordinat X, bedakan antara sentuhan layar atau klik mouse
        startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        
        idleSway.pause();
        gsap.killTweensOf(card);
        card.style.cursor = 'grabbing';
    };

    // 2. FUNGSI LEPAS TARIKAN (Merespon Mouse & Jari)
    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        card.style.cursor = 'grab';

        // Efek membal (elastic) saat dilepas
        gsap.to(card, {
            rotation: 0,
            duration: 2,
            ease: 'elastic.out(1, 0.25)',
            onComplete: () => idleSway.play()
        });
    };

    // 3. FUNGSI MENGGESER (Merespon Mouse & Jari)
    const moveDrag = (e) => {
        if (!isDragging) return;
        const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const diff = currentX - startX;
        gsap.set(card, { rotation: -(diff * 0.15) });
    };

    // --- EVENT LISTENER UNTUK PC / LAPTOP (MOUSE) ---
    card.addEventListener('mousedown', startDrag);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('mousemove', moveDrag);

    // --- EVENT LISTENER UNTUK HP / TABLET (TOUCH) ---
    card.addEventListener('touchstart', startDrag, { passive: true });
    window.addEventListener('touchend', endDrag);
    window.addEventListener('touchmove', moveDrag, { passive: true });
}

/* =========================================
   5. EDITORIAL PROJECT ANIMATION (HORIZONTAL)
========================================= */
const editorialSection = document.querySelector('#projects');
const editorialContainer = document.querySelector('.editorial-container');

if (editorialSection && editorialContainer) {
    // Animasi utama untuk menggeser container ke kiri (Horizontal Scroll)
    let horizontalScroll = gsap.to(editorialContainer, {
        x: () => -(editorialContainer.scrollWidth - window.innerWidth) + "px",
        ease: "none",
        scrollTrigger: {
            trigger: editorialSection,
            pin: true, // Mengunci layar saat berada di section ini
            scrub: 1, // Efek mulus mengikuti scroll
            start: "center center",
            end: () => "+=" + (editorialContainer.scrollWidth - window.innerWidth),
            invalidateOnRefresh: true
        }
    });

    // Efek parallax gambar disesuaikan ke sumbu X karena sekarang bergeraknya horizontal
    gsap.utils.toArray('.parallax-img img').forEach(img => {
        gsap.to(img, {
            xPercent: 15,
            ease: 'none',
            scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: horizontalScroll,
                start: 'left right',
                end: 'right left',
                scrub: true
            }
        });
    });

    // Animasi teks muncul saat elemen masuk ke layar dari kanan
    gsap.utils.toArray('.reveal-project').forEach(block => {
        gsap.from(block.children, {
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: block,
                containerAnimation: horizontalScroll,
                start: "left 85%"
            }
        });
    });
}


/* =========================================
   6. BRANDS WALL (TOOLS)
========================================= */
const brandItems = document.querySelectorAll('.brands-grid img');

if (brandItems.length > 0) {
    gsap.from(brandItems, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.brands-grid',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        }
    });
}


/* =========================================
   7. FOOTER TEXT
========================================= */
gsap.from('.bc-bottom h1', {
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out',
    scrollTrigger: {
        trigger: '.bc-bottom h1',
        start: 'top 95%'
    }
});