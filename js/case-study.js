/* ────────────────────────────────────────────────
   STUDIO 2K — CASE STUDY PAGE JAVASCRIPT
   Thilanka Dilshan Photography | Wedding Stories
──────────────────────────────────────────────── */

(function () {
  'use strict';

  gsap.registerPlugin(ScrollTrigger);

  /* ── Lenis ── */
  const lenis = new Lenis({
    duration: 1.4,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ── Custom Cursor ── */
  const cursor = document.getElementById('cursor');
  const dot    = cursor.querySelector('.cursor-dot');
  const ring   = cursor.querySelector('.cursor-ring');
  let mx = window.innerWidth  / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(dot, { x: mx, y: my, duration: 0.05, ease: 'none' });
  });
  function animateRing() {
    rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
    gsap.set(ring, { x: rx, y: ry });
    requestAnimationFrame(animateRing);
  }
  animateRing();
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });

  /* ── Project Data ── */
  const projects = {
    'chami-eranda': {
      tag: 'Wedding Album',
      year: '2024',
      title: 'Chami & Eranda',
      subtitle: 'A cinematic full-day wedding story captured in Colombo — intimate moments and grand emotions, frozen in time with every frame.',
      client: 'Chami & Eranda',
      services: 'Wedding Photography, Editing',
      duration: 'Full Day',
      yearBar: '2024',
      intro: 'When Chami and Eranda asked Studio 2K to capture their wedding day in Colombo, we arrived with one intention: to disappear into the day and let the love speak for itself. What emerged was an album full of unguarded laughter, quiet glances, and golden-light moments.',
      challengeTitle: 'Capturing Authentic Emotion',
      challengeBody: 'Large wedding venues in Colombo can feel overwhelming to photograph — grand architecture, busy lighting, dozens of guests. Our challenge was to make every frame feel intimate and personal within an expansive setting.',
      approachTitle: 'Storytelling Through Stillness',
      approachBody: 'We combined fly-on-the-wall documentary moments with carefully guided portraits. We worked with the existing light — the late-afternoon sun streaming through banquet windows, the warm glow of the reception hall — rather than overwhelming the setting with flash. The result is an album that breathes.',
      resultsText: 'The couple shared the album with their family network across Sri Lanka, generating over 4,000 organic social shares and bringing 12 new enquiries to Studio 2K within a month of publication.',
      stat1: '4K+',  stat1Label: 'Social Shares',
      stat2: '380',  stat2Label: 'Photos Delivered',
      stat3: '12',   stat3Label: 'New Referrals',
      imgs: ['assets/images/637139243_1402427718004949_6666201034993238005_n.jpg', 'assets/images/609026638_1364917278422660_2833140512891095027_n.jpg', 'assets/images/639420175_1408288920752162_3455617747218749968_n.jpg'],
      heroImg: 'assets/images/637139243_1402427718004949_6666201034993238005_n.jpg',
      next: 'ruwanthi-mangala',
      nextTitle: 'Ruwanthi & Mangala'
    },
    'ruwanthi-mangala': {
      tag: 'Pre-Wedding Shoot',
      year: '2024',
      title: 'Ruwanthi & Mangala',
      subtitle: 'A golden-hour pre-wedding session set against the lush highlands of Kandy — soft light, green hills, and a love story in every frame.',
      client: 'Ruwanthi & Mangala',
      services: 'Pre-Wedding Photography, Editing',
      duration: 'Half Day',
      yearBar: '2024',
      intro: 'Ruwanthi and Mangala chose the hill country of Kandy as the backdrop for their pre-wedding session. In the golden hours before sunset, surrounded by mist-touched hills and tea-garden paths, we crafted images as timeless as their bond.',
      challengeTitle: 'Working With Natural Light',
      challengeBody: 'Pre-wedding shoots in Kandy offer breathtaking scenery but demand technical flexibility — rapidly changing light conditions, unpredictable mist, and terrain that requires careful positioning. Every minute of the golden hour had to count.',
      approachTitle: 'Chasing the Light',
      approachBody: 'We scouted locations the morning before the shoot to plan our movements precisely. Three distinct setups — a lakeside path, a hilltop viewpoint, and a tea plantation row — each designed to catch the light at its warmest. We moved quickly and stayed relaxed, letting the couple forget the camera was there.',
      resultsText: 'The pre-wedding gallery became one of Studio 2K\'s most shared sets on Facebook, attracting significant attention from couples planning destination pre-wedding shoots in the hill country.',
      stat1: '6.2K', stat1Label: 'Facebook Reach',
      stat2: '240',  stat2Label: 'Images Delivered',
      stat3: '3',    stat3Label: 'Locations in One Shoot',
      imgs: ['assets/images/648436374_1417814523132935_8874425884483654297_n.jpg', 'assets/images/641262210_1408288054085582_3662194477068953645_n.jpg', 'assets/images/609026638_1364917278422660_2833140512891095027_n.jpg'],
      heroImg: 'assets/images/648436374_1417814523132935_8874425884483654297_n.jpg',
      next: 'sandali-harshana',
      nextTitle: 'Sandali & Harshana'
    },
    'sandali-harshana': {
      tag: 'Wedding Album',
      year: '2024',
      title: 'Sandali & Harshana',
      subtitle: 'A romantic outdoor garden wedding in Kurunegala — lush greenery, candlelight, and a couple utterly in love.',
      client: 'Sandali & Harshana',
      services: 'Wedding Photography, Cinematography',
      duration: 'Full Day',
      yearBar: '2024',
      intro: 'For Sandali and Harshana\'s outdoor wedding in Kurunegala, we were asked to deliver both a photography album and a cinematic highlight film. The venue — a beautifully landscaped private garden — gave us extraordinary natural light and depth to work with throughout the day.',
      challengeTitle: 'Coordinating Photo & Film',
      challengeBody: 'Running parallel photo and video production on a single wedding day without one team disrupting the other requires disciplined communication and intentional scheduling. Both teams needed access to the best moments simultaneously.',
      approachTitle: 'Two Teams, One Story',
      approachBody: 'We deployed our photography and cinematography teams with pre-agreed shot lists and moment sequences. During the ceremony, the photographer worked wide and close while the videographer captured motion and ambience. During portraits, roles swapped. The result was a unified visual story with no gaps.',
      resultsText: 'The couple\'s cinematic highlight film received over 8,000 views on Facebook within 48 hours of posting, and the album was featured on the Studio 2K page as one of our signature Kurunegala works.',
      stat1: '8K+',  stat1Label: 'Film Views in 48 Hours',
      stat2: '420',  stat2Label: 'Photos Delivered',
      stat3: '5',    stat3Label: 'Minute Highlight Film',
      imgs: ['assets/images/639420175_1408288920752162_3455617747218749968_n.jpg', 'assets/images/609026638_1364917278422660_2833140512891095027_n.jpg', 'assets/images/637139243_1402427718004949_6666201034993238005_n.jpg'],
      heroImg: 'assets/images/639420175_1408288920752162_3455617747218749968_n.jpg',
      next: 'chami-eranda',
      nextTitle: 'Chami & Eranda'
    }
  };

  /* ── Populate page ── */
  const params = new URLSearchParams(window.location.search);
  const slug   = params.get('project') || 'chami-eranda';
  const p      = projects[slug] || projects['chami-eranda'];

  document.title = `${p.title} — Studio 2K`;

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
  function setHTML(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = val;
  }
  function setImg(id, src, alt) {
    const el = document.getElementById(id);
    if (el) { el.src = src; if (alt) el.alt = alt; }
  }

  setText('cs-tag',           p.tag);
  setText('cs-year',          p.year);
  setText('cs-title',         p.title);
  setText('cs-subtitle',      p.subtitle);
  setText('cs-client',        p.client);
  setText('cs-services',      p.services);
  setText('cs-duration',      p.duration);
  setText('cs-year-bar',      p.yearBar);
  setText('cs-intro',         p.intro);
  setText('cs-challenge-title', p.challengeTitle);
  setText('cs-challenge-body',  p.challengeBody);
  setText('cs-approach-title',  p.approachTitle);
  setText('cs-approach-body',   p.approachBody);
  setText('cs-results-text',    p.resultsText);
  setText('cs-stat-1',       p.stat1);
  setText('cs-stat-1-label', p.stat1Label);
  setText('cs-stat-2',       p.stat2);
  setText('cs-stat-2-label', p.stat2Label);
  setText('cs-stat-3',       p.stat3);
  setText('cs-stat-3-label', p.stat3Label);
  setText('cs-next-title',   p.nextTitle);

  setImg('cs-hero-img',   p.heroImg,    p.title);
  setImg('cs-gallery-1',  p.imgs[0],    'Gallery image 1');
  setImg('cs-gallery-2',  p.imgs[1],    'Gallery image 2');
  setImg('cs-gallery-3',  p.imgs[2],    'Gallery image 3');

  const nextLink = document.getElementById('cs-next-link');
  if (nextLink) nextLink.href = `case-study.html?project=${p.next}`;

  /* ── GSAP Scroll Animations ── */
  gsap.fromTo('.cs-hero-content > *',
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.12, duration: 1.1, ease: 'power3.out', delay: 0.5 }
  );

  gsap.fromTo('.cs-info-item',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '.cs-info-bar', start: 'top 85%' } }
  );

  gsap.fromTo('.cs-intro',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.1, ease: 'power2.out',
      scrollTrigger: { trigger: '.cs-intro', start: 'top 80%' } }
  );

  document.querySelectorAll('.cs-body h3, .cs-body p, .cs-section-title').forEach(el => {
    gsap.fromTo(el,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 86%' } }
    );
  });

  document.querySelectorAll('.cs-gallery-item').forEach((item, i) => {
    gsap.fromTo(item,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: i * 0.1,
        scrollTrigger: { trigger: item, start: 'top 86%' } }
    );
  });

  document.querySelectorAll('.cs-stat').forEach((stat, i) => {
    gsap.fromTo(stat,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: i * 0.12,
        scrollTrigger: { trigger: stat, start: 'top 85%' } }
    );
  });

  /* ── Page transitions ── */
  function transitionTo(href) {
    gsap.to('body', {
      opacity: 0, duration: 0.4, ease: 'power2.in',
      onComplete: () => { window.location.href = href; }
    });
  }

  const backLink = document.getElementById('back-link');
  if (backLink) {
    backLink.addEventListener('click', e => { e.preventDefault(); transitionTo(backLink.href); });
  }
  if (nextLink) {
    nextLink.addEventListener('click', e => { e.preventDefault(); transitionTo(nextLink.href); });
  }

  /* ── Entrance fade ── */
  gsap.from('body', { opacity: 0, duration: 0.5 });

})();
