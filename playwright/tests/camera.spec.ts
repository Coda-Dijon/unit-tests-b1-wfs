import { test, expect } from "@playwright/test";

// La caméra est simulée par deux flags Chrome configurés dans playwright.config.ts :
//   --use-fake-device-for-media-stream  → flux vidéo de test généré en interne
//   --use-fake-ui-for-media-stream      → permission accordée sans dialogue
// Le serveur HTTP local (npx serve) est démarré automatiquement par playwright.config.ts.

test("présente la photo et indique le changement de photo de profil après avoir cliqué sur Continuer", async ({ page }) => {
  await page.goto("/camera.html");

  // TODO 1 — vérifier l'état initial
  //   - le bouton "Continuer" est masqué
  //   - le bouton "Prendre une photo" est désactivé
  //   - la zone de statut (role="status") est masquée

  // Attendre que la caméra soit prête — ne pas modifier cette ligne
  await expect(page.getByRole("button", { name: "Prendre une photo" })).toBeEnabled({
    timeout: 5_000,
  });

  // TODO 2 — cliquer sur "Prendre une photo"

  // TODO 3 — vérifier l'aperçu
  //   - le bouton "Continuer" est visible
  //   - le bouton "Prendre une photo" est masqué

  // TODO 4 — cliquer sur "Continuer"

  // TODO 5 — vérifier la confirmation
  //   - l'image (alt="Photo capturée") est visible
  //   - la zone de statut contient le texte "photo de profil"
  //   - le bouton "Continuer" est masqué

  expect(true).toBe(false); // à supprimer une fois les TODOs complétés
});
