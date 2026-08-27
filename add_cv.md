# Voce CV — Quality Engineering, CI/CD e Security Remediation

## Titolo suggerito

**Quality Engineering & DevSecOps per applicazione Angular — Jest, GitHub Actions e GitHub Pages**

## Versione per CV

Ho progettato e completato il rafforzamento della qualità software di un'applicazione Angular con NgRx, trasformando una configurazione di test non allineata nell'adozione strutturata di Jest. Ho realizzato una suite di **101 test in 19 suite**, con copertura verificata al **100%** su Statements, Branches, Functions e Lines, introducendo quality gate locali e CI con soglie obbligatorie. Ho inoltre implementato workflow GitHub Actions, pubblicazione GitHub Pages, remediation controllata delle dipendenze npm da **29 vulnerabilità a zero**, e documentazione tecnica/tracciabilità completa tramite Issues, Pull Request, report e piano di test.

## Risultati misurabili

- Migrazione e configurazione della test suite Angular su **Jest** con `jest-preset-angular` e ambiente zoneless.
- Implementazione di **19 suite Jest** e **101 test PASS**, inclusi test unitari, regressione, boundary, error handling e integrazione Store → Effects → UI.
- Coverage finale verificata:
  - Statements: **100%** (`700/700`)
  - Branches: **100%** (`84/84`)
  - Functions: **100%** (`26/26`)
  - Lines: **100%** (`700/700`)
- Definizione e verifica di quality gate Jest:
  - Statements e Lines ≥ **98%**
  - Branches e Functions ≥ **95%**
  - validazione negativa eseguita per dimostrare il fallimento sotto soglia.
- Automazione della qualità mediante **GitHub Actions**: installazione riproducibile con `npm ci`, lint, type-check, test, coverage gate, build e artifact del report coverage.
- Pubblicazione dell'applicazione con **GitHub Pages** e verifica end-to-end del deploy HTTP 200 e del base href della fork.
- Remediation DevSecOps delle dipendenze npm senza usare `--force` o `--legacy-peer-deps`:
  - baseline: **29 vulnerabilità** (1 critical, 20 high, 5 moderate, 3 low);
  - risultato finale: **0 vulnerabilità** da `npm audit`;
  - aggiornamento coordinato di Angular alla linea **21.2.22** e delle dipendenze transitive vulnerabili.
- Gestione tracciabile del ciclo di consegna attraverso GitHub Issues, branch dedicati, Pull Request, merge, commenti di chiusura e documentazione di verifica.
- Redazione e manutenzione di `TEST_CONTROL_PLAN.md`, report HTML LCOV e report complessivo nel `README.md`.

## Attività tecniche svolte

1. Analisi della codebase Angular standalone, NgRx Store/Effects, guard, routing, servizi RxJS, pipe e componenti.
2. Configurazione Jest, `jsdom`, TypeScript test config, coverage V8 e report HTML/LCOV.
3. Correzione di regressioni funzionali, inclusa la mappatura della bandiera tedesca nel `CountryFlagPipe`.
4. Test di reducer, action, effects asincroni e gestione di errori/cancellazione con RxJS.
5. Test del `authGuard` per emissioni multiple e corretto comportamento `take(1)`.
6. Test di validazione e boundary del form `NewCoin`: required fields, valori numerici, input sanitization, limiti e key handling.
7. Test integrati reali di Store, reducer, Effects e componenti, con mock limitati al solo confine I/O `CoinService`.
8. Configurazione delle soglie Jest e chiusura del registro dei casi di test.
9. Implementazione di pipeline CI GitHub Actions con artifact coverage e runtime Node controllato tramite `.nvmrc`.
10. Abilitazione e verifica della pubblicazione GitHub Pages.
11. Analisi, aggiornamento e verifica delle dipendenze npm con audit a zero vulnerabilità.
12. Archiviazione secondaria non distruttiva della memoria operativa su Wiki-LLM, con snapshot, hash di integrità e indicizzazione automatica.

## Tecnologie e competenze

`Angular 21` · `TypeScript` · `Jest` · `jest-preset-angular` · `NgRx` · `RxJS` · `Node.js` · `npm` · `Git` · `GitHub` · `GitHub Actions` · `GitHub Pages` · `CI/CD` · `DevSecOps` · `npm audit` · `LCOV` · `ESLint` · `Quality Gates` · `Test Automation` · `Integration Testing`

## Evidenze pubbliche

- Repository: https://github.com/GAVADALA2026/My-Aws-Coins-Collections
- Applicazione pubblicata: https://gavadala2026.github.io/My-Aws-Coins-Collections/
- Report di qualità nel README: https://github.com/GAVADALA2026/My-Aws-Coins-Collections#quality-and-delivery-report
- Piano e registro di test: `TEST_CONTROL_PLAN.md`
- Report coverage locale rigenerabile: `coverage/lcov-report/index.html`

## Nota di posizionamento professionale

La voce è adatta a CV per ruoli **DevOps / Cloud & DevOps Engineer / DevSecOps Engineer / QA Automation Engineer / Software Engineer**, perché evidenzia risultati misurabili, automazione della qualità, integrazione CI/CD, sicurezza della supply chain software e capacità di governare l'intero ciclo di rilascio.

---

Bozza pronta per essere elaborata e adattata a CV, profilo LinkedIn, portfolio tecnico o presentazione professionale.
