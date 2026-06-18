document.addEventListener('DOMContentLoaded', function () {
  const menuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      const open = mobileMenu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let current = 0;
    let timer;

    function showSlide(index) {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        const active = i === current;
        slide.classList.toggle('opacity-100', active);
        slide.classList.toggle('opacity-0', !active);
        slide.classList.toggle('is-active', active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });

    showSlide(0);
    startTimer();
  }

  document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
    const scope = panel.closest('section') || document;
    const cards = Array.from(scope.querySelectorAll('[data-movie-card]'));
    const search = panel.querySelector('[data-filter-search]');
    const year = panel.querySelector('[data-filter-year]');
    const region = panel.querySelector('[data-filter-region]');
    const type = panel.querySelector('[data-filter-type]');
    const empty = scope.querySelector('[data-filter-empty]');

    function valueOf(el) {
      return el ? el.value.trim().toLowerCase() : '';
    }

    function applyFilter() {
      const q = valueOf(search);
      const y = valueOf(year);
      const r = valueOf(region);
      const t = valueOf(type);
      let visible = 0;

      cards.forEach(function (card) {
        const haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-category'),
          card.getAttribute('data-type'),
          card.getAttribute('data-tags'),
          card.textContent
        ].join(' ').toLowerCase();
        const matchSearch = !q || haystack.indexOf(q) !== -1;
        const matchYear = !y || String(card.getAttribute('data-year')).toLowerCase() === y;
        const matchRegion = !r || String(card.getAttribute('data-region')).toLowerCase() === r;
        const matchType = !t || String(card.getAttribute('data-type')).toLowerCase() === t;
        const matched = matchSearch && matchYear && matchRegion && matchType;
        card.classList.toggle('hidden-card', !matched);
        if (matched) visible += 1;
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [search, year, region, type].forEach(function (el) {
      if (!el) return;
      el.addEventListener('input', applyFilter);
      el.addEventListener('change', applyFilter);
    });
  });
});
