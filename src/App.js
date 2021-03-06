import React from 'react'
import Modell from './model/Shopping'
import GruppenTag from './components/GruppenTag'
import GruppenDialog from './components/GruppenDialog'
import SortierDialog from "./components/SortierDialog";


class App extends React.Component {
    constructor(props) {
        super(props)
        this.initialisieren()
        this.state = {
            aktiveGruppe: null,
            showGruppenDialog: false,
            showSortierDialog: false,
            einkaufenAufgeklappt: true,
            erledigtAufgeklappt: false

        }

    }

    initialisieren() {
        let montagDeutsch = Modell.gruppeHinzufuegen("Montag Deutsch")
        let aufgabeBeispiel1 = montagDeutsch.artikelHinzufuegen("Beispiel Schreibübung 1")
        montagDeutsch.artikelHinzufuegen("Beispiel Hexentext lesen")
        let montagMathe = Modell.gruppeHinzufuegen("Montag Mathe")
        let aufgabeBeispiel2 = montagMathe.artikelHinzufuegen("Beispiel + und -")
        montagMathe.artikelHinzufuegen("Beispiel Zahlen Suchspiel")
        let dienstagDeutsch = Modell.gruppeHinzufuegen("Dienstag Deutsch")
        let aufgabeBeispiel3 = dienstagDeutsch.artikelHinzufuegen("Beispiel Schreibübung 2")
        let aufgabeBeispiel4 = dienstagDeutsch.artikelHinzufuegen("Beispiel Hexentext lesen")
        let dienstagMathe = Modell.gruppeHinzufuegen("Dienstag Mathe")
        let mittwochDeutsch = Modell.gruppeHinzufuegen("Mittwoch Deutsch")
        let mittwochMathe = Modell.gruppeHinzufuegen("Mittwoch Mathe")
        let donnerstagDeutsch = Modell.gruppeHinzufuegen("Donnerstag Deutsch")
        let donnerstagMathe = Modell.gruppeHinzufuegen("Donnerstag Mathe")
        let freitagDeutsch = Modell.gruppeHinzufuegen("Freitag Deutsch")
        let freitagMathe = Modell.gruppeHinzufuegen("Freitag Mathe")
        let streberEcke = Modell.gruppeHinzufuegen("Zusatz Aufgaben")
    }

    einkaufenAufZuKlappen() {
        let neuerZustand = !this.state.einkaufenAufgeklappt
        this.setState({einkaufenAufgeklappt: neuerZustand})
    }

    erledigtAufZuKlappen() {
        this.setState({erledigtAufgeklappt: !this.state.erledigtAufgeklappt})
    }

    artikelChecken = (artikel) => {
        artikel.gekauft = !artikel.gekauft
        const aktion = (artikel.gekauft) ? "erledigt" : "reaktiviert"
        Modell.informieren("[App] Artikel \"" + artikel.name + "\" wurde " + aktion)
        this.setState(this.state)
    }

    artikelHinzufuegen() {
        const eingabe = document.getElementById("artikelEingabe")
        const artikelName = eingabe.value.trim()
        if (artikelName.length > 0) {
            Modell.aktiveGruppe.artikelHinzufuegen(artikelName)
            this.setState(this.state)
        }
        eingabe.value = ""
        eingabe.focus()
    }

    setAktiveGruppe(gruppe) {
        Modell.aktiveGruppe = gruppe
        Modell.informieren("[App] Gruppe \"" + gruppe.name + "\" ist nun aktiv")
        this.setState({aktiveGruppe: Modell.aktiveGruppe})
    }

    closeSortierDialog = (reihenfolge, sortieren) => {
        if (sortieren) {
            Modell.sortieren(reihenfolge)
        }
        this.setState({showSortierDialog: false})
    }

    render() {
        let nochZuKaufen = []
        if (this.state.einkaufenAufgeklappt == true) {
            for (const gruppe of Modell.gruppenListe) {
                nochZuKaufen.push(<GruppenTag
                    key={gruppe.id}
                    gruppe={gruppe}
                    gekauft={false}
                    aktiv={gruppe == this.state.aktiveGruppe}
                    aktiveGruppeHandler={() => this.setAktiveGruppe(gruppe)}
                    checkHandler={this.artikelChecken}/>)
            }
        }

        let schonGekauft = []
        if (this.state.erledigtAufgeklappt) {
            for (const gruppe of Modell.gruppenListe) {
                schonGekauft.push(<GruppenTag
                    key={gruppe.id}
                    gruppe={gruppe}
                    gekauft={true}
                    aktiveGruppeHandler={() => this.setAktiveGruppe(gruppe)}
                    checkHandler={this.artikelChecken}/>)
            }
        }

        let gruppenDialog = ""
        if (this.state.showGruppenDialog) {
            gruppenDialog = <GruppenDialog
                gruppenListe={Modell.gruppenListe}
                onDialogClose={() => this.setState({showGruppenDialog: false})}/>
        }

        let sortierDialog = ""
        if (this.state.showSortierDialog) {
            sortierDialog = <SortierDialog onDialogClose={this.closeSortierDialog}/>
        }

        return (
            <div id="container">
                <header>
                    <h1>LERNILAND</h1>
                    <h3>Klasse 1C</h3>
                    <label
                        className="mdc-text-field mdc-text-field--filled mdc-text-field--with-trailing-icon mdc-text-field--no-label">
                        <span className="mdc-text-field__ripple"></span>
                        <input className="mdc-text-field__input" type="search"
                               id="artikelEingabe" placeholder="Aufgabe Hinzufügen"
                               onKeyPress={e => (e.key == 'Enter') ? this.artikelHinzufuegen() : ''}/>
                        <span className="mdc-line-ripple"></span>
                        <i className="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
                           tabIndex="0" role="button"
                           onClick={() => this.artikelHinzufuegen()}>add_circle</i>
                    </label>

                </header>
                <hr/>

                <main>
                    <section>
                        <h2>AUFGABEN
                            <i onClick={() => this.einkaufenAufZuKlappen()} className="material-icons">
                                {this.state.einkaufenAufgeklappt ? 'expand_more' : 'expand_less'}
                            </i>
                        </h2>
                        <dl>
                            {nochZuKaufen}
                        </dl>
                    </section>
                    <hr/>
                    <section>
                        <h2>ERFÜLLT
                            <i onClick={() => this.erledigtAufZuKlappen()} className="material-icons">
                                {this.state.erledigtAufgeklappt ? 'expand_more' : 'expand_less'}
                            </i>
                        </h2>
                        <dl>
                            {schonGekauft}
                        </dl>
                    </section>
                </main>
                <hr/>
                <footer>
                    <h1>VIEL SPAß BEIM LERNEN</h1>
                    {/*<button className="mdc-button mdc-button--raised"
                            onClick={() => this.setState({showGruppenDialog: true})}>
                        <span className="material-icons">bookmark_add</span>
                        <span className="mdc-button__ripple"></span> Gruppen
                    </button>
                    <button className="mdc-button mdc-button--raised"
                            onClick={() => this.setState({showSortierDialog: true})}>
                        <span className="material-icons">sort</span>
                        <span className="mdc-button__ripple"></span> Sort
                    </button>
                    <button className="mdc-button mdc-button--raised">
                        <span className="material-icons">settings</span>
                        <span className="mdc-button__ripple"></span> Setup
                    </button>*/}
                </footer>

               {/* {gruppenDialog}
                {sortierDialog}*/}
            </div>
        )
    }
}

export default App
