// Date statice: elevii clasei și alegerea făcută de clasă (album Red, fundal 35).
window.DATA = {
  clasa: "12C",
  elevi: [
    "Andronic Dumitrița", "Arman Alexandru", "Celacu Olga", "Cocieru Ion",
    "Coseric Egor", "Cucuruza Mihaela", "Cudreașov Gleb", "Culicov Melania",
    "Dogotar Ana-Maria", "Emciuc Polina", "Grabovschi Sava", "Jurjiu Nicolai",
    "Miron Vladislav", "Muntean Valentin", "Orghian Constantin",
    "Podgornîi Laurențiu", "Postolachi Ana", "Rusu Livia", "Scripcari Bianca",
    "Slesari Andrei", "Slobodeniuc Victoria", "Strulea Dumitru",
    "Tertea Alexandru", "Țărnă Daria", "Vacarciuc Gabriel", "Zaharcu Nichita",
  ],
  album: { nume: "Red", pagina: "https://absolvent.md/61-red", coperta: "https://absolvent.md/images/albume/modele/coperta-61-red.webp" },
  fundal: { nr: 35, id: "13vys0YcNDGwGykwq_Fpune-fDTSBJwnf" },
};
DATA.fundal.thumb = `https://drive.google.com/thumbnail?id=${DATA.fundal.id}&sz=w800`;
DATA.fundal.link = `https://drive.google.com/file/d/${DATA.fundal.id}/view`;
