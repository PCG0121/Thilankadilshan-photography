/* ═══════════════════════════════════════════════════════════════
   2K STUDIO — ADVANCED ANIMATIONS
   Inspired by Ceylon Wedlock's cinematic animation style.
   
   Features:
   • Line-by-line text reveal  [data-line-anim]
   • Character cascade         [data-char-anim]
   • Image overlay wipe        .img-reveal wrapper
   • Section counter strip     .anim-counter
   • Enhanced stagger reveals  [data-stagger]
   • Horizontal slide-in lines
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────
     UTILITY: Wait for DOM ready
  ───────────────────────────────────────────── */
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* ─────────────────────────────────────────────
     1. LINE-BY-LINE TEXT REVEAL
     
     Usage: Add [data-line-anim] to any element.
     Each line of text slides up from below with stagger.
     Inspired by Ceylon Wedlock's js-line-animation.
  ───────────────────────────────────────────── */
  function initLineAnimations() {
    const elements = document.querySelectorAll('[data-line-anim]');
    if (!elements.length) return;

    elements.forEach(el => {
      // Split text into lines using a temporary approach
      splitIntoLines(el);

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lines = el.querySelectorAll('.line-wrap');
            lines.forEach((line, i) => {
              line.style.transitionDelay = `${i * 0.08 + (parseFloat(el.dataset.delay) || 0)}s`;
              line.classList.add('visible');
            });
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      observer.observe(el);
    });
  }

  function splitIntoLines(el) {
    // Mark as processed
    el.setAttribute('data-line-split', 'true');
    el.style.visibility = 'hidden';

    const originalHTML = el.innerHTML;
    const text = el.innerText;

    // Use a canvas-like technique: render words, detect line breaks by y-position
    const words = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      const wordList = node.textContent.split(/\s+/).filter(Boolean);
      wordList.forEach(word => {
        const span = document.createElement('span');
        span.className = 'word-measure';
        span.style.cssText = 'display:inline-block;white-space:pre;';
        span.textContent = word + ' ';
        words.push({ span, parent, text: word });
      });
    }

    // Clear and re-insert as measurable spans
    el.innerHTML = '';
    words.forEach(w => el.appendChild(w.span));

    // Group by top offset (same line = same top)
    requestAnimationFrame(() => {
      const lineGroups = [];
      let currentTop = null;
      let currentGroup = [];

      words.forEach(w => {
        const top = w.span.getBoundingClientRect().top;
        if (currentTop === null || Math.abs(top - currentTop) > 4) {
          if (currentGroup.length) lineGroups.push(currentGroup);
          currentGroup = [w];
          currentTop = top;
        } else {
          currentGroup.push(w);
        }
      });
      if (currentGroup.length) lineGroups.push(currentGroup);

      // Build final line structure
      el.innerHTML = '';
      lineGroups.forEach((group, lineIdx) => {
        const outer = document.createElement('div');
        outer.className = 'line-outer';
        outer.style.overflow = 'hidden';
        outer.style.paddingBottom = '0.05em';

        const inner = document.createElement('div');
        inner.className = 'line-wrap';
        inner.textContent = group.map(w => w.text).join(' ');

        outer.appendChild(inner);
        el.appendChild(outer);
      });

      el.style.visibility = 'visible';
    });
  }

  /* ─────────────────────────────────────────────
     2. CHARACTER CASCADE ANIMATION
     
     Usage: Add [data-char-anim] to heading elements.
     Each character animates in with a stagger, similar
     to high-end fashion site heading reveals.
  ───────────────────────────────────────────── */
  function initCharAnimations() {
    const elements = document.querySelectorAll('[data-char-anim]');
    if (!elements.length) return;

    elements.forEach(el => {
      const originalText = el.textContent;
      const delay = parseFloat(el.dataset.charDelay) || 0;

      // Wrap each char in a span
      el.innerHTML = '';
      el.style.visibility = 'hidden';

      [...originalText].forEach((char, i) => {
        const outer = document.createElement('span');
        outer.className = 'char-outer';
        outer.style.overflow = 'hidden';
        outer.style.display = 'inline-block';
        outer.style.verticalAlign = 'bottom';

        const inner = document.createElement('span');
        inner.className = 'char-inner';
        inner.textContent = char === ' ' ? '\u00A0' : char;

        outer.appendChild(inner);
        el.appendChild(outer);
      });

      el.style.visibility = 'visible';

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const chars = el.querySelectorAll('.char-inner');
            chars.forEach((ch, i) => {
              ch.style.transitionDelay = `${i * 0.025 + delay}s`;
              ch.classList.add('visible');
            });
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.2 });

      observer.observe(el);
    });
  }

  /* ─────────────────────────────────────────────
     3. IMAGE OVERLAY WIPE REVEAL
     
     Usage: Wrap images in <div class="img-reveal">
     An overlay slides away (left or right) to reveal
     the image. Direction: data-reveal-dir="left|right"
  ───────────────────────────────────────────── */
  function initImageReveal() {
    const wrappers = document.querySelectorAll('.img-reveal');
    if (!wrappers.length) return;

    wrappers.forEach(wrapper => {
      // Inject overlay if not already there
      if (!wrapper.querySelector('.img-reveal-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'img-reveal-overlay';
        wrapper.appendChild(overlay);
      }

      const overlay = wrapper.querySelector('.img-reveal-overlay');
      const dir = wrapper.dataset.revealDir || 'left';
      const img = wrapper.querySelector('img');
      if (img) img.style.transform = 'scale(1.08)';

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Trigger overlay wipe
            wrapper.classList.add('revealed');
            // Scale image to normal
            if (img) {
              setTimeout(() => {
                img.style.transition = 'transform 1.6s cubic-bezier(0.25, 1, 0.5, 1)';
                img.style.transform = 'scale(1)';
              }, 200);
            }
            observer.unobserve(wrapper);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

      observer.observe(wrapper);
    });
  }

  /* ─────────────────────────────────────────────
     4. STAGGER CHILDREN REVEAL
     
     Usage: Add [data-stagger] to parent container.
     Children animate in with stagger delay.
     [data-stagger-delay="0.1"] = delay between items
  ───────────────────────────────────────────── */
  function initStaggerReveal() {
    const containers = document.querySelectorAll('[data-stagger]');
    if (!containers.length) return;

    containers.forEach(container => {
      const children = container.querySelectorAll('[data-stagger-item]') 
                    || container.children;
      const items = container.querySelectorAll('[data-stagger-item]');
      const delay = parseFloat(container.dataset.staggerDelay) || 0.1;

      items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            items.forEach((item, i) => {
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              }, i * (delay * 1000));
            });
            observer.unobserve(container);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(container);
    });
  }

  /* ─────────────────────────────────────────────
     5. HORIZONTAL LINE DRAW
     
     Usage: Add class .anim-line to any <hr> or <div>
     Line draws from left to right on scroll.
  ───────────────────────────────────────────── */
  function initLineDraws() {
    const lines = document.querySelectorAll('.anim-line');
    if (!lines.length) return;

    lines.forEach(line => {
      line.style.transformOrigin = 'left center';
      line.style.transform = 'scaleX(0)';
      line.style.transition = 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const d = parseFloat(line.dataset.delay) || 0;
            setTimeout(() => {
              line.style.transform = 'scaleX(1)';
            }, d * 1000);
            observer.unobserve(line);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(line);
    });
  }

  /* ─────────────────────────────────────────────
     6. SECTION NUMBER COUNTER
     
     Usage: <span class="anim-counter" data-target="350" data-suffix="+">
     Counts up to the target number on scroll.
  ───────────────────────────────────────────── */
  function initCounters() {
    const counters = document.querySelectorAll('.anim-counter:not(.counted)');
    if (!counters.length) return;

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10) || 0;
      const suffix = counter.dataset.suffix || '';
      const duration = parseInt(counter.dataset.duration, 10) || 2000;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            counter.classList.add('counted');
            const start = performance.now();
            const tick = (now) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              counter.textContent = Math.floor(eased * target) + suffix;
              if (progress < 1) requestAnimationFrame(tick);
              else counter.textContent = target + suffix;
            };
            requestAnimationFrame(tick);
            observer.unobserve(counter);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(counter);
    });
  }

  /* ─────────────────────────────────────────────
     7. MAGNETIC BUTTON ENHANCED
     
     Usage: Add class .btn-magnetic to buttons/links.
     More precise magnetic pull than basic version.
  ───────────────────────────────────────────── */
  function initMagneticButtons() {
    if (window.matchMedia('(hover: none)').matches) return;
    
    const btns = document.querySelectorAll('.btn-magnetic, .magnetic-btn');
    btns.forEach(btn => {
      let isHovering = false;
      let animFrame;

      btn.addEventListener('mouseenter', () => {
        isHovering = true;
        btn.style.transition = 'transform 0.1s ease';
      });

      btn.addEventListener('mousemove', (e) => {
        if (!isHovering) return;
        cancelAnimationFrame(animFrame);
        animFrame = requestAnimationFrame(() => {
          const rect = btn.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) * 0.35;
          const dy = (e.clientY - cy) * 0.35;
          btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
      });

      btn.addEventListener('mouseleave', () => {
        isHovering = false;
        cancelAnimationFrame(animFrame);
        btn.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        btn.style.transform = 'translate(0, 0)';
        setTimeout(() => { if (btn) btn.style.transition = ''; }, 600);
      });
    });
  }

  /* ─────────────────────────────────────────────
     8. WORDS SLIDE FROM RIGHT
     
     Usage: Add [data-words-right] to paragraphs.
     Words cascade in from the right side.
  ───────────────────────────────────────────── */
  function initWordsFromRight() {
    const elements = document.querySelectorAll('[data-words-right]');
    if (!elements.length) return;

    elements.forEach(el => {
      const text = el.textContent;
      const words = text.split(/\s+/).filter(Boolean);
      el.innerHTML = '';
      el.style.visibility = 'hidden';

      words.forEach((word, i) => {
        const outer = document.createElement('span');
        outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';

        const inner = document.createElement('span');
        inner.className = 'word-from-right';
        inner.textContent = word;
        inner.style.cssText = `
          display: inline-block;
          transform: translateX(80px);
          opacity: 0;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease;
          transition-delay: ${i * 0.04}s;
        `;

        outer.appendChild(inner);
        el.appendChild(outer);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      });

      el.style.visibility = 'visible';

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.querySelectorAll('.word-from-right').forEach(w => {
              w.style.transform = 'translateX(0)';
              w.style.opacity = '1';
            });
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.2 });

      observer.observe(el);
    });
  }

  /* ─────────────────────────────────────────────
     9. FLOATING LABEL (section markers)
     
     Usage: Add .anim-label to small section labels.
     They slide in from left with a fade.
  ───────────────────────────────────────────── */
  function initSectionLabels() {
    const labels = document.querySelectorAll('.anim-label');
    labels.forEach(label => {
      label.style.cssText += `
        opacity: 0;
        transform: translateX(-20px);
        transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
      `;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const d = parseFloat(label.dataset.delay) || 0;
            setTimeout(() => {
              label.style.opacity = '1';
              label.style.transform = 'translateX(0)';
            }, d * 1000);
            observer.unobserve(label);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(label);
    });
  }

  /* ─────────────────────────────────────────────
     10. CINEMATIC SECTION TRANSITION
     
     Adds a subtle color wash effect when entering
     dark/light sections on scroll.
  ───────────────────────────────────────────── */
  function initSectionTransitions() {
    const sections = document.querySelectorAll('section[data-theme-shift]');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const theme = entry.target.dataset.themeShift;
          document.body.dataset.currentTheme = theme;
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(s => observer.observe(s));
  }

  /* ─────────────────────────────────────────────
     11. SMOOTH SCROLL PROGRESS BAR
     
     A thin gold line at top of page showing
     reading progress — inspired by editorial sites.
  ───────────────────────────────────────────── */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (scrolled / total) * 100 : 0;
      bar.style.width = progress + '%';
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ─────────────────────────────────────────────
     12. PARALLAX LAYERS
     
     Usage: Add [data-parallax="0.3"] to elements.
     Number = speed multiplier (0.1 = subtle, 0.5 = strong)
  ───────────────────────────────────────────── */
  function initParallaxLayers() {
    if (prefersReducedMotion) return;
    
    const elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length) return;

    const update = () => {
      const scrollY = window.scrollY;
      elements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        const offset = (centerY - viewCenter) * speed;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ─────────────────────────────────────────────
     INIT ALL
  ───────────────────────────────────────────── */
  onReady(() => {
    if (prefersReducedMotion) return;

    initLineAnimations();
    initCharAnimations();
    initImageReveal();
    initStaggerReveal();
    initLineDraws();
    initCounters();
    initMagneticButtons();
    initWordsFromRight();
    initSectionLabels();
    initSectionTransitions();
    initScrollProgress();
    initParallaxLayers();
  });

  // Expose for external use
  window.TDAnimations = {
    refreshAll: () => {
      initLineAnimations();
      initImageReveal();
      initStaggerReveal();
      initCounters();
      initMagneticButtons();
    }
  };

})();
