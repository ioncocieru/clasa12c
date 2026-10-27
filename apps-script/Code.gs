/**
 * Backend pentru alegerea pozelor, clasa 12C.
 * Se lipește într-un Google Sheet NOU, numit POZE (Extensions > Apps Script).
 * Instrucțiuni: vezi README.md.
 *
 * Folosește o singură foaie: "POZE"
 *    Nume Prenume | Număr poză | Data
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

const SHEET = "POZE";

/** Creează foaia „POZE” dacă nu există (nu șterge nimic dacă există deja). */
function ensure_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(SHEET);
  if (!s) {
    s = ss.getSheets().length === 1 && ss.getSheets()[0].getLastRow() === 0 ? ss.getSheets()[0].setName(SHEET) : ss.insertSheet(SHEET);
    s.getRange(2, 1, ELEVI.length, 1).setValues(ELEVI.map((n) => [n]));
    s.setFrozenRows(1);
    s.setColumnWidth(1, 220); s.setColumnWidth(2, 120); s.setColumnWidth(3, 140);
  }
  s.getRange(1, 1, 1, 3).setValues([["Nume Prenume", "Număr poză", "Data"]])
    .setFontWeight("bold").setBackground("#ffff00");
  return s;
}

/** Rulează O DATĂ (Run): pregătește foaia „POZE”. */
function setup() { ensure_(); }

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function readAll_() {
  const s = ensure_();
  const last = s.getLastRow();
  if (last < 2) return [];
  return s.getRange(2, 1, last - 1, 3).getValues()
    .filter((v) => v[0] && String(v[1]).trim())
    .map((v) => ({
      nume: v[0], poza: String(v[1]),
      ts: v[2] instanceof Date ? v[2].toISOString() : String(v[2] || ""),
    }));
}

/** Citire: action=list (cine a completat) sau action=get&nume=... (numărul propriu, pentru editare). */
function doGet(e) {
  try {
    const rows = readAll_();
    if (e && e.parameter && e.parameter.action === "get") {
      const r = rows.filter((x) => x.nume === e.parameter.nume)[0];
      return json_({ ok: true, row: r || null });
    }
    // Lista publică NU include numărul pozei, doar cine a completat și când.
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
    if (ELEVI.indexOf(d.nume) < 0) return json_({ ok: false, error: "Nume necunoscut" });
    const poza = String(d.poza || "").trim();
    if (!/^[A-Za-z0-9_-]{1,20}$/.test(poza)) return json_({ ok: false, error: "Număr invalid" });

    const s = ensure_();
    const names = s.getRange(2, 1, Math.max(1, s.getLastRow() - 1), 1).getValues();
    let row = 0;
    for (let k = 0; k < names.length; k++) if (names[k][0] === d.nume) { row = k + 2; break; }
    if (!row) { row = s.getLastRow() + 1; s.getRange(row, 1).setValue(d.nume); }

    s.getRange(row, 2).setNumberFormat("@").setValue(poza);          // text: păstrează zerourile din față
    s.getRange(row, 3).setNumberFormat("dd.MM.yyyy HH:mm").setValue(new Date());

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
