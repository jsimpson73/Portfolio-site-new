/* ============================================================
   ENTERTAINER.JS — Venue Schedule, Photo Gallery, Media Player
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  initVenueSchedule();
  initGalleryLightbox();
  initMediaPlayer();
});

/* ══════════════════════════════════════
   VENUE SCHEDULE — dynamic table filter & rendering
══════════════════════════════════════ */
function initVenueSchedule() {
  // Sample schedule data — replace with real dates
  var scheduleData = [
    {
      date:  '2025-07-05',
      day:   'Saturday',
      venue: 'Champ\'s on Light Street',
      city:  'Sterling, IL',
      time:  '8:00 PM – 11:00 PM',
      type:  'Karaoke KJ',
      notes: 'Weekly Karaoke Night'
    },
    {
      date:  '2025-07-12',
      day:   'Saturday',
      venue: 'Champ\'s on Light Street',
      city:  'Sterling, IL',
      time:  '8:00 PM – 11:00 PM',
      type:  'Karaoke KJ',
      notes: 'Weekly Karaoke Night'
    },
    {
      date:  '2025-07-18',
      day:   'Friday',
      venue: 'Private Event',
      city:  'Morrison, IL',
      time:  '6:00 PM – 10:00 PM',
      type:  'Wedding DJ',
      notes: 'Private Reception'
    },
    {
      date:  '2025-07-19',
      day:   'Saturday',
      venue: 'Champ\'s on Light Street',
      city:  'Sterling, IL',
      time:  '8:00 PM – 11:00 PM',
      type:  'Karaoke KJ',
      notes: 'Weekly Karaoke Night'
    },
    {
      date:  '2025-07-26',
      day:   'Saturday',
      venue: 'Outdoor Summer Fest',
      city:  'Dixon, IL',
      time:  '4:00 PM – 8:00 PM',
      type:  'Live Performance',
      notes: 'Original music + covers'
    },
    {
      date:  '2025-08-02',
      day:   'Saturday',
      venue: 'Champ\'s on Light Street',
      city:  'Sterling, IL',
      time:  '8:00 PM – 11:00 PM',
      type:  'Karaoke KJ',
      notes: 'Weekly Karaoke Night'
    },
    {
      date:  '2025-08-09',
      day:   'Saturday',
      venue: 'The Rock Venue',
      city:  'Rockford, IL',
      time:  '9:00 PM – 1:00 AM',
      type:  'Wedding DJ',
      notes: 'Wedding Reception'
    },
    {
      date:  '2025-08-16',
      day:   'Saturday',
      venue: 'Champ\'s on Light Street',
      city:  'Sterling, IL',
      time:  '8:00 PM – 11:00 PM',
      type:  'Karaoke KJ',
      notes: 'Weekly Karaoke Night'
    },
    {
      date:  '2025-08-23',
      day:   'Saturday',
      venue: 'Private Event',
      city:  'Rock Falls, IL',
      time:  '7:00 PM – 11:00 PM',
      type:  'Live Performance',
      notes: 'Birthday Celebration'
    },
    {
      date:  '2025-09-06',
      day:   'Saturday',
      venue: 'Champ\'s on Light Street',
      city:  'Sterling, IL',
      time:  '8:00 PM – 11:00 PM',
      type:  'Karaoke KJ',
      notes: 'Weekly Karaoke Night'
    }
  ];

  var tbody      = document.getElementById('schedule-tbody');
  var filterBtns = document.querySelectorAll('.schedule-filter-btn');
  var emptyMsg   = document.getElementById('schedule-empty');

  if (!tbody) return;

  function typeClass(type) {
    if (type === 'Karaoke KJ')      return 'type-karaoke';
    if (type === 'Wedding DJ')      return 'type-dj';
    if (type === 'Live Performance') return 'type-live';
    return 'type-other';
  }

  function formatDate(dateStr) {
    var parts = dateStr.split('-');
    var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function renderSchedule(filter) {
    var today = new Date();
    today.setHours(0,0,0,0);

    var rows = scheduleData.filter(function(ev) {
      var parts = ev.date.split('-');
      var evDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      var matchFilter = (filter === 'all') || (ev.type === filter);
      var upcoming = evDate >= today;
      if (filter === 'past') {
        return evDate < today;
      }
      return matchFilter && upcoming;
    });

    tbody.innerHTML = '';

    if (rows.length === 0) {
      if (emptyMsg) emptyMsg.style.display = 'block';
      return;
    }
    if (emptyMsg) emptyMsg.style.display = 'none';

    rows.forEach(function(ev) {
      var tr = document.createElement('tr');
      tr.innerHTML = [
        '<td><span class="schedule-date">' + formatDate(ev.date) + '</span><br><span class="schedule-day">' + ev.day + '</span></td>',
        '<td><strong>' + ev.venue + '</strong><br><span class="text-muted">' + ev.city + '</span></td>',
        '<td>' + ev.time + '</td>',
        '<td><span class="type-badge ' + typeClass(ev.type) + '">' + ev.type + '</span></td>',
        '<td>' + ev.notes + '</td>'
      ].join('');
      tbody.appendChild(tr);
    });
  }

  renderSchedule('all');

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      renderSchedule(this.getAttribute('data-filter'));
    });
  });
}

