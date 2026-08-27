# Piano di controllo dei test — My AWS Coins Collection

## Obiettivo e scadenza

**Obiettivo:** entro 10 giorni lavorativi (due settimane) disporre di una suite Jest ripetibile che copra tutti i comportamenti attualmente implementati nel repository, un registro dei casi di test e un report HTML di coverage consultabile.

**Ambito:** codice Angular 21, NgRx, RxJS e template del repository. Il piano non dichiara requisiti che non sono presenti nel codice; i casi di sicurezza, accessibilità e browser reali sono registrati come controlli complementari, non come sostituti dei test Jest.

**Criterio di chiusura:** `npm test`, `npm run test:coverage`, lint e build completano con esito positivo; `coverage/lcov-report/index.html` viene rigenerato; ogni caso ha esito `PASS`, `FAIL`, `BLOCKED` o motivazione di esclusione.

## Toolchain Jest installata

- `jest` 30.4.2
- `jest-preset-angular` 17.0.0, compatibile con Angular 20–22
- `jest-environment-jsdom` 30.4.0
- `@types/jest` 30.0.0
- ambiente Angular **zoneless** (`setupZonelessTestEnv`)

Comandi ufficiali del clone:

```bash
npm test                         # suite seriale, senza watch
npm run test:watch               # sviluppo locale interattivo
npm run test:coverage            # report testo + HTML + lcov + JSON
```

Configurazione: `jest.config.js`; bootstrap: `setup-jest.ts`.
Il report HTML richiesto è `coverage/lcov-report/index.html`.

## Convenzioni operative

- Ogni test ha un nome che descrive il comportamento e non il dettaglio interno.
- Bug corretti: prima test rosso che riproduce l'errore, quindi correzione minima e test verde.
- I componenti isolano Store, Router, Actions e servizi tramite mock; la logica interna resta reale.
- Le soglie Jest si applicano alla suite completa: Statements e Lines ≥ 98%; Branches e Functions ≥ 95%. Il comando `npm run test:coverage` fallisce se una soglia è violata.
- `AppState.ts` è escluso dal calcolo perché contiene esclusivamente un'interfaccia TypeScript, senza comportamento runtime o logica business. Le esclusioni aggiuntive richiedono la stessa motivazione documentata.

## Registro completo dei casi

Stato verificato al quality gate: ogni riga del registro è `PASS`; i codici rappresentano casi atomici e i test parametrici Jest possono implementare più righe correlate. Le modifiche future devono aggiornare ogni riga interessata soltanto dopo un'esecuzione reale a `PASS`, `FAIL` o `BLOCKED`, con relativa evidenza.

### Modelli e azioni

| ID | File/area | Caso e risultato atteso | Tipo | Stato |
|---|---|---|---|---|
| TC-MOD-01 | `Coin` | costruttore completo conserva tutti i sei campi | positivo | PASS |
| TC-MOD-02 | `Coin` | costruttore senza argomenti inizializza stringhe vuote e valori numerici a zero | boundary | PASS |
| TC-MOD-03 | `Coin` | valori espliciti `0` per anno e valori monetari restano zero | boundary | PASS |
| TC-MOD-04 | `User` | costruttore completo conserva username e password | positivo | PASS |
| TC-MOD-05 | `User` | costruttore vuoto produce credenziali vuote | boundary | PASS |
| TC-ACT-01 | `signIn` | action contiene type, username e password invariati | positivo | PASS |
| TC-ACT-02 | `addCoin` | action contiene una coin invariata | positivo | PASS |
| TC-ACT-03 | `seelCoin` | action contiene l'indice da vendere | positivo | PASS |
| TC-ACT-04 | `getCoinsCollection*` | azioni richiesta/success/failure espongono type e payload corretti | positivo/errore | PASS |

### Reducer NgRx

| ID | File/area | Caso e risultato atteso | Tipo | Stato |
|---|---|---|---|---|
| TC-RED-01 | `loginReducer` | stato iniziale ha credenziali vuote | positivo | PASS |
| TC-RED-02 | `loginReducer` | `signIn` sostituisce le credenziali e non muta lo stato precedente | positivo | PASS |
| TC-RED-03 | `coinReducer` | stato iniziale è collezione vuota, non in caricamento e senza errore | positivo | PASS |
| TC-RED-04 | `coinReducer` | request pone `loading=true` e azzera un errore precedente | positivo | PASS |
| TC-RED-05 | `coinReducer` | success sostituisce coins, termina loading e azzera errore | positivo | PASS |
| TC-RED-06 | `coinReducer` | failure mantiene le coin, termina loading e salva il messaggio | errore | PASS |
| TC-RED-07 | `coinReducer` | vendita con indice valido elimina solo la coin richiesta e mantiene l'ordine | positivo | PASS |
| TC-RED-08 | `coinReducer` | vendita a indice 0 e ultimo indice gestisce entrambi i limiti | boundary | PASS |
| TC-RED-09 | `coinReducer` | indice negativo o >= lunghezza avvisa e restituisce lo stesso stato | negativo | PASS |
| TC-RED-10 | `coinReducer` | `addCoin` antepone la nuova coin senza alterare loading/errore | positivo | PASS |

