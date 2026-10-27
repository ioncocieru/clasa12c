(function () {
  const D = window.DATA, C = window.CONFIG;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const VALID = /^[A-Za-z0-9_-]{1,20}$/;   // cifre, litere, - și _ (ex. 0123, IMG_123)
  const state = { nume: "" };
  let rows = [], editing = false;

  if (API.isDemo()) $("demo").style.display = "block";
  $("termen").textContent = C.TERMEN;

  const btnLabel = () => (editing ? "Salvează modificarea" : "Trimite");
  function setEditing(v) { editing = v; $("trimite").textContent = btnLabel(); }
  const fmtDate = (iso) => {
    const d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleString("ro-RO", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" });
  };
  const clearErr = (id) => $(id).classList.remove("err");
  const poza = () => $("poza").value.trim();

  $("poza").addEventListener("input", () => clearErr("s-poza"));

  // ---------- 1. Nume ----------
  function fillNames() {
    const done = new Set(rows.map((r) => r.nume));
    const sel = $("nume"), cur = sel.value;
    sel.innerHTML = '<option value="">— alege —</option>' +
      D.elevi.map((n) => `<option value="${n}">${done.has(n) ? "(completat) " : ""}${n}</option>`).join("");
    sel.value = cur;
  }

  async function onName() {
    const nume = $("nume").value;
    state.nume = nume; clearErr("s-nume");
    const b = $("edit-banner");
    b.style.display = "none"; setEditing(false); $("poza").value = "";
    if (!nume) return;
    try { localStorage.setItem("clasa12c_nume_poze", nume); } catch (e) { /* ok */ }
    const row = rows.find((r) => r.nume === nume);
    if (!row) return;
    b.style.display = "block"; b.textContent = "Se încarcă numărul tău…";
    let full = null;
    try { full = await API.get(nume); } catch (e) { /* mai jos */ }
    if (state.nume !== nume) return; // a ales altcineva între timp
    if (!full) { b.textContent = "Ai completat deja, dar nu am putut încărca numărul. Reîncarcă pagina."; return; }
    $("poza").value = String(full.poza || ""); setEditing(true);
    b.innerHTML = "<b>Ai completat deja: poza nr. " + esc(full.poza) + "</b>" +
      (row.ts ? " (" + esc(fmtDate(row.ts)) + ")" : "") + ". Îl poți schimba și apăsa „Salvează modificarea”.";
  }
  $("nume").addEventListener("change", onName);

  // ---------- Trimitere ----------
  function validate() {
    const okN = !!state.nume;
    const v = poza(), okP = VALID.test(v);
    $("poza-err").textContent = !v ? "Scrie numărul pozei." : "Folosește doar cifre și litere (ex. 0123).";
    $("s-nume").classList.toggle("err", !okN);
    $("s-poza").classList.toggle("err", !okP);
    if (!okN) $("s-nume").scrollIntoView({ behavior: "smooth", block: "center" });
    else if (!okP) { $("s-poza").scrollIntoView({ behavior: "smooth", block: "center" }); $("poza").focus({ preventScroll: true }); }
    return okN && okP;
  }

  $("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const btn = $("trimite");
    btn.disabled = true; btn.textContent = "Se salvează…";
    const payload = { nume: state.nume, poza: poza() };
    try {
      if (!(await API.save(payload))) throw new Error("not confirmed");
      const i = rows.findIndex((r) => r.nume === payload.nume);
      const rec = { nume: payload.nume, ts: new Date().toISOString() };
      if (i >= 0) rows[i] = rec; else rows.push(rec);
      fillNames(); setEditing(true);
      $("form").style.display = "none"; $("gata").style.display = "block";
      $("g-nume").textContent = payload.nume;
      $("g-nr").textContent = "Poza nr. " + payload.poza;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("Nu am putut confirma salvarea. Verifică internetul și apasă din nou. Dacă se repetă, anunță-l pe cel care administrează site-ul.");
    } finally {
      btn.disabled = false; btn.textContent = btnLabel();
    }
  });

  $("modifica").addEventListener("click", () => {
    $("gata").style.display = "none"; $("form").style.display = "block";
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  async function loadRows() {
    try { rows = await API.list(); } catch (e) { rows = []; }
    fillNames();
  }
  fillNames();
  loadRows().then(() => {
    // dacă elevul a mai intrat de pe acest telefon, îi alegem numele automat
    let saved = "";
    try { saved = localStorage.getItem("clasa12c_nume_poze") || ""; } catch (e) { /* ok */ }
    if (saved && D.elevi.includes(saved)) { $("nume").value = saved; onName(); }
  });
})();
