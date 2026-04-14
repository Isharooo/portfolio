/* ========================================
   Portfolio - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  bustImageCache();
  initTypingEffect();
  initScrollReveal();
  initCounters();
  initSmoothScroll();
  initLerpScroll();
  initImageGalleries();
  initThesisSteps();
  initVppSteps();
  initPanelDropdowns();
  initLightbox();
  initContactTilt();
  initVppRipple();
  initCvWidget();
  initScrollTop();
  initHeroBackground();
  initThemeToggle();
});

/* ----------------------------------------
   Cache busting for images
   ---------------------------------------- */
function bustImageCache() {
  const v = '?v=3';
  document.querySelectorAll('img[src]').forEach(img => {
    if (img.src.includes('assets/') && !img.src.includes('?v=')) {
      img.src = img.getAttribute('src') + v;
    }
  });
  document.querySelectorAll('[data-src]').forEach(el => {
    if (!el.dataset.src.includes('?v=')) {
      el.dataset.src = el.dataset.src + v;
    }
  });
}

/* ----------------------------------------
   Navbar scroll effect
   ---------------------------------------- */
function initNavbar() {
  const nav = document.getElementById('nav');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('nav--scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ----------------------------------------
   Mobile menu
   ---------------------------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const links = mobileMenu.querySelectorAll('.mobile-menu__link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ----------------------------------------
   Typing effect for hero subtitle
   ---------------------------------------- */
function initTypingEffect() {
  const element = document.getElementById('typedText');
  const titles = [
    'Full Stack Developer',
    'KTH Engineering Student',
    'Problem Solver',
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let pauseTimer = null;

  function type() {
    const current = titles[titleIndex];

    if (!isDeleting) {
      element.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        pauseTimer = setTimeout(() => {
          isDeleting = true;
          type();
        }, 2200);
        return;
      }
      setTimeout(type, 80);
    } else {
      element.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    }
  }

  // Start after hero animations finish
  setTimeout(type, 1200);
}

/* ----------------------------------------
   Scroll reveal (Intersection Observer)
   ---------------------------------------- */
function initScrollReveal() {
  // Standard reveal elements
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Pipeline steps - staggered reveal
  const pipelineSteps = document.querySelectorAll('.reveal-step');

  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Find all steps and animate them sequentially
        pipelineSteps.forEach((step, index) => {
          setTimeout(() => {
            step.classList.add('visible');
          }, index * 150);
        });
        // Unobserve all after triggering
        pipelineSteps.forEach(step => stepObserver.unobserve(step));
      }
    });
  }, {
    threshold: 0.2,
  });

  // Only observe the first step to trigger the sequence
  if (pipelineSteps.length > 0) {
    stepObserver.observe(pipelineSteps[0]);
  }
}

/* ----------------------------------------
   Animated counters
   ---------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5,
  });

  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
  const target = parseFloat(element.dataset.target);
  const suffix = element.dataset.suffix || '';
  const decimals = parseInt(element.dataset.decimals) || 0;
  const duration = 1800;
  const startTime = performance.now();

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    const current = easedProgress * target;

    element.textContent = current.toFixed(decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toFixed(decimals) + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ----------------------------------------
   Smooth scroll for anchor links
   ---------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        smoothScrollTo(top, 900);
      }
    });
  });
}

/* ----------------------------------------
   Lerped smooth scroll (buttery feel)
   ---------------------------------------- */
function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let startTime = null;

  function ease(t) {
    // ease-in-out cubic
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + diff * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ----------------------------------------
   Momentum-based smooth page scroll
   ---------------------------------------- */
function initLerpScroll() {
  // Skip on touch devices — native scroll feels better
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  let current = window.scrollY;
  let target = window.scrollY;
  const lerp = 0.08;
  let rafId = null;
  let isScrolling = false;

  // Disable native smooth scroll so we can drive it ourselves
  document.documentElement.style.scrollBehavior = 'auto';

  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    target += e.deltaY;
    target = Math.max(0, Math.min(target, document.body.scrollHeight - window.innerHeight));
    if (!isScrolling) {
      isScrolling = true;
      rafId = requestAnimationFrame(animate);
    }
  }, { passive: false });

  // Sync on manual scrollbar drag / keyboard scroll
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      current = window.scrollY;
      target = window.scrollY;
    }
  });

  function animate() {
    current += (target - current) * lerp;
    // Snap when close enough
    if (Math.abs(target - current) < 0.5) {
      current = target;
      window.scrollTo(0, current);
      isScrolling = false;
      return;
    }
    window.scrollTo(0, current);
    rafId = requestAnimationFrame(animate);
  }
}

