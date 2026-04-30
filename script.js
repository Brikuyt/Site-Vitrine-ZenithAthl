// Menu burger
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('active');
});

// Fermer le menu au clic sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        burger.classList.remove('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header au scroll
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = entry.target.classList.contains('featured')
                ? 'scale(1.03)'
                : 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.offer-card, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease';
    observer.observe(el);
});

// Carousel des offres
(function () {
    const track = document.querySelector('.offers-track');
    const wrapper = document.querySelector('.offers-track-wrapper');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.carousel-dot');
    const cards = document.querySelectorAll('.offer-card');

    if (!track || !cards.length) return;

    let currentIndex = 0;

    function getVisible() {
        if (window.innerWidth <= 767) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function maxIndex() {
        return Math.max(0, cards.length - getVisible());
    }

    function updateCarousel() {
        const gap = 30;
        const cardWidth = cards[0].offsetWidth + gap;
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex();

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) { currentIndex--; updateCarousel(); }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex()) { currentIndex++; updateCarousel(); }
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentIndex = Math.min(parseInt(dot.dataset.index), maxIndex());
            updateCarousel();
        });
    });

    // Swipe tactile
    let touchStartX = 0;
    wrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    wrapper.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < maxIndex()) { currentIndex++; updateCarousel(); }
            else if (diff < 0 && currentIndex > 0) { currentIndex--; updateCarousel(); }
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        currentIndex = Math.min(currentIndex, maxIndex());
        updateCarousel();
    });

    updateCarousel();
}());

