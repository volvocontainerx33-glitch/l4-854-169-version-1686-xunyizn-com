(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var slider = document.querySelector("[data-hero]");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    function auto() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        auto();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        auto();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        auto();
      });
    }

    show(0);
    auto();
  }

  function setupFilter() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));
    if (!inputs.length) {
      return;
    }
    inputs.forEach(function (input) {
      var scope = input.closest("[data-filter-scope]") || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-card]"));
      var empty = scope.querySelector("[data-empty-state]");
      input.addEventListener("input", function () {
        var value = input.value.trim().toLowerCase();
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = ((card.getAttribute("data-title") || "") + " " + (card.getAttribute("data-meta") || "")).toLowerCase();
          var match = haystack.indexOf(value) !== -1;
          card.style.display = match ? "" : "none";
          if (match) {
            visible += 1;
          }
        });
        if (empty) {
          empty.style.display = visible ? "none" : "block";
        }
      });
    });
  }

  function createHls(video, source, onReady) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      onReady();
      return;
    }
    if (window.Hls && window.Hls.isSupported && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(source);
      hls.attachMedia(video);
      if (window.Hls.Events && window.Hls.Events.MANIFEST_PARSED) {
        hls.on(window.Hls.Events.MANIFEST_PARSED, onReady);
      } else {
        video.addEventListener("loadedmetadata", onReady, { once: true });
      }
      video._hls = hls;
      return;
    }
    video.src = source;
    onReady();
  }

  window.bindMoviePlayer = function (config) {
    var video = document.getElementById(config.videoId);
    var overlay = document.getElementById(config.overlayId);
    var started = false;
    if (!video) {
      return;
    }

    function start() {
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      if (started) {
        video.play().catch(function () {});
        return;
      }
      started = true;
      createHls(video, config.source, function () {
        video.play().catch(function () {});
      });
    }

    if (overlay) {
      overlay.addEventListener("click", start);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
  };

  ready(function () {
    setupMenu();
    setupHero();
    setupFilter();
  });
})();