/* ----------------------------------------
   Image gallery (thumbnail → main image)
   ---------------------------------------- */
function initImageGalleries() {
  document.querySelectorAll('.img-showcase').forEach(gallery => {
    const mainImg = gallery.querySelector('.img-showcase__img');
    const thumbs = gallery.querySelectorAll('.img-showcase__thumb');

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const src = thumb.dataset.src;
        const alt = thumb.querySelector('img').alt;

        // Fade transition
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = src;
          mainImg.alt = alt;
          mainImg.style.opacity = '1';
        }, 200);

        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  });
}

/* ----------------------------------------
   Thesis interactive steps
   ---------------------------------------- */
function initThesisSteps() {
  const nav = document.getElementById('thesisStepsNav');
  const content = document.getElementById('thesisContent');
  const prevBtn = document.getElementById('thesisPrev');
  const nextBtn = document.getElementById('thesisNext');
  const counter = document.getElementById('thesisCurrentStep');

  if (!nav || !content) return;

  const stepBtns = nav.querySelectorAll('.thesis-step-btn');
  const panels = content.querySelectorAll('.thesis-panel');
  let current = 1;
  const total = stepBtns.length;

  function goToStep(step) {
    current = step;

    // Update buttons
    stepBtns.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.step) === step);
    });

    // Update panels
    panels.forEach(panel => {
      panel.classList.toggle('active', parseInt(panel.dataset.panel) === step);
    });

    // Scroll the active step button into view in the nav
    const activeBtn = nav.querySelector('.thesis-step-btn.active');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => goToStep(parseInt(btn.dataset.step)));
  });
}

/* ----------------------------------------
   VPP interactive steps
   ---------------------------------------- */