/* ══════════════════════════════════════
   PHOTO GALLERY — grid + lightbox
══════════════════════════════════════ */
function initGalleryLightbox() {
  var galleryItems = document.querySelectorAll('.gallery-item');
  var lightbox     = document.getElementById('lightbox');

  if (!galleryItems.length || !lightbox) return;

  var lbImg   = lightbox.querySelector('.lb-img');
  var lbCaption = lightbox.querySelector('.lb-caption');
  var lbClose = lightbox.querySelector('.lb-close');
  var lbPrev  = lightbox.querySelector('.lb-prev');
  var lbNext  = lightbox.querySelector('.lb-next');
  var lbCounter = lightbox.querySelector('.lb-counter');

  var items = Array.from(galleryItems);
  var current = 0;

  function open(index) {
    current = index;
    var item = items[current];
    var src  = item.querySelector('img').getAttribute('src');
    var cap  = item.getAttribute('data-caption') || '';
    lbImg.src = src;
    lbImg.alt = cap;
    if (lbCaption) lbCaption.textContent = cap;
    if (lbCounter) lbCounter.textContent = (current + 1) + ' / ' + items.length;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function prev() { open((current - 1 + items.length) % items.length); }
  function next() { open((current + 1) % items.length); }

  items.forEach(function(item, idx) {
    item.addEventListener('click', function() { open(idx); });
  });

  if (lbClose) lbClose.addEventListener('click', close);
  if (lbPrev)  lbPrev.addEventListener('click', function(e) { e.stopPropagation(); prev(); });
  if (lbNext)  lbNext.addEventListener('click', function(e) { e.stopPropagation(); next(); });

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape')     close();
  });
}

