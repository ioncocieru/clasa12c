# Site clasa a XII-a C: citatul din album

Site static (HTML/CSS/JS, fără build). Elevul își alege numele și scrie citatul (obligatoriu).
Albumul **Red** și fundalul **35** sunt alese de clasă și apar doar ca informare.
Răspunsurile ajung într-un **Google Sheet**, în foaia `Citate` (Nume Prenume | Citat | Data).

- `index.html`: formularul (se poate intra din nou și edita citatul)
- `statistica.html`: câți au completat din 26, cine a completat, cine urmează
- `js/config.js`: **singurul fișier de editat** (adresa Google Script și termenul)
- `apps-script/Code.gs`: codul care se lipește în Google Sheets

## Pasul 1: Fundalul din Google Drive trebuie să fie public
Poza fundalului 35 se afișează din Drive. Share → General access → **Anyone with the link (Viewer)**.

## Pasul 2: Google Sheet + Apps Script
1. Deschide Google Sheet-ul tău (poți folosi același, celelalte foi nu sunt atinse).
2. Extensions → **Apps Script**. Șterge codul existent și lipește tot `apps-script/Code.gs`. Salvează.
3. Alege funcția `setup` și apasă **Run**. Se creează foaia `Citate` (dacă există deja, nu se șterge nimic).
   Dacă ai citate vechi în foaia `Raspunsuri`, rulează apoi și `sincronizeazaCitate`.
4. **Deploy → Manage deployments → creion (Edit) → Version: New version → Deploy**
   (la prima instalare: New deployment → Web app, Execute as: Me, Who has access: Anyone). Copiază adresa `/exec`.

## Pasul 3: Conectează site-ul
În `js/config.js` lipește adresa între ghilimele la `SCRIPT_URL`.

## Pasul 4: GitHub + Vercel
Pune conținutul folderului într-un repo GitHub, apoi vercel.com → Add New → Project → Deploy (Framework: Other).

## Mod demo
Cât `SCRIPT_URL` e gol, site-ul funcționează local (datele rămân în browser).

## Note
- Nu există parolă: oricine alege numele altui coleg îi poate vedea și modifica citatul.
- Pagina de statistică nu arată citatele, doar cine a completat.
- Lista elevilor (26, fără Isacenco Maxim) este în `js/data.js` **și** în `apps-script/Code.gs`.
