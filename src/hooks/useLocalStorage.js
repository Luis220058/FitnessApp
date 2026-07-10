/* ============================================
   USELOCALSTORAGE.JS — Ein eigener Hook
   
   NEUES KONZEPT: Custom Hooks
   
   Bisher hattest du in SatzLogger dieses Muster:
     - useState für die Daten
     - useEffect zum Laden beim Start
     - useEffect zum Speichern bei Änderung
   
   Das brauchen wir jetzt ZWEIMAL (Sätze UND Übungen).
   Statt zu kopieren, packen wir es in eine Funktion.
   
   Eine Funktion, die mit "use" anfängt und andere
   Hooks benutzt, nennt man "Custom Hook".
   Sie funktioniert wie useState — gibt einen Wert
   und eine Setter-Funktion zurück.
   
   Benutzung:
     const [saetze, setSaetze] = useLocalStorage('key', [])
   
   Das ist genau wie useState, nur dass es sich
   automatisch merkt.
   ============================================ */

import { useState, useEffect } from 'react'

export function useLocalStorage(schluessel, startwert) {

  /* Beim ersten Rendern: schau in localStorage nach.
     
     useState kann eine FUNKTION als Startwert kriegen.
     Die läuft dann nur einmal, beim ersten Rendern.
     Das ist wichtig — sonst würden wir bei JEDEM
     Rendern in localStorage nachschauen. */
  const [wert, setWert] = useState(() => {
    try {
      const gespeichert = localStorage.getItem(schluessel)
      // Gibt's was? Dann zurückwandeln. Sonst Startwert.
      return gespeichert ? JSON.parse(gespeichert) : startwert
    } catch (fehler) {
      // Falls die Daten kaputt sind: nimm den Startwert
      console.error('Fehler beim Laden:', fehler)
      return startwert
    }
  })

  /* Bei jeder Änderung: speichern. */
  useEffect(() => {
    try {
      localStorage.setItem(schluessel, JSON.stringify(wert))
    } catch (fehler) {
      console.error('Fehler beim Speichern:', fehler)
    }
  }, [schluessel, wert])

  // Zurückgeben wie useState: [wert, setter]
  return [wert, setWert]
}