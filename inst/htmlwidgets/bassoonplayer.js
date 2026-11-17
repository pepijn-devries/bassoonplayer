window.BassoonRegistry = window.BassoonRegistry || {};

HTMLWidgets.widget({

  name: 'bassoonplayer',
  type: 'output',

  factory: function(el, width, height) {
    const playerId = el.id;
    let moduleDataUrl = null;
    let isLoaded = false;

    let labels = {
      play: 'Play',
      pause: 'Pause',
      stop: 'Stop'
    };
    
    el.innerHTML = `
      <div class="bassoon-player">
        <button type="button" class="bp-btn bp-play btn btn-sm btn-primary">${labels.play}</button>
        <button type="button" class="bp-btn bp-stop btn btn-sm btn-outline-secondary">${labels.stop}</button>
        <span class="bp-title">Ready</span>
      </div>
    `;

    const playBtn = el.querySelector('.bp-play');
    const stopBtn = el.querySelector('.bp-stop');
    const titleSpan = el.querySelector('.bp-title');

    function registerPlayerReady() {
      window.BassoonRegistry[playerId] = {
        tracker: BassoonTracker,
        audio: BassoonTracker.audio,
        isLoaded: true
      };
      // Notify any bound visualizer widgets waiting on this playerId
      window.dispatchEvent(new CustomEvent('bassoon:ready', { detail: { playerId } }));
    }

    async function ensureLoaded() {
      if (!moduleDataUrl) return false;
      await BassoonTracker.load(moduleDataUrl);
      const song = BassoonTracker.getSong();
      if (song && song.title) {
        titleSpan.textContent = song.title;
      }
      isLoaded = true;
      window.BassoonActivePlayer = playerId;
      registerPlayerReady();
      return true;
    }

    playBtn.addEventListener('click', async function() {
      if (!moduleDataUrl) return;

      // Reload if not yet loaded, or if another player widget took over the global engine
      if (!isLoaded || window.BassoonActivePlayer !== playerId) {
        await ensureLoaded();
      }

      const ctx = BassoonTracker.audio.context;

      if (!BassoonTracker.isPlaying()) {
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        BassoonTracker.play();
        playBtn.textContent = labels.pause;
      } else if (ctx.state === 'suspended') {
        await ctx.resume();
        playBtn.textContent = labels.pause;
      } else {
        await ctx.suspend();
        playBtn.textContent = labels.play;
      }
    });

    stopBtn.addEventListener('click', async function() {
      if (window.BassoonActivePlayer !== playerId) return;

      if (BassoonTracker.audio?.context?.state === 'suspended') {
        await BassoonTracker.audio.context.resume();
      }
      BassoonTracker.stop();
      BassoonTracker.setCurrentSongPosition(0);
      playBtn.textContent = labels.play;
    });

    return {
      renderValue: async function(x) {
        moduleDataUrl = x.data;
        isLoaded = false;
        titleSpan.textContent = x.filename || 'Module loaded';
        
        console.log('TODO' + x.labels.play);
        labels.play = x.labels.play || 'Play';
        labels.pause = x.labels.pause || 'Pause';
        labels.stop = x.labels.stop || 'Stop';

        playBtn.textContent = labels.play;
        stopBtn.textContent = labels.stop;
        
        if (BassoonTracker.isPlaying() && window.BassoonActivePlayer === playerId) {
          if (BassoonTracker.audio?.context?.state === 'suspended') {
            await BassoonTracker.audio.context.resume();
          }
          BassoonTracker.stop();
        }
      },

      resize: function(width, height) {
      }
    };
  }
});
