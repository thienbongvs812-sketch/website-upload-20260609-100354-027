(function() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var mobileMenu = document.querySelector("[data-mobile-menu]");

    if (toggle && mobileMenu) {
        toggle.addEventListener("click", function() {
            mobileMenu.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var next = hero.querySelector("[data-hero-next]");
        var prev = hero.querySelector("[data-hero-prev]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function startTimer() {
            window.clearInterval(timer);
            timer = window.setInterval(function() {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function(dot) {
            dot.addEventListener("click", function() {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                startTimer();
            });
        });
        if (next) {
            next.addEventListener("click", function() {
                show(index + 1);
                startTimer();
            });
        }
        if (prev) {
            prev.addEventListener("click", function() {
                show(index - 1);
                startTimer();
            });
        }
        show(0);
        startTimer();
    }

    var filterForm = document.querySelector("[data-filter-form]");
    var filterGrid = document.querySelector("[data-filter-grid]");
    if (filterForm && filterGrid) {
        var cards = Array.prototype.slice.call(filterGrid.querySelectorAll("[data-title]"));
        var keyword = filterForm.querySelector("[data-filter-keyword]");
        var year = filterForm.querySelector("[data-filter-year]");
        var region = filterForm.querySelector("[data-filter-region]");
        var empty = document.querySelector("[data-filter-empty]");

        function applyFilter() {
            var q = keyword ? keyword.value.trim().toLowerCase() : "";
            var y = year ? year.value : "";
            var r = region ? region.value : "";
            var visible = 0;

            cards.forEach(function(card) {
                var title = (card.getAttribute("data-title") || "").toLowerCase();
                var cardYear = card.getAttribute("data-year") || "";
                var cardRegion = card.getAttribute("data-region") || "";
                var ok = true;

                if (q && title.indexOf(q) === -1) {
                    ok = false;
                }
                if (y && cardYear !== y) {
                    ok = false;
                }
                if (r && cardRegion !== r) {
                    ok = false;
                }
                card.hidden = !ok;
                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        filterForm.addEventListener("input", applyFilter);
        filterForm.addEventListener("change", applyFilter);
        filterForm.addEventListener("reset", function() {
            window.setTimeout(applyFilter, 0);
        });
    }

    var searchInput = document.getElementById("search-page-input");
    var searchGrid = document.getElementById("search-results");
    var searchEmpty = document.getElementById("search-empty");
    var searchTitle = document.querySelector("[data-search-title]");
    if (searchInput && searchGrid && window.SEARCH_MOVIES) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        searchInput.value = query;

        function cardTemplate(movie) {
            return [
                "<article class=\"movie-card\">",
                "<a href=\"" + movie.url + "\">",
                "<div class=\"card-cover\">",
                "<img src=\"" + movie.cover + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
                "<div class=\"cover-gradient\"></div>",
                "<span class=\"play-pill\">▶</span>",
                "<div class=\"cover-meta\"><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.year) + "</span></div>",
                "</div>",
                "<div class=\"card-body\">",
                "<span class=\"card-category\">" + escapeHtml(movie.category) + "</span>",
                "<h3>" + escapeHtml(movie.title) + "</h3>",
                "<p>" + escapeHtml(movie.desc) + "</p>",
                "<div class=\"card-meta\"><span>" + escapeHtml(movie.type) + "</span><span>" + escapeHtml(movie.genre) + "</span></div>",
                "</div>",
                "</a>",
                "</article>"
            ].join("");
        }

        function escapeHtml(value) {
            return String(value || "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\"/g, "&quot;");
        }

        function runSearch() {
            var q = searchInput.value.trim().toLowerCase();
            if (!q) {
                return;
            }
            var results = window.SEARCH_MOVIES.filter(function(movie) {
                var text = [movie.title, movie.desc, movie.category, movie.region, movie.type, movie.year, movie.genre, movie.tags].join(" ").toLowerCase();
                return text.indexOf(q) !== -1;
            }).slice(0, 120);

            searchGrid.innerHTML = results.map(cardTemplate).join("");
            if (searchTitle) {
                searchTitle.textContent = "搜索结果";
            }
            if (searchEmpty) {
                searchEmpty.hidden = results.length !== 0;
            }
        }

        if (query.trim()) {
            runSearch();
        }
    }
}());
