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

  // Salvează (sau înlocuiește) răspunsul unui elev.
  async function apiSave(payload) {
    if (demo()) {
      const rows = demoRows().filter((x) => x.nume !== payload.nume);
      rows.push({
        nume: payload.nume, ts: new Date().toISOString(), album: payload.album,
        fundal: payload.fundal, citat: payload.citat, citatText: payload.citatText, marime: payload.marime,
      });
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
        const rows = await apiList();
        if (rows.some((x) => x.nume === payload.nume)) return true;
      } catch (e) { /* mai încercăm */ }
    }
    return false;
  }

  window.API = { list: apiList, save: apiSave, isDemo: demo };
})();
