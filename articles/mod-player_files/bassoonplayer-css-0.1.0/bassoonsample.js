window.BassoonRegistry = window.BassoonRegistry || {};

HTMLWidgets.widget({
  name: 'bassoonsample',
  type: 'output',

  factory: function(el, width, height) {
    el.innerHTML = `<canvas class="bassoon-sample"></canvas>`;
    const canvas = el.querySelector('canvas');
    const ctx2d = canvas.getContext('2d');

    function getThemeColors() {
      const styles = getComputedStyle(canvas);
      return {
        bg: styles.getPropertyValue('--sample-bg').trim() || '#14181f',
        grid: styles.getPropertyValue('--sample-grid').trim() || '#2a3240',
        wave: styles.getPropertyValue('--sample-wave').trim() || '#4ade80',
        lineWidth: parseFloat(styles.getPropertyValue('--sample-line-width')) || 1.5
      };
    }
    let theme = getThemeColors();
    let targetPlayerId = null;
    let targetSample = null;
    let animId = null;

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

      const tkr = window.BassoonRegistry[targetPlayerId]?.tracker;
      if (!tkr) return;
      const samp = tkr?.getInstrument(targetSample)?.sample;
      if (!samp) return;
      ctx2d.lineWidth = theme.lineWidth;
      ctx2d.strokeStyle = theme.wave;
      ctx2d.beginPath();
      const sliceWidth = w/samp.length;
      let x = 0;
      for (let i = 0; i < samp.length; i++) {
        const sample = samp.data[i];
        const y = (h / 2) - sample * (h / 2);
        if (i === 0) {
          ctx2d.moveTo(x, y);
        } else {
          ctx2d.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx2d.stroke();
    }

    return {
      renderValue: function(x) {
        targetPlayerId = x.playerId;
        targetSample = typeof x.sample === 'number' ? x.sample - 1 : null;
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
