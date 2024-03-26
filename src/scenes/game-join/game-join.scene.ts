import { EVENTS, SCENES } from "@constants";
import { GameController } from "@controllers";
import { TextButton } from "@shared";
import { container } from "tsyringe";

export class GameJoinScene extends Phaser.Scene {
  private gameController: GameController;

  /**
   * Initializes the game join scene.
   */
  constructor() {
    super(SCENES.GAME_JOIN);

    this.gameController = container.resolve(GameController);
  }

  /**
   * Creates the game join scene.
   */
  create() {
    const { width, height } = this.game.canvas;

    this.add
      .text(width / 2, height / 4, "Join Game", {
        color: "#0f0",
        fontSize: "48px",
      })
      .setOrigin(0.5);

    const inputLabel = this.add
      .text(width / 2, height / 2 - 25, "Enter Game ID:", {
        color: "#0f0",
        fontSize: "28px",
      })
      .setOrigin(0.5);

    const input = this.add
      .dom(width / 2, height / 2 + 25)
      .createFromHTML(
        `<input
            type="text"
            id="game-id"
            name="input"
            maxlength="6"
            style="width: 200px; font-size: 24px; background-color: rgba(0, 0, 0, 0.5); color: #0f0; border: 2px solid #0f0; text-align: center;"
          />`
      )
      .setOrigin(0.5);
    const inputElement = input.getChildByID("game-id") as HTMLInputElement;
    inputElement.addEventListener("keypress", (event) => {
      if (event.code === "Enter") {
        this.joinGame(inputElement.value);
      }
    });

    const errorText = this.add
      .text(width / 2, height / 2 + 50, "", { color: "#f00", fontSize: "24px" })
      .setOrigin(0.5);

    this.add.existing(
      new TextButton(
        this,
        width / 2,
        (height / 4) * 3,
        "JOIN",
        {
          color: "#0f0",
          fontSize: "28px",
          padding: {
            x: 20,
            y: 10,
          },
        },
        () => this.joinGame(inputElement.value),
        0.5
      )
    );

    this.events.on(EVENTS.JOIN_GAME_ERROR, (error: string) => {
      if (!errorText.text) {
        inputLabel.y -= 25;
        input.y -= 25
        inputElement.style.borderColor = "#f00";
      }

      errorText.setText(error);
    });
  }

  /**
   * Joins a remote game.
   * @param gameId The game ID.
   */
  joinGame(gameId: string) {
    if (!gameId) {
      return;
    }

    this.gameController.joinRemoteGame(this, gameId);
  }
}
