(function () {
  var menuButton = document.querySelector("[data-menu-button]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function setSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        setSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        setSlide(current + 1);
      }, 5200);
    }
  }

  function filterCards(input) {
    var query = (input.value || "").trim().toLowerCase();
    var section = input.closest("section") || document;
    var cards = Array.prototype.slice.call(section.querySelectorAll(".js-movie-card"));

    cards.forEach(function (card) {
      var haystack = card.getAttribute("data-search") || "";
      card.classList.toggle("is-hidden-card", query && haystack.indexOf(query) === -1);
    });
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-page-filter]")).forEach(function (input) {
    input.addEventListener("input", function () {
      filterCards(input);
    });
  });

  var params = new URLSearchParams(window.location.search);
  var searchValue = params.get("q") || "";
  var searchInput = document.querySelector("[data-search-input]");
  var searchTitle = document.querySelector("[data-search-title]");
  var searchEmpty = document.querySelector("[data-search-empty]");

  if (searchInput) {
    searchInput.value = searchValue;
    var cards = Array.prototype.slice.call(document.querySelectorAll(".js-movie-card"));
    var normalized = searchValue.trim().toLowerCase();
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = card.getAttribute("data-search") || "";
      var matched = !normalized || haystack.indexOf(normalized) !== -1;
      card.classList.toggle("is-hidden-card", !matched);
      if (matched) {
        visible += 1;
      }
    });

    if (searchTitle && normalized) {
      searchTitle.textContent = "关键词：“" + searchValue + "”";
    }

    if (searchEmpty) {
      searchEmpty.classList.toggle("is-visible", visible === 0);
    }
  }

  function startPlayer(container) {
    var video = container.querySelector("video[data-hls]");
    var cover = container.querySelector(".player-cover");

    if (!video) {
      return;
    }

    var url = video.getAttribute("data-hls");

    if (!video.dataset.ready) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        video._hlsPlayer = hls;
      } else {
        video.src = url;
      }

      video.dataset.ready = "true";
    }

    if (cover) {
      cover.classList.add("is-hidden");
    }

    var promise = video.play();

    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(function (container) {
    var cover = container.querySelector(".player-cover");
    var video = container.querySelector("video[data-hls]");

    if (cover) {
      cover.addEventListener("click", function () {
        startPlayer(container);
      });
    }

    if (video) {
      video.addEventListener("click", function () {
        startPlayer(container);
      });
    }
  });
})();
