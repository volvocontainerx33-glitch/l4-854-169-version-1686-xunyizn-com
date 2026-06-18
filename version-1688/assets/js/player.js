function initPlayer(streamUrl) {
  const video = document.getElementById('movie-video');
  const button = document.getElementById('player-start');
  const message = document.getElementById('player-message');
  let attached = false;
  let hlsInstance = null;

  if (!video || !button || !streamUrl) {
    return;
  }

  function setMessage(text) {
    if (message) {
      message.textContent = text || '';
    }
  }

  function attachStream() {
    if (attached) {
      return;
    }
    attached = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          setMessage('播放暂时不稳定，请稍后重试');
          hlsInstance.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          setMessage('正在恢复播放');
          hlsInstance.recoverMediaError();
        } else {
          setMessage('播放暂时不可用，请稍后重试');
          hlsInstance.destroy();
        }
      });
    } else {
      setMessage('播放暂时不可用，请稍后重试');
    }
  }

  function beginPlay() {
    attachStream();
    button.classList.add('is-hidden');
    const result = video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(function () {
        button.classList.remove('is-hidden');
        setMessage('点击播放按钮开始观看');
      });
    }
  }

  button.addEventListener('click', beginPlay);
  video.addEventListener('click', function () {
    if (video.paused) {
      beginPlay();
    }
  });
  video.addEventListener('play', function () {
    button.classList.add('is-hidden');
    setMessage('');
  });
  video.addEventListener('pause', function () {
    if (!video.ended) {
      button.classList.remove('is-hidden');
    }
  });
  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
