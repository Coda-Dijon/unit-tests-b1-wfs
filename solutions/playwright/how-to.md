# Playwright : Solution complète

## Installation

```bash
cd solutions/playwright
npm install
npx playwright install chromium
```

## Lancer les tests

```bash
npm test                  # headless
npm run test:headed       # navigateur visible
npm run test:ui           # interface Playwright interactive
npm run test:debug        # pas à pas avec l'Inspector (--workers=1)
npm run test:record       # codegen : génère du code en cliquant
```

> En mode record, démarrer le serveur manuellement dans un terminal séparé :
> `npx serve src --listen 3000`, puis ouvrir `http://localhost:3000/camera.html` dans le navigateur codegen.

## Rapport HTML

```bash
npx playwright show-report
```

## Serveur HTTP local

Playwright démarre automatiquement `npx serve src` sur le port 3000 avant les tests (`webServer` dans `playwright.config.ts`).  
`reuseExistingServer` évite de redémarrer le serveur si un process l'occupe déjà en développement.

## Mock de la caméra

Deux flags Chrome, configurés dans `playwright.config.ts`, remplacent la vraie caméra :

| Flag | Rôle |
|---|---|
| `--use-fake-device-for-media-stream` | Flux vidéo de test généré en interne par Chrome |
| `--use-fake-ui-for-media-stream` | Permission caméra accordée sans dialogue |

## Sélecteurs : ordre de priorité

Documentation officielle : [playwright.dev/docs/locators](https://playwright.dev/docs/locators)

| Priorité | Locator | Exemple |
|:---:|---|---|
| 1 | `getByRole` | `getByRole("button", { name: "Continuer" })` |
| 2 | `getByLabel` | `getByLabel("Adresse e-mail")` |
| 3 | `getByPlaceholder` | `getByPlaceholder("nom@exemple.fr")` |
| 4 | `getByText` | `getByText("Votre photo de profil")` |
| 5 | `getByAltText` | `getByAltText("Photo capturée")` |
| 6 | `getByTitle` | `getByTitle("Fermer")` |
| 7 | `getByTestId` | `getByTestId("submit-btn")` |

`getByRole` est prioritaire car il valide simultanément la fonctionnalité **et** l'accessibilité.

## Explication du test

```
État 1 : Caméra active
  → getUserMedia déclenché au chargement
  → canplay active le bouton "Prendre une photo"

État 2 : Aperçu (après clic sur "Prendre une photo")
  → canvas capture une frame du flux vidéo
  → photo affichée, bouton "Continuer" visible

État 3 : Confirmation (après clic sur "Continuer")
  → stream.getTracks().forEach(track => track.stop()) coupe la caméra
  → bannière "Votre photo de profil va être mise à jour." affichée
```