function initVppSteps() {
  const nav = document.getElementById('vppStepsNav');
  const content = document.getElementById('vppContent');
  const prevBtn = document.getElementById('vppPrev');
  const nextBtn = document.getElementById('vppNext');
  const counter = document.getElementById('vppCurrentStep');

  if (!nav || !content) return;

  const stepBtns = nav.querySelectorAll('.thesis-step-btn');
  const panels = content.querySelectorAll('.thesis-panel');
  let current = 1;
  const total = stepBtns.length;

  function goToStep(step) {
    current = step;
    stepBtns.forEach(btn => btn.classList.toggle('active', parseInt(btn.dataset.step) === step));
    panels.forEach(panel => panel.classList.toggle('active', parseInt(panel.dataset.panel) === step));

    const activeBtn = nav.querySelector('.thesis-step-btn.active');
    if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  stepBtns.forEach(btn => btn.addEventListener('click', () => goToStep(parseInt(btn.dataset.step))));
}

/* ----------------------------------------
   Convert tech & config sections to dropdowns
   ---------------------------------------- */
function initPanelDropdowns() {
  document.querySelectorAll('.thesis-panel__tech, .thesis-panel__settings').forEach(section => {
    const label = section.querySelector('.thesis-panel__tech-label, .thesis-panel__settings-label');
    if (!label) return;

    const details = document.createElement('details');
    details.className = 'project__dropdown';

    const summary = document.createElement('summary');
    summary.className = 'project__dropdown-title';
    summary.textContent = label.textContent;

    section.parentNode.insertBefore(details, section);
    details.appendChild(summary);

    // Move all children except the label into a content wrapper
    const content = document.createElement('div');
    content.className = 'project__dropdown-content';
    const children = [...section.children].filter(c => c !== label);
    children.forEach(child => content.appendChild(child));
    details.appendChild(content);

    section.remove();
  });
}

/* ----------------------------------------
   Lightbox for images
   ---------------------------------------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const counter = document.getElementById('lightboxCounter');
  if (!lightbox || !lightboxImg) return;

  let gallery = [];
  let currentIndex = 0;

  function showImage(index) {
    currentIndex = index;
    lightboxImg.src = gallery[index];
    lightboxImg.alt = 'Image ' + (index + 1);
    if (counter) counter.textContent = (index + 1) + ' / ' + gallery.length;
  }

  function openLightbox(images, startIndex) {
    gallery = images;
    currentIndex = startIndex || 0;
    const isGallery = gallery.length > 1;
    if (prevBtn) prevBtn.hidden = !isGallery;
    if (nextBtn) nextBtn.hidden = !isGallery;
    if (counter) counter.hidden = !isGallery;
    showImage(currentIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    gallery = [];
  }

  // Single-image targets
  const targets = document.querySelectorAll('.img-showcase__img, .thesis-panel__preview img, [data-lightbox]');
  targets.forEach(img => {
    img.addEventListener('click', () => {
      openLightbox([img.src], 0);
    });
  });

  // Luday gallery button
  const ludayBtn = document.getElementById('ludayGalleryBtn');
  if (ludayBtn) {
    const ludayImages = [
      'assets/images/Payment-Luday.png',
      'assets/images/Pricing-Luday.png',
      'assets/images/Settings-Luday.png'
    ];
    ludayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(ludayImages, 0);
    });
  }

  // Navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage((currentIndex - 1 + gallery.length) % gallery.length);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage((currentIndex + 1) % gallery.length);
    });
  }

  // Close button
  const closeBtn = lightbox.querySelector('.lightbox__close');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  // Close on background click (not on image or buttons)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && gallery.length > 1) {
      showImage((currentIndex - 1 + gallery.length) % gallery.length);
    }
    if (e.key === 'ArrowRight' && gallery.length > 1) {
      showImage((currentIndex + 1) % gallery.length);
    }
  });
}

/* ----------------------------------------
   Contact Cards: 3D Perspective Tilt
   ---------------------------------------- */
function initContactTilt() {
  document.querySelectorAll('.contact-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 14;
      const rotateY = (centerX - x) / 14;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ----------------------------------------
   VPP Flow Steps: Ripple on Hover
   ---------------------------------------- */
function initVppRipple() {
  document.querySelectorAll('.vpp-flow__step').forEach(step => {
    step.addEventListener('mouseenter', (e) => {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = step.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      step.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* ----------------------------------------
   CV Sidebar Widget
   ---------------------------------------- */
function initCvWidget() {
  const widget = document.getElementById('cvWidget');
  const tab = document.getElementById('cvTab');
  const close = document.getElementById('cvClose');
  const themeToggle = document.getElementById('themeToggle');
  if (!widget || !tab) return;

  function hideThemeToggle() {
    if (themeToggle) { themeToggle.style.opacity = '0'; themeToggle.style.pointerEvents = 'none'; }
  }
  function showThemeToggle() {
    if (themeToggle) { themeToggle.style.opacity = ''; themeToggle.style.pointerEvents = ''; }
  }

  tab.addEventListener('click', () => {
    widget.classList.add('active');
    hideThemeToggle();
    // Lazy-load the CV iframe on first open
    const iframe = widget.querySelector('iframe');
    if (iframe && !iframe.src && iframe.dataset.src) {
      iframe.src = iframe.dataset.src;
    }
  });

  if (close) {
    close.addEventListener('click', () => {
      widget.classList.remove('active');
      showThemeToggle();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && widget.classList.contains('active')) {
      widget.classList.remove('active');
      showThemeToggle();
    }
  });

  // Close on click outside panel
  widget.querySelector('.cv-widget__panel').addEventListener('click', (e) => {
    e.stopPropagation();
  });

  document.addEventListener('click', (e) => {
    if (widget.classList.contains('active') && !widget.contains(e.target)) {
      widget.classList.remove('active');
      showThemeToggle();
    }
  });
}

/* ----------------------------------------
   Scroll to Top Button
   ---------------------------------------- */
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ----------------------------------------
   Hero Background (Constellation / Aurora)
   ---------------------------------------- */
function initHeroBackground() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let mouse = { x: 0.5, y: 0.5, active: false };
  const hero = canvas.parentElement.parentElement;

  function resize() {
    const r = hero.getBoundingClientRect();
    canvas.width = r.width * devicePixelRatio;
    canvas.height = r.height * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) / r.width;
    mouse.y = (e.clientY - r.top) / r.height;
    mouse.active = true;
  });
  hero.addEventListener('mouseleave', () => { mouse.active = false; });

  function w() { return canvas.width / devicePixelRatio; }
  function h() { return canvas.height / devicePixelRatio; }

  // Constellation stars
  const stars = [];
  for (let i = 0; i < 110; i++) {
    stars.push({ x: Math.random(), y: Math.random(), s: 1 + Math.random() * 1 });
  }

  // Aurora time
  let t = 0;
  // Smoothed mouse for aurora (prevents jumping)
  let smoothMx = 0.5, smoothMy = 0.5;

  function getAccent() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? [201, 169, 110] : [139, 111, 71];
  }

  function getBg() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? [18, 18, 18] : [249, 245, 238];
  }

  function drawConstellation() {
    const W = w(), H = h();
    const accent = getAccent();
    ctx.clearRect(0, 0, W, H);
    const mx = mouse.x * W, my = mouse.y * H;
    const radius = 220;

    stars.forEach(st => {
      const sx = st.x * W, sy = st.y * H;
      const distM = Math.hypot(sx - mx, sy - my);
      const glow = mouse.active && distM < radius ? 1 - distM / radius : 0;
      ctx.beginPath();
      ctx.arc(sx, sy, st.s + glow * 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + accent + ',' + (0.15 + glow * 0.55) + ')';
      ctx.fill();
    });

    if (mouse.active) {
      for (let i = 0; i < stars.length; i++) {
        const a = stars[i], ax = a.x * W, ay = a.y * H;
        if (Math.hypot(ax - mx, ay - my) > radius) continue;
        for (let j = i + 1; j < stars.length; j++) {
          const b = stars[j], bx = b.x * W, by = b.y * H;
          if (Math.hypot(bx - mx, by - my) > radius) continue;
          const d = Math.hypot(ax - bx, ay - by);
          if (d < radius) {
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.strokeStyle = 'rgba(' + accent + ',' + (0.22 * (1 - d / radius)) + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }
  }

  function drawAurora() {
    const W = w(), H = h();
    const bg = getBg();
    const accent = getAccent();
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgb(' + bg + ')';
    ctx.fillRect(0, 0, W, H);
    // Lerp toward actual mouse for smooth transition
    const targetX = mouse.active ? mouse.x : 0.5;
    const targetY = mouse.active ? mouse.y : 0.5;
    smoothMx += (targetX - smoothMx) * 0.04;
    smoothMy += (targetY - smoothMy) * 0.04;
    t += 0.012;
    for (let wave = 0; wave < 6; wave++) {
      ctx.beginPath();
      const yBase = H * 0.25 + wave * H * 0.1;
      const amp = 25 + wave * 10 + (smoothMy - 0.5) * 50;
      const freq = 0.006 + wave * 0.002;
      const phase = t * (1 + wave * 0.3) + smoothMx * 4;
      for (let x = 0; x <= W; x += 2) {
        const y = yBase + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 2.3 + phase * 1.5) * amp * 0.3;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fillStyle = 'rgba(' + accent + ',' + (0.03 + wave * 0.018) + ')';
      ctx.fill();
    }
  }

  function draw() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      drawAurora();
    } else {
      drawConstellation();
    }
    requestAnimationFrame(draw);
  }
  draw();

  // Expose for theme toggle
  window._heroCanvas = { canvas, ctx };
}

/* ----------------------------------------
   Theme Toggle (Light / Dark)
   ---------------------------------------- */
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const overlay = document.getElementById('themeOverlay');
  let transitioning = false;

  // Restore saved theme
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  /* --- Clock Sweep with real page content ---
       The OUTGOING theme is cloned as an overlay and shrinks away,
       revealing the real page (already switched to the new theme) underneath.
       toDark = true  → light clone shrinks CW
       toDark = false → dark clone shrinks CCW (mirrored) */
  function runClockSweep(toDark, onDone) {
    var scrollY = window.scrollY;

    // Clone carries the OUTGOING theme
    var snap = document.createElement('div');
    snap.setAttribute('data-theme', toDark ? 'light' : 'dark');
    snap.style.cssText = 'position:fixed;inset:0;z-index:10000;pointer-events:none;overflow:hidden;';

    var inner = document.createElement('div');
    inner.style.cssText = 'position:absolute;inset:0;background:var(--bg-primary);overflow:hidden;';

    var clone = document.body.cloneNode(true);
    clone.style.cssText = 'margin:0;pointer-events:none;position:absolute;top:0;left:0;right:0;transform:translateY(' + (-scrollY) + 'px);';
    clone.querySelectorAll('script, iframe, canvas, .theme-toggle, .scroll-top, .theme-overlay, .cv-widget').forEach(function(el) { el.remove(); });
    clone.querySelectorAll('[id]').forEach(function(el) { el.removeAttribute('id'); });

    inner.appendChild(clone);
    snap.appendChild(inner);
    overlay.appendChild(snap);

    // Start fully covering the screen
    snap.style.clipPath = 'inset(0)';

    // CW shrink: sweep arm moves CW from 12 o'clock, remaining visible area shrinks
    function clipShrinkCW(a) {
      if (a <= 0) return 'inset(0)';
      if (a >= 360) return 'polygon(50% 50%, 50% 0%, 50% 0%)';
      var rad = (a - 90) * Math.PI / 180;
      var pts = ['50% 50%'];
      // Sweep arm endpoint
      pts.push((50 + Math.cos(rad) * 150).toFixed(1) + '% ' + (50 + Math.sin(rad) * 150).toFixed(1) + '%');
      // Remaining corners in CW order (only those not yet swept)
      if (a < 45)  pts.push('100% 0%');    // 45°
      if (a < 135) pts.push('100% 100%');   // 135°
      if (a < 225) pts.push('0% 100%');     // 225°
      if (a < 315) pts.push('0% 0%');       // 315°
      pts.push('50% 0%');
      return 'polygon(' + pts.join(', ') + ')';
    }

    // CCW shrink: sweep arm moves CCW from 12 o'clock (mirrored)
    function clipShrinkCCW(a) {
      if (a <= 0) return 'inset(0)';
      if (a >= 360) return 'polygon(50% 50%, 50% 0%, 50% 0%)';
      var rad = (-(a) + 360 - 90) * Math.PI / 180;
      var pts = ['50% 50%'];
      // Sweep arm endpoint
      pts.push((50 + Math.cos(rad) * 150).toFixed(1) + '% ' + (50 + Math.sin(rad) * 150).toFixed(1) + '%');
      // Remaining corners in CCW order (only those not yet swept)
      if (a < 45)  pts.push('0% 0%');       // 315° position
      if (a < 135) pts.push('0% 100%');      // 225° position
      if (a < 225) pts.push('100% 100%');    // 135° position
      if (a < 315) pts.push('100% 0%');      // 45° position
      pts.push('50% 0%');
      return 'polygon(' + pts.join(', ') + ')';
    }

    var clipFn = toDark ? clipShrinkCW : clipShrinkCCW;
    var angle = 0;
    var step = 8;

    function tick() {
      angle += step;
      if (angle >= 360) angle = 360;
      snap.style.clipPath = clipFn(angle);
      if (angle < 360) {
        requestAnimationFrame(tick);
      } else {
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            snap.remove();
            onDone();
          });
        });
      }
    }

    // Double-rAF: ensure clone is painted, then switch theme underneath, then animate
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        // Switch real page theme NOW (hidden under clone)
        if (toDark) {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
        }
        // One more frame for new theme to render underneath
        requestAnimationFrame(function() {
          requestAnimationFrame(tick);
        });
      });
    });
  }

  btn.addEventListener('click', function() {
    if (transitioning) return;
    transitioning = true;
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    runClockSweep(!isDark, function() { transitioning = false; });
  });
}
