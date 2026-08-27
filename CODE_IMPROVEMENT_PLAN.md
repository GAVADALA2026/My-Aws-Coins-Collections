# Piano di miglioramento del codice

## Contesto verificato

Il repository dispone di una suite Jest stabile: 19 suite, 101 test e coverage
al 100% su Statements, Branches, Functions e Lines. Il quality gate è eseguito
localmente e in GitHub Actions; `npm audit` non riporta vulnerabilità.

## Stato di avanzamento

| Attività | Stato | PR | Note |
|---|---|---|---|
| P1-01 — ID stabile + rinomina `sellCoin` | ✅ Implementato | #16 | `id` su Coin, `sellCoin({coinId})`, track `coin.id` |
| P1-02 — Reducer puro (no `alert`) | ✅ Implementato | #16 | rimosso side effect, aggiunta `sellCoinFailure` |
| P2-02 — Importi decimali | ⬜ Da fare | — | — |
| P2-03 — UX e accessibilità | ⬜ Da fare | — | — |
| P3-01 — Selector + ViewModel | ⬜ Da fare | — | — |
| P3-02 — Change detection | ⬜ Da fare | — | — |
| P4-01 — E2E (Playwright) | ⬜ Da fare | — | — |
| P4-02 — Branch protection | ⬜ Da fare | — | — |
| P4-03 — Dependabot | ⬜ Da fare | — | — |
| P2-01 — Repository dati | ⬜ Da fare | — | — |
| P0-01 — Auth reale | ⬜ Da fare | — | rimandata (ultima) |

Dopo P1: **103 test pass (19 suite), coverage 100%** su Statements, Branches,
Functions e Lines. Lint 0, type-check 0, build ok.

Questo piano riguarda l'evoluzione della qualità architetturale, funzionale,
accessibile e operativa dell'applicazione. Ogni attività deve seguire il flusso
branch dedicato → test → aggiornamento documentazione → Pull Request → CI verde
→ merge → commento di chiusura.

## Priorità P0 — sicurezza prima di un uso reale

### P0-01 — Sostituire l'autenticazione demo

**Evidenza**

- `LoginPage` invia `username` e `pwd` allo Store NgRx;
- `authGuard` considera autenticato un utente con due stringhe non vuote;
- il README dichiara che il login è solo dimostrativo.

**Intervento**

1. Integrare un backend o un provider OpenID Connect/OAuth 2.0.
2. Non conservare password nel frontend, nello Store o nel browser storage.
3. Usare sessione backend con cookie `HttpOnly`, `Secure` e `SameSite` adeguato.
4. Aggiungere interceptor HTTP, logout, gestione scadenza/refresh e `returnUrl`.
5. Esporre nello Store solo uno stato autenticato minimo e non sensibile.

**Criteri di accettazione**

- nessuna password è presente nello Store NgRx;
- le route protette richiedono una sessione/token effettivamente valido;
- login, logout, sessione scaduta e redirect sono coperti da test;
- i segreti restano esclusi dal repository e dai log.

## Priorità P1 — correttezza del dominio e purezza NgRx

### P1-01 — Identificatore stabile e rinomina `sellCoin`

**Evidenza**

La coin è rimossa con l'azione `seelCoin({ coinIdx })`; la UI traccia gli
elementi con `$index`. Un indice non è stabile dopo filtri, ordinamenti,
refresh o aggiornamenti concorrenti.

**Intervento**

1. Aggiungere `id: string` al modello `Coin` e ai DTO/payload associati.
2. Rinominare l'azione in `sellCoin({ coinId })`.
3. Rimuovere con `coin.id !== coinId` e tracciare con `track coin.id`.
4. Mantenere una migrazione o un mapper se saranno introdotti dati persistiti.

**Criteri di accettazione**

- una vendita elimina solo l'elemento con l'ID richiesto;
- l'operazione resta corretta dopo riordino o filtro;
- non rimane alcun riferimento a `seelCoin` o a `coinIdx` per la vendita;
- test unitari e integrati coprono ID valido, assente e duplicati impossibili.

### P1-02 — Rimuovere effetti collaterali dal reducer

**Evidenza**

`coinReducer` invoca `alert('Coin not found')` quando riceve un indice non
valido. Un reducer NgRx deve rimanere puro e senza side effect.

**Intervento**

1. Far restituire al reducer solo il nuovo stato.
2. Modellare il problema con un'azione `sellCoinFailure` o stato di feedback.
3. Mostrare toast/dialog/accessibilità tramite Effect o servizio UI dedicato.
4. Rendere il feedback chiudibile e localizzabile.

**Criteri di accettazione**

- il reducer non accede a `window`, `alert`, router, HTTP o servizi UI;
- l'errore utente è visibile e testabile tramite stato/Effect;
- nessun test deve mockare una chiamata globale per verificare un reducer.

## Priorità P2 — dati, validazione e UX

### P2-01 — Repository dati e persistenza

**Evidenza**

`CoinService` restituisce una costante in memoria attraverso `of(...).pipe(delay(1000))`.

**Intervento**

1. Definire un'interfaccia `CoinRepository`.
2. Separare DTO API, modello di dominio e mapper.
3. Implementare un adapter `HttpClient` e, se utile alla demo, un adapter
   IndexedDB/local storage esplicitamente separato.
