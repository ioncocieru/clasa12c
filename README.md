# Site clasa a XII-a C: numărul pozei

Fiecare elev își alege numele și scrie **numărul pozei** pe care o vrea în album (ex. 0123).
Răspunsurile ajung într-un Google Sheet nou numit **POZE** (Nume Prenume | Număr poză | Data).
Se poate reveni și schimba numărul.

- `index.html`: formularul
- `statistica.html`: câți au completat din 26, cine a completat, cine urmează
- `js/config.js`: **singurul fișier de editat** (adresa Google Script și termenul)
- `apps-script/Code.gs`: codul pentru foaia POZE

## Pasul 1: Excel-ul nou POZE (Google Sheets)
1. drive.google.com -> New -> **Google Sheets** -> redenumește-l **POZE**.
2. Extensions -> **Apps Script**. Șterge codul existent și lipește tot `apps-script/Code.gs`. Salvează.
3. În meniul de lângă butonul Run alege funcția `setup` și apasă **Run** (acceptă permisiunile).
   Se pregătește foaia `POZE` cu cei 26 de elevi.
4. **Deploy -> New deployment -> Web app**: Execute as: **Me**, Who has access: **Anyone**. Copiază adresa `/exec`.

## Pasul 2: Conectează site-ul
În `js/config.js` lipește adresa la `SCRIPT_URL` și verifică `TERMEN`.

## Pasul 3: GitHub + Vercel
Repo pe GitHub cu conținutul folderului, apoi vercel.com -> Add New -> Project -> Deploy (Framework: Other).

## Mod demo
Cât `SCRIPT_URL` e gol, site-ul funcționează local (datele rămân în browser), ca să-l testezi.

## Note
- Numărul pozei acceptă cifre, litere, `-` și `_` (maxim 20), iar zerourile din față se păstrează (0123).
- Nu există parolă: oricine alege numele altui coleg îi poate vedea și schimba numărul.
- Pagina de statistică nu arată numerele, doar cine a completat.
- Lista elevilor (26, fără Isacenco Maxim) este în `js/data.js` **și** în `apps-script/Code.gs`.
