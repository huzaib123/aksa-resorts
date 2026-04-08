// ===== CURSOR =====
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left  = mouseX + 'px';
  dot.style.top   = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .room-card, .amenity-item, .platform-btn')
  .forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== HERO SEASON SLIDER =====
const slides       = document.querySelectorAll('.hero-slide');
const seasonDots   = document.querySelectorAll('.season-dot');
const seasonLabel  = document.getElementById('seasonLabel');
const labels       = ['Winter', 'Spring', 'Summer', 'Autumn'];
let currentSlide   = 0;
let slideInterval;

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  seasonDots[currentSlide].classList.remove('active');
  currentSlide = n;
  slides[currentSlide].classList.add('active');
  seasonDots[currentSlide].classList.add('active');
  seasonLabel.textContent = labels[currentSlide];
  // show snow only on winter
  snowCanvas.style.opacity = currentSlide === 0 ? '1' : '0';
}

function nextSlide() {
  goToSlide((currentSlide + 1) % slides.length);
}

function startSlider() {
  slideInterval = setInterval(nextSlide, 5500);
}

seasonDots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(slideInterval);
    goToSlide(parseInt(dot.dataset.season));
    startSlider();
  });
});

startSlider();

// ===== SNOW PARTICLES =====
const snowCanvas = document.getElementById('snowCanvas');
const ctx        = snowCanvas.getContext('2d');
let flakes       = [];

function resizeCanvas() {
  snowCanvas.width  = window.innerWidth;
  snowCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createFlake() {
  return {
    x:       Math.random() * snowCanvas.width,
    y:       -10,
    r:       Math.random() * 2.8 + 0.8,
    speed:   Math.random() * 1.2 + 0.4,
    drift:   (Math.random() - 0.5) * 0.5,
    opacity: Math.random() * 0.65 + 0.2
  };
}

for (let i = 0; i < 120; i++) {
  flakes.push({ ...createFlake(), y: Math.random() * snowCanvas.height });
}

function drawSnow() {
  ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
  flakes.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${f.opacity})`;
    ctx.fill();
    f.y += f.speed;
    f.x += f.drift;
    if (f.y > snowCanvas.height + 10) {
      Object.assign(f, createFlake());
    }
  });
  requestAnimationFrame(drawSnow);
}
drawSnow();

// ===== SEASONS SECTION =====
const seasonTabs = document.querySelectorAll('.season-tab');
const snBtns     = document.querySelectorAll('.sn-btn');

snBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const s = btn.dataset.season;
    seasonTabs.forEach(t => t.classList.remove('active'));
    snBtns.forEach(b => b.classList.remove('active'));
    document.querySelector(`.season-tab[data-season="${s}"]`).classList.add('active');
    btn.classList.add('active');
  });
});

// ===== GSAP SCROLL ANIMATIONS =====
gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('.reveal-left').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: -50 },
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 82%', once: true }
    });
});

document.querySelectorAll('.reveal-right').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: 50 },
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 82%', once: true }
    });
});

document.querySelectorAll('.reveal-up').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
});

gsap.utils.toArray('.room-card').forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 88%', once: true }
    });
});

gsap.utils.toArray('.amenity-item').forEach((item, i) => {
  gsap.fromTo(item,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.7, delay: i * 0.07, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 88%', once: true }
    });
});

// ===== VANILLA TILT =====
VanillaTilt.init(document.querySelectorAll('.room-card'), {
  max: 10,
  speed: 400,
  glare: true,
  'max-glare': 0.2,
  perspective: 900
});

// ===== BOOKING FORM =====
document.getElementById('bookingForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const inputs = this.querySelectorAll('input, select, textarea');
  let body = 'New Booking Enquiry from Aksa Resorts Website\n\n';
  inputs.forEach(inp => {
    if (inp.value) body += inp.placeholder || inp.name || 'Field';
    if (inp.value) body += ': ' + inp.value + '\n';
  });
  window.location.href = `mailto:booking@aksaresorts.com?subject=Booking Enquiry — Aksa Resorts&body=${encodeURIComponent(body)}`;
});
