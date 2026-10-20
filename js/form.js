(function () {
  const D = window.DATA, C = window.CONFIG;
  const $ = (id) => document.getElementById(id);
  const TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg>';
  const state = { nume: "", album: "", fundal: 0, citat: "", citatText: "", greutate: "", inaltime: "", marime: "" };
  let rows = [];

  if (API.isDemo()) $("demo").style.display = "block";
  $("folder").href = D.folderFundaluri;
  $("termen").textContent = C.TERMEN_CITAT;

  // ---------- 1. Nume ----------
  function fillNames() {
    const done = new Set(rows.map((r) => r.nume));
    const sel = $("nume");
    const cur = sel.value;
    sel.innerHTML = '<option value="">— alege —</option>' +
      D.elevi.map((n) => `<option value="${n}">${done.has(n) ? "(completat) " : ""}${n}</option>`).join("");
    sel.value = cur;
  }
  let editing = false;
  const btnLabel = () => (editing ? "Salvează modificările" : "Trimite răspunsurile");
  function setEditing(v) { editing = v; $("trimite").textContent = btnLabel(); }
  const fmtDate = (iso) => {
    const d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleString("ro-RO", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" });
  };

  // golește toate răspunsurile (păstrează numele ales)
  function clearAnswers() {
    state.album = ""; state.fundal = 0; state.greutate = ""; state.inaltime = ""; state.marime = "";
    document.querySelectorAll("#albume .card, #fundaluri .card").forEach((c) => c.setAttribute("aria-pressed", "false"));
    $("album-ales").style.display = "none"; $("fundal-ales").style.display = "none";
    $("citat-text").value = ""; $("citat-text").disabled = false; $("fara-citat").checked = false;
    state.citatText = ""; $("citat-count").textContent = "0";
    $("greutate").value = ""; $("inaltime").value = "";
    recalc(); updatePreview();
  }

  function fillAnswers(r) {
    if (D.albume.some((a) => a.nume === r.album)) pickAlbum(r.album);
    const fn = parseInt(String(r.fundal).replace(/\D/g, ""), 10);
    if (fn >= 1 && fn <= D.fundaluri.length) pickFundal(fn);
    if (r.citat === "Nu") { $("fara-citat").checked = true; $("citat-text").value = ""; state.citatText = ""; }
    else { $("fara-citat").checked = false; $("citat-text").value = r.citatText || ""; state.citatText = r.citatText || ""; }
    $("citat-text").disabled = $("fara-citat").checked;
    $("citat-count").textContent = String($("citat-text").value.length);
    const gi = D.greutati.indexOf(r.greutate), hi = D.inaltimi.indexOf(r.inaltime);
    $("greutate").value = gi >= 0 ? String(gi) : ""; $("inaltime").value = hi >= 0 ? String(hi) : "";
    recalc(); updatePreview();
  }

  async function onName() {
    const nume = $("nume").value;
    state.nume = nume; clearErr("s-nume");
    const b = $("edit-banner");
    b.style.display = "none"; setEditing(false);
    clearAnswers();
    if (!nume) return;
    try { localStorage.setItem("clasa12c_nume", nume); } catch (e) { /* ok */ }
    const row = rows.find((r) => r.nume === nume);
    if (!row) return;
    b.style.display = "block"; b.textContent = "Se încarcă răspunsurile tale…";
    let full = null;
    try { full = await API.get(nume); } catch (e) { /* mai jos */ }
    if (state.nume !== nume) return; // a ales altcineva între timp
    if (!full) { b.textContent = "Ai completat deja, dar nu am putut încărca răspunsurile. Reîncarcă pagina."; return; }
    fillAnswers(full);
    setEditing(true);
    b.innerHTML = "<b>Ai completat deja</b>" + (row.ts ? " (" + esc(fmtDate(row.ts)) + ")" : "") +
      ". Răspunsurile tale sunt completate mai jos, le poți modifica și apăsa „Salvează modificările”.";
  }
  $("nume").addEventListener("change", onName);

  // ---------- 2. Albume ----------
  function imgFallback(img) { img.onerror = () => { img.onerror = null; img.style.opacity = ".25"; }; }

  const albumeEl = $("albume");
  D.albume.forEach((a) => {
    const b = document.createElement("div");
    b.className = "card";
    b.setAttribute("role", "button");
    b.setAttribute("tabindex", "0");
    b.setAttribute("aria-pressed", "false");
    b.dataset.nume = a.nume;
    b.innerHTML =
      (a.badge ? `<span class="badge">${a.badge}</span>` : "") +
      `<span class="tick">${TICK}</span>` +
      `<img loading="lazy" alt="Album ${a.nume}" src="${D.albumCoperta(a)}">` +
      `<div class="cap"><span>${a.nume}</span><button type="button" class="zoom">Vezi pozele</button></div>`;
    imgFallback(b.querySelector("img"));
    b.addEventListener("click", (e) => {
      if (e.target.classList.contains("zoom")) { e.stopPropagation(); openAlbum(a); return; }
      pickAlbum(a.nume);
    });
    b.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickAlbum(a.nume); } });
    albumeEl.appendChild(b);
  });
  function pickAlbum(nume) {
    state.album = nume;
    albumeEl.querySelectorAll(".card").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.nume === nume)));
    const box = $("album-ales");
    box.style.display = "block";
    box.innerHTML = `Album ales: <strong>${nume}</strong>`;
    clearErr("s-album");
  }

  // ---------- 3. Fundaluri ----------
  const fundEl = $("fundaluri");
  D.fundaluri.forEach((id, i) => {
    const n = i + 1;
    const b = document.createElement("div");
    b.className = "card bg";
    b.setAttribute("role", "button");
    b.setAttribute("tabindex", "0");
    b.setAttribute("aria-pressed", "false");
    b.dataset.n = n;
    b.innerHTML =
      `<span class="tick">${TICK}</span>` +
      `<img loading="lazy" alt="Fundal ${n}" src="${D.fundalThumb(id, 500)}">` +
      `<div class="cap"><span>Fundal ${n}</span><button type="button" class="zoom">Mărește</button></div>`;
    imgFallback(b.querySelector("img"));
    b.addEventListener("click", (e) => {
      if (e.target.classList.contains("zoom")) { e.stopPropagation(); openFundal(n, id); return; }
      pickFundal(n);
    });
    b.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickFundal(n); } });
    fundEl.appendChild(b);
  });
  function pickFundal(n) {
    state.fundal = n;
    fundEl.querySelectorAll(".card").forEach((c) => c.setAttribute("aria-pressed", String(Number(c.dataset.n) === n)));
    const box = $("fundal-ales");
    box.style.display = "block";
    box.innerHTML = `Fundal ales: <strong>Fundal ${n}</strong>`;
    clearErr("s-fundal");
  }

  // ---------- 2. Citat (apare în album, lângă nume) ----------
  const citatMode = () => ($("fara-citat").checked ? "Nu" : "Da");
  function updatePreview() {
    $("qn").textContent = state.nume || "Nume Prenume";
    const t = state.citatText.trim();
    const qt = $("qt");
    if (citatMode() === "Nu") { qt.textContent = "Fără citat în album"; qt.classList.add("empty"); }
    else if (t) { qt.textContent = "„" + t + "”"; qt.classList.remove("empty"); }
    else { qt.textContent = "Citatul tău va apărea aici"; qt.classList.add("empty"); }
  }
  $("citat-text").addEventListener("input", (e) => {
    state.citatText = e.target.value;
    $("citat-count").textContent = e.target.value.length;
    updatePreview(); clearErr("s-citat");
  });
  $("fara-citat").addEventListener("change", () => {
    $("citat-text").disabled = $("fara-citat").checked;
    updatePreview(); clearErr("s-citat");
  });

  // ---------- 5. Robe (doar tabelul „Robe Speciale”, mărime = număr 1-5) ----------
  const gSel = $("greutate"), hSel = $("inaltime");
  D.greutati.forEach((g, i) => gSel.add(new Option(g, i)));
  D.inaltimi.forEach((h, i) => hSel.add(new Option(h, i)));

  function recalc() {
    const gi = gSel.value, hi = hSel.value;
    state.greutate = gi === "" ? "" : D.greutati[gi];
    state.inaltime = hi === "" ? "" : D.inaltimi[hi];
    const rec = $("rec");
    document.querySelectorAll("#tabele td.hit").forEach((c) => c.classList.remove("hit"));
    if (gi === "" || hi === "") { rec.style.display = "none"; state.marime = ""; return; }
    const nr = D.robeSpeciale[gi][hi];
    state.marime = String(nr);
    rec.style.display = "block";
    rec.innerHTML = `Mărimea ta de robă: <strong class="nr">${nr}</strong>`;
    const cell = document.querySelector(`#tabele tr[data-g="${gi}"] td[data-h="${hi}"]`);
    if (cell) cell.classList.add("hit");
    clearErr("s-roba");
  }
  gSel.addEventListener("change", recalc);
  hSel.addEventListener("change", recalc);

  $("tabele").innerHTML = `<table class="t"><tr><th>Greutate / Înălțime</th>` +
    D.inaltimi.map((h) => `<th>${h}</th>`).join("") + "</tr>" +
    D.greutati.map((g, i) => `<tr data-g="${i}"><td>${g}</td>` +
      D.robeSpeciale[i].map((v, j) => `<td data-h="${j}">${v}</td>`).join("") + "</tr>").join("") + "</table>";

  // ---------- Modal ----------
  const modal = $("modal");
  function openModal(titlu, link, imgs) {
    $("m-titlu").textContent = titlu;
    $("m-link").href = link;
    $("m-imgs").innerHTML = imgs.map((s) => `<img loading="lazy" alt="" src="${s}" onerror="this.remove()">`).join("");
    modal.classList.add("on");
    document.body.style.overflow = "hidden";
  }
  function openAlbum(a) { openModal("Album " + a.nume, D.albumPagina(a), D.albumPoze(a)); }
  function openFundal(n, id) { openModal("Fundal " + n, D.fundalLink(id), [D.fundalThumb(id, 1600)]); }
  function closeModal() { modal.classList.remove("on"); document.body.style.overflow = ""; }
  $("m-x").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // ---------- Validare + trimitere ----------
  function clearErr(id) { $(id).classList.remove("err"); }
  function citatOk() {
    if (citatMode() === "Nu") return true;
    if (state.citatText.trim().length < 3) {
      $("citat-err").textContent = "Scrie citatul sau bifează „Nu vreau citat în album”.";
      return false;
    }
    return true;
  }
  function validate() {
    const checks = [
      ["s-nume", !!state.nume], ["s-citat", citatOk()], ["s-album", !!state.album],
      ["s-fundal", !!state.fundal], ["s-roba", !!state.marime],
    ];
    let first = null;
    checks.forEach(([id, ok]) => {
      $(id).classList.toggle("err", !ok);
      if (!ok && !first) first = id;
    });
    if (first) $(first).scrollIntoView({ behavior: "smooth", block: "center" });
    return !first;
  }

  $("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const btn = $("trimite");
    btn.disabled = true; btn.textContent = "Se salvează…";
    const payload = {
      nume: state.nume, album: state.album, fundal: "Fundal " + state.fundal,
      citat: citatMode(), citatText: citatMode() === "Da" ? state.citatText.trim() : "", greutate: state.greutate, inaltime: state.inaltime, marime: state.marime,
    };
    try {
      const ok = await API.save(payload);
      if (!ok) throw new Error("not confirmed");
      const i = rows.findIndex((r) => r.nume === payload.nume);
      const rec = { ...payload, ts: new Date().toISOString() };
      if (i >= 0) rows[i] = rec; else rows.push(rec);
      fillNames();
      setEditing(true);
      showDone(payload);
    } catch (err) {
      alert("Nu am putut confirma salvarea. Verifică internetul și apasă din nou „Trimite”. Dacă se repetă, anunță-l pe cel care administrează site-ul.");
    } finally {
      btn.disabled = false; btn.textContent = btnLabel();
    }
  });

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function showDone(p) {
    $("form").style.display = "none";
    $("gata").style.display = "block";
    $("g-nume").textContent = p.nume;
    $("g-sum").innerHTML = [
      ["Nume Prenume", esc(p.nume)],
      ["Citat în album", p.citat === "Da" ? "„" + esc(p.citatText) + "”" : "Fără citat"],
      ["Album", esc(p.album)], ["Fundal", esc(p.fundal)],
      ["Greutate / înălțime", esc(p.greutate) + " · " + esc(p.inaltime) + " m"], ["Mărime robă", esc(p.marime)],
    ].map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  $("modifica").addEventListener("click", () => {
    $("gata").style.display = "none";
    $("form").style.display = "block";
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
    try { saved = localStorage.getItem("clasa12c_nume") || ""; } catch (e) { /* ok */ }
    if (saved && D.elevi.includes(saved)) { $("nume").value = saved; onName(); }
  });
  updatePreview();
})();
