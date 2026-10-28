/**
 * ============================================================================
 * KRISHNA WEDDING TEMPLATE - JAVASCRIPT ENGINE
 * Mobile-First Interactive Suite:
 * - Continuous Falling Flower Petals Canvas (Petals only, no hearts)
 * - Text Blur Entrance Scroll Animations
 * - Scratch Card Live Countdown Engine
 * - Simple Big Images Horizontal Photo Gallery (Arrows & Swipe)
 * - GSAP ScrollTrigger Event Cards Stacking Deck (like Hanisha wedding cards)
 * - Responsive RSVP System (Auto-hide guests on decline)
 * - Confetti & Social Sharing
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Continuous Falling Flower Petals Canvas (Flowers/Petals only)
  initFallingPetals();

  // 2. Text Blur Entrance Animations
  initScrollAnimations();

  // 3. Interactive Scratch Card Engine
  initScratchCard();

  // 4. Live Wedding Countdown Timer
  initWeddingCountdown();

  // 5. Simple Big Images Horizontal Photo Gallery with Arrow Navigation
  initSimpleGalleryCarousel();

  // 6. GSAP ScrollTrigger Event Cards Stacking Deck
  initEventCardsScrollTrigger();

  // 7. Responsive RSVP System with Attendance Toggle
  initRsvpAttendanceToggle();
  initRsvpExpander();
  checkExistingRsvp();
});

/* ==========================================================================
   1. CONTINUOUS FALLING FLOWER PETALS CANVAS ANIMATION
   Natural marigold, saffron, and rose petals (Strictly NO hearts)
   ========================================================================== */
