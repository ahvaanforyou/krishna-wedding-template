/**
 * ============================================================================
 * KRISHNA WEDDING TEMPLATE - JAVASCRIPT ENGINE
 * Full Interactive Suite: Text Blur Scroll, Scratch Card, Ambient Petals,
 * Bansuri Web Audio Synthesizer, RSVP Engine, Live Customizer & Responsive Modes
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Text Blur Entrance Animations via IntersectionObserver
  initScrollAnimations();

  // 2. Falling Petals & Sparkles Engine
  initPetalsEngine();

  // 3. Interactive Scratch Card Engine
  initScratchCard();

  // 4. Live Countdown Timer
  initWeddingCountdown();

  // 5. Ambient Bansuri Flute Web Audio Synthesizer
  initAudioSynthesizer();

  // 6. View Mode Switcher (Desktop Full View vs Phone Mockup)
  initViewModeSwitcher();

  // 7. Load Saved Customizer & RSVP Data
  loadSavedCustomizerData();
  checkExistingRsvp();
});

/* ==========================================================================
   1. TEXT BLUR SCROLL ANIMATION SYSTEM
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.anim-blur');

  // Immediately reveal elements that are already within the viewport on load
  function checkInitialViewport() {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= windowHeight * 0.95 && rect.bottom >= 0) {
        const delay = Math.min(parseInt(el.getAttribute('data-delay') || 0, 10), 300);
        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay);
      }
    });
  }

  // Run on start
  checkInitialViewport();

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = Math.min(parseInt(el.getAttribute('data-delay') || 0, 10), 400);

        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay);

        obs.unobserve(el);
      }
    });
  }, {
    root: null,
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  });

  elements.forEach(el => {
    if (!el.classList.contains('is-visible')) {
      observer.observe(el);
    }
  });

  // Fallback safety: ensure all elements are visible after 2 seconds
  setTimeout(() => {
    elements.forEach(el => el.classList.add('is-visible'));
  }, 2200);
}

/* ==========================================================================
   2. FALLING ROSE PETALS & GOLDEN SPARKLES CANVAS
   ========================================================================== */
let petalsActive = true;
let petalParticles = [];
let petalsAnimationId = null;

