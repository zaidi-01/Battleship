import { SCENES } from "@constants";
import { TextButton } from "@shared";

/**
 * Represents the menu scene of the game.
 */
export class MenuScene extends Phaser.Scene {

  /**
   * Initializes the menu scene.
   */
  constructor() {
    super(SCENES.MENU);
  }

  /**
   * Creates the menu scene.
   */
  create() {
    const localButton = new TextButton(
      this,
      100,
      100,
      "Local Game",
      { color: "#0f0" },
      this.startLocalGame.bind(this)
    );
  }

  /**
   * Starts a local game.
   */
  startLocalGame() {}
}
