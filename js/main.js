/* ============================================================
   MAIN.JS — Shared functionality for all pages
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  initNavbar();
  initScrollReveal();
  initScrollProgress();
  initBackToTop();
  initContactForm();
  initSmoothScroll();
});

/* ══════════════════════════════════════
   NAVBAR
══════════════════════════════════════ */
function initNavbar() {
  const header    = document.querySelector('.header');
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.nav-menu');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!header) return;

  // Scroll: add scrolled class
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Hamburger toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close menu on nav link click
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (hamburger) hamburger.classList.remove('active');
      if (navMenu)   navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (navMenu && navMenu.classList.contains('active')) {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // Active link on scroll (for single-page sections)
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    window.addEventListener('scroll', function () {
      let current = '';
      sections.forEach(function (section) {
        const sectionTop = section.offsetTop - parseInt(getComputedStyle(header).height) - 60;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
      navLinks.forEach(function (link) {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  }
}

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  function checkReveal() {
    const windowHeight = window.innerHeight;
    elements.forEach(function (el) {
      const top = el.getBoundingClientRect().top;
      if (top < windowHeight - 80) {
        el.classList.add('active');
      }
    });
  }

  checkReveal();
  window.addEventListener('scroll', checkReveal, { passive: true });
}

/* ══════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', function () {
    const total   = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / total) * 100;
    bar.style.width = scrolled + '%';
  }, { passive: true });
}

/* ══════════════════════════════════════
   BACK TO TOP
══════════════════════════════════════ */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════
   SMOOTH SCROLL (anchor links)
══════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 70;
        const top = target.offsetTop - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
}

/* ══════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fields = {
      name:    form.querySelector('#cf-name'),
      email:   form.querySelector('#cf-email'),
      subject: form.querySelector('#cf-subject'),
      message: form.querySelector('#cf-message')
    };

    let valid = true;

    // Clear previous errors
    Object.values(fields).forEach(function (f) {
      if (f) {
        f.classList.remove('invalid');
        const err = f.parentElement.querySelector('.error-text');
        if (err) err.remove();
      }
    });

    function showErr(input, msg) {
      if (!input) return;
      input.classList.add('invalid');
      const span = document.createElement('span');
      span.className = 'error-text';
      span.textContent = msg;
      input.parentElement.appendChild(span);
      valid = false;
    }

    if (!fields.name || fields.name.value.trim() === '') showErr(fields.name, 'Name is required.');
    if (!fields.email || fields.email.value.trim() === '') {
      showErr(fields.email, 'Email is required.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value)) {
      showErr(fields.email, 'Please enter a valid email address.');
    }
    if (!fields.subject || fields.subject.value.trim() === '') showErr(fields.subject, 'Subject is required.');
    if (!fields.message || fields.message.value.trim() === '') showErr(fields.message, 'Message is required.');

    const msgEl = form.querySelector('.form-message');

    if (valid) {
      if (msgEl) {
        msgEl.className = 'form-message success';
        msgEl.textContent = 'Thanks for your message! I\'ll be in touch soon.';
        setTimeout(function () { msgEl.className = 'form-message'; }, 6000);
      }
      form.reset();
    } else {
      if (msgEl) {
        msgEl.className = 'form-message error';
        msgEl.textContent = 'Please fix the errors above and try again.';
        setTimeout(function () { msgEl.className = 'form-message'; }, 6000);
      }
    }
  });
}

/* ══════════════════════════════════════
   TYPEWRITER (index page hero)
══════════════════════════════════════ */
function initTypewriter(elementSelector, words) {
  const el = document.querySelector(elementSelector);
  if (!el || !words || !words.length) return;

  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let speed = 110;

  function tick() {
    const word = words[wordIdx];
    if (deleting) {
      el.textContent = word.substring(0, charIdx - 1);
      charIdx--;
      speed = 55;
    } else {
      el.textContent = word.substring(0, charIdx + 1);
      charIdx++;
      speed = 110;
    }

    if (!deleting && charIdx === word.length) {
      speed = 1800;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      speed = 400;
    }

    setTimeout(tick, speed);
  }

  setTimeout(tick, 800);
}