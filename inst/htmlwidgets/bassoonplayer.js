window.BassoonRegistry = window.BassoonRegistry || {};

(function() {
  function registerBassoonHandler() {
    if (window.Shiny && Shiny.addCustomMessageHandler) {
      Shiny.addCustomMessageHandler('get_bassoon_position', function(message) {
        console.log("Handler triggered with message:", message);
        
        const tkr = window.BassoonRegistry[message.id]?.tracker;

        if (tkr) {
          var stat = tkr.getStateAtTime(tkr.audio.context.currentTime);
          Shiny.setInputValue(
            message.id + '_position',
            {
              pattern_pos: stat.patternPos,
              song_pos: stat.songPos
            },
            { priority: "event" }
          );
        } else {
          console.warn("Player instance not found on element:", message.id);
        }
      });
    }
  }

  if (window.Shiny) {
    registerBassoonHandler();
  } else {
    document.addEventListener('shiny:connected', registerBassoonHandler);
  }
})();

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
    let bpclass = 'bassoon-btn btn btn-sm';
    
    el.innerHTML = `
      <div class="bassoon-player">
        <button type="button" class="bp-play ${bpclass}">${labels.play}</button>
        <button type="button" class="bp-stop ${bpclass}">${labels.stop}</button>
        <span class="bassoon-title">Ready</span>
      </div>
    `;

    const playBtn = el.querySelector('.bp-play');
    const stopBtn = el.querySelector('.bp-stop');
    const titleSpan = el.querySelector('.bassoon-title');

    function syncSamplesToShiny() {
      if (!window.Shiny) return;
    
      const sendInstruments = () => {
        const tkr = window.BassoonRegistry[playerId]?.tracker;
        if (!tkr) return;
        const sng = tkr.getSong();
        if (!sng || !sng.instruments) return;
    
        const cleanInstruments = sng.instruments.map((inst, idx) => ({
          index: idx,
          name: inst.name || '',
          volume: inst.volume,
          finetune: inst.finetune,
          sampleLength: inst.sample ? inst.sample.length : 0
        }));
    
        Shiny.setInputValue(playerId + '_instruments', JSON.stringify(cleanInstruments));
      };
    
      if (window.Shiny && Shiny.shinyapp && Shiny.shinyapp.$socket) {
        sendInstruments();
      } else {
        $(document).one('shiny:sessioninitialized', sendInstruments);
      }
    }

    function registerPlayerReady() {
      window.BassoonRegistry[playerId] = {
        tracker: BassoonTracker,
        audio: BassoonTracker.audio,
        isLoaded: true
      };
      window.dispatchEvent(new CustomEvent('bassoon:ready', { detail: { playerId } }));
    }

    async function ensureLoaded() {
      if (!moduleDataUrl) return false;
    
      if (typeof BassoonTracker.init === 'function' && !BassoonTracker.audio?.context) {
        await BassoonTracker.init();
      }
    
      await BassoonTracker.load(moduleDataUrl);
      
      const song = BassoonTracker.getSong();
      if (song && song.title) {
        titleSpan.textContent = song.title;
      }
      isLoaded = true;
      window.BassoonActivePlayer = playerId;
      registerPlayerReady();
      syncSamplesToShiny();
      return true;
    }

    playBtn.addEventListener('click', async function() {
      if (!moduleDataUrl) return;

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
        if (document.readyState === 'complete') {
          await ensureLoaded();
        } else {
          window.addEventListener('load', () => ensureLoaded(), { once: true });
        }
        moduleDataUrl = x.data;
        isLoaded = false;
        titleSpan.textContent = x.filename || 'Module loaded';
        
        labels.play = x.labels.play || 'Play';
        labels.pause = x.labels.pause || 'Pause';
        labels.stop = x.labels.stop || 'Stop';
        bpclass = x.class || 'bassoon-btn btn btn-sm';

        playBtn.textContent = labels.play;
        stopBtn.textContent = labels.stop;
        playBtn.className = bpclass;
        stopBtn.className = bpclass;

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
