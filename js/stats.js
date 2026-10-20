(function () {
  const D = window.DATA, C = window.CONFIG;
  const $ = (id) => document.getElementById(id);
  if (API.isDemo()) $("demo").style.display = "block";
  $("v-total").textContent = D.elevi.length;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (iso) => {
    const d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toLocaleString("ro-RO", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  let last = "";
  function countUp(el, to, suffix) {
    const from = parseInt(el.textContent, 10) || 0;
    if (from === to || matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = to + (suffix || ""); return; }
    const t0 = performance.now(), dur = 600;
    (function step(t) {
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(from + (to - from) * k) + (suffix || "");
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  async function render() {
    let rows = [];
    try {
      rows = await API.list();
      $("refresh").textContent = "Actualizat la " + new Date().toLocaleTimeString("ro-RO") +
        " · se reîmprospătează automat";
    } catch (e) {
      $("refresh").textContent = "Nu am putut încărca datele. Încerc din nou…";
      return;
    }
    const sig = JSON.stringify(rows);
    if (sig === last) return;
    last = sig;
    const byName = new Map(rows.map((r) => [r.nume, r]));
    const done = D.elevi.filter((n) => byName.has(n));
    const left = D.elevi.filter((n) => !byName.has(n));
    const pct = Math.round((done.length / D.elevi.length) * 100);

    countUp($("v-done"), done.length);
    countUp($("v-left"), left.length);
    countUp($("v-pct"), pct, "%");
    $("bar").style.width = pct + "%";
    $("c-done").textContent = done.length;
    $("c-left").textContent = left.length;

    $("l-done").innerHTML = done
      .sort((a, b) => new Date(byName.get(b).ts) - new Date(byName.get(a).ts))
      .map((n) => `<li><span>${esc(n)}</span><span class="when">${fmt(byName.get(n).ts)}</span></li>`).join("");
    $("l-left").innerHTML = left.map((n) => `<li><span>${esc(n)}</span></li>`).join("");
    $("e-done").style.display = done.length ? "none" : "block";
    $("e-left").style.display = left.length ? "none" : "block";

  }

  render();
  setInterval(render, Math.max(10, C.REFRESH_SECUNDE || 30) * 1000);
})();
