(function () {
  function createPlayer(video, source, overlay) {
    var hls = null;
    var started = false;

    function tryPlay() {
      var promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    function start() {
      if (started) {
        tryPlay();
        return;
      }

      started = true;

      if (overlay) {
        overlay.classList.add('hidden');
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        tryPlay();
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          tryPlay();
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal || !hls) {
            return;
          }

          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
            hls = null;
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        tryPlay();
      } else {
        video.src = source;
        tryPlay();
      }
    }

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('hidden');
      }
    });

    video.addEventListener('click', function () {
      if (!started) {
        start();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    return {
      start: start,
      destroy: function () {
        if (hls) {
          hls.destroy();
          hls = null;
        }
      }
    };
  }

  window.initMoviePlayer = function (id, source) {
    var root = document.getElementById(id);

    if (!root) {
      return null;
    }

    var video = root.querySelector('video');
    var overlay = root.querySelector('.player-overlay');

    if (!video || !source) {
      return null;
    }

    return createPlayer(video, source, overlay);
  };
})();
