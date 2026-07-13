/* ============================================
   SATZLOGGER.JSX
   
   NEU: Übungen sind jetzt Objekte { name, typ }
   statt reiner Strings. typ ist "zusatz" (normales
   Gewicht) oder "koerpergewicht" (Körpergewicht +
   optionales Zusatzgewicht, z.B. bei Klimmzügen).
   
   Migration: alte, als String gespeicherte Übungen
   werden beim Laden automatisch ins neue Format
   überführt.
   
   Bei "koerpergewicht"-Übungen wird das zuletzt
   geloggte Körpergewicht aus fitnessapp_gewicht
   geholt und automatisch zum eingegebenen
   Zusatzgewicht addiert.
   ============================================ */

import { useState } from 'react'
import { START_GRUPPEN } from '../data/uebungen'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Tagesuebersicht from './Tagesuebersicht'
import './SatzLogger.css'

function SatzLogger() {

  /* ===== GESPEICHERTE DATEN ===== */

  const [saetze, setSaetze] = useLocalStorage('fitnessapp_saetze', [])
  const [gruppen, setGruppen] = useLocalStorage('fitnessapp_gruppen', START_GRUPPEN)

  // Körpergewichts-Verlauf — nur LESEN, kein Setter nötig.
  // Gleicher Speicher-Schlüssel wie im Gewichtlogger.
  const [gewichtsEintraege] = useLocalStorage('fitnessapp_gewicht', [])


  /* ===== MIGRATION =====
     Alte Übungen waren reine Strings ("Bankdrücken").
     Neue Übungen sind Objekte ({ name, typ }).
     Automatische Reparatur alter Daten. */

  function migriereUebung(uebung) {
    if (typeof uebung === 'object') return uebung
    return { name: uebung, typ: 'zusatz' }
  }

  const gruppenMigriert = {}
  for (const gruppenName of Object.keys(gruppen)) {
    gruppenMigriert[gruppenName] = gruppen[gruppenName].map(migriereUebung)
  }
  const gruppenNamen = Object.keys(gruppenMigriert)


  /* ===== NORMALER STATE ===== */

  const [gewaehlteGruppe, setGewaehlteGruppe] = useState(null)
  // gewaehlteUebung bleibt ein simpler String (der Name) — einfacher
  // zu vergleichen als ganze Objekte.
  const [gewaehlteUebung, setGewaehlteUebung] = useState(null)

  const [gewicht, setGewicht] = useState('')          // für "zusatz"-Übungen
  const [zusatzgewicht, setZusatzgewicht] = useState('')  // für "koerpergewicht"-Übungen
  const [wiederholungen, setWiederholungen] = useState('')
  const [rpe, setRpe] = useState(7)
  const [notiz, setNotiz] = useState('')

  const [bearbeiten, setBearbeiten] = useState(false)

  const [neueGruppe, setNeueGruppe] = useState('')
  const [neueUebung, setNeueUebung] = useState('')
  const [neuerTyp, setNeuerTyp] = useState('zusatz')  // Typ-Auswahl beim Anlegen
  const [zeigeGruppeFeld, setZeigeGruppeFeld] = useState(false)
  const [zeigeUebungFeld, setZeigeUebungFeld] = useState(false)


  /* ===== ABGELEITETE DATEN ===== */

    // Lokales Datum statt toISOString() (das ist UTC) — sonst bekommen
  // Einträge kurz nach Mitternacht das Datum des Vortags und fallen
  // in Statistik.jsx aus der aktuellen Woche raus.
  function alsDatumString(date) {
    const jahr = date.getFullYear()
    const monat = (date.getMonth() + 1).toString().padStart(2, '0')
    const tag = date.getDate().toString().padStart(2, '0')
    return `${jahr}-${monat}-${tag}`
  }

  const heute = alsDatumString(new Date())
  const alleHeutigenSaetze = saetze.filter(satz => satz.datum === heute)
  const heutigeSaetze = alleHeutigenSaetze.filter(
    satz => satz.uebung === gewaehlteUebung
  )
  const letztesMal = saetze.find(
    satz => satz.uebung === gewaehlteUebung && satz.datum !== heute
  )

  // Das Übungs-Objekt der aktuell gewählten Übung finden
  // (um an ihren "typ" ranzukommen)
  const uebungObjekt = gewaehlteGruppe && gewaehlteUebung
    ? gruppenMigriert[gewaehlteGruppe].find(u => u.name === gewaehlteUebung)
    : null
  const istKoerpergewicht = uebungObjekt?.typ === 'koerpergewicht'

  // Aktuellstes Körpergewicht: der Eintrag mit dem neuesten Datum
  const aktuellesKoerpergewicht = gewichtsEintraege.length > 0
    ? [...gewichtsEintraege].sort((a, b) => b.datum.localeCompare(a.datum))[0].gewicht
    : null

  function satzZahlFuerUebung(uebung) {
    return alleHeutigenSaetze.filter(satz => satz.uebung === uebung).length
  }

  function satzZahlFuerGruppe(gruppe) {
    return alleHeutigenSaetze.filter(satz => satz.gruppe === gruppe).length
  }

  function rpeFarbe(wert) {
    if (wert >= 9) return 'var(--danger)'
    if (wert >= 8) return 'var(--warning)'
    return 'var(--accent)'
  }


  /* ===== GRUPPEN VERWALTEN ===== */

  function legeGruppeAn() {
    const name = neueGruppe.trim()
    if (!name) return
    if (gruppen[name]) {
      alert('Diese Gruppe gibt es schon.')
      return
    }
    setGruppen({ ...gruppen, [name]: [] })
    setNeueGruppe('')
    setZeigeGruppeFeld(false)
    setGewaehlteGruppe(name)
  }

  function loescheGruppe(name) {
    if (!confirm(`Gruppe "${name}" löschen? Die geloggten Sätze bleiben erhalten.`)) {
      return
    }
    const kopie = { ...gruppen }
    delete kopie[name]
    setGruppen(kopie)
    if (gewaehlteGruppe === name) {
      setGewaehlteGruppe(null)
      setGewaehlteUebung(null)
    }
  }


  /* ===== ÜBUNGEN VERWALTEN ===== */

  function legeUebungAn() {
    const name = neueUebung.trim()
    if (!name || !gewaehlteGruppe) return

    const bestehendeNamen = gruppenMigriert[gewaehlteGruppe].map(u => u.name)
    if (bestehendeNamen.includes(name)) {
      alert('Diese Übung gibt es in dieser Gruppe schon.')
      return
    }

    const neueUebungObjekt = { name: name, typ: neuerTyp }

    setGruppen({
      ...gruppen,
      [gewaehlteGruppe]: [...gruppenMigriert[gewaehlteGruppe], neueUebungObjekt],
    })
    setNeueUebung('')
    setNeuerTyp('zusatz')
    setZeigeUebungFeld(false)
  }

  function loescheUebung(uebungName) {
    if (!confirm(`Übung "${uebungName}" löschen? Die geloggten Sätze bleiben erhalten.`)) {
      return
    }
    setGruppen({
      ...gruppen,
      [gewaehlteGruppe]: gruppenMigriert[gewaehlteGruppe].filter(u => u.name !== uebungName),
    })
    if (gewaehlteUebung === uebungName) {
      setGewaehlteUebung(null)
    }
  }


  /* ===== AUSWAHL (Toggle) ===== */

  function waehleGruppe(gruppe) {
    if (bearbeiten) return
    if (gewaehlteGruppe === gruppe) {
      setGewaehlteGruppe(null)
      setGewaehlteUebung(null)
      return
    }
    setGewaehlteGruppe(gruppe)
    setGewaehlteUebung(null)
    setZeigeUebungFeld(false)
  }

  function waehleUebung(uebungName) {
    if (bearbeiten) return
    if (gewaehlteUebung === uebungName) {
      setGewaehlteUebung(null)
      return
    }
    setGewaehlteUebung(uebungName)
    setZusatzgewicht('')
  }


  /* ===== SÄTZE ===== */

  function speichereSatz() {
    if (!wiederholungen) return

    let tatsaechlichesGewicht

    if (istKoerpergewicht) {
      // Körpergewicht + Zusatzgewicht (Zusatz darf leer/0 sein)
      if (!aktuellesKoerpergewicht) {
        alert('Trag zuerst dein Körpergewicht im Profil ein.')
        return
      }
      const zusatz = parseFloat(zusatzgewicht) || 0
      tatsaechlichesGewicht = aktuellesKoerpergewicht + zusatz
    } else {
      if (!gewicht) return
      tatsaechlichesGewicht = parseFloat(gewicht)
    }

    const neuerSatz = {
      id: Date.now(),
      uebung: gewaehlteUebung,
      gruppe: gewaehlteGruppe,
      gewicht: tatsaechlichesGewicht,
      // Bei Körpergewicht-Übungen merken wir uns zusätzlich, wie sich
      // das Gewicht zusammensetzt — nützlich für die Anzeige später.
      zusatzgewicht: istKoerpergewicht ? (parseFloat(zusatzgewicht) || 0) : null,
      istKoerpergewicht: istKoerpergewicht,
      wiederholungen: parseInt(wiederholungen),
      rpe: rpe,
      notiz: notiz,
      datum: heute,
      zeitstempel: Date.now(),
    }

    setSaetze([neuerSatz, ...saetze])
    setWiederholungen('')
    setNotiz('')
    // Gewicht-Feld NICHT leeren (man macht meist mehrere Sätze mit
    // demselben Gewicht) — Zusatzgewicht aber schon, da öfter variiert.
  }

  function loescheSatz(id) {
    setSaetze(saetze.filter(satz => satz.id !== id))
  }


  /* ===== ANZEIGE ===== */

  return (
    <div className="logger">

      {/* === GRUPPEN === */}
      <div className="section">
        <div className="section-kopf">
          <div className="section-label">Gruppe</div>
          <button
            className={`bearbeiten-btn ${bearbeiten ? 'aktiv' : ''}`}
            onClick={() => setBearbeiten(!bearbeiten)}
          >
            {bearbeiten ? 'Fertig' : 'Bearbeiten'}
          </button>
        </div>

        <div className="gruppen-grid">
          {gruppenNamen.map(gruppe => {
            const anzahl = satzZahlFuerGruppe(gruppe)
            return (
              <div key={gruppe} className="gruppe-wrapper">
                <button
                  className={`gruppe-btn ${gewaehlteGruppe === gruppe ? 'aktiv' : ''}`}
                  onClick={() => waehleGruppe(gruppe)}
                >
                  {gruppe}
                  {anzahl > 0 && !bearbeiten && (
                    <span className="badge">{anzahl}</span>
                  )}
                </button>
                {bearbeiten && (
                  <button
                    className="entfernen-btn"
                    onClick={() => loescheGruppe(gruppe)}
                    aria-label={`${gruppe} löschen`}
                  >
                    ×
                  </button>
                )}
              </div>
            )
          })}

          {!zeigeGruppeFeld && (
            <button className="plus-btn" onClick={() => setZeigeGruppeFeld(true)}>
              +
            </button>
          )}
        </div>

        {zeigeGruppeFeld && (
          <div className="neu-feld">
            <input
              type="text"
              value={neueGruppe}
              onChange={(e) => setNeueGruppe(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && legeGruppeAn()}
              placeholder="Name der Gruppe"
              autoFocus
            />
            <button className="neu-btn" onClick={legeGruppeAn}>Anlegen</button>
            <button
              className="abbrechen-btn"
              onClick={() => { setZeigeGruppeFeld(false); setNeueGruppe('') }}
            >
              ×
            </button>
          </div>
        )}
      </div>


      {/* === ÜBUNGEN === */}
      {gewaehlteGruppe && (
        <div className="section">
          <div className="section-label">Übung</div>

          <div className="uebungen-liste">
            {gruppenMigriert[gewaehlteGruppe].map(uebung => {
              const anzahl = satzZahlFuerUebung(uebung.name)
              const istGewaehlt = gewaehlteUebung === uebung.name
              return (
                <div key={uebung.name}>

                  <div className="uebung-wrapper">
                    <button
                      className={`uebung-btn ${istGewaehlt ? 'aktiv' : ''}`}
                      onClick={() => waehleUebung(uebung.name)}
                    >
                      <span>
                        {uebung.name}
                        {uebung.typ === 'koerpergewicht' && (
                          <span className="typ-tag">KG</span>
                        )}
                      </span>
                      {anzahl > 0 && !bearbeiten && (
                        <span className="badge">{anzahl}</span>
                      )}
                    </button>
                    {bearbeiten && (
                      <button
                        className="entfernen-btn"
                        onClick={() => loescheUebung(uebung.name)}
                        aria-label={`${uebung.name} löschen`}
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {istGewaehlt && !bearbeiten && (
                    <div className="eingabe-bereich">

                      {letztesMal && (
                        <div className="letztes-mal">
                          Letztes Mal: {letztesMal.gewicht} kg × {letztesMal.wiederholungen}
                          {' '}(RPE {letztesMal.rpe})
                        </div>
                      )}

                      <div className="eingabe-karte">

                        {istKoerpergewicht ? (
                          /* === EINGABE FÜR KÖRPERGEWICHT-ÜBUNGEN === */
                          <>
                            {aktuellesKoerpergewicht ? (
                              <div className="koerpergewicht-info">
                                Körpergewicht: <strong>{aktuellesKoerpergewicht} kg</strong>
                              </div>
                            ) : (
                              <div className="koerpergewicht-warnung">
                                Kein Körpergewicht hinterlegt — trag es im Profil ein.
                              </div>
                            )}

                            <div className="eingabe-reihe">
                              <div className="eingabe-feld">
                                <label>Zusatzgewicht (kg)</label>
                                <input
                                  type="number"
                                  inputMode="decimal"
                                  step="0.5"
                                  value={zusatzgewicht}
                                  onChange={(e) => setZusatzgewicht(e.target.value)}
                                  placeholder="0"
                                />
                              </div>
                              <div className="eingabe-feld">
                                <label>Wiederholungen</label>
                                <input
                                  type="number"
                                  inputMode="numeric"
                                  value={wiederholungen}
                                  onChange={(e) => setWiederholungen(e.target.value)}
                                  placeholder="0"
                                />
                              </div>
                            </div>

                            {aktuellesKoerpergewicht && (
                              <div className="gesamt-vorschau">
                                Gesamt: {aktuellesKoerpergewicht + (parseFloat(zusatzgewicht) || 0)} kg
                              </div>
                            )}
                          </>
                        ) : (
                          /* === EINGABE FÜR NORMALE ÜBUNGEN === */
                          <div className="eingabe-reihe">
                            <div className="eingabe-feld">
                              <label>Gewicht (kg)</label>
                              <input
                                type="number"
                                inputMode="decimal"
                                step="0.5"
                                value={gewicht}
                                onChange={(e) => setGewicht(e.target.value)}
                                placeholder="0"
                              />
                            </div>
                            <div className="eingabe-feld">
                              <label>Wiederholungen</label>
                              <input
                                type="number"
                                inputMode="numeric"
                                value={wiederholungen}
                                onChange={(e) => setWiederholungen(e.target.value)}
                                placeholder="0"
                              />
                            </div>
                          </div>
                        )}

                        <div className="rpe-bereich">
                          <div className="rpe-kopf">
                            <label>RPE</label>
                            <span className="rpe-wert" style={{ color: rpeFarbe(rpe) }}>
                              {rpe}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={rpe}
                            onChange={(e) => setRpe(parseInt(e.target.value))}
                            className="rpe-slider"
                            style={{ accentColor: rpeFarbe(rpe) }}
                          />
                        </div>

                        <div className="eingabe-feld">
                          <label>Notiz (optional)</label>
                          <input
                            type="text"
                            value={notiz}
                            onChange={(e) => setNotiz(e.target.value)}
                            placeholder="z.B. Schulter gezwickt"
                          />
                        </div>

                        <button className="speichern-btn" onClick={speichereSatz}>
                          Satz speichern
                        </button>
                      </div>

                      {heutigeSaetze.length > 0 && (
                        <div className="saetze-liste">
                          {heutigeSaetze.map((satz, index) => (
                            <div key={satz.id} className="satz-zeile">
                              <div className="satz-nummer">
                                {heutigeSaetze.length - index}
                              </div>
                              <div className="satz-daten">
                                <div className="satz-haupt">
                                  <span className="satz-gewicht">{satz.gewicht} kg</span>
                                  <span className="satz-mal">×</span>
                                  <span className="satz-reps">{satz.wiederholungen}</span>
                                </div>
                                {satz.istKoerpergewicht && (
                                  <div className="satz-notiz">
                                    Körpergewicht + {satz.zusatzgewicht} kg
                                  </div>
                                )}
                                {satz.notiz && (
                                  <div className="satz-notiz">{satz.notiz}</div>
                                )}
                              </div>
                              <div className="satz-rpe" style={{ color: rpeFarbe(satz.rpe) }}>
                                {satz.rpe}
                              </div>
                              <button
                                className="loeschen-btn"
                                onClick={() => loescheSatz(satz.id)}
                                aria-label="Satz löschen"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  )}
                </div>
              )
            })}

            {!zeigeUebungFeld && (
              <button
                className="plus-btn breit"
                onClick={() => setZeigeUebungFeld(true)}
              >
                + Übung hinzufügen
              </button>
            )}

            {zeigeUebungFeld && (
              <div className="neu-uebung-formular">
                <input
                  type="text"
                  value={neueUebung}
                  onChange={(e) => setNeueUebung(e.target.value)}
                  placeholder="Name der Übung"
                  autoFocus
                />

                {/* Typ-Auswahl: Körpergewicht oder Zusatzgewicht */}
                <div className="typ-auswahl">
                  <button
                    className={`typ-btn ${neuerTyp === 'zusatz' ? 'aktiv' : ''}`}
                    onClick={() => setNeuerTyp('zusatz')}
                  >
                    Zusatzgewicht
                  </button>
                  <button
                    className={`typ-btn ${neuerTyp === 'koerpergewicht' ? 'aktiv' : ''}`}
                    onClick={() => setNeuerTyp('koerpergewicht')}
                  >
                    Körpergewicht
                  </button>
                </div>

                <div className="neu-feld">
                  <button className="neu-btn" onClick={legeUebungAn}>
                    Anlegen
                  </button>
                  <button
                    className="abbrechen-btn"
                    onClick={() => {
                      setZeigeUebungFeld(false)
                      setNeueUebung('')
                      setNeuerTyp('zusatz')
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      <Tagesuebersicht saetze={alleHeutigenSaetze} onLoeschen={loescheSatz} />

    </div>
  )
}

export default SatzLogger