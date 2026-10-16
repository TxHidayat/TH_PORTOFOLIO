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

/* =========================================
   8. DYNAMIC SYSTEM STATUS (TIME & BATTERY)
========================================= */

// --- A. SENSOR WAKTU SIANG & MALAM ---
const timeEl = document.getElementById('sys-time');

if (timeEl) {
    // Jalankan pembaruan setiap 1 detik (1000ms)
    setInterval(() => {
        const now = new Date();
        
        // Ambil komponen waktu
        let hours = now.getHours();
        let mins = now.getMinutes();
        let secs = now.getSeconds();
        
        // Deteksi Siang (06:00 - 17:59) atau Malam
        const isDay = hours >= 6 && hours < 18;
        const icon = isDay ? '☀️' : '🌙';

        // Tambahkan angka 0 di depan jika di bawah 10 (contoh: 09:05)
        hours = hours < 10 ? '0' + hours : hours;
        mins = mins < 10 ? '0' + mins : mins;
        secs = secs < 10 ? '0' + secs : secs;

        // Ambil komponen tanggal
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();

        // Cetak ke layar HTML
        timeEl.textContent = `[ ${icon} ${day}/${month}/${year} - ${hours}:${mins}:${secs} ]`;
    }, 1000);
}


// --- B. SENSOR BATERAI PERANGKAT ---
const batEl = document.getElementById('sys-bat');

if (batEl) {
    // Cek apakah browser pengunjung mendukung fitur baca baterai
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            
            const updateBattery = () => {
                const level = Math.round(battery.level * 100);
                // Munculkan ikon petir jika sedang dicas
                const charging = battery.charging ? '⚡' : ''; 
                batEl.textContent = `[ PWR: ${level}% ${charging}]`;
            };

            updateBattery(); // Jalankan saat pertama kali dimuat
            
            // Dengarkan perubahan jika kabel charger dicabut/dicolok
            battery.addEventListener('levelchange', updateBattery);
            battery.addEventListener('chargingchange', updateBattery);
        });
    } else {
        // Fallback jika dibuka di perangkat yang tidak mendukung (seperti Safari/iPhone)
        batEl.textContent = `[ PWR: DIRECT ]`; 
    }
}

/* =========================================
   10. BLUEPRINT SCANNER SPLASH SCREEN
========================================= */
window.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash-screen');
    
    if (splash) {
        document.body.style.overflow = 'hidden'; 
        
        // Animasi CSS berjalan 1.8 detik (1800ms). 
        // Kita hancurkan kontainer splash di 1.85 detik agar bersih dari memori.
        setTimeout(() => {
            splash.classList.add('splash-hidden');
            document.body.style.overflow = 'auto'; 
        }, 1850);
    }
});

/* =========================================
   11. FARMORA CASE STUDY MODAL INTERACTION
   ========================================= */
const farmoraModal = document.getElementById('farmora-modal');
const openFarmoraBtn = document.getElementById('open-farmora-btn');
const closeFarmoraBtn = document.getElementById('close-farmora-btn');
const closeFarmoraFooterBtn = document.getElementById('close-farmora-footer-btn');
const farmoraBackdrop = document.getElementById('farmora-modal-backdrop');
const farmoraMainImage = document.getElementById('farmora-main-image');
const farmoraCaption = document.getElementById('farmora-showcase-caption');
const farmoraThumbs = document.querySelectorAll('.farmora-modal__thumb');

if (farmoraModal && openFarmoraBtn) {
    const openModal = () => {
        farmoraModal.removeAttribute('hidden');
        // Force reflow for smooth CSS animation
        void farmoraModal.offsetWidth;
        farmoraModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        if (typeof lenis !== 'undefined' && lenis && typeof lenis.stop === 'function') {
            lenis.stop();
        }
        if (closeFarmoraBtn) closeFarmoraBtn.focus();
    };

    const closeModal = () => {
        farmoraModal.classList.remove('is-open');
        document.body.style.overflow = '';
        if (typeof lenis !== 'undefined' && lenis && typeof lenis.start === 'function') {
            lenis.start();
        }
        setTimeout(() => {
            if (!farmoraModal.classList.contains('is-open')) {
                farmoraModal.setAttribute('hidden', '');
            }
        }, 260);
        openFarmoraBtn.focus();
    };

    // Open trigger
    openFarmoraBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });

    // Close triggers
    if (closeFarmoraBtn) closeFarmoraBtn.addEventListener('click', closeModal);
    if (closeFarmoraFooterBtn) closeFarmoraFooterBtn.addEventListener('click', closeModal);
    if (farmoraBackdrop) farmoraBackdrop.addEventListener('click', closeModal);

    // Escape key trigger
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && farmoraModal.classList.contains('is-open')) {
            closeModal();
        }
    });

    // Interactive thumbnail switcher
    farmoraThumbs.forEach((thumb) => {
        thumb.addEventListener('click', () => {
            const fullSrc = thumb.getAttribute('data-full');
            const captionText = thumb.getAttribute('data-caption');

            farmoraThumbs.forEach((t) => t.classList.remove('active'));
            thumb.classList.add('active');

            if (farmoraMainImage && fullSrc) {
                farmoraMainImage.style.opacity = '0.3';
                farmoraMainImage.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    farmoraMainImage.src = fullSrc;
                    farmoraMainImage.alt = captionText || 'FARMORA Screenshot';
                    farmoraMainImage.style.opacity = '1';
                    farmoraMainImage.style.transform = 'scale(1)';
                }, 120);
            }

            if (farmoraCaption && captionText) {
                farmoraCaption.textContent = captionText;
            }
        });
    });

    // Ensure custom cursor recognizes newly accessible modal triggers
    farmoraModal.querySelectorAll('.hover-trigger, button').forEach((el) => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });
}