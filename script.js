/**
 * ============================================================================
 * KRISHNA WEDDING TEMPLATE - JAVASCRIPT ENGINE
 * Mobile-First Interactive Suite: Text Blur Scroll, Scratch Card Engine,
 * Live Countdown Timer, Responsive RSVP System, Confetti & Social Sharing
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Text Blur Entrance Animations
  initScrollAnimations();

  // 2. Interactive Scratch Card Engine
  initScratchCard();

  // 3. Live Countdown Timer
  initWeddingCountdown();

  // 4. Responsive RSVP System
  initRsvpExpander();
  checkExistingRsvp();
});

/* ==========================================================================
   1. TEXT BLUR SCROLL ANIMATION
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.anim-blur');

  function checkViewport() {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= windowHeight * 0.92) {
        el.classList.add('is-visible');
      }
    });
  }

  // Run on start
  checkViewport();

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   2. LIVE WEDDING COUNTDOWN TIMER (01 NOVEMBER 2026)
   ========================================================================== */
function initWeddingCountdown() {
  // Target: November 1, 2026 at 10:24 AM IST
  const targetDate = new Date('2026-11-01T10:24:00+05:30').getTime();

  const elDays = document.getElementById('cd-days');
  const elHours = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  if (!elDays || !elHours || !elMinutes || !elSeconds) return;

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
   3. INTERACTIVE SCRATCH TO REVEAL CARD (MOBILE TOUCH FIXED)
   ========================================================================== */
function initScratchCard() {
  const container = document.getElementById('scratch-container');
  const canvas = document.getElementById('scratch-canvas');
  const hintOverlay = document.getElementById('scratch-hint');
  const btnQuickReveal = document.getElementById('btn-quick-reveal');

  if (!container || !canvas) return;
  const ctx = canvas.getContext('2d');

  let isDrawing = false;
  let isRevealed = false;

  function paintCover() {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Solid Royal Blue Velvet Gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#102e64');
    grad.addColorStop(0.5, '#173f82');
    grad.addColorStop(1, '#0c234d');

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle Gold Filigree Border
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

    isRevealed = false;
    canvas.style.opacity = '1';
    canvas.style.pointerEvents = 'auto';
    if (hintOverlay) hintOverlay.style.opacity = '1';
    if (btnQuickReveal) btnQuickReveal.classList.remove('hidden');
  }

  paintCover();
  window.addEventListener('resize', () => {
    if (!isRevealed) paintCover();
  });

  function scratch(x, y) {
    if (isRevealed) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    if (hintOverlay && hintOverlay.style.opacity !== '0') {
      hintOverlay.style.opacity = '0';
    }

    checkScratchProgress();
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

  // Touch Listeners with e.preventDefault() so mobile screen doesn't drag/scroll
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    scratch(x, y);
  }, { passive: false });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    isDrawing = false;
  }, { passive: false });

  // Progress check
  let lastCheck = 0;
  function checkScratchProgress() {
    const now = Date.now();
    if (now - lastCheck < 200) return;
    lastCheck = now;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparent = 0;
    const step = 48; // sampling step
    const totalSampled = pixels.length / step;

    for (let i = 3; i < pixels.length; i += step) {
      if (pixels[i] === 0) transparent++;
    }

    if ((transparent / totalSampled) * 100 > 30) {
      triggerFullReveal();
    }
  }

  function triggerFullReveal() {
    if (isRevealed) return;
    isRevealed = true;

    canvas.style.transition = 'opacity 0.5s ease';
    canvas.style.opacity = '0';
    canvas.style.pointerEvents = 'none';
    if (hintOverlay) hintOverlay.style.opacity = '0';
    if (btnQuickReveal) btnQuickReveal.classList.add('hidden');

    fireConfetti();
    showToast('✨ Auspicious Muhurtham Revealed!');
  }

  if (btnQuickReveal) {
    btnQuickReveal.addEventListener('click', triggerFullReveal);
  }
}

function copyBlessingCode() {
  const code = '#RADHE-SHYAM-2026';
  navigator.clipboard.writeText(code).then(() => {
    showToast('✨ Pass Code copied to clipboard: ' + code);
  }).catch(() => {
    showToast('Blessing Code: ' + code);
  });
}

/* ==========================================================================
   4. RESPONSIVE RSVP SYSTEM
   ========================================================================== */
function initRsvpExpander() {
  const toggleBar = document.getElementById('rsvp-toggle-bar');
  const wrapper = document.getElementById('rsvp-form-wrapper');

  if (toggleBar && wrapper) {
    toggleBar.addEventListener('click', () => {
      toggleBar.classList.toggle('open');
      wrapper.classList.toggle('collapsed');
      if (window.lucide) window.lucide.createIcons();
    });
  }
}

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

  // Switch to confirmation card
  const form = document.getElementById('rsvp-form');
  const successBox = document.getElementById('rsvp-success-box');
  const nameDisplay = document.getElementById('guest-name-display');
  const summaryDetails = document.getElementById('rsvp-summary-details');

  if (nameDisplay) nameDisplay.textContent = name;
  if (summaryDetails) {
    summaryDetails.innerHTML = attending === 'yes'
      ? `🎉 Attending with <strong>${guests}</strong> guest(s) for <strong>${eventsChecked || 'Celebrations'}</strong>`
      : `🕊️ Heartfelt wishes sent from afar`;
  }

  form.classList.add('hidden');
  successBox.classList.remove('hidden');

  fireConfetti();
  showToast('🌸 Your RSVP has been confirmed with joy!');
}

function resetRsvpForm() {
  const form = document.getElementById('rsvp-form');
  const successBox = document.getElementById('rsvp-success-box');
  if (form) form.classList.remove('hidden');
  if (successBox) successBox.classList.add('hidden');
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
   5. SOCIAL SHARING & UTILITIES
   ========================================================================== */
function shareOnWhatsApp() {
  const groom = 'Hemanth';
  const bride = 'Yashaswini';
  const date = '01 November 2026';
  
  const msg = `🌸 *Wedding Invitation* 🌸\n\nWith the divine blessings of Radha Krishna, we joyfully invite you to the wedding celebrations of:\n\n*${groom} weds ${bride}*\n📅 Date: ${date}\n\nKindly view our digital wedding invite and RSVP here:\n${window.location.href}\n\nWe look forward to celebrating together! ✨`;

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}

function copyInviteLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('🔗 Wedding invite link copied!');
  }).catch(() => {
    showToast('Link copied!');
  });
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function fireConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#d4af37', '#133979', '#e84393', '#10b981', '#ffffff']
    });
  }
}