function initPetalsEngine() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Generate initial particles
  const count = window.innerWidth < 640 ? 25 : 45;
  petalParticles = [];
  for (let i = 0; i < count; i++) {
    petalParticles.push(createParticle(canvas, true));
  }

  function render() {
    if (!petalsActive) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of petalParticles) {
      p.y += p.speedY;
      p.x += Math.sin(p.angle) * p.speedX;
      p.angle += p.angleSpeed;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.isSparkle) {
        // Draw golden divine sparkle
        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity * (0.6 + Math.sin(p.angle * 2) * 0.4)})`;
        ctx.shadowColor = '#d4af37';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Draw rose petal
        ctx.fillStyle = p.color;
        ctx.shadowColor = 'rgba(232, 67, 147, 0.2)';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.3, p.size * 0.7, p.rotation, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Reset when particle goes off bottom or sides
      if (p.y > canvas.height + 20 || p.x < -30 || p.x > canvas.width + 30) {
        Object.assign(p, createParticle(canvas, false));
      }
    }

    petalsAnimationId = requestAnimationFrame(render);
  }

  render();

  // Toolbar Toggle Button
  const btnPetals = document.getElementById('btn-petals');
  if (btnPetals) {
    btnPetals.addEventListener('click', () => {
      petalsActive = !petalsActive;
      btnPetals.classList.toggle('active', petalsActive);
      showToast(petalsActive ? '🌸 Ambient Petals Enabled' : 'Petals Paused');
      if (petalsActive && !petalsAnimationId) {
        render();
      }
    });
  }
}

function createParticle(canvas, randomY = false) {
  const isSparkle = Math.random() < 0.35;
  const colors = [
    'rgba(233, 30, 99, 0.65)',   // Rose pink
    'rgba(244, 67, 54, 0.6)',    // Soft crimson
    'rgba(255, 182, 193, 0.7)',  // Light pink
    'rgba(255, 215, 0, 0.6)'     // Sacred yellow/gold
  ];

  return {
    isSparkle,
    x: Math.random() * canvas.width,
    y: randomY ? Math.random() * canvas.height : -20,
    size: isSparkle ? Math.random() * 2.5 + 1.2 : Math.random() * 5 + 4,
    speedY: isSparkle ? Math.random() * 0.6 + 0.3 : Math.random() * 1.2 + 0.7,
    speedX: Math.random() * 0.8 + 0.3,
    angle: Math.random() * Math.PI * 2,
    angleSpeed: Math.random() * 0.02 + 0.01,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.04,
    opacity: Math.random() * 0.5 + 0.5,
    color: colors[Math.floor(Math.random() * colors.length)]
  };
}

/* ==========================================================================
   3. REAL HTML5 INTERACTIVE SCRATCH CARD
   ========================================================================== */
function initScratchCard() {
  const container = document.getElementById('scratch-container');
  const canvas = document.getElementById('scratch-canvas');
  const hintOverlay = document.getElementById('scratch-hint');
  const btnQuickReveal = document.getElementById('btn-quick-reveal');
  const btnResetScratch = document.getElementById('btn-reset-scratch');

  if (!container || !canvas) return;
  const ctx = canvas.getContext('2d');

  let isDrawing = false;
  let isRevealed = false;

  function resizeAndPaintCover() {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Rich Royal Blue Velvet & Gold Foil Gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#0a1d3f');
    grad.addColorStop(0.35, '#13356f');
    grad.addColorStop(0.7, '#0d2551');
    grad.addColorStop(1, '#06132b');

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Gold Shimmer Grid & Dots
    ctx.fillStyle = 'rgba(212, 175, 55, 0.18)';
    for (let x = 15; x < canvas.width; x += 30) {
      for (let y = 15; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Gold Filigree Border on Canvas Cover
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Inner Dashed Line
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);
    ctx.setLineDash([]);

    // Reset flags
    isRevealed = false;
    canvas.style.opacity = '1';
    canvas.style.pointerEvents = 'auto';
    if (hintOverlay) hintOverlay.style.opacity = '1';
    if (btnQuickReveal) btnQuickReveal.classList.remove('hidden');
    if (btnResetScratch) btnResetScratch.classList.add('hidden');
  }

  resizeAndPaintCover();
  window.addEventListener('resize', () => {
    if (!isRevealed) resizeAndPaintCover();
  });

  function scratch(x, y) {
    if (isRevealed) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    // Hide the hint overlay once scratching begins
    if (hintOverlay && hintOverlay.style.opacity !== '0') {
      hintOverlay.style.opacity = '0';
    }

    checkScratchPercentage();
  }

  function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  // Mouse Listeners
  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  });

  window.addEventListener('mouseup', () => {
    isDrawing = false;
  });

  // Touch Listeners
  canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    isDrawing = false;
  });

  // Calculate Scratched Percentage
  let lastCheck = 0;
  function checkScratchPercentage() {
    const now = Date.now();
    if (now - lastCheck < 250) return; // throttle checking
    lastCheck = now;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;
    const totalPixels = pixels.length / 4;

    // Sample every 16th pixel for high performance
    for (let i = 3; i < pixels.length; i += 64) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const percentage = (transparentCount / (totalPixels / 16)) * 100;
    if (percentage > 38) {
      triggerFullReveal();
    }
  }

  function triggerFullReveal() {
    if (isRevealed) return;
    isRevealed = true;

    // Smoothly fade out the canvas
    canvas.style.transition = 'opacity 0.6s ease';
    canvas.style.opacity = '0';
    canvas.style.pointerEvents = 'none';
    if (hintOverlay) hintOverlay.style.opacity = '0';

    if (btnQuickReveal) btnQuickReveal.classList.add('hidden');
    if (btnResetScratch) btnResetScratch.classList.remove('hidden');

    // Confetti celebration burst
    fireConfetti();
    playChimeSound();
    showToast('✨ Auspicious Muhurtham Revealed!');
  }

  if (btnQuickReveal) {
    btnQuickReveal.addEventListener('click', triggerFullReveal);
  }

  if (btnResetScratch) {
    btnResetScratch.addEventListener('click', () => {
      resizeAndPaintCover();
      showToast('Scratch card reset!');
    });
  }
}

function copyBlessingCode() {
  const code = '#RADHE-SHYAM-2026';
  navigator.clipboard.writeText(code).then(() => {
    showToast('✨ Blessing Pass Code Copied to Clipboard!');
  }).catch(() => {
    showToast('Blessing Pass Code: ' + code);
  });
}

/* ==========================================================================
   4. LIVE WEDDING COUNTDOWN TIMER (01 NOVEMBER 2026)
   ========================================================================== */
function initWeddingCountdown() {
  // Target: November 1, 2026 at 10:24 AM IST
  const targetDate = new Date('2026-11-01T10:24:00+05:30').getTime();

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  if (!elDays) return;

  function update() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      elDays.textContent = '00';
      elHours.textContent = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    elDays.textContent = String(days).padStart(2, '0');
    elHours.textContent = String(hours).padStart(2, '0');
    elMinutes.textContent = String(minutes).padStart(2, '0');
    elSeconds.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   5. BANSURI (FLUTE) WEB AUDIO SYNTHESIZER
   Zero external dependencies - generates serene Raag Yaman melody in browser!
   ========================================================================== */
let audioCtx = null;
let isPlayingAudio = false;
let audioMelodyTimeout = null;

function initAudioSynthesizer() {
  const btnAudio = document.getElementById('btn-audio');
  if (!btnAudio) return;

  const iconOn = btnAudio.querySelector('.icon-music-on');
  const iconOff = btnAudio.querySelector('.icon-music-off');

  btnAudio.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isPlayingAudio = !isPlayingAudio;

    if (isPlayingAudio) {
      iconOn.classList.remove('hidden');
      iconOff.classList.add('hidden');
      btnAudio.classList.add('active');
      showToast('🪈 Playing Divine Bansuri Flute Raga');
      playBansuriRaga();
    } else {
      iconOn.classList.add('hidden');
      iconOff.classList.remove('hidden');
      btnAudio.classList.remove('active');
      showToast('Music Muted');
      if (audioMelodyTimeout) clearTimeout(audioMelodyTimeout);
    }
  });
}

// Classical Indian Raag Yaman Frequencies (Sa Re Ga Ma Dha Ni Sa in E base flute)
const BANSURI_NOTES = [
  329.63, // E4 (Sa)
  369.99, // F#4 (Re)
  415.30, // G#4 (Ga)
  466.16, // A#4 (Teevra Ma)
  493.88, // B4 (Pa)
  554.37, // C#5 (Dha)
  622.25, // D#5 (Ni)
  659.25  // E5 (Tar Sa)
];

const MELODY_SEQUENCE = [
  { note: 0, dur: 1.2 }, // Sa
  { note: 1, dur: 0.8 }, // Re
  { note: 2, dur: 1.5 }, // Ga
  { note: 1, dur: 0.6 }, // Re
  { note: 2, dur: 1.0 }, // Ga
  { note: 3, dur: 1.6 }, // Ma
  { note: 4, dur: 2.0 }, // Pa
  { note: 5, dur: 0.9 }, // Dha
  { note: 6, dur: 1.1 }, // Ni
  { note: 7, dur: 2.2 }, // Tar Sa
  { note: 6, dur: 0.8 },
  { note: 4, dur: 1.4 },
  { note: 2, dur: 1.8 }
];

let melodyStep = 0;

function playBansuriRaga() {
  if (!isPlayingAudio || !audioCtx) return;

  const current = MELODY_SEQUENCE[melodyStep % MELODY_SEQUENCE.length];
  melodyStep++;

  const freq = BANSURI_NOTES[current.note];
  playFluteTone(freq, current.dur);

  audioMelodyTimeout = setTimeout(playBansuriRaga, current.dur * 1000 + 150);
}

function playFluteTone(freq, duration) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  // Main Flute Oscillator (sine wave with soft triangle harmonic)
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  // Vibrato LFO
  const lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();
  lfo.frequency.setValueAtTime(5.5, now); // 5.5 Hz natural flute vibrato
  lfoGain.gain.setValueAtTime(4.5, now);
  lfo.connect(osc1.frequency);
  lfo.connect(osc2.frequency);
  lfo.start(now);

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, now);

  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq * 2, now); // octave overtone

  const osc2Gain = audioCtx.createGain();
  osc2Gain.gain.setValueAtTime(0.12, now);
  osc2.connect(osc2Gain);

  // Envelope shaping (gentle breath attack and reedy decay)
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.18, now + 0.25); // breath rise
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.3); // smooth release

  osc1.connect(gainNode);
  osc2Gain.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc1.start(now);
  osc2.start(now);

  osc1.stop(now + duration + 0.4);
  osc2.stop(now + duration + 0.4);
  lfo.stop(now + duration + 0.4);
}

function playChimeSound() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.1);
    gain.gain.setValueAtTime(0, now + idx * 0.1);
    gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.1 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now + idx * 0.1);
    osc.stop(now + idx * 0.1 + 0.9);
  });
}

/* ==========================================================================
   6. RESPONSIVE VIEW MODE SWITCHER (LAPTOP vs PHONE PREVIEW)
   ========================================================================== */
function initViewModeSwitcher() {
  const btn = document.getElementById('btn-view-mode');
  const appWrapper = document.getElementById('app-wrapper');
  const label = document.getElementById('view-mode-label');
  const iconPhone = btn ? btn.querySelector('.icon-phone') : null;
  const iconLaptop = btn ? btn.querySelector('.icon-laptop') : null;

  if (!btn || !appWrapper) return;

  btn.addEventListener('click', () => {
    const isDesktop = appWrapper.classList.contains('desktop-view');

    if (isDesktop) {
      appWrapper.classList.remove('desktop-view');
      appWrapper.classList.add('phone-mockup-view');
      label.textContent = 'Laptop View';
      iconPhone.classList.add('hidden');
      iconLaptop.classList.remove('hidden');
      showToast('📱 Switched to Phone Simulation Frame');
    } else {
      appWrapper.classList.remove('phone-mockup-view');
      appWrapper.classList.add('desktop-view');
      label.textContent = 'Phone View';
      iconPhone.classList.remove('hidden');
      iconLaptop.classList.add('hidden');
      showToast('💻 Switched to Full Laptop View');
    }

    // Scroll to top cleanly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   7. PHOTO UPLOAD & REPLACEMENT FOR BRIDE & GROOM
   ========================================================================== */
function triggerPhotoUpload(type) {
  const fileInput = document.getElementById(`${type}-file-input`);
  if (fileInput) fileInput.click();
}

function handlePhotoUpload(event, type) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const imgEl = document.getElementById(`${type}-photo-img`);
    if (imgEl) {
      imgEl.src = e.target.result;
      // Persist in localStorage
      try {
        localStorage.setItem(`krishna_${type}_photo`, e.target.result);
        showToast(`✨ ${type.charAt(0).toUpperCase() + type.slice(1)} photo updated!`);
      } catch (err) {
        console.warn('Storage quota exceeded for photo', err);
        showToast('Photo updated for this session!');
      }
    }
  };
  reader.readAsDataURL(file);
}

/* ==========================================================================
   8. RSVP FORM SUBMISSION & CONFETTI
   ========================================================================== */
function handleRsvpSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('rsvp-name').value.trim();
  const phone = document.getElementById('rsvp-phone').value.trim();
  const attendingRadio = document.querySelector('input[name="attending"]:checked');
  const attending = attendingRadio ? attendingRadio.value : 'yes';
  const guests = document.getElementById('rsvp-guests').value;
  const message = document.getElementById('rsvp-message').value.trim();

  const eventsChecked = Array.from(document.querySelectorAll('input[name="events"]:checked'))
    .map(cb => cb.value)
    .join(', ');

  const rsvpData = {
    name,
    phone,
    attending,
    guests,
    events: eventsChecked,
    message,
    timestamp: new Date().toISOString()
  };

  localStorage.setItem('krishna_rsvp_submission', JSON.stringify(rsvpData));

  // Switch form view to confirmation card
  const form = document.getElementById('rsvp-form');
  const successBox = document.getElementById('rsvp-success-box');
  const nameDisplay = document.getElementById('guest-name-display');
  const summaryDetails = document.getElementById('rsvp-summary-details');

  if (nameDisplay) nameDisplay.textContent = name;
  if (summaryDetails) {
    summaryDetails.innerHTML = attending === 'yes'
      ? `🎉 Attending with <strong>${guests}</strong> guest(s) for <strong>${eventsChecked || 'All Events'}</strong>`
      : `🕊️ Warm wishes sent from afar`;
  }

  form.classList.add('hidden');
  successBox.classList.remove('hidden');

  fireConfetti();
  playChimeSound();
  showToast('🌸 Your RSVP has been graciously received!');
}

function resetRsvpForm() {
  document.getElementById('rsvp-form').classList.remove('hidden');
  document.getElementById('rsvp-success-box').classList.add('hidden');
}

function checkExistingRsvp() {
  const saved = localStorage.getItem('krishna_rsvp_submission');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      const nameInput = document.getElementById('rsvp-name');
      const phoneInput = document.getElementById('rsvp-phone');
      if (nameInput) nameInput.value = data.name || '';
      if (phoneInput) phoneInput.value = data.phone || '';
    } catch (err) {
      console.error(err);
    }
  }
}

/* ==========================================================================
   9. TEMPLATE CUSTOMIZER MODAL & PERSISTENCE
   ========================================================================== */
const customizerBtn = document.getElementById('btn-open-editor');
if (customizerBtn) {
  customizerBtn.addEventListener('click', openCustomizerModal);
}

function openCustomizerModal() {
  document.getElementById('modal-customizer').classList.remove('hidden');
}

function closeCustomizerModal() {
  document.getElementById('modal-customizer').classList.add('hidden');
}

function saveCustomizerData(e) {
  e.preventDefault();

  const fields = [
    'groomName', 'groomFullName', 'groomParents',
    'brideName', 'brideFullName', 'brideParents',
    'weddingDateDisplay', 'hostFather', 'hostMother',
    'weddingVenue'
  ];

  const customData = {};
  fields.forEach(f => {
    const input = document.getElementById(`cust-${f}`);
    if (input) {
      customData[f] = input.value;
      // Update DOM elements that correspond to this key
      document.querySelectorAll(`[data-key="${f}"]`).forEach(el => {
        el.textContent = input.value;
      });
    }
  });

  localStorage.setItem('krishna_custom_invitation', JSON.stringify(customData));
  closeCustomizerModal();
  fireConfetti();
  showToast('✨ Invitation updated successfully!');
}

function loadSavedCustomizerData() {
  // Load text customizations
  const saved = localStorage.getItem('krishna_custom_invitation');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      Object.keys(data).forEach(key => {
        document.querySelectorAll(`[data-key="${key}"]`).forEach(el => {
          el.textContent = data[key];
        });
        const input = document.getElementById(`cust-${key}`);
        if (input) input.value = data[key];
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Load custom photos if previously uploaded
  const bridePhoto = localStorage.getItem('krishna_bride_photo');
  if (bridePhoto) {
    const img = document.getElementById('bride-photo-img');
    if (img) img.src = bridePhoto;
  }
  const groomPhoto = localStorage.getItem('krishna_groom_photo');
  if (groomPhoto) {
    const img = document.getElementById('groom-photo-img');
    if (img) img.src = groomPhoto;
  }
}

function resetCustomizerToDefaults() {
  localStorage.removeItem('krishna_custom_invitation');
  localStorage.removeItem('krishna_bride_photo');
  localStorage.removeItem('krishna_groom_photo');
  location.reload();
}

/* ==========================================================================
   10. CALENDAR, MAPS & SOCIAL SHARING
   ========================================================================== */
function addToCalendar(eventType) {
  let title = 'Hemanth & Yashaswini Wedding';
  let start = '20261101T043000Z'; // UTC for 10:00 AM IST
  let end = '20261101T080000Z';
  let desc = 'Sacred wedding celebration of Hemanth & Yashaswini with blessings of Radha Krishna.';
  let loc = 'The Royal Vrindavan Palace Hall, Bangalore';

  if (eventType === 'Reception') {
    title = 'Hemanth & Yashaswini Grand Reception';
    start = '20261022T133000Z'; // 7:00 PM IST
    end = '20261022T173000Z';
    loc = 'Crystal Ballroom, The Grand Orchid, Bangalore';
  } else if (eventType === 'Haldi') {
    title = 'Hemanth & Yashaswini Haldi & Mehendi';
    start = '20261022T043000Z'; // 10:00 AM IST
    end = '20261022T083000Z';
    loc = 'Ananda Mango Orchards, Bangalore';
  }

  // Download .ics file
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Krishna Wedding Invite//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${loc}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${eventType}-Invitation.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`📅 ${eventType} event added to your calendar!`);
}

function openMapModal(venue) {
  const modal = document.getElementById('modal-map');
  const addressText = document.getElementById('map-modal-address');
  const gLink = document.getElementById('google-maps-link');

  if (addressText) addressText.textContent = venue;
  if (gLink) {
    gLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`;
  }
  if (modal) modal.classList.remove('hidden');
}

