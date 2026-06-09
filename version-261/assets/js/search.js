(function () {
    var data = window.MOVIE_SEARCH_DATA || [];
    var form = document.querySelector('[data-search-page-form]');
    var input = form ? form.querySelector('input[name="q"]') : null;
    var results = document.querySelector('[data-search-results]');
    var summary = document.querySelector('[data-search-summary]');

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function getQuery() {
        var params = new URLSearchParams(window.location.search);
        return params.get('q') || '';
    }

    function render(items, query) {
        if (!results) {
            return;
        }
        results.innerHTML = '';
        if (summary) {
            summary.textContent = query ? '搜索 “' + query + '” ，找到 ' + items.length + ' 部影片。' : '请输入关键词搜索，默认展示热度靠前的影片。';
        }
        items.slice(0, 120).forEach(function (movie) {
            var article = document.createElement('article');
            article.className = 'movie-card';
            article.innerHTML = [
                '<a class="card-link" href="' + movie.url + '">',
                '  <figure class="poster-frame">',
                '    <img src="./' + movie.image + '" alt="' + escapeHtml(movie.title) + ' 海报" loading="lazy">',
                '    <figcaption>' + escapeHtml(movie.title) + '</figcaption>',
                '    <span class="play-pill">▶ 播放</span>',
                '  </figure>',
                '  <div class="card-body">',
                '    <div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
                '    <h3>' + escapeHtml(movie.title) + '</h3>',
                '    <p>' + escapeHtml(movie.oneLine) + '</p>',
                '    <div class="tag-row">' + movie.tags.slice(0, 3).map(function (tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join('') + '</div>',
                '  </div>',
                '</a>'
            ].join('');
            results.appendChild(article);
        });
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function search(query) {
        var keyword = normalize(query);
        if (!keyword) {
            return data.slice(0, 60);
        }
        return data.filter(function (movie) {
            return normalize(movie.searchText).indexOf(keyword) !== -1;
        });
    }

    function submit(query, updateAddress) {
        var items = search(query);
        render(items, query.trim());
        if (updateAddress) {
            var url = new URL(window.location.href);
            if (query.trim()) {
                url.searchParams.set('q', query.trim());
            } else {
                url.searchParams.delete('q');
            }
            history.replaceState(null, '', url.toString());
        }
    }

    if (input) {
        input.value = getQuery();
        input.addEventListener('input', function () {
            submit(input.value, true);
        });
    }

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            submit(input ? input.value : '', true);
        });
    }

    submit(getQuery(), false);
})();
