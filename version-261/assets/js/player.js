import { H as Hls } from './hls-dru42stk.js';

function setMessage(player, message) {
    var messageNode = player.querySelector('[data-player-message]');
    if (messageNode) {
        messageNode.textContent = message;
    }
}

function startPlayer(player) {
    var video = player.querySelector('video[data-src]');
    var button = player.querySelector('[data-play-button]');
    if (!video) {
        return;
    }

    var source = video.getAttribute('data-src');
    if (!source) {
        setMessage(player, '没有找到播放源。');
        return;
    }

    player.classList.add('is-loading');
    setMessage(player, '正在加载高清播放源...');

    function playVideo() {
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                setMessage(player, '播放源已加载，请再次点击视频播放。');
            });
        }
        player.classList.remove('is-loading');
        player.classList.add('is-playing');
        if (button) {
            button.setAttribute('aria-hidden', 'true');
        }
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', playVideo, { once: true });
        video.load();
        return;
    }

    if (Hls && Hls.isSupported()) {
        var hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true
        });
        player._hls = hls;
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            playVideo();
        });
        hls.on(Hls.Events.ERROR, function (eventName, data) {
            if (data && data.fatal) {
                setMessage(player, '播放源加载失败，请稍后重试。');
                player.classList.remove('is-loading');
            }
        });
        return;
    }

    video.src = source;
    video.load();
    playVideo();
}

document.querySelectorAll('[data-player]').forEach(function (player) {
    var button = player.querySelector('[data-play-button]');
    if (button) {
        button.addEventListener('click', function () {
            startPlayer(player);
        }, { once: true });
    }
});
