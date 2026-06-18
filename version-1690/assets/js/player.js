function initMoviePlayer(src) {
  var video = document.querySelector('[data-player]');
  var cover = document.querySelector('[data-player-cover]');
  var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-play-trigger]'));
  var hls;
  var loaded = false;

  if (!video) {
    return;
  }

  function loadVideo() {
    if (loaded) {
      return;
    }

    loaded = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      return;
    }

    video.src = src;
  }

  function playVideo() {
    loadVideo();

    if (cover) {
      cover.classList.add('player-ready');
    }

    video.setAttribute('controls', 'controls');
    var promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', playVideo);
  });

  if (cover) {
    cover.addEventListener('click', playVideo);
  }

  video.addEventListener('click', function () {
    if (!loaded) {
      playVideo();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
}