4. Aggiungere cache, errori strutturati e retry controllato.

**Criteri di accettazione**

- il dominio non dipende direttamente da HTTP;
- l'adapter di test resta deterministico;
- caricamento, errore, retry e persistenza sono testati;
- nessuna chiamata di rete viene eseguita durante la suite Jest.

### P2-02 — Importi decimali e typed forms

**Evidenza**

I campi monetari sono `type="number"`, ma `allowOnlyDigits()` blocca i
separatori decimali. Questo impedisce l'inserimento di importi come `0,01 €`,
presenti anche nella collezione di esempio.

**Intervento**

1. Usare `inputmode="decimal"`, `step="0.01"` e validatori coerenti.
2. Memorizzare preferibilmente gli importi in centesimi interi oppure adottare
   una strategia decimale esplicita.
3. Usare `NonNullableFormBuilder` e `FormGroup` tipizzati.
4. Aggiornare i `FormControl` anziché mutare direttamente `input.value`.
5. Aggiungere limiti a anno, testo e importi, con normalizzazione `trim()`.

**Criteri di accettazione**

- sono ammessi decimali validi e rifiutati valori negativi/malformati;
- non esistono discrepanze tra valore visualizzato e valore del FormControl;
- i casi limite monetari e di anno sono coperti dai test.

### P2-03 — Stati UX e accessibilità

**Intervento**

1. Aggiungere stato di collezione vuota.
2. Usare `aria-busy` durante il caricamento e `role="alert"`/`aria-live` per gli errori.
3. Rendere il pulsante di vendita descrittivo: ad esempio `Sell <nome coin>`.
4. Chiedere conferma prima di una vendita e fornire feedback dopo aggiunta/rimozione.
5. Localizzare date, valute, testi e messaggi d'errore con Angular i18n.

**Criteri di accettazione**

- loading, empty state, errore e retry sono percepibili da tastiera e screen reader;
- le azioni distruttive hanno conferma e feedback;
- i flussi principali superano un controllo automatico di accessibilità.

## Priorità P3 — scalabilità e prestazioni

### P3-01 — Selector riusabili e ViewModel

**Evidenza**

`CoinsList` usa più selector inline direttamente sullo stato radice.

**Intervento**

1. Creare feature selector e selector memoizzati con `createSelector`.
2. Esporre un ViewModel unico con coin, loading, error e aggregati.
3. Centralizzare filtri, ordinamenti e statistiche nei selector.
4. Valutare `selectSignal()` per componenti Angular moderni.

### P3-02 — Change detection e rendering lista

1. Aggiungere `ChangeDetectionStrategy.OnPush` ai componenti presentazionali.
2. Usare ID stabili nel `track` della lista.
3. Introdurre paginazione, virtual scrolling o ricerca quando la collezione cresce.
4. Misurare bundle e Web Vitals prima di ottimizzazioni invasive.

## Priorità P4 — qualità continua e governance

### P4-01 — End-to-end testing

Non sono presenti configurazioni Playwright, Cypress o file E2E.

**Intervento**

Adottare Playwright e coprire almeno:

1. login demo o login reale;
2. accesso alla Home;
3. caricamento collezione;
4. aggiunta con importo decimale;
5. vendita con conferma;
6. errore/retry;
7. smoke test della pubblicazione GitHub Pages.

### P4-02 — Protezione di `main`

Il branch `main` non ha branch protection configurata.

**Intervento**

1. Richiedere il check GitHub Actions `Lint, test, coverage and build`.
2. Vietare push diretti su `main`.
3. Richiedere Pull Request e, se il team lo richiede, una review.
4. Abilitare aggiornamento branch prima del merge quando necessario.

### P4-03 — Manutenzione supply chain

1. Attivare Dependabot per npm e GitHub Actions.
2. Pianificare `npm audit --audit-level=high` in GitHub Actions.
3. Gestire aggiornamenti Angular/NgRx e deprecazioni in Issue dedicate.
4. Revisionare gli install script npm soltanto con tracciabilità, provenienza e
   test successivi.

## Sequenza raccomandata

| Ordine | Attività | Valore principale |
|---:|---|---|
| 1 | P1-01 + P1-02 | Integrità delle operazioni e correttezza NgRx |
| 2 | P2-02 | Inserimento corretto di importi monetari |
| 3 | P2-03 | UX e accessibilità |
| 4 | P3-01 + P3-02 | Scalabilità e manutenibilità UI |
| 5 | P4-01 | Fiducia nel comportamento su browser reale |
| 6 | P4-02 + P4-03 | Governance e manutenzione continua |
| 7 | P2-01 | Dati persistenti e integrazione API |
| 8 | P0-01 | Preparazione a un uso non dimostrativo |

## Regola di consegna

Ogni modifica deve includere test appropriati e chiudersi soltanto dopo:

```text
npm ci
npm run lint
npx tsc --project tsconfig.spec.json --noEmit
npm test
npm run test:coverage
npm run build
npm audit --json
```

Per modifiche candidate al merge devono inoltre risultare verdi i workflow
GitHub Actions e, quando interessato, il deploy GitHub Pages.
