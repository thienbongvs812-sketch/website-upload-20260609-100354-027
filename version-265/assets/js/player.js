function initMoviePlayer(mediaUrl) {
    var video = document.querySelector("[data-player-video]");
    var cover = document.querySelector("[data-player-cover]");
    var button = document.querySelector("[data-player-button]");
    var hls = null;
    var loaded = false;

    if (!video || !mediaUrl) {
        return;
    }

    function hideCover() {
        if (cover) {
            cover.classList.add("is-hidden");
        }
    }

    function loadMedia() {
        if (loaded) {
            return;
        }
        loaded = true;
        video.controls = true;
        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(mediaUrl);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(function () {});
            });
            hls.on(window.Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }
                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                    hls.startLoad();
                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError();
                } else {
                    hls.destroy();
                }
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = mediaUrl;
        } else {
            video.src = mediaUrl;
        }
    }

    function startPlayback() {
        hideCover();
        loadMedia();
        video.play().catch(function () {});
    }

    if (button) {
        button.addEventListener("click", startPlayback);
    }

    if (cover) {
        cover.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
        if (video.paused) {
            startPlayback();
        }
    });

    window.addEventListener("pagehide", function () {
        if (hls) {
            hls.destroy();
            hls = null;
        }
    });
}
