
(function() {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function text(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function initMenu() {
    var button = qs('[data-menu-toggle]');
    var nav = qs('[data-mobile-nav]');
    if (!button || !nav) return;
    button.addEventListener('click', function() {
      nav.classList.toggle('open');
    });
  }

  function initHero() {
    var hero = qs('[data-hero]');
    if (!hero) return;
    var slides = qsa('.hero-slide', hero);
    var dots = qsa('[data-hero-dot]', hero);
    var next = qs('[data-hero-next]', hero);
    var prev = qs('[data-hero-prev]', hero);
    if (!slides.length) return;
    var index = 0;
    var timer = null;

    function show(n) {
      index = (n + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      if (timer) window.clearInterval(timer);
      timer = window.setInterval(function() {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        show(i);
        start();
      });
    });
    if (next) next.addEventListener('click', function() { show(index + 1); start(); });
    if (prev) prev.addEventListener('click', function() { show(index - 1); start(); });
    show(0);
    start();
  }

  function initHeroSearch() {
    var form = qs('[data-hero-search]');
    if (!form) return;
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      var input = qs('input', form);
      var query = input ? input.value.trim() : '';
      var url = './search.html';
      if (query) url += '?q=' + encodeURIComponent(query);
      window.location.href = url;
    });
  }

  function initFilters() {
    var input = qs('[data-search-input]');
    var year = qs('[data-year-filter]');
    var type = qs('[data-type-filter]');
    var reset = qs('[data-reset-filter]');
    var cards = qsa('.movie-card');
    if (!cards.length || (!input && !year && !type)) return;
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q');
    if (initial && input) input.value = initial;

    function apply() {
      var q = text(input && input.value);
      var y = text(year && year.value);
      var t = text(type && type.value);
      var visible = 0;
      cards.forEach(function(card) {
        var haystack = text([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-type'),
          card.getAttribute('data-keywords')
        ].join(' '));
        var ok = true;
        if (q && haystack.indexOf(q) === -1) ok = false;
        if (y && text(card.getAttribute('data-year')) !== y) ok = false;
        if (t && haystack.indexOf(t) === -1) ok = false;
        card.style.display = ok ? '' : 'none';
        if (ok) visible += 1;
      });
      var empty = qs('[data-empty-state]');
      if (empty) empty.style.display = visible ? 'none' : 'block';
    }

    [input, year, type].forEach(function(el) {
      if (!el) return;
      el.addEventListener('input', apply);
      el.addEventListener('change', apply);
    });
    if (reset) {
      reset.addEventListener('click', function() {
        if (input) input.value = '';
        if (year) year.value = '';
        if (type) type.value = '';
        apply();
      });
    }
    apply();
  }

  function attachPlayer(src) {
    var video = document.getElementById('moviePlayer');
    var cover = document.getElementById('playButton');
    if (!video || !src) return;
    var loaded = false;
    var hls = null;

    function load() {
      if (loaded) return;
      loaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }
    }

    function play() {
      load();
      if (cover) cover.classList.add('is-hidden');
      video.setAttribute('controls', 'controls');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') promise.catch(function() {});
    }

    if (cover) cover.addEventListener('click', play);
    video.addEventListener('click', function() {
      if (video.paused) play();
    });
    window.addEventListener('beforeunload', function() {
      if (hls) hls.destroy();
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    initMenu();
    initHero();
    initHeroSearch();
    initFilters();
  });

  window.MovieSite = {
    initPlayer: attachPlayer
  };
})();
