window.BassoonRegistry = window.BassoonRegistry || {};

HTMLWidgets.widget({
  name: 'bassoonscope',
  type: 'output',

  factory: function(el, width, height) {
    el.innerHTML = `<canvas class="bassoon-scope"></canvas>`;
    const canvas = el.querySelector('canvas');
    const ctx2d = canvas.getContext('2d');

    function getThemeColors() {
      const styles = getComputedStyle(canvas);
      return {
        bg: styles.getPropertyValue('--scope-bg').trim() || '#14181f',
        grid: styles.getPropertyValue('--scope-grid').trim() || '#2a3240',
        wave: styles.getPropertyValue('--scope-wave').trim() || '#4ade80',
        lineWidth: parseFloat(styles.getPropertyValue('--scope-line-width')) || 1.5
      };
    }
    let theme = getThemeColors();
    
    let targetPlayerId = null;
    let targetChannel = null;
    let analyser = null;
    let dataArray = null;
    let animId = null;

    function connectAnalyser() {
      const entry = window.BassoonRegistry[targetPlayerId];
      if (!entry || !entry.audio || !entry.audio.context) return false;

      const audioCtx = entry.audio.context;
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      // 1. Float32Array prevents byte-clamping on loud peaks
      dataArray = new Float32Array(analyser.frequencyBinCount);

      if (typeof targetChannel === 'number' && entry.audio.filterChains[targetChannel]) {
        entry.audio.filterChains[targetChannel].output().connect(analyser);
      } else {
        entry.audio.cutOffVolume.connect(analyser);
      }
      return true;
    }

    function draw() {
      animId = requestAnimationFrame(draw);
      const w = canvas.width;
      const h = canvas.height;

      // Clear background
      ctx2d.fillStyle = theme.bg;
      ctx2d.fillRect(0, 0, w, h);

      // Center zero-line
      ctx2d.strokeStyle = theme.grid;
      ctx2d.lineWidth = 1;
      ctx2d.beginPath();
      ctx2d.moveTo(0, h / 2);
      ctx2d.lineTo(w, h / 2);
      ctx2d.stroke();

      if (!analyser && !connectAnalyser()) return;

      const entry = window.BassoonRegistry[targetPlayerId];
      if (!entry || entry.audio.context.state !== 'running') return;

      // 2. Read floating-point waveform samples
      analyser.getFloatTimeDomainData(dataArray);

      // 3. Snap to first rising zero-crossing so the wave stays steady
      let startIndex = 0;
      for (let i = 1; i < dataArray.length / 2; i++) {
        if (dataArray[i - 1] < 0 && dataArray[i] >= 0) {
          startIndex = i;
          break;
        }
      }

      ctx2d.lineWidth = theme.lineWidth;
      ctx2d.strokeStyle = theme.wave;
      ctx2d.beginPath();

      const visibleSamples = Math.floor(dataArray.length / 2);
      const sliceWidth = w / visibleSamples;
      const verticalScale = 0.5; // Uses 50% of canvas height for clean headroom
      let x = 0;

      for (let i = 0; i < visibleSamples; i++) {
        const sample = dataArray[startIndex + i];
        const y = (h / 2) - (sample * (h / 2) * verticalScale);
        if (i === 0) {
          ctx2d.moveTo(x, y);
        } else {
          ctx2d.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx2d.stroke();
    }

    window.addEventListener('bassoon:ready', function(e) {
      if (e.detail.playerId === targetPlayerId) {
        analyser = null;
        connectAnalyser();
      }
    });

    return {
      renderValue: function(x) {
        targetPlayerId = x.playerId;
        targetChannel = typeof x.channel === 'number' ? x.channel - 1 : null;
        analyser = null;

        canvas.width = el.clientWidth || width || 200;
        canvas.height = el.clientHeight || height || 60;

        if (!animId) draw();
      },
      resize: function(newWidth, newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
      }
    };
  }
});
