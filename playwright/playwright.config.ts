import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }]],

  // Démarre automatiquement un serveur HTTP local avant les tests
  webServer: {
    command: "npx --yes serve src --listen 3000 --no-clipboard",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: [
            // Remplace la vraie caméra par un flux vidéo de test généré par Chrome
            "--use-fake-device-for-media-stream",
            // Accorde la permission caméra sans afficher la boîte de dialogue
            "--use-fake-ui-for-media-stream",
          ],
        },
        permissions: ["camera"],
      },
    },
  ],
});
