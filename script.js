// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Carousel
const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsWrap = document.getElementById('carouselDots');
const cards = Array.from(track.children);

cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  dot.addEventListener('click', () => scrollToCard(i));
  dotsWrap.appendChild(dot);
});
const dots = Array.from(dotsWrap.children);

function cardWidth() {
  return cards[0].getBoundingClientRect().width + 20; // + gap
}

function scrollToCard(index) {
  track.scrollTo({ left: cardWidth() * index, behavior: 'smooth' });
}

function currentIndex() {
  return Math.round(track.scrollLeft / cardWidth());
}

function updateDots() {
  const idx = Math.min(currentIndex(), dots.length - 1);
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

prevBtn.addEventListener('click', () => scrollToCard(Math.max(currentIndex() - 1, 0)));
nextBtn.addEventListener('click', () => scrollToCard(Math.min(currentIndex() + 1, cards.length - 1)));

track.addEventListener('scroll', () => {
  window.requestAnimationFrame(updateDots);
});

updateDots();

// Autoplay, pauses on interaction
let autoplay = setInterval(advance, 4500);

function advance() {
  const next = (currentIndex() + 1) % cards.length;
  scrollToCard(next);
}

function pauseAutoplay() {
  clearInterval(autoplay);
  autoplay = setInterval(advance, 4500);
}

['pointerdown', 'wheel'].forEach(evt => {
  track.addEventListener(evt, () => clearInterval(autoplay), { passive: true });
});
[prevBtn, nextBtn].forEach(btn => btn.addEventListener('click', pauseAutoplay));
