/* ============================================
   DIYA PHARMA — UI Interactions
   ============================================ */

/* ---------- Carousel / Slider ---------- */
class Carousel {
  constructor(container, options = {}) {
    this.container = container;
    this.track = container.querySelector('.carousel-track');
    if (!this.track) return;
    this.slides = [...this.track.children];
    this.current = 0;
    this.autoplay = options.autoplay ?? true;
    this.interval = options.interval ?? 4000;
    this.perView = options.perView ?? 4;
    this.gap = options.gap ?? 24;
    this.timer = null;
    this.init();
  }
  init() {
    this.updatePerView();
    const prev = this.container.querySelector('.carousel-prev');
    const next = this.container.querySelector('.carousel-next');
    if (prev) prev.addEventListener('click', () => this.prev());
    if (next) next.addEventListener('click', () => this.next());
    if (this.autoplay) this.startAutoplay();
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => { if (this.autoplay) this.startAutoplay(); });
    window.addEventListener('resize', () => { this.updatePerView(); this.goTo(this.current); });
    this.goTo(0);
  }
  updatePerView() {
    const w = window.innerWidth;
    if (w <= 480) this.activePerView = 1;
    else if (w <= 768) this.activePerView = Math.min(2, this.perView);
    else if (w <= 1024) this.activePerView = Math.min(3, this.perView);
    else this.activePerView = this.perView;
  }
  goTo(index) {
    const maxIndex = Math.max(0, this.slides.length - this.activePerView);
    this.current = Math.max(0, Math.min(index, maxIndex));
    const slideWidth = (this.track.parentElement.offsetWidth - (this.activePerView - 1) * this.gap) / this.activePerView;
    this.slides.forEach(s => { s.style.minWidth = slideWidth + 'px'; s.style.maxWidth = slideWidth + 'px'; });
    this.track.style.gap = this.gap + 'px';
    const offset = this.current * (slideWidth + this.gap);
    this.track.style.transform = `translateX(-${offset}px)`;
  }
  next() { this.goTo(this.current + 1 >= this.slides.length - this.activePerView + 1 ? 0 : this.current + 1); }
  prev() { this.goTo(this.current <= 0 ? this.slides.length - this.activePerView : this.current - 1); }
  startAutoplay() { this.stopAutoplay(); this.timer = setInterval(() => this.next(), this.interval); }
  stopAutoplay() { if (this.timer) clearInterval(this.timer); }
}

/* ---------- Tabs ---------- */
function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(tabGroup => {
    const btns = tabGroup.querySelectorAll('[data-tab]');
    const panels = tabGroup.closest('section')?.querySelectorAll('[data-tab-panel]') || document.querySelectorAll('[data-tab-panel]');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.tab;
        panels.forEach(p => {
          p.classList.toggle('active', p.dataset.tabPanel === target);
        });
      });
    });
  });
}

/* ---------- Accordion ---------- */
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isOpen = item.classList.contains('open');
      item.closest('.accordion')?.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-content').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ---------- Search with Debounce ---------- */
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ---------- Smooth Scroll to Element ---------- */
function scrollToElement(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- Lazy Load Images ---------- */
function initLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  images.forEach(img => observer.observe(img));
}

/* ---------- Price Range Slider ---------- */
function initPriceSlider() {
  const slider = document.getElementById('priceRange');
  const display = document.getElementById('priceDisplay');
  if (slider && display) {
    slider.addEventListener('input', () => {
      display.textContent = `₹0 - ₹${parseInt(slider.value).toLocaleString()}`;
    });
  }
}

/* ---------- Init UI ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initAccordions();
  initLazyLoad();
  initPriceSlider();
});
