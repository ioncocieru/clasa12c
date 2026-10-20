// Comunicarea cu Google Sheets (prin Google Apps Script) sau MOD DEMO (localStorage).
(function () {
  const DEMO_KEY = "clasa12c_demo_rows";
  const demo = () => !window.CONFIG.SCRIPT_URL;

  function demoRows() {
    try { return JSON.parse(localStorage.getItem(DEMO_KEY) || "[]"); } catch (e) { return []; }
  }

  // Întoarce lista răspunsurilor: [{nume, ts, album, fundal, citat, marime}]
  async function apiList() {
    if (demo()) return demoRows();
    const url = window.CONFIG.SCRIPT_URL + (window.CONFIG.SCRIPT_URL.includes("?") ? "&" : "?") +
      "action=list&t=" + Date.now();
    const r = await fetch(url, { redirect: "follow" });
    const j = await r.json();
    if (!j.ok) throw new Error(j.error || "Eroare server");
    return j.rows;
  }

  // Răspunsul complet al unui singur elev (pentru editare). null dacă nu există.
  async function apiGet(nume) {
    if (demo()) return demoRows().find((x) => x.nume === nume) || null;
    const url = window.CONFIG.SCRIPT_URL + (window.CONFIG.SCRIPT_URL.includes("?") ? "&" : "?") +
      "action=get&nume=" + encodeURIComponent(nume) + "&t=" + Date.now();
    const r = await fetch(url, { redirect: "follow" });
    const j = await r.json();
    if (!j.ok) throw new Error(j.error || "Eroare server");
    return j.row || null;
  }

  // Salvează (sau înlocuiește) răspunsul unui elev.
  async function apiSave(payload) {
    if (demo()) {
      const rows = demoRows().filter((x) => x.nume !== payload.nume);
      rows.push(Object.assign({}, payload, { ts: new Date().toISOString() }));
      localStorage.setItem(DEMO_KEY, JSON.stringify(rows));
      return true;
    }
    // text/plain evită cererea preflight CORS (Apps Script nu o suportă)
    await fetch(window.CONFIG.SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    // Răspunsul e „opac”, deci verificăm că rândul a apărut în foaie.
    for (let i = 0; i < 5; i++) {
      await new Promise((res) => setTimeout(res, 1200));
      try {
        const saved = await apiGet(payload.nume);
        if (saved && saved.album === payload.album && saved.fundal === payload.fundal &&
            saved.citat === payload.citat && String(saved.citatText || "") === String(payload.citatText || "") &&
            String(saved.marime) === String(payload.marime) && saved.greutate === payload.greutate &&
            saved.inaltime === payload.inaltime) return true;
      } catch (e) { /* mai încercăm */ }
    }
    return false;
  }

  window.API = { list: apiList, get: apiGet, save: apiSave, isDemo: demo };
})();
