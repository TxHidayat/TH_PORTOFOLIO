// 1. SETUP SMOOTH SCROLL
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

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

// 2. CURSOR LOGIC
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const hoverTriggers = document.querySelectorAll('.hover-trigger, a, button, .card-content');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

hoverTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', () => {
        document.body.classList.add('hovering');
    });
    trigger.addEventListener('mouseleave', () => {
        document.body.classList.remove('hovering');
    });
});

// 3. ANIMASI HERO
const revealElements = document.querySelectorAll('.reveal-text');
if(revealElements.length > 0) {
    gsap.from(revealElements, {
        y: 100, opacity: 0,
        duration: 1.5, stagger: 0.2,
        ease: "power4.out", delay: 0.5
    });
}

// 4. ANIMASI STACKED CARDS
const cards = document.querySelectorAll('.card-sticky');
cards.forEach((card, index) => {
    gsap.from(card, {
        scale: 0.9, opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
        }
    });
});

// 5. ANIMASI FOTO PROFIL
gsap.to(".profile-img", {
    yPercent: 10,
    ease: "none",
    scrollTrigger: {
        trigger: ".profile-img-wrapper",
        start: "top bottom",
        end: "bottom top",
        scrub: true
    }
});

// ... kode animasi sebelumnya ...

// 6. LOGIKA FLOATING IMAGE PROJECT
const projectItems = document.querySelectorAll('.project-item');

projectItems.forEach(item => {
    const imgPreview = item.querySelector('.p-image-preview');
    
    // Saat mouse bergerak di atas item
    item.addEventListener('mousemove', (e) => {
        // Pindahkan gambar ke posisi kursor
        // Kita gunakan animasi CSS/GSAP ringan agar smooth
        gsap.to(imgPreview, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.5, // Sedikit delay agar terlihat smooth (fluid)
            ease: "power2.out"
        });
    });
});

// ... kode animasi sebelumnya ...

// 6. ANIMASI EDITORIAL PARALLAX
// Efek: Gambar bergerak di dalam bingkainya saat scroll (Parallax)
const parallaxImages = document.querySelectorAll('.parallax-img img');

parallaxImages.forEach(img => {
    gsap.to(img, {
        yPercent: 15, // Gambar turun 15%
        ease: "none",
        scrollTrigger: {
            trigger: img.parentElement, // Trigger saat container gambar masuk layar
            start: "top bottom",
            end: "bottom top",
            scrub: true // Gerakan terikat dengan scrollbar
        }
    });
});

// Efek: Teks muncul (Fade In Up) saat scroll
const textReveals = document.querySelectorAll('.reveal-project');

textReveals.forEach(text => {
    gsap.from(text.children, { // Menganimasikan anak elemen (h3, p, ul)
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1, // Muncul berurutan
        ease: "power3.out",
        scrollTrigger: {
            trigger: text,
            start: "top 80%", // Mulai saat elemen 80% dari atas layar
            toggleActions: "play none none reverse"
        }
    });
});