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
    includeHTML("#site-footer", "assets/partials/footer.html")
  ]).then(function () {
    // Sticky header shadow on scroll (if header exists)
    var header = document.querySelector(".site-header");
    if (header) {
      function onScroll() {
        if (window.scrollY > 8) header.classList.add("is-scrolled");
        else header.classList.remove("is-scrolled");
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  });

  // Early access availability -- live from bot API
  (function updateAvailability() {
    var API = "https://cd-shoutout-bot-live-production.up.railway.app/api/slots";

    // Support both old single-element (availabilityCount) and new split (earlyFilled / earlyTotal)
    var countEl  = document.getElementById("availabilityCount");
    var filledEl = document.getElementById("earlyFilled");
    var totalEl  = document.getElementById("earlyTotal");

    if (!countEl && !filledEl) return;

    fetch(API, { cache: "no-store" })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var used = Number(data && data.used);
        var max  = Number(data && data.max);

        if (!isFinite(used) || used < 0) used = 0;
        if (!isFinite(max)  || max  <= 0) max  = 5;
        if (used > max) used = max;

        if (countEl)  countEl.textContent  = used + " / " + max;
        if (filledEl) filledEl.textContent = used;
        if (totalEl)  totalEl.textContent  = max;
      })
      .catch(function () {
        // Fallback: try the local JSON file
        fetch("assets/data/availability.json", { cache: "no-store" })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            var filled = Number(data && data.filled);
            var cap    = Number(data && data.capacity);
            if (!isFinite(filled) || filled < 0) filled = 0;
            if (!isFinite(cap)    || cap    <= 0) cap    = 5;
            if (filled > cap) filled = cap;
            if (countEl)  countEl.textContent  = filled + " / " + cap;
            if (filledEl) filledEl.textContent = filled;
            if (totalEl)  totalEl.textContent  = cap;
          })
          .catch(function () { /* keep HTML fallback */ });
      });
  })();
});
