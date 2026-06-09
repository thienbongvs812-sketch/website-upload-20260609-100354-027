(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var button = document.querySelector("[data-menu-button]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("open");
      document.body.classList.toggle("menu-open", nav.classList.contains("open"));
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var previous = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
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

    function start() {
      stop();
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (previous) {
      previous.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function textOf(card, field) {
    return (card.getAttribute("data-" + field) || "").toLowerCase();
  }

  function setupFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
    panels.forEach(function (panel) {
      var input = panel.querySelector("[data-filter-input]");
      var selects = Array.prototype.slice.call(panel.querySelectorAll("[data-filter-field]"));
      var scope = panel.parentElement || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));

      function apply() {
        var query = input ? input.value.trim().toLowerCase() : "";
        var filters = selects.map(function (select) {
          return {
            field: select.getAttribute("data-filter-field"),
            value: select.value.trim().toLowerCase()
          };
        });
        cards.forEach(function (card) {
          var haystack = ["title", "year", "region", "type", "genre", "tags"].map(function (field) {
            return textOf(card, field);
          }).join(" ");
          var matchesQuery = !query || haystack.indexOf(query) !== -1;
          var matchesFilters = filters.every(function (filter) {
            if (!filter.value) {
              return true;
            }
            return textOf(card, filter.field).indexOf(filter.value) !== -1;
          });
          card.classList.toggle("hidden-by-filter", !(matchesQuery && matchesFilters));
        });
      }

      if (input) {
        input.addEventListener("input", apply);
      }
      selects.forEach(function (select) {
        select.addEventListener("change", apply);
      });
      apply();
    });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function resultCard(movie) {
    return [
      "<article class=\"movie-card\">",
      "<a class=\"poster-wrap\" href=\"" + escapeHtml(movie.url) + "\" aria-label=\"" + escapeHtml(movie.title) + "\">",
      "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
      "<span class=\"poster-play\">▶</span>",
      "</a>",
      "<div class=\"movie-card-body\">",
      "<div class=\"movie-meta-row\"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.type) + "</span><span>" + escapeHtml(movie.region) + "</span></div>",
      "<h3><a href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h3>",
      "<p>" + escapeHtml(movie.oneLine) + "</p>",
      "<div class=\"tag-row\"><span>" + escapeHtml(movie.category) + "</span></div>",
      "</div>",
      "</article>"
    ].join("");
  }

  function setupSearchPage() {
    var form = document.querySelector("[data-search-form]");
    var input = document.querySelector("[data-search-input]");
    var results = document.querySelector("[data-search-results]");
    if (!form || !input || !results || typeof MOVIE_INDEX === "undefined") {
      return;
    }

    function render() {
      var query = input.value.trim().toLowerCase();
      var list = MOVIE_INDEX.filter(function (movie) {
        var haystack = [movie.title, movie.year, movie.type, movie.region, movie.genre, movie.tags, movie.category, movie.oneLine].join(" ").toLowerCase();
        return !query || haystack.indexOf(query) !== -1;
      }).slice(0, 96);

      if (!list.length) {
        results.innerHTML = "<div class=\"empty-result\">没有找到匹配的影片，请尝试更换关键词。</div>";
        return;
      }
      results.innerHTML = "<div class=\"movie-grid\">" + list.map(resultCard).join("") + "</div>";
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      render();
    });
    input.addEventListener("input", render);
    var params = new URLSearchParams(window.location.search);
    var keyword = params.get("q");
    if (keyword) {
      input.value = keyword;
    }
    render();
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupSearchPage();
  });
})();