function closeMapModal() {
  const modal = document.getElementById('modal-map');
  if (modal) modal.classList.add('hidden');
}

function copyAddressText() {
  const text = document.getElementById('map-modal-address').textContent;
  navigator.clipboard.writeText(text).then(() => {
    showToast('📍 Venue address copied!');
  });
}

function shareOnWhatsApp() {
  const groom = document.querySelector('[data-key="groomName"]')?.textContent || 'Hemanth';
  const bride = document.querySelector('[data-key="brideName"]')?.textContent || 'Yashaswini';
  const date = document.querySelector('[data-key="weddingDateDisplay"]')?.textContent || '01 November 2026';
  
  const msg = `🌸 *Wedding Invitation* 🌸\n\nWith the divine blessings of Radha Krishna, we joyfully invite you to the wedding celebrations of:\n\n*${groom} weds ${bride}*\n📅 Date: ${date}\n\nKindly view our digital wedding invite, auspicious Muhurtham and RSVP here:\n${window.location.href}\n\nWe look forward to celebrating together! ✨`;

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}

function copyInvitationLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('🔗 Wedding invitation link copied!');
  }).catch(() => {
    showToast('Link copied!');
  });
}

/* ==========================================================================
   11. UTILITIES: TOASTS & CONFETTI
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function fireConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#e84393', '#14b8a6', '#f59e0b', '#ffffff']
    });
  }
}
