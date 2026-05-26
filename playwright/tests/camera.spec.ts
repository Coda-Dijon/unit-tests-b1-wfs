import { test, expect } from "@playwright/test";

// La caméra est simulée par deux flags Chrome configurés dans playwright.config.ts :
//   --use-fake-device-for-media-stream  → flux vidéo de test généré en interne
//   --use-fake-ui-for-media-stream      → permission accordée sans dialogue
// Le serveur HTTP local (npx serve) est démarré automatiquement par playwright.config.ts.

test("présente la photo et indique le changement de photo de profil après avoir cliqué sur Continuer", async ({ page }) => {
  await page.goto("/camera.html");

  // Arrange — état initial
  await expect(page.getByRole("button", { name: "Continuer" })).toBeHidden();
  await expect(page.getByRole("button", { name: "Prendre une photo" })).toBeDisabled();
  await expect(page.getByRole("status")).toBeHidden();

  // Attendre que la caméra soit prête
  await expect(page.getByRole("button", { name: "Prendre une photo" })).toBeEnabled({
    timeout: 5_000,
  });

  // Act — prendre la photo
  await page.getByRole("button", { name: "Prendre une photo" }).click();

  // Aperçu : le bouton Continuer apparaît, la capture disparaît
  await expect(page.getByRole("button", { name: "Continuer" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Prendre une photo" })).toBeHidden();

  // Act — confirmer
  await page.getByRole("button", { name: "Continuer" }).click();

  // Assert — la photo est affichée et le message de confirmation apparaît
  await expect(page.getByAltText("Photo capturée")).toBeVisible();
  await expect(page.getByRole("status")).toBeVisible();
  await expect(page.getByRole("status")).toContainText("photo de profil");
  await expect(page.getByRole("button", { name: "Continuer" })).toBeHidden();
});
