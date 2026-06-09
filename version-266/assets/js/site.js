(function () {
    const toggle = document.querySelector('[data-mobile-toggle]');
    const panel = document.querySelector('[data-mobile-panel]');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('open');
        });
    }

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    let activeSlide = slides.findIndex(function (slide) {
        return slide.classList.contains('active');
    });

    if (activeSlide < 0) {
        activeSlide = 0;
    }

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === activeSlide);
        });
    }

    const previous = document.querySelector('[data-hero-prev]');
    const next = document.querySelector('[data-hero-next]');

    if (previous) {
        previous.addEventListener('click', function () {
            showSlide(activeSlide - 1);
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            showSlide(activeSlide + 1);
        });
    }

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(activeSlide + 1);
        }, 5200);
    }

    document.querySelectorAll('[data-site-search]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const input = form.querySelector('input');
            const query = input ? input.value.trim() : '';
            const url = query ? './search.html?q=' + encodeURIComponent(query) : './search.html';
            window.location.href = url;
        });
    });

    const filterList = document.querySelector('[data-filter-list]');

    if (filterList) {
        const cards = Array.from(filterList.querySelectorAll('[data-movie-card]'));
        const input = document.querySelector('[data-filter-input]');
        const typeSelect = document.querySelector('[data-filter-type]');
        const regionSelect = document.querySelector('[data-filter-region]');
        const yearSelect = document.querySelector('[data-filter-year]');
        const emptyState = document.querySelector('[data-empty-state]');
        const params = new URLSearchParams(window.location.search);
        const initialQuery = params.get('q') || '';

        if (input && initialQuery) {
            input.value = initialQuery;
        }

        function includesText(value, query) {
            return String(value || '').toLowerCase().indexOf(query) !== -1;
        }

        function applyFilters() {
            const query = input ? input.value.trim().toLowerCase() : '';
            const typeValue = typeSelect ? typeSelect.value : '';
            const regionValue = regionSelect ? regionSelect.value : '';
            const yearValue = yearSelect ? yearSelect.value : '';
            let visible = 0;

            cards.forEach(function (card) {
                const content = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags'),
                    card.textContent
                ].join(' ').toLowerCase();

                const matchedQuery = !query || includesText(content, query);
                const matchedType = !typeValue || includesText(card.getAttribute('data-type'), typeValue);
                const matchedRegion = !regionValue || includesText(card.getAttribute('data-region'), regionValue);
                const matchedYear = !yearValue || String(card.getAttribute('data-year') || '').slice(0, 3) === yearValue;
                const show = matchedQuery && matchedType && matchedRegion && matchedYear;

                card.style.display = show ? '' : 'none';
                if (show) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle('show', visible === 0);
            }
        }

        [input, typeSelect, regionSelect, yearSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });

        applyFilters();
    }
})();