function initFallingPetals() {
  const canvas = document.getElementById('flower-petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const isMobile = window.innerWidth < 600;
  const PETAL_COUNT = isMobile ? 18 : 28;

  // Realistic Indian Wedding Petal Colors: Marigold, Turmeric, Deep Saffron, Soft Rose, Jasmine
  const petalColors = [
    { r: 245, g: 176, b: 65, a: 0.85 },  // Auspicious Marigold Gold
    { r: 235, g: 120, b: 35, a: 0.8 },   // Deep Saffron Orange
    { r: 250, g: 200, b: 85, a: 0.85 },  // Bright Turmeric Yellow
    { r: 244, g: 143, b: 177, a: 0.75 }, // Soft Blush Rose
    { r: 255, g: 252, b: 242, a: 0.9 }   // Sacred Jasmine Cream
  ];

  const petals = [];
  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(createPetal(true));
  }

  function createPetal(initial = false) {
    const isRose = Math.random() > 0.5;
    return {
      x: Math.random() * width,
      y: initial ? Math.random() * height : -20 - Math.random() * 40,
      size: Math.random() * 7 + 7,
      speedY: Math.random() * 1.3 + 0.9,
      speedX: (Math.random() - 0.5) * 0.7,
      swaySpeed: Math.random() * 0.025 + 0.015,
      swayOffset: Math.random() * Math.PI * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      isRose: isRose,
      color: petalColors[Math.floor(Math.random() * petalColors.length)]
    };
  }

  // Draw natural teardrop/oval flower petal path (No heart shapes)
  function drawFlowerPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.beginPath();

    if (p.isRose) {
      // Delicate curved rose petal
      ctx.moveTo(0, -p.size * 0.9);
      ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.9, p.size * 1.0, p.size * 0.5, 0, p.size * 1.1);
      ctx.bezierCurveTo(-p.size * 1.0, p.size * 0.5, -p.size * 0.9, -p.size * 0.9, 0, -p.size * 0.9);
    } else {
      // Marigold teardrop petal with natural curve
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size * 0.75, -p.size * 0.8, p.size * 1.1, p.size * 0.4, 0, p.size * 1.4);
      ctx.bezierCurveTo(-p.size * 1.1, p.size * 0.4, -p.size * 0.75, -p.size * 0.8, 0, 0);
    }

    ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.color.a})`;
    ctx.fill();

    // Subtle central petal vein for realism
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, p.size * 0.8);
    ctx.strokeStyle = `rgba(${Math.max(0, p.color.r - 30)}, ${Math.max(0, p.color.g - 30)}, ${Math.max(0, p.color.b - 30)}, 0.25)`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.y += p.speedY;
      p.swayOffset += p.swaySpeed;
      p.x += Math.sin(p.swayOffset) * 1.1 + p.speedX;
      p.rotation += p.rotationSpeed;

      // Respawn at top when drifting off-screen
      if (p.y > height + 25) {
        petals[i] = createPetal(false);
      }
      if (p.x < -25) p.x = width + 10;
      if (p.x > width + 25) p.x = -10;

      drawFlowerPetal(p);
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   2. TEXT BLUR SCROLL ANIMATION
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.anim-blur');

  function checkViewport() {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= windowHeight * 0.94) {
        el.classList.add('is-visible');
      }
    });
  }

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
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. LIVE WEDDING COUNTDOWN TIMER (01 NOVEMBER 2026)
   ========================================================================== */
function initWeddingCountdown() {
  const targetDate = new Date('2026-11-01T09:30:00+05:30').getTime();

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
   4. INTERACTIVE SCRATCH CARD ENGINE
   ========================================================================== */
function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  const hintOverlay = document.getElementById('scratch-hint');
  const quickBtn = document.getElementById('btn-quick-reveal');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let scratched = false;
  let totalPixels = 0;
  let scratchedPixels = 0;

  function setupCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    totalPixels = rect.width * rect.height;
    scratchedPixels = 0;

    const w = rect.width;
    const h = rect.height;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#133979');
    grad.addColorStop(0.5, '#1e488f');
    grad.addColorStop(1, '#0c2754');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Micro gold sparkle specs
    ctx.fillStyle = 'rgba(212, 175, 55, 0.45)';
    for (let i = 0; i < 70; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      const r = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, w - 20, h - 20);
  }

  setTimeout(setupCanvas, 100);
  window.addEventListener('resize', () => {
    if (!scratched) setupCanvas();
  });

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function scratch(e) {
    if (!isDrawing || scratched) return;
    const pos = getPos(e);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2);
    ctx.fill();

    if (hintOverlay) {
      hintOverlay.style.opacity = '0';
    }

    scratchedPixels += Math.PI * 28 * 28 * 0.4;
    if (scratchedPixels / totalPixels > 0.35) {
      revealFullCard();
    }
  }

  function revealFullCard() {
    if (scratched) return;
    scratched = true;
    canvas.style.transition = 'opacity 0.6s ease';
    canvas.style.opacity = '0';
    if (hintOverlay) hintOverlay.style.opacity = '0';
    setTimeout(() => {
      canvas.style.display = 'none';
      if (hintOverlay) hintOverlay.style.display = 'none';
    }, 600);
    fireConfetti();
  }

  canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
  canvas.addEventListener('mousemove', scratch);
  window.addEventListener('mouseup', () => { isDrawing = false; });

  canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    e.preventDefault();
    scratch(e);
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    scratch(e);
  }, { passive: false });

  window.addEventListener('touchend', () => { isDrawing = false; });

  if (quickBtn) {
    quickBtn.addEventListener('click', () => {
      revealFullCard();
    });
  }
}

/* ==========================================================================
   5. SIMPLE BIG IMAGES HORIZONTAL PHOTO GALLERY (ARROWS & SWIPE)
   No automatic fast spinning; user controlled with arrow clicks and swipe
   ========================================================================== */
function initSimpleGalleryCarousel() {
  const slidesContainer = document.getElementById('gallerySlides');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const dotsContainer = document.getElementById('galleryDots');
  if (!slidesContainer) return;

  const slides = Array.from(slidesContainer.querySelectorAll('.big-slide-item'));
  if (!slides.length) return;

  let currentIndex = 0;

  // Render clickable dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to photo ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlides() {
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    updateSlides();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  }

  // Mobile Touch Swipe Navigation
  let touchStartX = 0;
  let touchEndX = 0;

  slidesContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  slidesContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goToSlide(currentIndex + 1); // Swiped Left -> Show Next
      } else {
        goToSlide(currentIndex - 1); // Swiped Right -> Show Previous
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   6. GSAP SCROLLTRIGGER EVENT CARDS STACKING DECK
   Matching the Hanisha template scroll deck feel - 100% Solid & Opaque
   ========================================================================== */
function initEventCardsScrollTrigger() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  const cards = Array.from(document.querySelectorAll('.event-card-item'));
  if (cards.length < 2) return;

  cards.forEach((card, idx) => {
    const nextCard = cards[idx + 1];
    if (nextCard) {
      gsap.to(card, {
        scale: 0.94,
        ease: 'none',
        scrollTrigger: {
          trigger: nextCard,
          start: 'top 75%',
          end: 'top 18%',
          scrub: true,
        }
      });
    }
  });
}

/* ==========================================================================
   7. RESPONSIVE RSVP SYSTEM WITH CONDITIONAL ATTENDANCE
   When 'Regretfully Decline' is selected: hides number of guests & events
   ========================================================================== */
function initRsvpAttendanceToggle() {
  const attendingRadios = document.querySelectorAll('input[name="attending"]');
  const attendanceDetails = document.getElementById('rsvp-attendance-details');

  attendingRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.querySelectorAll('.attendance-radios .radio-card').forEach(c => c.classList.remove('active'));
      e.target.closest('.radio-card').classList.add('active');

      const isAttending = e.target.value === 'yes';
      if (attendanceDetails) {
        if (isAttending) {
          attendanceDetails.style.display = 'block';
        } else {
          // Hide number of guests and events attending when declining
          attendanceDetails.style.display = 'none';
        }
      }
    });
  });
}

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
  const guestsEl = document.getElementById('rsvp-guests');
  const guests = guestsEl ? guestsEl.value : '1';
  const message = document.getElementById('rsvp-message').value.trim();

  const eventsChecked = Array.from(document.querySelectorAll('input[name="events"]:checked'))
    .map(cb => cb.value)
    .join(', ');

  const rsvpData = {
    name,
    phone,
    attending,
    guests: attending === 'yes' ? guests : '0',
    events: attending === 'yes' ? eventsChecked : 'None',
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
      ? `🎉 Attending with <strong>${guests}</strong> guest(s) for <strong>${eventsChecked || 'All Celebrations'}</strong>`
      : `🕊️ Heartfelt blessings received with warm gratitude from afar`;
  }

  form.classList.add('hidden');
  successBox.classList.remove('hidden');

  fireConfetti();
  showToast(attending === 'yes' ? '🌸 Your RSVP has been confirmed with joy!' : '🕊️ Thank you for your warm wishes!');
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
   8. SOCIAL SHARING & UTILITIES
   Flower petals and gold confetti only (No hearts)
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
    // Custom flower petal shape (Strictly floral, no hearts)
    try {
      const petalPath = confetti.shapeFromPath({
        path: 'M12 2 C8 2 4 6 4 12 C4 18 8 22 12 22 C16 22 20 18 20 12 C20 6 16 2 12 2 Z'
      });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        shapes: [petalPath],
        colors: ['#f5b041', '#e67e22', '#d4af37', '#f48fb1', '#fff9c4']
      });
    } catch (e) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#f5b041', '#e67e22', '#d4af37', '#f48fb1', '#fff9c4']
      });
    }
  }
}
