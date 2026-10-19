// Date statice: elevi, albume, fundaluri, tabele de mărimi robe.
window.DATA = {
  clasa: "12C",
  scoala: "L.T. „Lucian Blaga”, Bălți",

  // 26 de elevi (Isacenco Maxim a fost scos)
  elevi: [
    "Andronic Dumitrița", "Arman Alexandru", "Celacu Olga", "Cocieru Ion",
    "Coseric Egor", "Cucuruza Mihaela", "Cudreașov Gleb", "Culicov Melania",
    "Dogotar Ana-Maria", "Emciuc Polina", "Grabovschi Sava", "Jurjiu Nicolai",
    "Miron Vladislav", "Muntean Valentin", "Orghian Costantin",
    "Podgornîi Laurențiu", "Postolachi Ana", "Rusu Livia", "Scripcari Bianca",
    "Slesari Andrei", "Slobodeniuc Victoria", "Strulea Dumitru",
    "Tertea Alexandru", "Țârnă Daria", "Vacarciuc Gabriel", "Zaharcu Nichita",
  ],

  // Albume (modele pentru liceu) de pe https://absolvent.md/albume#modele
  // slug = adresa paginii modelului; copertă = /images/albume/modele/coperta-<slug>.webp
  albume: [
    { nume: "Red", slug: "61-red", badge: "Recomandat de Cocieru Ion" },
    { nume: "Gold", slug: "5-gold", badge: "Varianta roșie, să se potrivească cu ținuta neagră" },
    { nume: "Cerc", slug: "7-cerc" },
    { nume: "Premium", slug: "1-premium" },
    { nume: "Typo", slug: "58-typo" },
    { nume: "Line", slug: "57-line" },
    { nume: "Granit", slug: "granit" },
    { nume: "Fonturi", slug: "6-fonturi" },
    { nume: "Black Promotion", slug: "black-promotion" },
    { nume: "Split", slug: "4-split" },
    { nume: "David", slug: "2-david" },
    { nume: "CEEF", slug: "9-ceef" },
    { nume: "Black Year", slug: "black-year" },
    { nume: "Black & White Promotion", slug: "13-black-white-promotion" },
    { nume: "Pastel Blue", slug: "50-pastel-blue" },
    { nume: "White Granite", slug: "white-granite" },
    { nume: "Puskin School Time", slug: "11PuskinSchoolTime" },
    { nume: "Cover", slug: "cover" },
    { nume: "Coffe", slug: "15-coffe" },
    { nume: "Marmura", slug: "3-marmura" },
    { nume: "Acuarela", slug: "8-acuarela" },
    { nume: "Ocean", slug: "12-ocean" },
    { nume: "Rose Gradient", slug: "48-rose-gradient" },
    { nume: "City Bordo", slug: "18Color" },
    { nume: "Gogol", slug: "gogol" },
    { nume: "Black & White", slug: "black-white" },
    { nume: "Medical Blue", slug: "medical-blue" },
    { nume: "Grey Outside", slug: "grey-outside" },
    { nume: "Color", slug: "bordo" },
    { nume: "Autumn", slug: "08-autumn" },
    { nume: "Brown Thunder", slug: "08-brown-thunder" },
    { nume: "Red Thunder", slug: "10-red-thunder" },
    { nume: "Modern Style", slug: "modern-style" },
    { nume: "Modern Grey", slug: "modern-grey" },
  ],

  // Modele de fundal (fișiere din folderul Google Drive). Ordinea = numărul fundalului.
  fundaluri: [
    "1L93sJrLxfSRbLzyL0qHUMps8vbaZr-46", "1eNZjsElV0kOhnhWMJpuuyPMb8M7PHi3e",
    "19eZlBh3QmzPP9e8A1lYMrj00upEHp3kA", "1ISVtwhDgeArIy2lTDUgHa9iP4hOtckh2",
    "1ffIsnHGKRKquRs8TnxqBrMP3m7VBy5ww", "1Vv3yQjblQnBzfpm28WGMXwCOpF8qFqDg",
    "1b_yJQ7k8Tvj9Meiwmf3tuwmtsDpq9hoc", "1g2SG869uClwZHdcmN7CYNE1uZSF8jG-N",
    "19qaXWJyAK3ojDJ9NmKFe1jpBQhn8Awfp", "1PGIVNDFvoklhUkZfTErLOFOm2GSCz9jT",
    "1lNkZVR4dDGNoQ8XdFBItYRUr7BSAW_Xs", "1j53lqQcrEoqDFNcoE5lXWLqXEl-rglsK",
    "1Mz4jED6NvbhLCHtJDyiOrxQSNrOX58Vp", "1RxOLO4fF7zb09dj0QXShFDZYJRqJiT7L",
    "1YHrJil05qP8r_yVJOGvY_XBTGWVgHwTF", "1-RcIf5ThBVykmdFtYF-eCYgL3N5Bst3x",
    "1QZlFX_HEywRrQ84d9I8jWIyQ5aS0I3SY", "1i-0_oRRGJVD7F_ku8YeDWsStObSucKyz",
    "1ID9cCNfWCPuHiHl-H7PkllCEI4qh0ZOP", "1fraWSgiGP1ZEwyL-YA6Y2I9AWP88-HWU",
    "1syYQG0MWXrIGkqZGi_CVY7T0ExpWvKdd", "1qU8jbBpNq4HtazwwbuSIMaGHS5-7KzGK",
    "1tUktQiPUoqErw0MSsQlQBefai99E6s60", "184Z_OLO5FuSaOdXhbIeZnSQL6BfVVQCr",
    "1yW13oKuHNVv2HGQ5sMqZV8mt7jXzK4vf", "10ZMpBK_8y7yeBBJxh50OyjW2qxSyRNjI",
    "1nNNxClv_R3rqE9RCnjybYVifn2jOrhr4", "1mY070q6GbPOr2-LIaJawSDZKA4bQ8T8S",
    "1myzVmUCoXHz8uAj6-N28sy0GBpC9XQdF", "1z9cXGNVzuUbqBgbZB52aPXoHlasCOrCx",
    "1h0rpItLO1PNjKgDcf4RF5aJku0QL8PF3", "1mWSr-tgaCLf6Zf6vFbFZEdEN5Nja5_sS",
    "1ADxTDbBozncPHHkUHSWglAqHmney4wpG", "1kGTuoaxZ3bRIbjbnEcMzjAgWNOWr91it",
    "13vys0YcNDGwGykwq_Fpune-fDTSBJwnf",
  ],
  folderFundaluri: "https://drive.google.com/drive/folders/1RNOylsQp06LDLfFKORBQsJ7sWfRqDHYI",

  // Tabele de mărimi robe (din Excel). Rânduri = greutate, coloane = înălțime.
  greutati: ["45-55 kg", "55-65 kg", "65-75 kg", "75-85 kg", "85-95 kg", "peste 95 kg"],
  inaltimi: ["1,55-1,65", "1,65-1,75", "1,75-1,85", "1,85-1,95", "1,95-peste"],
  robeSpeciale: [
    [1, 1, 2, 3, 4],
    [1, 2, 2, 3, 4],
    [2, 3, 3, 4, 5],
    [2, 3, 4, 5, 5],
    [3, 3, 4, 5, 5],
    [4, 4, 5, 5, 5],
  ],
  robeNegre: [
    ["XS", "XS", "S", "M", "L"],
    ["XS", "S", "S", "M", "L"],
    ["S", "M", "M", "L", "XL"],
    ["S", "M", "L", "XL", "XL"],
    ["M", "M", "L", "XL", "XL"],
    ["L", "L", "XL", "XXL", "XXL"],
  ],
  marimiNegre: ["XS", "S", "M", "L", "XL", "XXL"],
  marimiSpeciale: [1, 2, 3, 4, 5],
};

DATA.albumCoperta = (a) => `https://absolvent.md/images/albume/modele/coperta-${a.slug}.webp`;
DATA.albumPagina = (a) => `https://absolvent.md/${a.slug}`;
DATA.albumPoze = (a) => [
  `https://absolvent.md/images/albume/modele/${a.slug}.webp`,
  `https://absolvent.md/images/albume/modele/${a.slug}-1.webp`,
  `https://absolvent.md/images/albume/modele/${a.slug}-2.webp`,
  `https://absolvent.md/images/albume/modele/${a.slug}-3.webp`,
];
DATA.fundalThumb = (id, w = 600) => `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;
DATA.fundalLink = (id) => `https://drive.google.com/file/d/${id}/view`;
