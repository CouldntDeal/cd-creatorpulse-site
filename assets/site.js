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

  // Early access availability (reads JSON; updates the metric)
  // No backend required. Update assets/data/availability.json to change values.
  (function updateAvailability() {
    var el = document.getElementById("availabilityCount");
    if (!el) return;

    fetch("assets/data/availability.json", { cache: "no-store" })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var filled = Number(data && data.filled);
        var cap = Number(data && data.capacity);

        if (!isFinite(filled) || filled < 0) filled = 0;
        if (!isFinite(cap) || cap <= 0) cap = 5;
        if (filled > cap) filled = cap;

        el.textContent = filled + " / " + cap;
      })
      .catch(function () {
        // Keep whatever is already in the HTML as the fallback.
      });
  })();
});