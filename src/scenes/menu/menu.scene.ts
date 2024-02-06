import { SCENES } from "@constants";
import { TextButton } from "@shared";
import { GameController } from "@controllers";
import { container } from "tsyringe";

/**
 * Represents the menu scene of the game.
 */
export class MenuScene extends Phaser.Scene {
  private gameController: GameController;

  /**
   * Initializes the menu scene.
   */
  constructor() {
    super(SCENES.MENU);

    this.gameController = container.resolve(GameController);
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
  startLocalGame() {
    this.gameController.startLocalGame(this);
  }
}
