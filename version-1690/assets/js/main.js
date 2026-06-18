(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    setInterval(function () {
      showSlide(current + 1);
    }, 5600);
  }

  function withRoot(path) {
    var root = document.body.getAttribute('data-root') || './';
    return root + String(path || '').replace(/^\.\//, '');
  }

  function resultItem(item) {
    return [
      '<a class="flex gap-3 p-3 hover:bg-gray-800 transition-colors" href="' + withRoot(item.url) + '">',
      '<img class="w-14 h-20 object-cover rounded-lg flex-shrink-0" src="' + withRoot(item.cover) + '" alt="' + item.title + '">',
      '<span class="min-w-0">',
      '<strong class="block text-white line-clamp-1">' + item.title + '</strong>',
      '<small class="block text-gray-400 line-clamp-1">' + item.year + ' · ' + item.region + ' · ' + item.genre + '</small>',
      '</span>',
      '</a>'
    ].join('');
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-site-search]')).forEach(function (searchInput) {
    var box = searchInput.parentElement || document;
    var searchPanel = box.querySelector('[data-search-panel]');

    if (!searchPanel || !Array.isArray(window.siteSearchData)) {
      return;
    }

    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();

      if (!q) {
        searchPanel.classList.remove('is-open');
        searchPanel.innerHTML = '';
        return;
      }

      var results = window.siteSearchData.filter(function (item) {
        return [item.title, item.region, item.genre, item.year].join(' ').toLowerCase().indexOf(q) !== -1;
      }).slice(0, 12);

      searchPanel.innerHTML = results.length ? results.map(resultItem).join('') : '<div class="p-4 text-sm text-gray-400">未找到相关内容</div>';
      searchPanel.classList.add('is-open');
    });

    document.addEventListener('click', function (event) {
      if (!searchPanel.contains(event.target) && event.target !== searchInput) {
        searchPanel.classList.remove('is-open');
      }
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-page-filter]')).forEach(function (input) {
    var scope = document.querySelector(input.getAttribute('data-page-filter')) || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card-search]'));

    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();

      cards.forEach(function (card) {
        var text = card.getAttribute('data-card-search').toLowerCase();
        card.classList.toggle('page-filter-hidden', q && text.indexOf(q) === -1);
      });
    });
  });
})();