### Pipe, servizio, effect e guard

| ID | File/area | Caso e risultato atteso | Tipo | Stato |
|---|---|---|---|---|
| TC-PIPE-01..10 | `CountryFlagPipe` | mappa Italy, Spain, France, Germany, Portugal, Belgium, Netherlands, Austria, Greece e San Marino alla bandiera corretta | parametrico | PASS |
| TC-PIPE-11 | `CountryFlagPipe` | valore sconosciuto è restituito invariato | negativo | PASS |
| TC-PIPE-12 | `CountryFlagPipe` | stringa vuota, casing diverso e spazi non vengono normalizzati implicitamente | boundary | PASS |
| TC-SVC-01 | `CoinService` | emette la collezione iniziale completa dopo il delay previsto | positivo/async | PASS |
| TC-SVC-02 | `CoinService` | emette dieci coin con campi essenziali valorizzati | integrità dati | PASS |
| TC-SVC-03 | `CoinService` | emissione non avviene prima di 1000 ms | boundary/tempo | PASS |
| TC-SVC-04 | `CoinService` | due sottoscrizioni ricevono una sequenza coerente e indipendente | async | PASS |
| TC-EFF-01 | `CoinEffects` | request + servizio riuscito produce `getCoinsCollectionSuccess` con payload | positivo | PASS |
| TC-EFF-02 | `CoinEffects` | `Error` del servizio produce failure con il messaggio originale | errore | PASS |
| TC-EFF-03 | `CoinEffects` | errore non-Error produce fallback `Unable to load coins collection` | errore | PASS |
| TC-EFF-04 | `CoinEffects` | azioni estranee non producono output | negativo | PASS |
| TC-EFF-05 | `CoinEffects` | una nuova request annulla la richiesta precedente (`switchMap`) | concorrenza | PASS |
| TC-GRD-01 | `authGuard` | username e password non vuoti consentono `/home` | positivo | PASS |
| TC-GRD-02 | `authGuard` | username vuoto restituisce UrlTree verso `/` | negativo | PASS |
| TC-GRD-03 | `authGuard` | password vuota restituisce UrlTree verso `/` | negativo | PASS |
| TC-GRD-04 | `authGuard` | credenziali formate da soli spazi sono rifiutate | boundary | PASS |
| TC-GRD-05 | `authGuard` | seleziona una sola emissione dallo Store | async | PASS |

### Login e navigazione

| ID | File/area | Caso e risultato atteso | Tipo | Stato |
|---|---|---|---|---|
| TC-LOG-01 | `LoginPage` | crea form con username e password e submit inizialmente disabilitato | positivo | PASS |
| TC-LOG-02 | `LoginPage` | username vuoto produce validazione e non esegue dispatch/navigate | negativo | PASS |
| TC-LOG-03 | `LoginPage` | password assente produce validazione e non esegue dispatch/navigate | negativo | PASS |
| TC-LOG-04 | `LoginPage` | password di 7 caratteri è rifiutata | boundary | PASS |
| TC-LOG-05 | `LoginPage` | password di 8 caratteri e username valido abilitano submit | boundary | PASS |
| TC-LOG-06 | `LoginPage` | submit valido invia `signIn` con valori immutati | positivo | PASS |
| TC-LOG-07 | `LoginPage` | submit valido naviga esattamente a `/home` | integrazione | PASS |
| TC-LOG-08 | route | route vuota visualizza LoginPage | integrazione | PASS |
| TC-LOG-09 | route | route `/home` è associata ad HomePage e protetta da `authGuard` | integrazione | PASS |

### Creazione di una coin

