/**
 * Backend pentru site-ul clasei 12C: Google Apps Script legat de un Google Sheet.
 * Instrucțiuni: vezi README.md (pasul 2).
 *
 * Folosește O SINGURĂ foaie: "Citate"
 *    Nume Prenume | Citat | Data
 * Celelalte foi din fișier (Raspunsuri, Lista Absolventi, Лист1 etc.) NU sunt atinse.
 */

const ELEVI = [
  "Andronic Dumitrița", "Arman Alexandru", "Celacu Olga", "Cocieru Ion",
  "Coseric Egor", "Cucuruza Mihaela", "Cudreașov Gleb", "Culicov Melania",
  "Dogotar Ana-Maria", "Emciuc Polina", "Grabovschi Sava", "Jurjiu Nicolai",
  "Miron Vladislav", "Muntean Valentin", "Orghian Costantin",
  "Podgornîi Laurențiu", "Postolachi Ana", "Rusu Livia", "Scripcari Bianca",
  "Slesari Andrei", "Slobodeniuc Victoria", "Strulea Dumitru",
  "Tertea Alexandru", "Țârnă Daria", "Vacarciuc Gabriel", "Zaharcu Nichita",
];

const SHEET_C = "Citate";
const NO_QUOTE = "(fără citat)"; // valoare veche, tratată ca necompletat

/** Creează foaia „Citate” dacă nu există (nu șterge nimic dacă există deja). */
function ensureCitate_(ss) {
  let c = ss.getSheetByName(SHEET_C);
  if (!c) {
    c = ss.insertSheet(SHEET_C);
    c.getRange(2, 1, ELEVI.length, 1).setValues(ELEVI.map((n) => [n]));
    c.setFrozenRows(1);
    c.setColumnWidth(1, 220);
    c.setColumnWidth(2, 600);
    c.setColumnWidth(3, 140);
  }
  c.getRange(1, 1, 1, 3).setValues([["Nume Prenume", "Citat", "Data"]]).setFontWeight("bold").setBackground("#ffff00");
  return c;
}

/** Rulează O DATĂ (Run): pregătește foaia „Citate”. Nu șterge date existente. */
function setup() {
  ensureCitate_(SpreadsheetApp.getActiveSpreadsheet());
}

/** Rulează O DATĂ dacă ai răspunsuri vechi în foaia „Raspunsuri”: copiază citatele în „Citate”. */
function sincronizeazaCitate() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const c = ensureCitate_(ss);
  const sh = ss.getSheetByName("Raspunsuri");
  if (!sh || sh.getLastRow() < 2) return;
  sh.getRange(2, 1, sh.getLastRow() - 1, 9).getValues().forEach(function (v) {
    const i = ELEVI.indexOf(v[1]);
    if (i < 0 || v[4] !== "Da" || !String(v[5]).trim()) return;
    c.getRange(i + 2, 2).setNumberFormat("@").setValue(String(v[5]));
    c.getRange(i + 2, 3).setValue(v[0]);
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function readAll_() {
  const c = ensureCitate_(SpreadsheetApp.getActiveSpreadsheet());
  const last = c.getLastRow();
  if (last < 2) return [];
  return c.getRange(2, 1, last - 1, 3).getValues()
    .filter((v) => v[0] && String(v[1]).trim() && v[1] !== NO_QUOTE)
    .map((v) => ({
      nume: v[0], citat: String(v[1]),
      ts: v[2] instanceof Date ? v[2].toISOString() : String(v[2] || ""),
    }));
}

/** Citire: action=list (cine a completat) sau action=get&nume=... (citatul propriu, pentru editare). */
function doGet(e) {
  try {
    const rows = readAll_();
    if (e && e.parameter && e.parameter.action === "get") {
      const r = rows.filter((x) => x.nume === e.parameter.nume)[0];
      return json_({ ok: true, row: r || null });
    }
    // Lista publică NU include citatele, doar cine a completat și când.
    return json_({ ok: true, rows: rows.map((x) => ({ nume: x.nume, ts: x.ts })) });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Scriere: formularul trimite JSON ca text/plain. */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    const i = ELEVI.indexOf(d.nume);
    if (i < 0) return json_({ ok: false, error: "Nume necunoscut" });
    const citat = String(d.citat || "").trim().slice(0, 200);
    if (citat.length < 3) return json_({ ok: false, error: "Citat prea scurt" });

    const c = ensureCitate_(SpreadsheetApp.getActiveSpreadsheet());
    // găsește rândul după nume (nu presupune ordinea)
    const names = c.getRange(2, 1, Math.max(1, c.getLastRow() - 1), 1).getValues();
    let row = 0;
    for (let k = 0; k < names.length; k++) if (names[k][0] === d.nume) { row = k + 2; break; }
    if (!row) { row = c.getLastRow() + 1; c.getRange(row, 1).setValue(d.nume); }

    c.getRange(row, 2).setNumberFormat("@").setValue(citat); // text simplu: nu se execută formule
    c.getRange(row, 3).setNumberFormat("dd.MM.yyyy HH:mm").setValue(new Date());
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