/* ══════════════════════════════════════
   MEDIA PLAYER — custom HTML5 audio player
══════════════════════════════════════ */
function initMediaPlayer() {
  var player     = document.getElementById('media-player');
  if (!player) return;

  var audio      = player.querySelector('audio');
  var playlist   = document.querySelectorAll('.playlist-item');
  var playBtn    = player.querySelector('.mp-play');
  var prevBtn    = player.querySelector('.mp-prev');
  var nextBtn    = player.querySelector('.mp-next');
  var seekBar    = player.querySelector('.mp-seek');
  var volSlider  = player.querySelector('.mp-volume');
  var muteBtn    = player.querySelector('.mp-mute');
  var timeEl     = player.querySelector('.mp-time-current');
  var durationEl = player.querySelector('.mp-time-duration');
  var trackTitle = player.querySelector('.mp-track-title');
  var trackArtist= player.querySelector('.mp-track-artist');
  var trackThumb = player.querySelector('.mp-track-thumb');
  var progressFill = player.querySelector('.mp-progress-fill');
  var visualizer = player.querySelector('.mp-visualizer');

  if (!audio) return;

  var currentTrack = 0;
  var isPlaying    = false;

  // Build playlist items array
  var tracks = [];
  playlist.forEach(function(item) {
    tracks.push({
      src:    item.getAttribute('data-src'),
      title:  item.getAttribute('data-title') || 'Unknown Track',
      artist: item.getAttribute('data-artist') || 'John Simpson',
      thumb:  item.getAttribute('data-thumb') || ''
    });
  });

  // Fallback: placeholder tracks if none provided
  if (tracks.length === 0) {
    tracks = [
      { src: 'audio/track1.mp3', title: 'Original Track 1', artist: 'John Simpson', thumb: '' },
      { src: 'audio/track2.mp3', title: 'Original Track 2', artist: 'John Simpson', thumb: '' },
      { src: 'audio/track3.mp3', title: 'Cover Song',       artist: 'John Simpson', thumb: '' }
    ];
  }

  function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' + s : s);
  }

  function loadTrack(idx) {
    currentTrack = idx;
    var t = tracks[idx];

    if (audio && t.src) {
      audio.src = t.src;
    }

    if (trackTitle)  trackTitle.textContent  = t.title;
    if (trackArtist) trackArtist.textContent = t.artist;
    if (trackThumb && t.thumb) {
      trackThumb.src = t.thumb;
      trackThumb.style.display = 'block';
    }

    // Update playlist active state
    playlist.forEach(function(item, i) {
      item.classList.toggle('active', i === idx);
    });

    // Reset progress
    if (seekBar)      seekBar.value = 0;
    if (progressFill) progressFill.style.width = '0%';
    if (timeEl)       timeEl.textContent = '0:00';
    if (durationEl)   durationEl.textContent = '0:00';
  }

  function play() {
    if (!audio.src && tracks.length > 0) loadTrack(0);
    audio.play().catch(function() {});
    isPlaying = true;
    if (playBtn) {
      playBtn.querySelector('i').className = 'fas fa-pause';
    }
    if (player) player.classList.add('playing');
    animateViz();
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    if (playBtn) {
      playBtn.querySelector('i').className = 'fas fa-play';
    }
    if (player) player.classList.remove('playing');
  }

  function togglePlay() {
    if (isPlaying) pause(); else play();
  }

  function prevTrack() {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
    if (isPlaying) play();
  }

  function nextTrack() {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    if (isPlaying) play();
  }

  // Events
  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (prevBtn) prevBtn.addEventListener('click', prevTrack);
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);

  // Playlist clicks
  playlist.forEach(function(item, idx) {
    item.addEventListener('click', function() {
      loadTrack(idx);
      play();
    });
  });

  // Seek
  if (seekBar) {
    seekBar.addEventListener('input', function() {
      if (audio.duration) {
        audio.currentTime = (this.value / 100) * audio.duration;
      }
    });
  }

  // Volume
  if (volSlider) {
    volSlider.addEventListener('input', function() {
      audio.volume = this.value / 100;
      if (muteBtn) updateMuteIcon();
    });
  }

  // Mute toggle
  if (muteBtn) {
    muteBtn.addEventListener('click', function() {
      audio.muted = !audio.muted;
      updateMuteIcon();
    });
  }

  function updateMuteIcon() {
    var icon = muteBtn.querySelector('i');
    if (!icon) return;
    if (audio.muted || audio.volume === 0) {
      icon.className = 'fas fa-volume-mute';
    } else if (audio.volume < 0.5) {
      icon.className = 'fas fa-volume-down';
    } else {
      icon.className = 'fas fa-volume-up';
    }
  }

  // Time update
  audio.addEventListener('timeupdate', function() {
    if (!audio.duration) return;
    var pct = (audio.currentTime / audio.duration) * 100;
    if (seekBar)      seekBar.value = pct;
    if (progressFill) progressFill.style.width = pct + '%';
    if (timeEl)       timeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', function() {
    if (durationEl) durationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('ended', function() {
    nextTrack();
  });

  // Visualizer bars animation (CSS-driven, JS kicks off)
  var vizBars = [];
  if (visualizer) {
    for (var i = 0; i < 32; i++) {
      var bar = document.createElement('span');
      bar.className = 'viz-bar';
      visualizer.appendChild(bar);
      vizBars.push(bar);
    }
  }

  var vizFrame;
  function animateViz() {
    if (!vizBars.length) return;
    vizBars.forEach(function(bar) {
      var h = isPlaying ? (Math.random() * 60 + 5) : 4;
      bar.style.height = h + '%';
    });
    if (isPlaying) {
      vizFrame = requestAnimationFrame(function() {
        setTimeout(animateViz, 80);
      });
    } else {
      cancelAnimationFrame(vizFrame);
      vizBars.forEach(function(bar) { bar.style.height = '4%'; });
    }
  }

  // Init load first track info
  if (tracks.length > 0) loadTrack(0);
}