| ID | File/area | Caso e risultato atteso | Tipo | Stato |
|---|---|---|---|---|
| TC-NEW-01 | `NewCoin` | inizializza tutti i sei FormControl | positivo | PASS |
| TC-NEW-02 | `NewCoin` | nome vuoto è rifiutato e non invia action | negativo | PASS |
| TC-NEW-03 | `NewCoin` | country vuoto è rifiutato e non invia action | negativo | PASS |
| TC-NEW-04 | `NewCoin` | anno zero e negativo sono rifiutati | boundary | PASS |
| TC-NEW-05 | `NewCoin` | anno 1 è accettato | boundary | PASS |
| TC-NEW-06 | `NewCoin` | valori currency/estimated zero sono accettati | boundary | PASS |
| TC-NEW-07 | `NewCoin` | valori currency/estimated negativi sono rifiutati | boundary | PASS |
| TC-NEW-08 | `NewCoin` | descrizione opzionale vuota è accettata | positivo | PASS |
| TC-NEW-09 | `NewCoin` | submit valido dispatcha `addCoin` con tutti i campi | positivo | PASS |
| TC-NEW-10 | `NewCoin` | tasti di controllo consentiti non vengono bloccati | UI | PASS |
| TC-NEW-11 | `NewCoin` | lettere, segni e decimali in keydown vengono bloccati | UI/negativo | PASS |
| TC-NEW-12 | `NewCoin` | anno a quattro cifre blocca ulteriore digitazione senza selezione | boundary | PASS |
| TC-NEW-13 | `NewCoin` | selezione nel campo a lunghezza massima consente la sostituzione | boundary | PASS |
| TC-NEW-14 | `NewCoin` | input/paste elimina i non-digit e rispetta il max length | UI | PASS |

### Collezione e componenti di presentazione

| ID | File/area | Caso e risultato atteso | Tipo | Stato |
|---|---|---|---|---|
| TC-LST-01 | `CoinsList` | `ngOnInit` seleziona coins, loading ed error dallo Store | positivo | PASS |
| TC-LST-02 | `CoinsList` | `ngOnInit` dispatcha il caricamento una volta | positivo | PASS |
| TC-LST-03 | `CoinsList` | `loadCoins()` dispatcha `getCoinsCollection` | positivo | PASS |
| TC-LST-04 | template list | con loading mostra spinner e non lista/errore | UI/stato | PASS |
| TC-LST-05 | template list | con errore mostra messaggio e Retry | UI/errore | PASS |
| TC-LST-06 | template list | Retry invoca un nuovo caricamento | UI/errore | PASS |
| TC-LST-07 | template list | con coin renderizza un `app-coin-item` per elemento e indice corretto | UI | PASS |
| TC-ITM-01 | `CoinItem` | input coin e index validi consentono inizializzazione/rendering | positivo | PASS |
| TC-ITM-02 | `CoinItem` | coin assente genera errore esplicito | negativo | PASS |
| TC-ITM-03 | `CoinItem` | index `undefined` o `null` genera errore esplicito | negativo | PASS |
| TC-ITM-04 | `CoinItem` | index 0 è valido e non viene scambiato per assenza | boundary | PASS |
| TC-ITM-05 | `CoinItem` | click Sell dispatcha `seelCoin` con l'indice corrente | UI | PASS |
| TC-ITM-06 | template item | mostra flag, nome, anno, descrizione e valori EUR della coin | UI | PASS |
| TC-WEL-01 | `Welcome` | seleziona username dallo Store | positivo | PASS |
| TC-WEL-02 | template welcome | username non vuoto è mostrato | UI | PASS |
| TC-WEL-03 | template welcome | username vuoto visualizza fallback `User` | boundary | PASS |
| TC-RES-01 | `ResumeCoinsCollection` | `ngOnInit` seleziona la collezione | positivo | PASS |
| TC-RES-02 | `ResumeCoinsCollection` | collezione vuota produce numero 0 e valore 0 | boundary | PASS |
| TC-RES-03 | `ResumeCoinsCollection` | una coin produce count e estimatedValue corretti | positivo | PASS |
| TC-RES-04 | `ResumeCoinsCollection` | più coin sommano correttamente valori decimali | positivo/boundary | PASS |
| TC-RES-05 | template resume | formatta totale EUR e numero coin | UI | PASS |
| TC-HOM-01 | `HomePage` | compone Welcome, NewCoin e CoinsList | integrazione | PASS |
| TC-HOM-02 | `App` | crea il root component e conserva il titolo previsto | positivo | PASS |
| TC-HOM-03 | `App` | espone RouterOutlet per il routing applicativo | integrazione | PASS |

### Flussi integrati Store → Effects → UI

| ID | File/area | Caso e risultato atteso | Tipo | Stato |
|---|---|---|---|---|
| TC-INT-01 | `appConfig` + `HomePage` | il TestBed usa la composizione reale di Store, Effects e reducer dichiarata in `appConfig`, sostituendo solo il confine esterno `CoinService` | integrazione/configurazione | PASS |
| TC-INT-02 | `CoinsList` + `CoinEffects` | il caricamento iniziale attraversa action, reducer ed effect; la UI mostra prima lo spinner e poi una card per la coin ricevuta | integrazione/async | PASS |
| TC-INT-03 | `CoinsList` + `CoinEffects` | un errore del servizio aggiorna lo stato failure e visualizza il feedback; Retry invia una nuova action che raggiunge il successo | integrazione/errore/retry | PASS |
| TC-INT-04 | `NewCoin` → reducer → dashboard | il submit del form valido aggiorna Store reale, lista e riepilogo senza chiamate HTTP | integrazione | PASS |

