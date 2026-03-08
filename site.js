document.addEventListener("DOMContentLoaded", function () {
  // Header/Footer includes
  function includeHTML(selector, url) {
    var el = document.querySelector(selector);
    if (!el) return Promise.resolve();

    return fetch(url, { cache: "no-store" })
      .then(function (res) { return res.text(); })
      .then(function (html) { el.innerHTML = html; })
      .catch(function () { /* fail quietly */ });
  }

  Promise.all([
    includeHTML("#site-header", "assets/partials/header.html"),
    includeHTML("#site-footer",  "assets/partials/footer.html")
  ]).then(function () {

    // ── Sticky header shadow on scroll ────────────────────────
    var header = document.querySelector(".site-header");
    if (header) {
      function onScroll() {
        if (window.scrollY > 8) header.classList.add("is-scrolled");
        else header.classList.remove("is-scrolled");
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    // ── Hamburger menu toggle ──────────────────────────────────
    var toggle  = document.querySelector(".nav-toggle");
    var navWrap = document.querySelector(".nav-wrap");

    if (toggle && navWrap) {
      toggle.addEventListener("click", function () {
        var isOpen = navWrap.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      // Close menu when a nav link is tapped
      navWrap.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          navWrap.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });

      // Close menu when clicking outside
      document.addEventListener("click", function (e) {
        if (!header.contains(e.target) && navWrap.classList.contains("is-open")) {
          navWrap.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });

      // Close menu on resize back to desktop
      window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
          navWrap.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      }, { passive: true });
    }

    // ── Occasional header pulse ────────────────────────────────
    if (header) {
      function schedulePulse() {
        var delay = 8000 + Math.random() * 10000;
        setTimeout(function () {
          header.classList.add("is-pulsing");
          setTimeout(function () {
            header.classList.remove("is-pulsing");
            schedulePulse();
          }, 1800);
        }, delay);
      }
      setTimeout(schedulePulse, 2000);
    }
  });

  // ── Early access availability ──────────────────────────────
  (function updateAvailability() {
    var filledEl = document.getElementById("earlyFilled");
    var totalEl  = document.getElementById("earlyTotal");
    if (!filledEl) return;

    fetch("assets/data/availability.json", { cache: "no-store" })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var filled = Number(data && data.filled);
        var cap    = Number(data && data.capacity);
        if (!isFinite(filled) || filled < 0) filled = 0;
        if (!isFinite(cap) || cap <= 0) cap = 5;
        if (filled > cap) filled = cap;
        if (filledEl) filledEl.textContent = filled;
        if (totalEl)  totalEl.textContent  = cap;
      })
      .catch(function () { /* keep HTML defaults */ });
  })();
});
