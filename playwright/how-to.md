# Playwright — Tests end-to-end avec mock caméra

## Prérequis

- Node.js ≥ 18
- npm ≥ 9

## Installation

```bash
cd playwright

# 1. Installer les dépendances npm
npm install

# 2. Installer le navigateur Chromium géré par Playwright
npx playwright install chromium
```

## La page testée

`src/camera.html` — une page qui :
1. Demande l'accès à la caméra via `getUserMedia`
2. Affiche le flux vidéo en temps réel
3. Propose un bouton **Prendre une photo**
4. Une fois la photo prise, affiche le bouton **Continuer**

## Serveur HTTP local

Les tests s'exécutent sur `http://localhost:3000` plutôt que via `file://`. Cela permet d'utiliser correctement les API navigateur qui exigent un contexte HTTP (comme `getUserMedia`).

Le serveur est géré automatiquement par Playwright via `webServer` dans `playwright.config.ts` :

```ts
webServer: {
  command: "npx --yes serve src --listen 3000 --no-clipboard",
  url: "http://localhost:3000",
  reuseExistingServer: !process.env.CI,
},
use: {
  baseURL: "http://localhost:3000",
},
```

- Playwright lance `npx serve src` avant les tests et attend que `http://localhost:3000` réponde.
- `reuseExistingServer` : si un serveur tourne déjà sur le port 3000 en développement, Playwright le réutilise plutôt que d'en démarrer un second.
- En CI (`process.env.CI` défini), le serveur est toujours recréé pour garantir un environnement propre.
- Les tests utilisent simplement `page.goto("/camera.html")` — pas de chemin absolu ni d'import `path`.

> `npx --yes serve` télécharge `serve` à la volée si nécessaire, aucune installation préalable n'est requise.

## Mock de la caméra

Les tests ne nécessitent **aucune vraie caméra**. Le mock est configuré dans `playwright.config.ts` via deux flags Chrome :

| Flag                                 | Rôle                                                                               |
|--------------------------------------|------------------------------------------------------------------------------------|
| `--use-fake-device-for-media-stream` | Remplace la caméra physique par un flux vidéo de test généré en interne par Chrome |
| `--use-fake-ui-for-media-stream`     | Accorde la permission caméra automatiquement, sans boîte de dialogue               |

```ts
// playwright.config.ts
launchOptions: {
  args: [
    '--use-fake-device-for-media-stream',
    '--use-fake-ui-for-media-stream',
  ],
},
permissions: ['camera'],
```

## Sélecteurs recommandés par Playwright

Playwright recommande d'utiliser des **locators** qui reflètent ce que l'utilisateur perçoit, plutôt que des détails d'implémentation (classes CSS, IDs, XPath). Cette approche rend les tests résistants aux refactorisations.

Documentation officielle : [playwright.dev/docs/locators](https://playwright.dev/docs/locators)

### Ordre de priorité

| Priorité | Locator            | Exemple                                      | Quand l'utiliser                                                                                                   |
|:--------:|--------------------|----------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
|    1     | `getByRole`        | `getByRole("button", { name: "Continuer" })` | Toujours en premier — cible l'élément par son rôle ARIA et son nom accessible, exactement comme un lecteur d'écran |
|    2     | `getByLabel`       | `getByLabel("Adresse e-mail")`               | Champs de formulaire associés à un `<label>`                                                                       |
|    3     | `getByPlaceholder` | `getByPlaceholder("nom@exemple.fr")`         | Champs sans label mais avec un placeholder                                                                         |
|    4     | `getByText`        | `getByText("Votre photo de profil")`         | Éléments identifiés par leur contenu textuel visible                                                               |
|    5     | `getByAltText`     | `getByAltText("Photo capturée")`             | Images (`<img alt="...">`)                                                                                         |
|    6     | `getByTitle`       | `getByTitle("Fermer")`                       | Éléments avec un attribut `title`                                                                                  |
|    7     | `getByTestId`      | `getByTestId("submit-btn")`                  | Dernier recours — ajouter `data-testid` si aucune autre option sémantique n'est disponible                         |

### Pourquoi cet ordre ?

`getByRole` est prioritaire parce qu'il valide simultanément **la fonctionnalité et l'accessibilité** : si un bouton n'a pas de nom accessible, le test échoue — ce qui est un vrai bug. Un sélecteur CSS comme `.btn-primary` passerait sans signaler le problème.

```ts
// ❌ Fragile — casse si la classe change, ne teste pas l'accessibilité
page.locator(".btn-green")

// ❌ Fragile — casse si l'ID change, opaque sur l'intention
page.locator("#continue-btn")

// ✅ Sémantique — correspond à ce que l'utilisateur voit et interagit
page.getByRole("button", { name: "Continuer" })

// ✅ Sémantique — correspond à l'image que l'utilisateur voit
page.getByAltText("Photo capturée")
```

### Exemple dans ce projet

```ts
// Rôle ARIA : bouton identifié par son libellé
await page.getByRole("button", { name: "Prendre une photo" }).click();

// Rôle ARIA : zone de statut (aria-live)
await expect(page.getByRole("status")).toContainText("photo de profil");

// Texte alternatif : image capturée
await expect(page.getByAltText("Photo capturée")).toBeVisible();
```

## Lancer les tests

### Mode headless (CI, usage quotidien)
```bash
npm test
```

### Mode headed — navigateur visible
```bash
npm run test:headed
```
Utile pour voir ce que Playwright fait en temps réel.

### Mode UI — interface Playwright interactive
```bash
npm run test:ui
```
Permet d'exécuter, rejouer et inspecter chaque test visuellement avec une timeline et des captures d'écran à chaque étape.

### Mode debug — pas à pas avec Playwright Inspector
```bash
npm run test:debug
```
Ouvre le **Playwright Inspector** : vous avancez action par action, inspectez le DOM et les sélecteurs à chaque étape.

> `--workers=1` est forcé en debug pour éviter les exécutions parallèles qui rendraient l'inspection impossible.

### Mode record — générer un test en cliquant
```bash
npm run test:record
```
Ouvre un navigateur Chrome contrôlé. Naviguez vers `http://localhost:3000/camera.html`, interagissez avec la page, et Playwright génère le code TypeScript correspondant dans le terminal.

> Le serveur HTTP doit être démarré manuellement en mode record car `webServer` ne s'active que pendant `playwright test`. Lancez `npx serve src --listen 3000` dans un terminal séparé avant d'utiliser le codegen.

## Rapport HTML

Après chaque exécution, un rapport est disponible :

```bash
npx playwright show-report
```

## Structure du projet

```
playwright/
├── playwright.config.ts   # Configuration : navigateurs, flags mock caméra
├── package.json
├── how-to.md              # Ce fichier
├── src/
│   └── camera.html        # Page à tester
└── tests/
    └── camera.spec.ts     # Test end-to-end
```
