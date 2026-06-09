(function () {
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  var menuButton = $('.menu-toggle');
  var mobilePanel = $('#mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      var isOpen = mobilePanel.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.textContent = isOpen ? '×' : '☰';
    });
  }

  var hero = $('.hero');

  if (hero) {
    var slides = $all('.hero-slide', hero);
    var dots = $all('.hero-dots button', hero);
    var current = 0;
    var intervalId = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      if (intervalId) {
        window.clearInterval(intervalId);
      }

      intervalId = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    var prev = $('.hero-arrow.prev', hero);
    var next = $('.hero-arrow.next', hero);

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });

    show(0);
    start();
  }

  var filterPanel = $('.filters');

  if (filterPanel) {
    var searchInput = $('[data-filter="search"]', filterPanel);
    var typeSelect = $('[data-filter="type"]', filterPanel);
    var yearSelect = $('[data-filter="year"]', filterPanel);
    var cards = $all('.movie-card[data-title]');
    var empty = $('.empty-state');

    function filterCards() {
      var text = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var type = typeSelect ? typeSelect.value : '';
      var year = yearSelect ? yearSelect.value : '';
      var shown = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-genre') || '',
          card.getAttribute('data-tags') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-type') || ''
        ].join(' ').toLowerCase();
        var okText = !text || haystack.indexOf(text) !== -1;
        var okType = !type || card.getAttribute('data-type') === type;
        var okYear = !year || card.getAttribute('data-year') === year;
        var visible = okText && okType && okYear;

        card.style.display = visible ? '' : 'none';

        if (visible) {
          shown += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', shown === 0);
      }
    }

    [searchInput, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', filterCards);
        control.addEventListener('change', filterCards);
      }
    });

    filterCards();
  }
})();
