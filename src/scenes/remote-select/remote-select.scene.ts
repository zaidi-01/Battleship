import { ASSETS, SCENES } from "@constants";
import { GameController } from "@controllers";
import { TextButton } from "@shared";
import { container } from "tsyringe";

/**
 * Represents the remote select menu.
 */
export class RemoteSelectScene extends Phaser.Scene {
  private gameController: GameController;

  /**
   * Initializes the remote select menu.
   */
  constructor() {
    super(SCENES.REMOTE_SELECT);

    this.gameController = container.resolve(GameController);
  }

  /**
   * Creates the remote select menu.
   */
  create() {
    const { width, height } = this.game.canvas;

    this.add.sprite(width / 2, height / 4, ASSETS.SPRITES.LOGO);

    this.add.existing(
      new TextButton(
        this,
        width / 2,
        height / 1.6,
        "CREATE GAME",
        {
          color: "#0f0",
          fontSize: "28px",
          padding: {
            x: 20,
            y: 10,
          },
        },
        this.createGame.bind(this),
        0.5
      )
    );
    this.add.existing(
      new TextButton(
        this,
        width / 2,
        height / 1.4,
        "JOIN GAME",
        {
          color: "#0f0",
          fontSize: "28px",
          padding: {
            x: 20,
            y: 10,
          },
        },
        this.joinGame.bind(this),
        0.5
      )
    );
  }

  /**
   * Creates a remote game.
   */
  private createGame() {
    this.gameController.createRemoteGame(this);
  }

  /**
   * Joins a remote game.
   */
  private joinGame() {
    this.gameController.joinRemoteGame(this);
  }
}
