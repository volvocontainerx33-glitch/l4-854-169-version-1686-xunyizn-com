(function () {
  function loadVideo(player) {
    var video = player.querySelector('video');
    if (!video || video.dataset.ready === 'true') {
      return Promise.resolve(video);
    }

    var stream = video.getAttribute('data-stream');
    video.dataset.ready = 'true';

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      player.classList.add('is-ready');
      return Promise.resolve(video);
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      player.hls = hls;
      player.classList.add('is-ready');
      return Promise.resolve(video);
    }

    player.classList.add('is-ready');
    return Promise.resolve(video);
  }

  function play(player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    loadVideo(player).then(function () {
      if (!video) {
        return;
      }
      var result = video.play();
      if (result && typeof result.then === 'function') {
        result.catch(function () {});
      }
      player.classList.add('is-playing');
      if (button) {
        button.classList.add('is-hidden');
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');

    if (button) {
      button.addEventListener('click', function () {
        play(player);
      });
    }

    if (video) {
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        player.classList.remove('is-playing');
      });
      video.addEventListener('click', function () {
        if (video.paused) {
          play(player);
        }
      });
    }
  });
})();
