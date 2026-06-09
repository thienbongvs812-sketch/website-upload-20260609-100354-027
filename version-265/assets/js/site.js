(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector(".nav-toggle");
        var mobileNav = document.querySelector(".mobile-nav");
        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var prev = document.querySelector(".hero-prev");
        var next = document.querySelector(".hero-next");
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, idx) {
                slide.classList.toggle("active", idx === current);
            });
            dots.forEach(function (dot, idx) {
                dot.classList.toggle("active", idx === current);
            });
        }

        function startHero() {
            if (timer || slides.length < 2) {
                return;
            }
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        function restartHero() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
            startHero();
        }

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(current - 1);
                restartHero();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(current + 1);
                restartHero();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
                restartHero();
            });
        });

        startHero();

        var searchInput = document.querySelector(".catalog-search");
        var yearSelect = document.querySelector(".catalog-select");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .rank-item"));
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");

        if (query && searchInput) {
            searchInput.value = query;
        }

        function matchYear(year, filter) {
            var value = parseInt(year, 10);
            if (!filter) {
                return true;
            }
            if (filter === "2025") {
                return value >= 2025;
            }
            if (filter === "2020") {
                return value >= 2020 && value < 2025;
            }
            if (filter === "2010") {
                return value >= 2010 && value < 2020;
            }
            if (filter === "2000") {
                return value >= 2000 && value < 2010;
            }
            if (filter === "1990") {
                return value < 2000;
            }
            return true;
        }

        function applyFilters() {
            if (!cards.length) {
                return;
            }
            var q = searchInput ? searchInput.value.trim().toLowerCase() : "";
            var yearFilter = yearSelect ? yearSelect.value : "";
            cards.forEach(function (card) {
                var text = [
                    card.getAttribute("data-title") || "",
                    card.getAttribute("data-tags") || "",
                    card.getAttribute("data-genre") || "",
                    card.getAttribute("data-region") || "",
                    card.getAttribute("data-type") || "",
                    card.getAttribute("data-year") || ""
                ].join(" ").toLowerCase();
                var okText = !q || text.indexOf(q) !== -1;
                var okYear = matchYear(card.getAttribute("data-year") || "", yearFilter);
                card.hidden = !(okText && okYear);
            });
        }

        if (searchInput) {
            searchInput.addEventListener("input", applyFilters);
        }

        if (yearSelect) {
            yearSelect.addEventListener("change", applyFilters);
        }

        applyFilters();
    });
})();
