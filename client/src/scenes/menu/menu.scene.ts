import { ASSETS, SCENES } from "@constants";
import { GameController } from "@controllers";
import { TextButton } from "@shared";
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
    const { width, height } = this.game.canvas;

    this.add.sprite(width / 2, height / 4, ASSETS.SPRITES.LOGO);

    this.add.existing(
      new TextButton(
        this,
        width / 2,
        height / 1.6,
        "SINGLEPLAYER",
        {
          color: "#0f0",
          fontSize: "28px",
          padding: {
            x: 20,
            y: 10,
          },
        },
        this.startLocalGame.bind(this),
        0.5
      )
    );
    this.add.existing(
      new TextButton(
        this,
        width / 2,
        height / 1.4,
        "MULTIPLAYER",
        {
          color: "#0f0",
          fontSize: "28px",
          padding: {
            x: 20,
            y: 10,
          },
        },
        this.startMultiplayerGame.bind(this),
        0.5
      )
    );
  }

  /**
   * Starts a local game.
   */
  startLocalGame() {
    this.gameController.startLocalGame(this);
  }

  /**
   * Starts a multiplayer game.
   */
  startMultiplayerGame() {
    this.gameController.startRemoteGame(this);
  }
}