## Piano di lavoro: 10 giorni lavorativi

| Giorno | Attività e deliverable | Evidenza di uscita |
|---|---|---|
| 1 | Installazione Jest, preset Angular, jsdom e configurazione zoneless; baseline e inventario | `jest.config.js`, `setup-jest.ts`, `npm test` avviabile |
| 2 | Modelli, actions, reducer e pipe; correggere i difetti trovati con red/green | test unitari verdi; log difetti aggiornato |
| 3 | CoinService ed effetti NgRx, inclusi errori e cancellazione `switchMap` | test RxJS/Effects verdi |
| 4 | authGuard, routes e LoginPage, con validazioni e navigazione | test di autenticazione verdi |
| 5 | NewCoin, incluse validazione numerica, keydown e paste | test form/UI verdi |
| 6 | CoinsList e CoinItem, comprese UI loading/error/retry | test collezione verdi |
| 7 | Welcome, ResumeCoinsCollection, HomePage e App; rendering integrato | test dashboard verdi |
| 8 | Esecuzione coverage, analisi righe/rami rosa-gialli, nuovi casi per gap business | `coverage/lcov-report/index.html` aggiornato |
| 9 | Hardening: regressioni, flussi combinati Store→Effects→componenti, lint e build | suite, lint e build verdi |
| 10 | Review finale, esiti del registro, report coverage e soglie proposte/documentate | pacchetto di consegna riproducibile |

## Stato di esecuzione verificato

L'ultima esecuzione completa ha prodotto **19 suite PASS e 101 test PASS**.
I file dei test implementati coprono azioni, modelli, reducer, pipe, servizio
RxJS, effect NgRx, guard, routing, tutti i componenti esistenti e i flussi
integrati Store → Effects → UI.

```text
npm run test:coverage
Statements: 100.00% (700/700)
Branches:   100.00% (84/84)
Functions:  100.00% (26/26)
Lines:      100.00% (700/700)
Report HTML: coverage/lcov-report/index.html
```

## Quality gate Jest — Issue #5

`jest.config.js` applica `coverageThreshold.global` a ogni esecuzione di
`npm run test:coverage`:

| Metrica | Soglia minima | Baseline verificata |
|---|---:|---:|
| Statements | 98% | 100.00% |
| Branches | 95% | 100.00% |
| Functions | 95% | 100.00% |
| Lines | 98% | 100.00% |

Il gate è stato validato anche in negativo con una soglia temporanea di
Statements al 101%: Jest è terminato con exit code `1` e il messaggio
`Coverage for statements (100%) does not meet "global" threshold (101%)`.
`AppState.ts` è escluso perché espone solo un'interfaccia TypeScript, senza
codice runtime. Il report HTML e `coverage/lcov.info` vengono rigenerati da
ogni esecuzione positiva.

I flussi integrati e le soglie Jest sono ora coperti. Il backlog residuo riguarda
il quality gate GitHub Actions e la remediation controllata delle vulnerabilità
transitive, attività tracciate separatamente nelle issue #6 e #7.

## Quality gate e deliverable finali

1. `package.json`, `package-lock.json`, `jest.config.js`, `setup-jest.ts` e `tsconfig.spec.json` coerenti e versionati.
2. Tutti i casi nel registro con esito aggiornato, oppure `BLOCKED` con dipendenza e owner.
3. Report HTML: `coverage/lcov-report/index.html`; file lcov e JSON per integrazione CI.
4. Riepilogo finale con conteggio test, tempi, Statements/Branches/Functions/Lines, rami residui e difetti.
5. `coverageThreshold.global` applica il gate: Statements/Lines ≥ 98%, Branches/Functions ≥ 95%. Una regressione sotto soglia interrompe Jest con exit code non zero.

## Rischi e decisioni aperte

- Il repository usa Angular 21 con setup zoneless: il bootstrap Jest deve restare zoneless, salvo introduzione esplicita di `zone.js` nel prodotto.
- Il progetto mantiene `vitest` perché è incluso dal toolchain Angular; i comandi di verifica definiti qui usano esclusivamente Jest.
- `npm install` ha segnalato 28 vulnerabilità transitive (3 low, 5 moderate, 19 high, 1 critical). La remediation richiede una verifica separata delle dipendenze e non verrà applicata automaticamente durante la migrazione test.
- TC-PIPE-01..10 ha già individuato e corretto il mapping errato `Germany → 🇬🇷`; il comportamento ora atteso è `Germany → 🇩🇪`.

## Fonte coverage

Aakanksha, “Understanding the Jest Coverage Report: A Complete Guide”, Walmart Global Tech Blog, Medium, 3 aprile 2025:
https://medium.com/walmartglobaltech/understanding-the-jest-coverage-report-a-complete-guide-966733d6f730
