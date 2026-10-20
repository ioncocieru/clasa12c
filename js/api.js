// Comunicarea cu Google Sheets (prin Google Apps Script) sau MOD DEMO (localStorage).
(function () {
  const DEMO_KEY = "clasa12c_citate_demo";
  const demo = () => !window.CONFIG.SCRIPT_URL;
  const q = (params) => {
    const u = window.CONFIG.SCRIPT_URL;
    return u + (u.includes("?") ? "&" : "?") + params + "&t=" + Date.now();
  };

  function demoRows() {
    try { return JSON.parse(localStorage.getItem(DEMO_KEY) || "[]"); } catch (e) { return []; }
  }

  // Lista celor care au completat: [{nume, ts}]
  async function apiList() {
    if (demo()) return demoRows().map((r) => ({ nume: r.nume, ts: r.ts }));
    const j = await (await fetch(q("action=list"), { redirect: "follow" })).json();
    if (!j.ok) throw new Error(j.error || "Eroare server");
    return j.rows;
  }

  // Răspunsul unui elev (pentru editare): {nume, citat, ts} sau null
  async function apiGet(nume) {
    if (demo()) return demoRows().find((x) => x.nume === nume) || null;
    const j = await (await fetch(q("action=get&nume=" + encodeURIComponent(nume)), { redirect: "follow" })).json();
    if (!j.ok) throw new Error(j.error || "Eroare server");
    return j.row || null;
  }

  // Salvează (sau înlocuiește) citatul unui elev.
  async function apiSave(p) {
    if (demo()) {
      const rows = demoRows().filter((x) => x.nume !== p.nume);
      rows.push({ nume: p.nume, citat: p.citat, ts: new Date().toISOString() });
      localStorage.setItem(DEMO_KEY, JSON.stringify(rows));
      return true;
    }
    // text/plain evită cererea preflight CORS (Apps Script nu o suportă)
    await fetch(window.CONFIG.SCRIPT_URL, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(p),
    });
    // Răspunsul e „opac”, deci verificăm că citatul a ajuns în foaie.
    for (let i = 0; i < 5; i++) {
      await new Promise((res) => setTimeout(res, 1200));
      try {
        const s = await apiGet(p.nume);
        if (s && s.citat === p.citat) return true;
      } catch (e) { /* mai încercăm */ }
    }
    return false;
  }

  window.API = { list: apiList, get: apiGet, save: apiSave, isDemo: demo };
})();
