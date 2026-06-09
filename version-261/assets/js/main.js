(function () {
    var navToggle = document.querySelector('[data-nav-toggle]');
    var navPanel = document.querySelector('[data-nav-panel]');

    if (navToggle && navPanel) {
        navToggle.addEventListener('click', function () {
            navPanel.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-global-search]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input[name="q"]');
            var query = input ? input.value.trim() : '';
            if (!query) {
                return;
            }
            var root = document.body.getAttribute('data-root') || './';
            var target = new URL(root + 'search.html', document.baseURI);
            target.searchParams.set('q', query);
            window.location.href = target.toString();
        });
    });

    var carousel = document.querySelector('[data-hero-carousel]');
    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle('is-active', itemIndex === index);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle('is-active', itemIndex === index);
            });
        }

        function startTimer() {
            clearInterval(timer);
            timer = setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, itemIndex) {
            dot.addEventListener('click', function () {
                showSlide(itemIndex);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        showSlide(0);
        startTimer();
    }

    document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
        var list = document.querySelector('[data-card-list]');
        if (!list) {
            return;
        }
        var cards = Array.prototype.slice.call(list.querySelectorAll('[data-movie-card]'));
        var input = panel.querySelector('[data-local-search]');
        var yearSelect = panel.querySelector('[data-filter-year]');
        var regionSelect = panel.querySelector('[data-filter-region]');
        var typeSelect = panel.querySelector('[data-filter-type]');
        var count = panel.querySelector('[data-filter-count]');

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function applyFilters() {
            var keyword = normalize(input && input.value);
            var year = yearSelect ? yearSelect.value : 'all';
            var region = regionSelect ? regionSelect.value : 'all';
            var type = typeSelect ? typeSelect.value : 'all';
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute('data-search-text'));
                var ok = true;
                if (keyword && text.indexOf(keyword) === -1) {
                    ok = false;
                }
                if (year !== 'all' && card.getAttribute('data-year') !== year) {
                    ok = false;
                }
                if (region !== 'all' && card.getAttribute('data-region') !== region) {
                    ok = false;
                }
                if (type !== 'all' && card.getAttribute('data-type') !== type) {
                    ok = false;
                }
                card.hidden = !ok;
                if (ok) {
                    visible += 1;
                }
            });

            if (count) {
                count.textContent = '当前显示 ' + visible + ' / ' + cards.length + ' 部';
            }
        }

        [input, yearSelect, regionSelect, typeSelect].forEach(function (element) {
            if (element) {
                element.addEventListener('input', applyFilters);
                element.addEventListener('change', applyFilters);
            }
        });

        applyFilters();
    });
})();
