import { ASSETS, SCENES } from "@constants";
import Phaser from "phaser";

/**
 * Represents the Preload Scene in the game.
 * This scene is responsible for preloading game assets and displaying a progress bar.
 */
export class PreloadScene extends Phaser.Scene {
  /**
   * Initializes the Preload Scene.
   */
  constructor() {
    super(SCENES.PRELOAD);
  }

  /**
   * Preloads game assets and creates a progress bar.
   */
  preload() {
    // Sprites
    for (const sprite of Object.values(ASSETS.SPRITES)) {
      this.load.image(sprite, `assets/sprites/${sprite}.png`);
    }

    // Spritesheets
    this.load.spritesheet(
      ASSETS.SPRITESHEETS.WATER,
      "assets/spritesheets/water.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );

    this.createProgressBar();
  }

  /**
   * Creates a progress bar and displays loading progress.
   */
  createProgressBar() {
    const { width, height } = this.scale;
    const progressBoxWidth = 320;
    const progressBoxHeight = 50;
    const progressBoxSpacing = 10;

    const progressBar = this.add.graphics();

    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(
      width / 2 - progressBoxWidth / 2,
      height / 2 - progressBoxHeight / 2,
      progressBoxWidth,
      progressBoxHeight
    );

    this.make
      .text({
        x: width / 2,
        y: height / 2 - progressBoxHeight / 2 - 10,
        text: "Loading...",
        style: {
          font: "20px monospace",
          color: "#ffffff",
        },
      })
      .setOrigin(0.5, 1);
    const percentText = this.make
      .text({
        x: width / 2,
        y: height / 2,
        text: "0%",
        style: {
          font: "18px monospace",
          color: "#ffffff",
        },
      })
      .setOrigin(0.5, 0.5);
    const assetText = this.make
      .text({
        x: width / 2,
        y: height / 2 + progressBoxHeight / 2 + 10,
        text: "",
        style: {
          font: "18px monospace",
          color: "#ffffff",
        },
      })
      .setOrigin(0.5, 0);

    this.load.on("progress", (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(
        width / 2 - progressBoxWidth / 2 + progressBoxSpacing,
        height / 2 - progressBoxHeight / 2 + progressBoxSpacing,
        (progressBoxWidth - progressBoxSpacing * 2) * value,
        progressBoxHeight - progressBoxSpacing * 2
      );

      percentText.setText(`${Math.floor(value * 100)}%`);
    });
    this.load.on("fileprogress", (file: Phaser.Loader.File) => {
      assetText.setText(`Loading asset: ${file.key}`);
    });
    this.load.on("complete", () => {
      this.scene.start(SCENES.BACKGROUND);
      this.scene.start(SCENES.MENU);
      this.scene.start(SCENES.DIALOG_CONTAINER);
      this.scene.stop(this);
    });
  }
}
