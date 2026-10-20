(function () {
  const D = window.DATA, C = window.CONFIG;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const state = { nume: "", citat: "" };
  let rows = [];
  let editing = false;

  if (API.isDemo()) $("demo").style.display = "block";
  $("termen").textContent = C.TERMEN_CITAT;
  $("fundal-img").src = D.fundal.thumb;
  $("fundal-link").href = D.fundal.link;

  const btnLabel = () => (editing ? "Salvează modificările" : "Trimite citatul");
  function setEditing(v) { editing = v; $("trimite").textContent = btnLabel(); }
  const fmtDate = (iso) => {
    const d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleString("ro-RO", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" });
  };
  function clearErr(id) { $(id).classList.remove("err"); }

  // ---------- Previzualizare: Nume Prenume + citat ----------
  function updatePreview() {
    $("qn").textContent = state.nume || "Nume Prenume";
    const t = state.citat.trim(), qt = $("qt");
    qt.textContent = t ? "„" + t + "”" : "Citatul tău va apărea aici";
    qt.classList.toggle("empty", !t);
  }
  $("citat-text").addEventListener("input", (e) => {
    state.citat = e.target.value;
    $("citat-count").textContent = e.target.value.length;
    updatePreview(); clearErr("s-citat");
  });

  // ---------- 1. Nume ----------
  function fillNames() {
    const done = new Set(rows.map((r) => r.nume));
    const sel = $("nume"), cur = sel.value;
    sel.innerHTML = '<option value="">— alege —</option>' +
      D.elevi.map((n) => `<option value="${n}">${done.has(n) ? "(completat) " : ""}${n}</option>`).join("");
    sel.value = cur;
  }

  function setCitat(t) {
    state.citat = t; $("citat-text").value = t; $("citat-count").textContent = String(t.length);
    updatePreview();
  }

  async function onName() {
    const nume = $("nume").value;
    state.nume = nume; clearErr("s-nume");
    const b = $("edit-banner");
    b.style.display = "none"; setEditing(false); setCitat("");
    if (!nume) return;
    try { localStorage.setItem("clasa12c_nume", nume); } catch (e) { /* ok */ }
    const row = rows.find((r) => r.nume === nume);
    if (!row) return;
    b.style.display = "block"; b.textContent = "Se încarcă citatul tău…";
    let full = null;
    try { full = await API.get(nume); } catch (e) { /* mai jos */ }
    if (state.nume !== nume) return; // a ales altcineva între timp
    if (!full) { b.textContent = "Ai completat deja, dar nu am putut încărca citatul. Reîncarcă pagina."; return; }
    setCitat(full.citat || "");
    setEditing(true);
    b.innerHTML = "<b>Ai completat deja</b>" + (row.ts ? " (" + esc(fmtDate(row.ts)) + ")" : "") +
      ". Citatul tău este mai jos, îl poți modifica și apăsa „Salvează modificările”.";
  }
  $("nume").addEventListener("change", onName);

  // ---------- Trimitere ----------
  function validate() {
    const okN = !!state.nume, okC = state.citat.trim().length >= 3;
    $("s-nume").classList.toggle("err", !okN);
    $("s-citat").classList.toggle("err", !okC);
    if (!okN) $("s-nume").scrollIntoView({ behavior: "smooth", block: "center" });
    else if (!okC) $("s-citat").scrollIntoView({ behavior: "smooth", block: "center" });
    return okN && okC;
  }

  $("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const btn = $("trimite");
    btn.disabled = true; btn.textContent = "Se salvează…";
    const payload = { nume: state.nume, citat: state.citat.trim() };
    try {
      if (!(await API.save(payload))) throw new Error("not confirmed");
      const i = rows.findIndex((r) => r.nume === payload.nume);
      const rec = { nume: payload.nume, ts: new Date().toISOString() };
      if (i >= 0) rows[i] = rec; else rows.push(rec);
      fillNames(); setEditing(true);
      $("form").style.display = "none"; $("gata").style.display = "block";
      $("g-nume").textContent = payload.nume;
      $("g-qn").textContent = payload.nume;
      $("g-qt").textContent = "„" + payload.citat + "”";
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
  fillNames(); updatePreview();
  loadRows().then(() => {
    // dacă elevul a mai intrat de pe acest telefon, îi alegem numele automat
    let saved = "";
    try { saved = localStorage.getItem("clasa12c_nume") || ""; } catch (e) { /* ok */ }
    if (saved && D.elevi.includes(saved)) { $("nume").value = saved; onName(); }
  });
})();
