/* assets/site.js
 * Static partial injection + nav active highlight (no frameworks)
 * Uses body[data-page] if present, otherwise falls back to path matching.
 */
(function(){
  function normalizePath(p){
    if (!p) return "/";
    // Convert "/index.html" -> "/"
    return p.replace(/\/index\.html$/i, "/");
  }

  async function loadPartial(url){
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load partial: " + url);
    return await res.text();
  }

  function setActiveNav(){
    const body = document.body;
    const pageKey = (body && body.getAttribute("data-page")) ? body.getAttribute("data-page") : null;

    const links = Array.from(document.querySelectorAll('.nav-links a[data-nav]'));
    if (!links.length) return;

    links.forEach(a => {
      a.classList.remove("active");
      a.removeAttribute("aria-current");
    });

    // Prefer explicit pageKey if set
    if (pageKey) {
      const match = links.find(a => a.getAttribute("data-nav") === pageKey);
      if (match) {
        match.classList.add("active");
        match.setAttribute("aria-current", "page");
        return;
      }
    }

    // Fallback: compare pathname
    const current = normalizePath(location.pathname);
    const best = links.find(a => normalizePath(new URL(a.getAttribute("href"), location.origin).pathname) === current);
    if (best) {
      best.classList.add("active");
      best.setAttribute("aria-current", "page");
    }
  }

  async function inject(){
    const headerHost = document.getElementById("site-header");
    const footerHost = document.getElementById("site-footer");

    if (headerHost) {
      try { headerHost.innerHTML = await loadPartial("assets/partials/header.html"); }
      catch (e) { console.warn(e); }
    }

    if (footerHost) {
      try { footerHost.innerHTML = await loadPartial("assets/partials/footer.html"); }
      catch (e) { console.warn(e); }
    }

    setActiveNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();