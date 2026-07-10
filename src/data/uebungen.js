/* ============================================
   UEBUNGEN.JS — Deine Übungsdaten
   
   Warum eine eigene Datei? Damit du Übungen
   ändern kannst, ohne den Code anzufassen.
   Das ist eine wichtige Gewohnheit: Daten und
   Logik getrennt halten.
   ============================================ */

// Ein Objekt: jeder Schlüssel ist eine Gruppe,
// jeder Wert ist eine Liste von Übungen.
export const GRUPPEN = {
  "Arme": [
    "Seitheben",
    "Face Pulls",
    "Trizepsdrücken überkopf",
    "Trizepsdrücken",
    "Bizeps Curls",
    "Hammer Curls",
  ],
  "Brust / Rücken": [
    "Low Row Maschine",
    "Brustpresse",
    "Schrägbankdrücken",
    "Latzug",
    "Klimmzüge",
    "Butterfly",
  ],
  "Beine": [
    "Squats",
    "RDL",
    "Ausfallschritte",
    "Wadenheben",
    "Abduktoren",
  ],
}

// Object.keys() gibt uns die Gruppennamen als Liste:
// ["Arme", "Brust / Rücken", "Beine"]
export const GRUPPEN_NAMEN = Object.keys(GRUPPEN)