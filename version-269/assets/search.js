(function () {
  var form = document.getElementById('search-form');
  var input = document.getElementById('search-input');
  var grid = document.getElementById('search-results');
  var empty = document.querySelector('.empty-state');
  var movies = window.SEARCH_MOVIES || [];

  function card(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card">',
      '<a href="' + escapeHtml(movie.url) + '" class="movie-card-link" aria-label="' + escapeHtml(movie.title) + '">',
      '<div class="movie-poster">',
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<div class="poster-mask"></div>',
      '<div class="poster-region">' + escapeHtml(movie.region) + '</div>',
      '<div class="poster-genre">' + escapeHtml(movie.genre) + '</div>',
      '</div>',
      '<div class="movie-info">',
      '<h3>' + escapeHtml(movie.title) + '</h3>',
      '<p>' + escapeHtml(movie.oneLine) + '</p>',
      '<div class="movie-tags">' + tags + '</div>',
      '<div class="movie-meta"><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.year) + '</span></div>',
      '</div>',
      '</a>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function render(query) {
    var q = String(query || '').trim().toLowerCase();
    var results = movies.filter(function (movie) {
      if (!q) {
        return true;
      }

      var haystack = [
        movie.title,
        movie.year,
        movie.type,
        movie.region,
        movie.genre,
        (movie.tags || []).join(' '),
        movie.oneLine
      ].join(' ').toLowerCase();

      return haystack.indexOf(q) !== -1;
    }).slice(0, 120);

    grid.innerHTML = results.map(card).join('');

    if (empty) {
      empty.classList.toggle('show', results.length === 0);
    }
  }

  function currentQuery() {
    var params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  if (input) {
    input.value = currentQuery();
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      render(input.value);
      var params = new URLSearchParams(window.location.search);
      params.set('q', input.value);
      window.history.replaceState(null, '', 'search.html?' + params.toString());
    });

    input.addEventListener('input', function () {
      render(input.value);
    });
  }

  render(currentQuery());
})();
