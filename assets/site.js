/* assets/site.js
 * Shared chrome injection for GitHub Pages static site.
 * Uses absolute /assets/... paths so it never breaks.
 */
(function () {
  async function load(url) {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load: " + url + " (" + res.status + ")");
    return await res.text();
  }

  function setActiveNav() {
    const pageKey = document.body ? document.body.getAttribute("data-page") : null;
    const links = Array.from(document.querySelectorAll(".nav-links a[data-nav]"));

    links.forEach(a => {
      a.classList.remove("active");
      a.removeAttribute("aria-current");
    });

    if (pageKey) {
      const match = links.find(a => a.getAttribute("data-nav") === pageKey);
      if (match) {
        match.classList.add("active");
        match.setAttribute("aria-current", "page");
      }
    }
  }

  async function inject() {
    const headerHost = document.getElementById("site-header");
    const footerHost = document.getElementById("site-footer");

    if (headerHost) {
      try { headerHost.innerHTML = await load("/assets/partials/header.html"); }
      catch (e) { console.warn("[site] header inject failed:", e); }
    }

    if (footerHost) {
      try { footerHost.innerHTML = await load("/assets/partials/footer.html"); }
      catch (e) { console.warn("[site] footer inject failed:", e); }
    }

    setActiveNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();