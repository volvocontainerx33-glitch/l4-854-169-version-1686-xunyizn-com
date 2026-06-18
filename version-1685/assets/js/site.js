(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');

  if (header && toggle) {
    toggle.addEventListener('click', function () {
      var opened = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  document.querySelectorAll('.poster img, .hero-bg img, .side-poster img, .rank-thumb img').forEach(function (img) {
    img.addEventListener('error', function () {
      if (img.parentElement) {
        img.parentElement.classList.add('is-empty');
      }
      img.remove();
    });
  });

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    show(0);
    restart();
  });

  document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
    var root = panel.parentElement;
    var input = panel.querySelector('[data-filter-keyword]');
    var year = panel.querySelector('[data-filter-year]');
    var region = panel.querySelector('[data-filter-region]');
    var type = panel.querySelector('[data-filter-type]');
    var category = panel.querySelector('[data-filter-category]');
    var cards = Array.prototype.slice.call(root.querySelectorAll('[data-card]'));

    function value(el) {
      return el ? el.value.trim().toLowerCase() : '';
    }

    function apply() {
      var q = value(input);
      var y = value(year);
      var r = value(region);
      var t = value(type);
      var c = value(category);

      cards.forEach(function (card) {
        var search = (card.getAttribute('data-search') || '').toLowerCase();
        var match = true;
        if (q && search.indexOf(q) === -1) {
          match = false;
        }
        if (y && String(card.getAttribute('data-year') || '').toLowerCase() !== y) {
          match = false;
        }
        if (r && String(card.getAttribute('data-region') || '').toLowerCase() !== r) {
          match = false;
        }
        if (t && String(card.getAttribute('data-type') || '').toLowerCase() !== t) {
          match = false;
        }
        if (c && String(card.getAttribute('data-category') || '').toLowerCase() !== c) {
          match = false;
        }
        card.hidden = !match;
      });
    }

    [input, year, region, type, category].forEach(function (el) {
      if (el) {
        el.addEventListener('input', apply);
        el.addEventListener('change', apply);
      }
    });
  });

  document.querySelectorAll('[data-player]').forEach(function (player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    var src = player.getAttribute('data-src');
    var hls = null;
    var started = false;

    function start() {
      if (!video || !src) {
        return;
      }

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      if (!started) {
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            maxBufferLength: 30,
            enableWorker: true
          });
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal && hls) {
              if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad();
              } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
              }
            }
          });
        } else {
          video.src = src;
          video.addEventListener('loadedmetadata', function () {
            video.play().catch(function () {});
          }, { once: true });
        }
        started = true;
      }

      video.play().catch(function () {});
    }

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!started || video.paused) {
          start();
        }
      });
    }
  });
})();
