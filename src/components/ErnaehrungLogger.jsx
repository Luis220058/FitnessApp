/* ============================================
   ERNAEHRUNGLOGGER.JSX
   
   Wie der Satz-Logger: mehrere Einträge pro Tag,
   jeder einzeln sichtbar, plus Tagessumme oben.
   Anders als der Gewicht-Logger (nur 1 Eintrag/Tag)
   werden hier neue Einträge angehängt, nicht ersetzt.
   ============================================ */

import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import './ErnaehrungLogger.css'

function ErnaehrungLogger() {

  /* ===== DATEN ===== */
  const [eintraege, setEintraege] = useLocalStorage('fitnessapp_ernaehrung', [])

  const [kalorien, setKalorien] = useState('')
  const [carbs, setCarbs] = useState('')
  const [protein, setProtein] = useState('')
  const [fett, setFett] = useState('')
  const [notiz, setNotiz] = useState('')


  /* ===== LOKALES DATUM =====
     Wie im Gewicht-Logger: toISOString() ist UTC und
     würde Einträge kurz nach Mitternacht falsch einsortieren. */
  function alsDatumString(date) {
    const jahr = date.getFullYear()
    const monat = (date.getMonth() + 1).toString().padStart(2, '0')
    const tag = date.getDate().toString().padStart(2, '0')
    return `${jahr}-${monat}-${tag}`
  }

  const heute = alsDatumString(new Date())
  const heutigeEintraege = eintraege.filter(e => e.datum === heute)


  /* ===== TAGESSUMMEN =====
     Vier separate reduce()-Aufrufe — einer pro Nährwert.
     Leicht zu lesen, auch wenn's vier Zeilen statt einer sind. */

  const summeKalorien = heutigeEintraege.reduce((summe, e) => summe + e.kalorien, 0)
  const summeCarbs = heutigeEintraege.reduce((summe, e) => summe + e.carbs, 0)
  const summeProtein = heutigeEintraege.reduce((summe, e) => summe + e.protein, 0)
  const summeFett = heutigeEintraege.reduce((summe, e) => summe + e.fett, 0)


  /* ===== FUNKTIONEN ===== */

  function speichereEintrag() {
    // Kalorien ist das einzige Pflichtfeld — Rest darf 0/leer sein
    if (!kalorien) return

    const neuerEintrag = {
      id: Date.now(),
      kalorien: parseFloat(kalorien) || 0,
      carbs: parseFloat(carbs) || 0,
      protein: parseFloat(protein) || 0,
      fett: parseFloat(fett) || 0,
      notiz: notiz,
      datum: heute,
      zeitstempel: Date.now(),
    }

    // Anhängen, nicht ersetzen — anders als beim Gewicht-Logger
    setEintraege([neuerEintrag, ...eintraege])

    // Felder leeren für den nächsten Eintrag
    setKalorien('')
    setCarbs('')
    setProtein('')
    setFett('')
    setNotiz('')
  }

  function loescheEintrag(id) {
    setEintraege(eintraege.filter(e => e.id !== id))
  }


  /* ===== ANZEIGE ===== */

  return (
    <div className="ernaehrung-logger">

      {/* Eingabe-Karte */}
      <div className="ernaehrung-karte">

        <div className="eingabe-reihe">
          <div className="eingabe-feld">
            <label>Kalorien</label>
            <input
              type="number"
              inputMode="numeric"
              value={kalorien}
              onChange={(e) => setKalorien(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="eingabe-feld">
            <label>Carbs (g)</label>
            <input
              type="number"
              inputMode="decimal"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="eingabe-reihe">
          <div className="eingabe-feld">
            <label>Protein (g)</label>
            <input
              type="number"
              inputMode="decimal"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="eingabe-feld">
            <label>Fett (g)</label>
            <input
              type="number"
              inputMode="decimal"
              value={fett}
              onChange={(e) => setFett(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="eingabe-feld">
          <label>Notiz (optional)</label>
          <input
            type="text"
            value={notiz}
            onChange={(e) => setNotiz(e.target.value)}
            placeholder="z.B. Frühstück"
          />
        </div>

        <button className="speichern-btn" onClick={speichereEintrag}>
          Eintrag speichern
        </button>

      </div>


      {/* Tagessumme */}
      {heutigeEintraege.length > 0 && (
        <div className="summe-karte">
          <div className="summe-kalorien">
            {Math.round(summeKalorien)} <span className="einheit">kcal heute</span>
          </div>
          <div className="summe-makros">
            <div className="makro">
              <span className="makro-wert carbs">{Math.round(summeCarbs)}g</span>
              <span className="makro-label">Carbs</span>
            </div>
            <div className="makro">
              <span className="makro-wert protein">{Math.round(summeProtein)}g</span>
              <span className="makro-label">Protein</span>
            </div>
            <div className="makro">
              <span className="makro-wert fett">{Math.round(summeFett)}g</span>
              <span className="makro-label">Fett</span>
            </div>
          </div>
        </div>
      )}


      {/* Liste der heutigen Einträge */}
      {heutigeEintraege.length > 0 && (
        <div className="section">
          <div className="section-label">
            Heute — {heutigeEintraege.length}{' '}
            {heutigeEintraege.length === 1 ? 'Eintrag' : 'Einträge'}
          </div>
          <div className="eintraege-liste">
            {heutigeEintraege.map(eintrag => (
              <div key={eintrag.id} className="eintrag-zeile">
                <div className="eintrag-info">
                  <div className="eintrag-haupt">
                    <span className="eintrag-kalorien">{eintrag.kalorien} kcal</span>
                    {eintrag.notiz && (
                      <span className="eintrag-notiz">{eintrag.notiz}</span>
                    )}
                  </div>
                  <div className="eintrag-makros">
                    C {eintrag.carbs}g · P {eintrag.protein}g · F {eintrag.fett}g
                  </div>
                </div>
                <button
                  className="loeschen-btn"
                  onClick={() => loescheEintrag(eintrag.id)}
                  aria-label="Eintrag löschen"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default ErnaehrungLogger