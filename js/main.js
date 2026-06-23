/* ─────────────────────────────────────────────
   2K STUDIO — MAIN JAVASCRIPT
   GSAP Animations · Lenis Scroll · WebGL · Cursor
───────────────────────────────────────────── */

(function () {
  'use strict';

  /* ══════════════════════════════════════
     GSAP REGISTRATION
  ══════════════════════════════════════ */
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  /* ══════════════════════════════════════
     LENIS SMOOTH SCROLL
  ══════════════════════════════════════ */
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ══════════════════════════════════════
     PRELOADER
  ══════════════════════════════════════ */
  const preloader = document.getElementById('preloader');
  const counter   = document.getElementById('counter');
  const bar       = document.querySelector('.preloader-bar');

  let count = 0;
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 8) + 2;
    if (count >= 100) count = 100;
    counter.textContent = count;
    bar.style.width = count + '%';
    if (count === 100) {
      clearInterval(interval);
      setTimeout(revealSite, 400);
    }
  }, 50);

  function revealSite() {
    // Step 1: Fade out preloader content
    const tl = gsap.timeline();
    tl.to(preloader, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        preloader.style.display = 'none';
        // Step 2: Cinematic curtain wipe
        const curtain = document.getElementById('preloader-curtain');
        if (curtain) {
          curtain.classList.add('exit');
          setTimeout(() => {
            curtain.style.display = 'none';
            document.body.classList.remove('loading');
            initHeroAnimations();
            // Step 3: Reveal hero words
            setTimeout(() => {
              document.querySelectorAll('.hero-word').forEach(w => w.classList.add('visible'));
            }, 100);
          }, 800);
        } else {
          document.body.classList.remove('loading');
          initHeroAnimations();
          setTimeout(() => {
            document.querySelectorAll('.hero-word').forEach(w => w.classList.add('visible'));
          }, 100);
        }
      }
    });
  }

  /* ══════════════════════════════════════
     CUSTOM CURSOR
  ══════════════════════════════════════ */
  const cursor = document.getElementById('cursor');
  const dot    = cursor.querySelector('.cursor-dot');
  const ring   = cursor.querySelector('.cursor-ring');
  const label  = cursor.querySelector('.cursor-label');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX;
  let ringY  = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.05, ease: 'none' });
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    gsap.set(ring, { x: ringX, y: ringY });
    gsap.set(label, { x: ringX, y: ringY });
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Interactive elements
  document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-text');
      label.textContent = el.dataset.cursor;
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-text');
    });
  });

  document.querySelectorAll('a, button, .filter-btn, .case-study-link, .btn-primary').forEach(el => {
    if (!el.hasAttribute('data-cursor')) {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    }
  });

  /* ══════════════════════════════════════
     NAVIGATION
  ══════════════════════════════════════ */
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false;

  // Scroll Effect
  lenis.on('scroll', ({ scroll }) => {
    if (scroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger
  hamburger.addEventListener('click', toggleMenu);
  function toggleMenu() {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('active', menuOpen);
    mobileMenu.classList.toggle('open', menuOpen);
    if (menuOpen) {
      lenis.stop();
      // Ceylon Wedlock style: stagger links in with CSS transitions
      mobileMenu.classList.remove('animating');
      const links = mobileMenu.querySelectorAll('.mobile-nav-link');
      links.forEach(link => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(24px)';
      });
      requestAnimationFrame(() => {
        mobileMenu.classList.add('animating');
        links.forEach((link, i) => {
          link.style.transitionDelay = `${0.15 + i * 0.07}s`;
        });
      });
    } else {
      lenis.start();
      mobileMenu.classList.remove('animating');
    }
  }

  // Close Menu on Link Click
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu();
    });
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href.length <= 1) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0, duration: 1.6 });
      }
    });
  });

  /* ══════════════════════════════════════
     HERO ANIMATIONS
  ══════════════════════════════════════ */
  function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-word', {
      y: 0, opacity: 1,
      duration: 1.2,
      stagger: 0.12,
      ease: 'power4.out'
    })
    .to('.hero-tag', {
      y: 0, opacity: 1, duration: 0.8
    }, '-=0.6')
    .to('.hero-sub', {
      y: 0, opacity: 1, duration: 0.8
    }, '-=0.5')
    .to('.hero-cta', {
      y: 0, opacity: 1, duration: 0.8
    }, '-=0.6')
    .to('.hero-footer', {
      opacity: 1, duration: 0.8
    }, '-=0.4');

    // Stats counter
    setTimeout(() => {
      document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2.4,
          ease: 'power2.out',
          delay: 0.5,
          onUpdate: function() {
            el.textContent = Math.floor(this.targets()[0].val);
          }
        });
      });
    }, 600);
  }

  /* ══════════════════════════════════════
     WEBGL HERO CANVAS (Grain + Vignette)
  ══════════════════════════════════════ */
  function initWebGL() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const vertSrc = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
    const fragSrc = `
      precision mediump float;
      uniform float u_time;
      uniform vec2  u_res;

      float rand(vec2 co) {
        return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        float noise = rand(uv + u_time * 0.01) * 0.06;
        float vign  = uv.x * (1.0 - uv.x) * uv.y * (1.0 - uv.y) * 8.0;
        vign = clamp(vign, 0.0, 1.0);
        float v = noise * (1.0 - vign * 0.5);
        gl_FragColor = vec4(v, v, v, 0.6);
      }
    `;

    function compileShader(src, type) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(vertSrc, gl.VERTEX_SHADER));
    gl.attachShader(prog, compileShader(fragSrc, gl.FRAGMENT_SHADER));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1, 1,-1, -1,1, 1,1
    ]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes  = gl.getUniformLocation(prog, 'u_res');
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);

    let t = 0;
    function render() {
      t += 0.5;
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }
    render();

    window.addEventListener('resize', () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    });
  }
  initWebGL();

  /* ══════════════════════════════════════
     SCROLL ANIMATIONS
  ══════════════════════════════════════ */
  function initScrollAnimations() {

    // Section titles reveal
    gsap.utils.toArray('.reveal-text').forEach(el => {
      gsap.fromTo(el,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    // Section labels
    gsap.utils.toArray('.section-label-wrap').forEach(el => {
      gsap.fromTo(el,
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        }
      );
    });

    // Featured items
    gsap.utils.toArray('.featured-item').forEach((item, i) => {
      gsap.fromTo(item,
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 80%' }
        }
      );
    });

    // Portfolio Grid items
    gsap.utils.toArray('.grid-item').forEach((item, i) => {
      gsap.fromTo(item,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: i * 0.05,
          scrollTrigger: { trigger: item, start: 'top 90%' }
        }
      );
    });

    // Case Study Rows
    gsap.utils.toArray('.case-study-row').forEach((row, i) => {
      gsap.fromTo(row,
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: i * 0.1,
          scrollTrigger: { trigger: row, start: 'top 88%' }
        }
      );
    });

    // About content
    gsap.fromTo('.about-content > *',
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-content', start: 'top 75%' }
      }
    );

    gsap.fromTo('.about-img-wrap',
      { scale: 1.1, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-visual', start: 'top 80%' }
      }
    );

    gsap.fromTo('.badge',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-badges', start: 'top 85%' }
      }
    );

    // Services list
    gsap.fromTo('.services-list li',
      { x: -20, opacity: 0 },
      {
        x: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.services-list', start: 'top 80%' }
      }
    );

    // Contact form
    gsap.fromTo('.form-group',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.contact-form', start: 'top 80%' }
      }
    );

    // Parallax on images
    gsap.utils.toArray('.parallax-img').forEach(img => {
      gsap.fromTo(img,
        { y: '-8%' },
        {
          y: '8%',
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.featured-media, .about-img-wrap'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    });

    // Hero bg subtle scale
    gsap.fromTo('.hero-bg-img',
      { scale: 1.1 },
      {
        scale: 1.0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      }
    );

  }

  /* Wait for DOM to be ready before scroll animations */
  window.addEventListener('load', () => {
    initScrollAnimations();
    initSectionReveal();
    initCursorTrail();
    initStatUnderlines();
  });

  /* ══════════════════════════════════════
     SECTION REVEAL (data-section-reveal)
  ══════════════════════════════════════ */
  function initSectionReveal() {
    const els = document.querySelectorAll('[data-section-reveal]');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseFloat(entry.target.dataset.revealDelay) || 0;
          setTimeout(() => entry.target.classList.add('in-view'), delay * 1000);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
  }

  /* ══════════════════════════════════════
     CURSOR TRAIL
  ══════════════════════════════════════ */
  function initCursorTrail() {
    if (window.matchMedia('(hover: none)').matches) return;
    const trailCount = 6;
    const trails = [];
    for (let i = 0; i < trailCount; i++) {
      const t = document.createElement('div');
      t.className = 'cursor-trail';
      document.body.appendChild(t);
      trails.push({ el: t, x: 0, y: 0 });
    }
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
    });
    const animTrail = () => {
      let lx = mouseX, ly = mouseY;
      trails.forEach((trail, i) => {
        const delay = 1 - (i / trailCount) * 0.8;
        trail.x += (lx - trail.x) * delay * 0.18;
        trail.y += (ly - trail.y) * delay * 0.18;
        const scale = 1 - (i / trailCount) * 0.6;
        trail.el.style.cssText = `
          left: ${trail.x}px;
          top: ${trail.y}px;
          opacity: ${(1 - i / trailCount) * 0.35};
          transform: translate(-50%, -50%) scale(${scale});
        `;
        lx = trail.x; ly = trail.y;
      });
      requestAnimationFrame(animTrail);
    };
    animTrail();
  }

  /* ══════════════════════════════════════
     STAT ITEM UNDERLINES (on scroll)
  ══════════════════════════════════════ */
  function initStatUnderlines() {
    const items = document.querySelectorAll('.stat-item');
    if (!items.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    items.forEach(item => obs.observe(item));
  }

  /* ══════════════════════════════════════
     PORTFOLIO FILTER
  ══════════════════════════════════════ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const gridItems  = document.querySelectorAll('.grid-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      gridItems.forEach(item => {
        const cat = item.dataset.category;
        const show = filter === 'all' || cat === filter;
        gsap.to(item, {
          opacity: show ? 1 : 0,
          scale: show ? 1 : 0.95,
          duration: 0.4,
          ease: 'power2.inOut',
          onComplete: () => {
            item.classList.toggle('hidden', !show);
          }
        });
        if (show) {
          item.classList.remove('hidden');
          gsap.to(item, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
        }
      });
    });
  });

  /* ══════════════════════════════════════
     CONTACT FORM
  ══════════════════════════════════════ */
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btnText = submitBtn.querySelector('.btn-text');
      btnText.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate send
      await new Promise(r => setTimeout(r, 1800));

      gsap.to(submitBtn, { backgroundColor: '#2d7a4e', duration: 0.4 });
      btnText.textContent = 'Message Sent ✓';

      setTimeout(() => {
        gsap.to(submitBtn, { backgroundColor: '#c9a96e', duration: 0.4 });
        btnText.textContent = 'Send Enquiry';
        submitBtn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

  /* ══════════════════════════════════════
     PAGE TRANSITION
  ══════════════════════════════════════ */
  function pageTransition(href) {
    const blocks = document.querySelectorAll('.transition-block');
    const tl = gsap.timeline({
      onComplete: () => { window.location.href = href; }
    });
    tl.to(blocks, {
      scaleY: 1,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power3.inOut',
      transformOrigin: 'bottom'
    });
  }

  document.querySelectorAll('.case-study-link, .cs-next, a.case-study-row').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      e.preventDefault();
      pageTransition(href);
    });
  });

  // Intro transition on page load
  const blocks = document.querySelectorAll('.transition-block');
  gsap.set(blocks, { scaleY: 1, transformOrigin: 'top' });
  gsap.to(blocks, {
    scaleY: 0,
    duration: 0.6,
    stagger: 0.08,
    ease: 'power3.inOut',
    delay: 0.3
  });

  /* ══════════════════════════════════════
     HERO H1 WORD SPLIT
  ══════════════════════════════════════ */
  (function splitHeroH1() {
    const h1 = document.querySelector('.hero h1');
    if (!h1) return;
    const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(textNode => {
      const words = textNode.textContent.split(/\s+/).filter(Boolean);
      const frag = document.createDocumentFragment();
      words.forEach((word, i) => {
        const outer = document.createElement('span');
        outer.className = 'hero-word';
        outer.innerHTML = `<span class="hero-word-inner">${word}</span>`;
        frag.appendChild(outer);
        if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
      });
      textNode.replaceWith(frag);
    });
  })();

  /* ══════════════════════════════════════
     MARQUEE PAUSE ON HOVER
  ══════════════════════════════════════ */
  const marquee = document.getElementById('marquee-track');
  if (marquee) {
    marquee.addEventListener('mouseenter', () => {
      marquee.style.animationPlayState = 'paused';
      marquee.querySelectorAll('.marquee-content').forEach(m => {
        m.style.animationPlayState = 'paused';
      });
    });
    marquee.addEventListener('mouseleave', () => {
      marquee.style.animationPlayState = 'running';
      marquee.querySelectorAll('.marquee-content').forEach(m => {
        m.style.animationPlayState = 'running';
      });
    });
  }

})();
