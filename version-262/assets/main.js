(function () {
  'use strict';

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initMobileNav() {
    var button = document.querySelector('[data-mobile-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (slides.length < 2) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(parseInt(dot.getAttribute('data-hero-dot'), 10));
        start();
      });
    });

    start();
  }

  function normalizeText(text) {
    return (text || '').toString().trim().toLowerCase();
  }

  function initFilters() {
    var input = document.querySelector('[data-filter-input]');
    var list = document.querySelector('[data-filter-list]');
    if (!input || !list) {
      return;
    }
    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
    var resultCount = document.querySelector('[data-result-count]');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    if (document.body.getAttribute('data-page') === 'search' && query) {
      input.value = query;
    }

    function applyFilter() {
      var keyword = normalizeText(input.value);
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = normalizeText(card.getAttribute('data-search') + ' ' + card.getAttribute('data-title'));
        var matched = !keyword || haystack.indexOf(keyword) !== -1;
        card.classList.toggle('is-hidden-card', !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (resultCount) {
        resultCount.textContent = keyword ? '找到 ' + visible + ' 个相关内容' : '输入关键词可快速筛选片库内容';
      }
    }

    input.addEventListener('input', applyFilter);
    applyFilter();
  }

  window.setupMoviePlayer = function (sourceUrl) {
    var video = document.getElementById('movie-player');
    var overlay = document.getElementById('play-overlay');
    if (!video || !sourceUrl) {
      return;
    }
    var initialized = false;

    function attachSource() {
      if (initialized) {
        return;
      }
      initialized = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }
    }

    function playVideo() {
      attachSource();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener('click', playVideo);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });
  };

  ready(function () {
    initMobileNav();
    initHero();
    initFilters();
  });
})();
