// Clickadee — shared site behaviors
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -- Sticky header hairline border on scroll -------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 4);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* -- Mark current nav link --------------------------------------------- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .footer-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });

  /* -- Scroll-reveal for sections ------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && !reduceMotion && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* -- Curriculum week card flip -------------------------------------------- */
  document.querySelectorAll('.week-card').forEach(function (card) {
    var front = card.querySelector('.week-card-face--front');
    var back = card.querySelector('.week-card-face--back');
    if (!front || !back) return;

    var frontBtn = front.querySelector('.week-card-expand');
    var backBtn = back.querySelector('.week-card-back-btn');

    var setFlipped = function (flipped) {
      card.classList.toggle('is-flipped', flipped);
      front.setAttribute('aria-hidden', String(flipped));
      back.setAttribute('aria-hidden', String(!flipped));
      if (frontBtn) {
        frontBtn.setAttribute('aria-expanded', String(flipped));
        frontBtn.tabIndex = flipped ? -1 : 0;
      }
      if (backBtn) backBtn.tabIndex = flipped ? 0 : -1;
    };

    setFlipped(false);

    front.addEventListener('click', function () { setFlipped(true); });
    if (backBtn) {
      backBtn.addEventListener('click', function () { setFlipped(false); });
    }
  });

  /* -- Curriculum week row arrow navigation --------------------------------- */
  var weekRow = document.querySelector('.week-row');
  var weekPrev = document.querySelector('.week-nav-prev');
  var weekNext = document.querySelector('.week-nav-next');
  if (weekRow && weekPrev && weekNext) {
    var updateWeekNav = function () {
      var maxScroll = weekRow.scrollWidth - weekRow.clientWidth;
      weekPrev.disabled = weekRow.scrollLeft <= 1;
      weekNext.disabled = weekRow.scrollLeft >= maxScroll - 1;
    };

    var pageWeekRow = function (direction) {
      weekRow.scrollBy({
        left: direction * weekRow.clientWidth * 0.9,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    };

    weekPrev.addEventListener('click', function () { pageWeekRow(-1); });
    weekNext.addEventListener('click', function () { pageWeekRow(1); });
    weekRow.addEventListener('scroll', updateWeekNav, { passive: true });
    window.addEventListener('resize', updateWeekNav);
    updateWeekNav();
  }

  /* -- FAQ accordion ------------------------------------------------------- */
  document.querySelectorAll('.faq-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.faq-item');
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
      item.classList.toggle('is-open', !isOpen);
    });
  });
})();
