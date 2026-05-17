/* --- Cursor --- */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a, button, .work-card, .skill-card, .software-card, .testi-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('expand'); ring.classList.add('expand'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('expand'); ring.classList.remove('expand'); });
});

/* --- Navbar scroll --- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* --- Work tabs filter --- */
document.querySelectorAll('.work-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.work-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.work-card').forEach(card => {
      if (card.dataset.cat === filter) {
        card.style.display = 'block';
        card.style.animation = 'fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) both';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* --- Scroll reveal --- */
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      /* animate skill bars */
      const bar = entry.target.querySelector('.skill-bar');
      if (bar) { bar.style.width = bar.dataset.width + '%'; }
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

/* Also observe skill bars on their own */
document.querySelectorAll('.skill-bar').forEach(bar => {
  const obs2 = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { bar.style.width = bar.dataset.width + '%'; }
  }, { threshold: 0.5 });
  obs2.observe(bar);
});

/* --- Jelly button click --- */
document.querySelectorAll('.btn-hire, .btn-primary, .btn-secondary, .nav-hire').forEach(btn => {
  btn.addEventListener('mousedown', () => {
    btn.style.transform = 'scale(0.94)';
    setTimeout(() => { btn.style.transform = ''; }, 300);
  });
});

/* --- Parallax on hero --- */
document.addEventListener('mousemove', e => {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  const xPct = (e.clientX / window.innerWidth - 0.5) * 8;
  const yPct = (e.clientY / window.innerHeight - 0.5) * 6;
  heroBg.style.transform = `translate(${xPct}px, ${yPct}px) scale(1.06)`;
});
/* --- Work tabs filter --- */
document.querySelectorAll('.work-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.work-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.work-card').forEach(card => {
      const show = card.dataset.cat === filter;
      card.style.display = show ? 'block' : 'none';
      if (!show) {
        const v = card.querySelector('video');
        if (v) { v.pause(); v.currentTime = 0; }
        updatePlayIcon(card, false);
      }
      if (show) card.style.animation = 'fadeSlideUp 0.5s cubic-bezier(0.22,1,0.36,1) both';
    });
  });
});

/* --- Video controls --- */
function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + String(sec).padStart(2, '0');
}
function updatePlayIcon(card, playing) {
  const iconPlay  = card.querySelector('.icon-play');
  const iconPause = card.querySelector('.icon-pause');
  if (!iconPlay) return;
  iconPlay.style.display  = playing ? 'none'  : 'block';
  iconPause.style.display = playing ? 'block' : 'none';
}
function updateMuteIcon(card, muted) {
  const iconMute   = card.querySelector('.icon-mute');
  const iconUnmute = card.querySelector('.icon-unmute');
  if (!iconMute) return;
  iconMute.style.display   = muted ? 'block' : 'none';
  iconUnmute.style.display = muted ? 'none'  : 'block';
}

document.querySelectorAll('.work-card').forEach(card => {
  const video      = card.querySelector('video');
  const playBtn    = card.querySelector('.play-pause');
  const muteBtn    = card.querySelector('.mute-btn');
  const fill       = card.querySelector('.vid-progress-fill');
  const bar        = card.querySelector('.vid-progress-bar');
  const timeLabel  = card.querySelector('.vid-time');
  if (!video) return;

  /* Fullscreen */
  const fsBtn = document.createElement('button');
  fsBtn.className = 'vid-btn fs-btn';
  fsBtn.setAttribute('aria-label', 'Fullscreen');
  fsBtn.innerHTML = '<svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:var(--c-cyan);fill:none;stroke-width:2px;stroke-linecap:round;stroke-linejoin:round"><path d="M8 3H5a2 2 0 0 0-2 2v3m13 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>';
  card.querySelector('.vid-controls').appendChild(fsBtn);

  fsBtn.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    }
  });

  ['fullscreenchange', 'webkitfullscreenchange'].forEach(evt => {
    video.addEventListener(evt, () => {
      if (document.fullscreenElement === video || document.webkitFullscreenElement === video) {
        video.setAttribute('controls', 'controls');
        video.muted = false;
        updateMuteIcon(card, false);
      } else {
        video.removeAttribute('controls');
      }
    });
  });

  /* Play / Pause */
  playBtn.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    if (video.paused) { video.play(); updatePlayIcon(card, true); }
    else              { video.pause(); updatePlayIcon(card, false); }
  });

  /* Mute / Unmute */
  muteBtn.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    video.muted = !video.muted;
    updateMuteIcon(card, video.muted);
  });
  updateMuteIcon(card, true); /* starts muted */

  /* Progress fill + time */
  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    fill.style.width = pct + '%';
    timeLabel.textContent = fmtTime(video.currentTime);
  });

  /* Seek on bar click */
  bar.addEventListener('click', e => {
    e.stopPropagation();
    const rect = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    video.currentTime = ratio * video.duration;
  });

  /* Auto-play on hover, pause on leave */
  card.addEventListener('mouseenter', () => {
    video.play().then(() => updatePlayIcon(card, true)).catch(() => {});
  });
  card.addEventListener('mouseleave', () => {
    video.pause();
    updatePlayIcon(card, false);
  });
});
