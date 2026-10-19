# Site clasa a XII-a C — alegeri album, fundal, citate, robe

Site static (HTML/CSS/JS, fără build). Răspunsurile ajung într-un **Google Sheet** prin Google Apps Script.

- `index.html` — formularul elevilor
- `statistica.html` — câți au completat din 26, cine a completat, cine urmează + rezultatele alegerilor
- `js/config.js` — **singurul fișier de editat** (adresa Google Script)
- `apps-script/Code.gs` — codul care se lipește în Google Sheets
- `GHID-google-sheets.md` — cum aduci Excel-ul Absolvent.md în Google Sheets și îl legi de site

## Pasul 1 — Fundalurile din Google Drive trebuie să fie publice
Pozele fundalurilor se afișează direct din Drive. În folderul cu fundaluri:
Share → General access → **Anyone with the link (Viewer)**. Altfel elevii vor vedea imagini goale.

## Pasul 2 — Google Sheet + Apps Script
1. Creează un Google Sheet nou (ex. „Clasa 12C – alegeri”).
2. Extensions → **Apps Script**. Șterge codul existent și lipește tot conținutul din `apps-script/Code.gs`. Salvează.
3. Alege funcția `setup` și apasă **Run** (acceptă permisiunile). Se creează foile `Raspunsuri` și `Lista Absolventi`.
4. Deploy → **New deployment** → tip **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy și copiază **Web app URL** (se termină cu `/exec`).

## Pasul 3 — Conectează site-ul
În `js/config.js` lipește adresa între ghilimele la `SCRIPT_URL`. Gata.

Dacă modifici ulterior `Code.gs`, fă Deploy → Manage deployments → creion (Edit) → Version: **New version**.

## Pasul 4 — GitHub + Vercel
1. Pune conținutul acestui folder într-un repo GitHub (fișierele la rădăcină, `index.html` lângă `js/` și `css/`).
2. vercel.com → Add New → Project → alege repo-ul → **Deploy** (Framework: Other, fără build command). Linkul îl trimiți clasei.

## Ce primești în Google Sheets
- `Raspunsuri` — un rând per elev: dată, nume, album, fundal, citate, citat orientativ, greutate, înălțime, mărime robă.
  Dacă un elev retrimite, rândul lui se actualizează (nu se dublează).
- `Lista Absolventi` — formatul din Excel-ul Absolvent.md (Nume Prenume · Număr poză · Mărime robă · Pachet/Notițe).
  Se completează automat; copiezi coloanele în Excel-ul original sau încarci foaia direct.

## Mod demo
Cât `SCRIPT_URL` e gol, site-ul funcționează local (datele rămân în browser), ca să-l testezi.

## Note
- Pagina de statistică NU arată greutatea/înălțimea, doar mărimea aleasă.
- Albumele (copertele) se încarcă de pe absolvent.md; dacă își schimbă adresele, actualizează `js/data.js`.
- Isacenco Maxim a fost scos din listă (26 de elevi). Lista se află în `js/data.js` **și** în `apps-script/Code.gs`.
