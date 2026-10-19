# Ghid: Excel-ul Absolvent.md în Google Sheets, legat de site

Excel-ul („2027. L.L.Blaga Bălți mun.Balti. 12C.xlsx”) se deschide în **Google Sheets**, nu în Google Docs. Docs e pentru text, Sheets e pentru tabele. După pași, răspunsurile elevilor se completează singure în Excel.

## Partea 1 — Pune Excel-ul în Google Sheets
1. Deschide drive.google.com cu contul tău.
2. New → **File upload** → alege fișierul `.xlsx`.
3. Dă dublu clic pe fișierul încărcat (se deschide în previzualizare) → sus apasă **Open with → Google Sheets**.
4. Meniu **File → Save as Google Sheets**. De acum lucrezi în versiunea Google (are iconița verde Sheets), nu în `.xlsx`.
5. Redenumește fișierul, de exemplu „Clasa 12C – Absolvent”.

Foaia ta se numește „Лист1”. Las-o așa, nu o redenumi.

## Partea 2 — Adaugă scriptul care primește răspunsurile
Lucrezi în **același** fișier Google Sheets.
1. Meniu **Extensions → Apps Script**.
2. Șterge codul existent și lipește tot conținutul din `apps-script/Code.gs`. Apasă Salvează.
3. În bara de sus alege funcția **setup** și apasă **Run**. Google cere permisiuni: Review permissions → alege contul → Advanced → Go to project → Allow.
4. Revino la fișier: au apărut două foi noi, `Raspunsuri` și `Lista Absolventi`. Foaia „Лист1” rămâne neatinsă.
5. În Apps Script: **Deploy → New deployment**. La roata dințată alege **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Apasă Deploy și copiază adresa **Web app URL** (se termină cu `/exec`).
6. Lipește adresa în `js/config.js`, la `SCRIPT_URL`, apoi urcă site-ul pe GitHub/Vercel.

## Partea 3 — Adu răspunsurile în foaia Excel (Лист1)
În Excel-ul Absolvent.md, lista absolvenților începe la rândul 15, în coloanele A–D (Nume Prenume, Număr poză, Mărime robă, Pachet/Notițe). Foaia `Lista Absolventi` are exact aceleași 4 coloane, completate automat de site.

În **Лист1** pune aceste formule (câte una, în prima celulă a coloanei; se întind singure peste cele 26 de rânduri):

| Celula | Formula |
|---|---|
| A15 | `='Lista Absolventi'!A2:A27` |
| C15 | `='Lista Absolventi'!C2:C27` |
| D15 | `='Lista Absolventi'!D2:D27` |

Coloana B (Număr poză) o completezi tu manual, în foaia `Lista Absolventi` sau în Лист1. Dacă scrii în A15, C15, D15 peste formulă, se strică legătura; scrie doar în coloana B.

**Totalul pe mărimi** (tabelul „Total Marimi robe”). Pentru fiecare mărime, pune în celula de lângă ea:
`=COUNTIF($C$15:$C$40; "XS")`
și la fel pentru S, M, L, XL, XXL. Pentru robele speciale, `=COUNTIF($C$15:$C$40; 3)` etc. (cifra fără ghilimele). Dacă Sheets-ul tău e setat pe engleză, separatorul în formule este virgula, nu punct și virgulă.

## Partea 4 — Trimite Excel-ul înapoi la Absolvent.md
Meniu **File → Download → Microsoft Excel (.xlsx)**. Formulele se transformă în valori, deci fișierul arată ca originalul, cu lista completată.

## Dacă ceva nu merge
- **Elevii văd imagini goale la fundaluri:** folderul din Drive trebuie să fie „Anyone with the link”.
- **Elevul apasă Trimite și primește eroare:** verifică la Deploy că „Who has access” este **Anyone**. Dacă ai modificat codul, fă Deploy → Manage deployments → creion (Edit) → Version: **New version** → Deploy.
- **Pagina de statistică rămâne goală:** adresa din `config.js` trebuie să se termine cu `/exec`, nu cu `/edit`.
- **Vrei să începi de la zero:** rulează din nou `setup` (șterge doar foile `Raspunsuri` și `Lista Absolventi`, nu și Лист1).
