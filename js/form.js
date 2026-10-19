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
  $("nume").addEventListener("change", (e) => { state.nume = e.target.value; clearErr("s-nume"); });

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

  // ---------- 4. Citate ----------
  document.querySelectorAll("#s-citat .pill").forEach((p) => {
    p.addEventListener("click", () => {
      state.citat = p.dataset.v;
      document.querySelectorAll("#s-citat .pill").forEach((q) => q.setAttribute("aria-pressed", String(q === p)));
      $("citat-box").style.display = state.citat === "Da" ? "block" : "none";
      $("citat-err").textContent = "Alege Da sau Nu.";
      clearErr("s-citat");
      if (state.citat === "Da") setTimeout(() => $("citat-text").focus({ preventScroll: true }), 50);
    });
  });
  $("citat-text").addEventListener("input", (e) => {
    state.citatText = e.target.value;
    $("citat-count").textContent = e.target.value.length;
    clearErr("s-citat");
  });

  // ---------- 5. Robe ----------
  const gSel = $("greutate"), hSel = $("inaltime"), mSel = $("marime");
  D.greutati.forEach((g, i) => gSel.add(new Option(g, i)));
  D.inaltimi.forEach((h, i) => hSel.add(new Option(h, i)));

  mSel.innerHTML = '<option value="">— alege —</option>' +
    '<optgroup label="Robă neagră">' + D.marimiNegre.map((m) => `<option value="Neagră ${m}">${m}</option>`).join("") + "</optgroup>" +
    '<optgroup label="Robă specială">' + D.marimiSpeciale.map((m) => `<option value="Specială ${m}">${m}</option>`).join("") + "</optgroup>";

  function recalc() {
    const gi = gSel.value, hi = hSel.value;
    state.greutate = gi === "" ? "" : D.greutati[gi];
    state.inaltime = hi === "" ? "" : D.inaltimi[hi];
    const rec = $("rec");
    if (gi === "" || hi === "") { rec.style.display = "none"; return; }
    const neagra = D.robeNegre[gi][hi], speciala = D.robeSpeciale[gi][hi];
    rec.style.display = "block";
    rec.innerHTML = `Recomandat: robă neagră <strong>${neagra}</strong> · robă specială <strong>${speciala}</strong>`;
    mSel.value = "Neagră " + neagra;
    state.marime = mSel.value;
    clearErr("s-roba");
  }
  gSel.addEventListener("change", recalc);
  hSel.addEventListener("change", recalc);
  mSel.addEventListener("change", () => { state.marime = mSel.value; clearErr("s-roba"); });

  function tabel(titlu, data) {
    return `<p style="margin:14px 0 0"><b>${titlu}</b></p><table class="t"><tr><th>Greutate / Înălțime</th>` +
      D.inaltimi.map((h) => `<th>${h}</th>`).join("") + "</tr>" +
      D.greutati.map((g, i) => `<tr><td>${g}</td>` + data[i].map((v) => `<td>${v}</td>`).join("") + "</tr>").join("") + "</table>";
  }
  $("tabele").innerHTML = tabel("Robe negre", D.robeNegre) + tabel("Robe speciale", D.robeSpeciale);

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
    if (!state.citat) { $("citat-err").textContent = "Alege Da sau Nu."; return false; }
    if (state.citat === "Da" && state.citatText.trim().length < 3) {
      $("citat-err").textContent = "Scrie, orientativ, citatul pe care îl vrei.";
      return false;
    }
    return true;
  }
  function validate() {
    const checks = [
      ["s-nume", !!state.nume], ["s-album", !!state.album], ["s-fundal", !!state.fundal],
      ["s-citat", citatOk()], ["s-roba", !!state.marime && !!state.greutate && !!state.inaltime],
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
    btn.disabled = true; btn.textContent = "Se trimite…";
    const payload = {
      nume: state.nume, album: state.album, fundal: "Fundal " + state.fundal,
      citat: state.citat, citatText: state.citat === "Da" ? state.citatText.trim() : "", greutate: state.greutate, inaltime: state.inaltime, marime: state.marime,
    };
    try {
      const ok = await API.save(payload);
      if (!ok) throw new Error("not confirmed");
      showDone(payload);
    } catch (err) {
      alert("Nu am putut confirma salvarea. Verifică internetul și apasă din nou „Trimite”. Dacă se repetă, anunță-l pe cel care administrează site-ul.");
    } finally {
      btn.disabled = false; btn.textContent = "Trimite răspunsurile";
    }
  });

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function showDone(p) {
    $("form").style.display = "none";
    $("gata").style.display = "block";
    $("g-nume").textContent = p.nume;
    $("g-sum").innerHTML = [
      ["Album", p.album], ["Fundal", p.fundal],
      ["Citate", p.citat],
      ...(p.citat === "Da" ? [["Citat orientativ", esc(p.citatText)], ["Citatul final", "până " + C.TERMEN_CITAT]] : []),
      ["Greutate / înălțime", p.greutate + " · " + p.inaltime + " m"], ["Mărime robă", p.marime],
    ].map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  $("modifica").addEventListener("click", () => {
    $("gata").style.display = "none";
    $("form").style.display = "block";
    loadRows();
  });

  async function loadRows() {
    try { rows = await API.list(); } catch (e) { rows = []; }
    fillNames();
  }
  fillNames();
  loadRows();
})();
