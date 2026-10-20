/**
 * Backend pentru site-ul clasei 12C — Google Apps Script legat de un Google Sheet.
 * Instrucțiuni: vezi README.md (pasul 2).
 *
 * Creează 2 foi:
 *  - "Raspunsuri"        — un rând pe elev (se actualizează dacă retrimite)
 *  - "Lista Absolventi"  — în formatul din Excel-ul Absolvent.md
 *                          (Nume Prenume | Număr poză | Mărime robă | Pachet/Notițe)
 *  - "Citate"            — Nume Prenume | Citat (gata de copiat în album); se creează singură
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

const HEAD = ["Data", "Nume Prenume", "Album", "Fundal", "Citate", "Citat orientativ", "Greutate", "Înălțime", "Mărime robă"];
const SHEET_R = "Raspunsuri";
const SHEET_L = "Lista Absolventi";
const SHEET_C = "Citate";

/** Rulează O SINGURĂ DATĂ din editor (butonul Run) ca să pregătească foile. */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let r = ss.getSheetByName(SHEET_R) || ss.insertSheet(SHEET_R);
  r.clear();
  r.getRange(1, 1, 1, HEAD.length).setValues([HEAD]).setFontWeight("bold").setBackground("#ffff00");
  r.setFrozenRows(1);

  let l = ss.getSheetByName(SHEET_L) || ss.insertSheet(SHEET_L);
  l.clear();
  l.getRange(1, 1, 1, 4).setValues([["Nume Prenume", "Număr poză", "Mărime robă", "Pachet/Notițe"]])
    .setFontWeight("bold").setBackground("#ffff00");
  l.getRange(2, 1, ELEVI.length, 1).setValues(ELEVI.map((n) => [n]));
  l.setFrozenRows(1);
  l.autoResizeColumns(1, 4);

  // Șterge foaia goală implicită (doar dacă e chiar goală). Foaia importată din Excel rămâne neatinsă.
  ["Sheet1", "Foaie1"].forEach(function (n) {
    const s = ss.getSheetByName(n);
    if (s && s.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s);
  });
}

function ensureCitate_(ss) {
  let c = ss.getSheetByName(SHEET_C);
  if (!c) {
    c = ss.insertSheet(SHEET_C);
    c.getRange(1, 1, 1, 2).setValues([["Nume Prenume", "Citat"]]).setFontWeight("bold").setBackground("#ffff00");
    c.getRange(2, 1, ELEVI.length, 1).setValues(ELEVI.map((n) => [n]));
    c.setFrozenRows(1);
    c.setColumnWidth(1, 220);
    c.setColumnWidth(2, 600);
  }
  return c;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Citire: action=list (statistică) sau action=get&nume=... (editarea propriului răspuns). */
function doGet(e) {
  try {
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_R);
    const vals = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, HEAD.length).getValues() : [];
    const ts = (v) => (v[0] instanceof Date ? v[0].toISOString() : String(v[0]));

    if (e && e.parameter && e.parameter.action === "get") {
      const nume = e.parameter.nume;
      const v = vals.filter((x) => x[1] === nume)[0];
      if (!v) return json_({ ok: true, row: null });
      return json_({ ok: true, row: {
        ts: ts(v), nume: v[1], album: String(v[2]), fundal: String(v[3]), citat: String(v[4]),
        citatText: String(v[5]), greutate: String(v[6]), inaltime: String(v[7]), marime: String(v[8]),
      } });
    }

    // Lista publică: NU include greutatea, înălțimea și citatele scrise.
    const rows = vals.filter((v) => v[1]).map((v) => ({
      ts: ts(v), nume: v[1], album: v[2], fundal: v[3], citat: v[4], marime: v[8],
    }));
    return json_({ ok: true, rows: rows });
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
    if (ELEVI.indexOf(d.nume) === -1) return json_({ ok: false, error: "Nume necunoscut" });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_R);
    const line = [new Date(), d.nume, d.album, d.fundal, d.citat, String(d.citatText || "").slice(0, 200),
      d.greutate, d.inaltime, String(d.marime)].map((x, i) => (i === 0 ? x : String(x).slice(0, 200)));

    // rândul existent al elevului (dacă retrimite, îl suprascriem)
    const last = sh.getLastRow();
    let row = 0;
    if (last > 1) {
      const names = sh.getRange(2, 2, last - 1, 1).getValues();
      for (let i = 0; i < names.length; i++) if (names[i][0] === d.nume) { row = i + 2; break; }
    }
    if (!row) row = last + 1;
    sh.getRange(row, 2, 1, line.length - 1).setNumberFormat("@"); // text simplu: nu se execută formule
    sh.getRange(row, 1, 1, line.length).setValues([line]);
    sh.getRange(row, 1).setNumberFormat("dd.MM.yyyy HH:mm");

    // foaia „Citate”: Nume Prenume | Citat (ordinea clasei)
    const c = ensureCitate_(ss);
    const ci = ELEVI.indexOf(d.nume) + 2;
    c.getRange(ci, 2).setNumberFormat("@");
    c.getRange(ci, 2).setValue(d.citat === "Da" ? String(d.citatText || "").slice(0, 200) : "(fără citat)");

    // sincronizează „Lista Absolventi” (formatul din Excel)
    const l = ss.getSheetByName(SHEET_L);
    const ln = l.getRange(2, 1, Math.max(1, l.getLastRow() - 1), 1).getValues();
    for (let i = 0; i < ln.length; i++) {
      if (ln[i][0] === d.nume) {
        // mărimea robei = număr 1-5 (tabelul Robe Speciale)
        const marimeExcel = Number(d.marime);
        l.getRange(i + 2, 3, 1, 2).setValues([[marimeExcel, "Album: " + d.album + "; " + d.fundal + "; Citate: " + d.citat]]);
        break;
      }
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
