(function () {
  function beginPlayback(video, cover, sourceUrl) {
    var playPromise;

    function revealVideo() {
      cover.classList.add("is-hidden");
      video.setAttribute("controls", "controls");
    }

    function playNow() {
      revealVideo();
      playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          cover.classList.remove("is-hidden");
        });
      }
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      if (video.getAttribute("src") !== sourceUrl) {
        video.setAttribute("src", sourceUrl);
      }
      playNow();
      return;
    }

    if (typeof Hls !== "undefined" && Hls.isSupported()) {
      if (video.hlsPlayer) {
        video.hlsPlayer.destroy();
      }
      video.hlsPlayer = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      video.hlsPlayer.loadSource(sourceUrl);
      video.hlsPlayer.attachMedia(video);
      video.hlsPlayer.on(Hls.Events.MANIFEST_PARSED, function () {
        playNow();
      });
      revealVideo();
      return;
    }

    video.setAttribute("src", sourceUrl);
    playNow();
  }

  window.initMoviePlayer = function (videoId, coverId, buttonId, sourceUrl) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    var button = document.getElementById(buttonId);
    if (!video || !cover || !sourceUrl) {
      return;
    }

    cover.addEventListener("click", function () {
      beginPlayback(video, cover, sourceUrl);
    });

    if (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        beginPlayback(video, cover, sourceUrl);
      });
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        beginPlayback(video, cover, sourceUrl);
      }
    });
  };
})();
