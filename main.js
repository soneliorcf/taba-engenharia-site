// Remove logo PNG background (make it transparent)
(function() {
  const img = document.querySelector('.nav-icon-img');
  function processBg() {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height);
    const px = d.data;
    const [bgR, bgG, bgB] = [44, 47, 56];
    const thr = 22;
    for (let i = 0; i < px.length; i += 4) {
      if (Math.abs(px[i]-bgR) < thr && Math.abs(px[i+1]-bgG) < thr && Math.abs(px[i+2]-bgB) < thr)
        px[i+3] = 0;
    }
    ctx.putImageData(d, 0, 0);
    img.src = c.toDataURL('image/png');
  }
  img.complete ? processBg() : img.addEventListener('load', processBg);
})();

// Nav scroll effect + scroll progress
const header = document.getElementById('header');
const progressBar = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);

  if (progressBar) {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrollTop / docHeight * 100) + '%';
  }
}, { passive: true });

// Mobile menu — animated hamburger + body scroll lock
const toggle = document.getElementById('navToggle');
const links  = document.getElementById('navLinks');

function openMenu() {
  links.classList.add('open');
  toggle.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  links.classList.remove('open');
  toggle.classList.remove('active');
  document.body.style.overflow = '';
}

toggle.addEventListener('click', () => {
  links.classList.contains('open') ? closeMenu() : openMenu();
});

links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// Close menu on outside tap
document.addEventListener('click', (e) => {
  if (links.classList.contains('open') && !links.contains(e.target) && !toggle.contains(e.target)) {
    closeMenu();
  }
});

// Reveal on scroll
const reveals = document.querySelectorAll('.section > .container > *, .membro-card, .servico-item, .stat-card, .cta-card');
reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 55);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

reveals.forEach(el => observer.observe(el));

// Projects carousel dots (mobile)
const grid = document.getElementById('projetosGrid');
const dotsContainer = document.getElementById('projetosDots');

function isMobile() { return window.innerWidth <= 640; }

function initDots() {
  if (!grid || !dotsContainer) return;
  dotsContainer.innerHTML = '';

  if (!isMobile()) return;

  const cards = grid.querySelectorAll('.projeto-card');
  if (cards.length === 0) return;

  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
  });
}

function updateDots() {
  if (!grid || !dotsContainer || !isMobile()) return;
  const cards = Array.from(grid.querySelectorAll('.projeto-card'));
  const dots = Array.from(dotsContainer.querySelectorAll('span'));
  if (cards.length === 0) return;

  const scrollLeft = grid.scrollLeft;
  const cardWidth = cards[0].offsetWidth + 12; // gap
  const activeIndex = Math.round(scrollLeft / cardWidth);

  dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
}

initDots();
if (grid) grid.addEventListener('scroll', updateDots, { passive: true });
window.addEventListener('resize', initDots);
