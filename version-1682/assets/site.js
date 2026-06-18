(function () {
  var header = document.querySelector('[data-site-header]');
  var menuButton = document.querySelector('[data-menu-toggle]');
  var navLinks = document.querySelector('[data-nav-links]');

  function updateHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 18) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuButton && navLinks) {
    menuButton.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
        startTimer();
      });
    });

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

    startTimer();
  }

  var panel = document.querySelector('[data-filter-panel]');
  var scope = document.querySelector('[data-filter-scope]');
  if (panel && scope) {
    var input = panel.querySelector('[data-filter-input]');
    var typeSelect = panel.querySelector('[data-filter-type]');
    var yearSelect = panel.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search-card]'));
    var params = new URLSearchParams(window.location.search);

    if (input && params.get('q')) {
      input.value = params.get('q');
    }

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function filterCards() {
      var query = normalize(input ? input.value : '');
      var typeValue = normalize(typeSelect ? typeSelect.value : '');
      var yearValue = normalize(yearSelect ? yearSelect.value : '');

      cards.forEach(function (card) {
        var haystack = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.dataset.tags
        ].join(' '));
        var cardType = normalize(card.dataset.type);
        var cardYear = normalize(card.dataset.year);
        var matchedQuery = !query || haystack.indexOf(query) !== -1;
        var matchedType = !typeValue || cardType.indexOf(typeValue) !== -1;
        var matchedYear = !yearValue || cardYear === yearValue;
        card.classList.toggle('is-hidden-card', !(matchedQuery && matchedType && matchedYear));
      });
    }

    if (input) {
      input.addEventListener('input', filterCards);
    }
    if (typeSelect) {
      typeSelect.addEventListener('change', filterCards);
    }
    if (yearSelect) {
      yearSelect.addEventListener('change', filterCards);
    }

    filterCards();
  }
})();
